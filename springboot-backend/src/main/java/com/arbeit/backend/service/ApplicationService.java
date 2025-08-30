package com.arbeit.backend.service;

import com.arbeit.backend.dto.ApplicationDTO;
import com.arbeit.backend.model.Application;
import com.arbeit.backend.model.Job;
import com.arbeit.backend.repository.ApplicationRepository;
import com.arbeit.backend.repository.JobRepository;
import com.mongodb.client.gridfs.GridFSBucket;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final JobService jobService;
    private final FileService fileService;

    public ApplicationService(ApplicationRepository applicationRepository,
                            JobRepository jobRepository,
                            JobService jobService,
                            FileService fileService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.jobService = jobService;
        this.fileService = fileService;
    }

    public Application submitApplication(ApplicationDTO applicationDTO) {
        // Check if job exists and is active
        Optional<Job> jobOpt = jobRepository.findActiveJobByJobId(applicationDTO.getJobId());
        if (jobOpt.isEmpty()) {
            throw new RuntimeException("Job not found or not active");
        }

        // Check if user already applied for this job
        String userId = generateUniqueUserId();
        if (applicationRepository.existsByUserIdAndJobId(userId, applicationDTO.getJobId())) {
            throw new RuntimeException("You have already applied for this job");
        }

        Application application = new Application();
        application.setUserId(userId);
        application.setJobId(applicationDTO.getJobId());
        application.setFullName(applicationDTO.getFullName());
        application.setEmail(applicationDTO.getEmail());
        application.setPhone(applicationDTO.getPhone());
        application.setCoverLetter(applicationDTO.getCoverLetter());
        application.setExperience(applicationDTO.getExperience());
        application.setCurrentCompany(applicationDTO.getCurrentCompany());
        application.setCurrentJobTitle(applicationDTO.getCurrentJobTitle());
        application.setEducation(applicationDTO.getEducation());
        application.setLinkedinUrl(applicationDTO.getLinkedinUrl());
        application.setPortfolioUrl(applicationDTO.getPortfolioUrl());
        application.setStatus("Pending");
        application.setAppliedDate(LocalDateTime.now());
        application.setUpdatedDate(LocalDateTime.now());

        // Handle resume upload if provided
        if (applicationDTO.getResume() != null && !applicationDTO.getResume().isEmpty()) {
            try {
                String resumeId = saveResumeToGridFS(applicationDTO.getResume(), userId);
                application.setResumeId(resumeId);
                application.setResumeFileName(userId + "_resume.pdf");
            } catch (Exception e) {
                // Log error but don't fail the application
                System.err.println("Failed to save resume: " + e.getMessage());
            }
        }

        Application savedApplication = applicationRepository.save(application);

        // Increment job applicant count
        jobService.incrementApplicantCount(applicationDTO.getJobId());

        return savedApplication;
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAllByOrderByAppliedDateDesc();
    }

    public Application updateApplicationStatus(String applicationId, String status) {
        Optional<Application> applicationOpt = applicationRepository.findById(applicationId);
        if (applicationOpt.isEmpty()) {
            throw new RuntimeException("Application not found");
        }

        Application application = applicationOpt.get();
        application.setStatus(status);
        application.setUpdatedDate(LocalDateTime.now());

        if ("Under Review".equals(status) && application.getReviewedDate() == null) {
            application.setReviewedDate(LocalDateTime.now());
        }

        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByJob(String jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public List<Application> getApplicationsByUser(String userId) {
        return applicationRepository.findByUserId(userId);
    }

    private String saveResumeToGridFS(String resumeData, String userId) throws IOException {
        // Assuming resumeData is Base64 encoded PDF
        byte[] resumeBytes = Base64.getDecoder().decode(resumeData);

        // Create GridFS upload stream
        com.mongodb.client.gridfs.model.GridFSUploadOptions options =
            new com.mongodb.client.gridfs.model.GridFSUploadOptions()
                .chunkSizeBytes(1024)
                .metadata(new org.bson.Document("userId", userId)
                    .append("uploadDate", LocalDateTime.now()));

        // Upload to GridFS
        return gridFSBucket.uploadFromStream(userId + "_resume.pdf",
            new java.io.ByteArrayInputStream(resumeBytes), options).toString();
    }

    private String generateUniqueUserId() {
        String userId;
        do {
            // Generate a random 3-digit number
            userId = String.valueOf(100 + (int)(Math.random() * 900));
        } while (applicationRepository.findByUserId(userId).stream().findFirst().isPresent());

        return userId;
    }
}
