package com.arbeit.backend.controller;

import com.arbeit.backend.service.GeminiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/scanner")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ScannerController {

    private final GeminiService geminiService;

    public ScannerController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(@RequestBody Map<String, String> request) {
        try {
            String resumeText = request.get("resumeText");
            if (resumeText == null || resumeText.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Resume text is required"));
            }

            String analysis = geminiService.analyzeResume(resumeText);

            return ResponseEntity.ok(Map.of(
                "analysis", analysis,
                "success", true
            ));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("API key")) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(Map.of("error", "AI service configuration error"));
            } else if (e.getMessage().contains("Failed to generate")) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(Map.of("error", "AI service temporarily unavailable"));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", e.getMessage()));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to analyze resume"));
        }
    }
}
