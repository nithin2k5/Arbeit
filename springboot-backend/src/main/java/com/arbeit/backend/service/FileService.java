package com.arbeit.backend.service;

import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileService {

    @Value("${app.upload.resume-dir}")
    private String resumeDir;

    private final GridFSBucket gridFSBucket;

    public FileService(GridFSBucket gridFSBucket) {
        this.gridFSBucket = gridFSBucket;
    }

    public String saveResumeToGridFS(MultipartFile file, String userId) throws IOException {
        String fileName = userId + "_resume_" + file.getOriginalFilename();

        GridFSUploadOptions options = new GridFSUploadOptions()
                .chunkSizeBytes(1024)
                .metadata(new org.bson.Document("userId", userId)
                        .append("originalFileName", file.getOriginalFilename())
                        .append("contentType", file.getContentType()));

        ObjectId fileId = gridFSBucket.uploadFromStream(
                fileName,
                new ByteArrayInputStream(file.getBytes()),
                options
        );

        return fileId.toString();
    }

    public String saveResumeToFileSystem(MultipartFile file, String userId) throws IOException {
        // Create directory if it doesn't exist
        Path uploadPath = Paths.get(resumeDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String fileName = userId + "_resume_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        // Save file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }

    public byte[] downloadResumeFromGridFS(String fileId) throws IOException {
        ObjectId objectId = new ObjectId(fileId);
        return gridFSBucket.downloadToStream(objectId, new java.io.ByteArrayOutputStream())
                .toByteArray();
    }

    public void deleteResumeFromGridFS(String fileId) {
        ObjectId objectId = new ObjectId(fileId);
        gridFSBucket.delete(objectId);
    }

    public boolean isValidResumeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            return false;
        }

        // Allow PDF, DOC, DOCX files
        return contentType.equals("application/pdf") ||
               contentType.equals("application/msword") ||
               contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    }

    public boolean isFileSizeValid(MultipartFile file, long maxSizeInMB) {
        if (file == null) {
            return false;
        }
        long maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        return file.getSize() <= maxSizeInBytes;
    }
}
