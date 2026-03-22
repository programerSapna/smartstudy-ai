package com.smartstudy.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateQuiz(String content) {
        int questionCount;
        int contentLength = content.length();

        if (contentLength < 1000) {
            questionCount = 5;
        } else if (contentLength < 3000) {
            questionCount = 10;
        } else if (contentLength < 6000) {
            questionCount = 15;
        } else {
            questionCount = 20;
        }

        String prompt = "Generate exactly " + questionCount + " multiple choice questions based on this content. " +
                "Return ONLY a pure JSON array, no markdown, no code blocks, no extra text. " +
                "Format: [{\"question\":\"...\",\"options\":[\"A ...\",\"B ...\",\"C ...\",\"D ...\"],\"correctAnswer\":\"A\"}] " +
                "Content: " + content;
        return callGemini(prompt);
    }

    public String generateSummary(String content) {
        String prompt = "Please provide a concise summary (5-7 bullet points) " +
                "of the following study content: " + content;
        return callGemini(prompt);
    }
    private String callGemini(String prompt) {
        String url = "https://openrouter.ai/api/v1/chat/completions";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "mistralai/mistral-small-3.1-24b-instruct:free");

        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);
        requestBody.put("messages", List.of(message));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            List<Map> choices = (List<Map>) response.getBody().get("choices");
            Map message1 = (Map) choices.get(0).get("message");
            return (String) message1.get("content");
        } catch (Exception e) {
            return "AI service error: " + e.getMessage();
        }
    }
}