package com.smartstudy.backend.controller;

import com.smartstudy.backend.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/study")
@CrossOrigin(origins = "http://localhost:3000")
public class StudyController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/generate-quiz")
    public ResponseEntity<?> generateQuiz(@RequestBody Map<String, String> body) {
        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Content required"));
        }
        String quiz = geminiService.generateQuiz(content);
        return ResponseEntity.ok(Map.of("quiz", quiz));
    }

    @PostMapping("/generate-summary")
    public ResponseEntity<?> generateSummary(@RequestBody Map<String, String> body) {
        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Content required"));
        }
        String summary = geminiService.generateSummary(content);
        return ResponseEntity.ok(Map.of("summary", summary));
    }
}