package com.arbeit.backend.service;

import com.google.ai.client.generativeai.GenerativeModel;
import com.google.ai.client.generativeai.java.GenerativeModelFutures;
import com.google.ai.client.generativeai.type.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class GeminiService {

    @Value("${app.gemini.api-key}")
    private String apiKey;

    private GenerativeModelFutures getModel() {
        com.google.ai.client.generativeai.GenerativeModel model =
            new com.google.ai.client.generativeai.GenerativeModel("gemini-pro", apiKey);
        return GenerativeModelFutures.from(model);
    }

    public String generateRoadmap(String dreamRole, String currentSkills) {
        String prompt = String.format(
            "As a career mentor, create a detailed roadmap for someone who wants to become a %s. " +
            "Their current skills are: %s. " +
            "Please provide: " +
            "1. A structured learning path with 5 major milestones " +
            "2. For each milestone, list 3-4 specific goals that are measurable and achievable " +
            "3. Recommended resources or certifications for each milestone " +
            "4. Estimated time to achieve each milestone " +
            "Format the response in a clear, structured way that can be easily parsed into sections. " +
            "Keep the response concise and focused on actionable steps.",
            dreamRole, currentSkills != null ? currentSkills : "No prior experience"
        );

        return generateContent(prompt);
    }

    public String generateProjectPlan(String title, String description) {
        String prompt = String.format(
            "Create a detailed project plan for the following project:\n" +
            "Title: %s\n" +
            "Description: %s\n" +
            "Break down the project into phases. For each phase include:\n" +
            "1. Phase title\n" +
            "2. List of specific tasks to complete\n" +
            "3. Expected deliverables\n" +
            "4. Time estimate\n" +
            "Format the response with clear section headers for each phase, using \"Phase 1:\", \"Phase 2:\", etc.\n" +
            "Include tasks as numbered lists.\n" +
            "List deliverables under a \"Deliverables:\" section.\n" +
            "Include time estimate under \"Time Estimate:\".\n" +
            "Keep the phases focused and actionable.",
            title, description
        );

        return generateContent(prompt);
    }

    public String analyzeResume(String resumeText) {
        String prompt = String.format(
            "You are an expert ATS (Applicant Tracking System) analyzer. Analyze this resume and provide detailed feedback in the following format:\n\n" +
            "OVERALL SCORE: [Score out of 100]\n\n" +
            "KEY STRENGTHS:\n" +
            "- [Strength 1]\n" +
            "- [Strength 2]\n" +
            "- [Strength 3]\n\n" +
            "AREAS FOR IMPROVEMENT:\n" +
            "- [Area 1]\n" +
            "- [Area 2]\n" +
            "- [Area 3]\n\n" +
            "KEYWORD OPTIMIZATION:\n" +
            "- Missing Important Keywords: [List keywords]\n" +
            "- Suggested Keywords to Add: [List keywords]\n\n" +
            "FORMAT AND STRUCTURE:\n" +
            "- [Feedback on format]\n" +
            "- [Feedback on structure]\n" +
            "- [Feedback on readability]\n\n" +
            "RECOMMENDATIONS:\n" +
            "1. [Specific recommendation 1]\n" +
            "2. [Specific recommendation 2]\n" +
            "3. [Specific recommendation 3]\n\n" +
            "Resume content to analyze:\n%s",
            resumeText
        );

        return generateContent(prompt);
    }

    private String generateContent(String prompt) {
        try {
            com.google.ai.client.generativeai.type.Content content =
                new com.google.ai.client.generativeai.type.Content.Builder()
                    .addText(prompt)
                    .build();

            GenerateContentResponse response = getModel().generateContent(content).get();

            if (response.getText() != null && !response.getText().isEmpty()) {
                return response.getText();
            } else {
                throw new RuntimeException("Empty response from Gemini API");
            }
        } catch (ExecutionException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to generate content: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Gemini API error: " + e.getMessage());
        }
    }
}
