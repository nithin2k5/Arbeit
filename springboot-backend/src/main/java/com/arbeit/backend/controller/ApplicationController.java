package com.arbeit.backend.controller;

import com.arbeit.backend.dto.ApplicationDTO;
import com.arbeit.backend.model.Application;
import com.arbeit.backend.service.ApplicationService;
import com.arbeit.backend.service.FileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final FileService fileService;

    public ApplicationController(ApplicationService applicationService, FileService fileService) {
        this.applicationService = applicationService;
        this.fileService = fileService;
    }

    @PostMapping
    public ResponseEntity<?> submitApplication(@ModelAttribute ApplicationDTO applicationDTO) {
        try {
            Application application = applicationService.submitApplication(applicationDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Application submitted successfully", "userId", application.getUserId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to submit application"));
        }
    }

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        try {
            List<Application> applications = applicationService.getAllApplications();
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping
    public ResponseEntity<?> updateApplicationStatus(@RequestBody Map<String, String> request) {
        try {
            String applicationId = request.get("_id");
            String status = request.get("status");

            if (applicationId == null || status == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Application ID and status are required"));
            }

            Application updatedApplication = applicationService.updateApplicationStatus(applicationId, status);
            return ResponseEntity.ok(updatedApplication);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update application status"));
        }
    }

    @GetMapping("/{applicationId}/resume")
    public ResponseEntity<?> downloadResume(@PathVariable String applicationId) {
        try {
            Optional<Application> applicationOpt = applicationService.getApplicationById(applicationId);
            if (applicationOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Application not found"));
            }

            Application application = applicationOpt.get();
            if (application.getResumePath() == null || application.getResumePath().isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Resume not found"));
            }

            Resource resource = new FileSystemResource(application.getResumePath());
            if (!resource.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Resume file not found"));
            }

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + application.getResumeFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to download resume"));
        }
    }
}
