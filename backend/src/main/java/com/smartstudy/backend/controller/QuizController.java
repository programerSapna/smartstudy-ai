package com.smartstudy.backend.controller;

import com.smartstudy.backend.model.QuizResult;
import com.smartstudy.backend.repository.QuizResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizController {

    @Autowired
    private QuizResultRepository quizResultRepository;

    @PostMapping("/save-score")
    public ResponseEntity<?> saveScore(@RequestBody Map<String, Object> body) {
        QuizResult result = new QuizResult();
        result.setUserId(body.get("userId").toString());
        result.setScore(Integer.parseInt(body.get("score").toString()));
        result.setTotalQuestions(Integer.parseInt(body.get("totalQuestions").toString()));
        quizResultRepository.save(result);
        return ResponseEntity.ok(Map.of("message", "Score saved!"));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<QuizResult>> getHistory(@PathVariable String userId) {
        return ResponseEntity.ok(quizResultRepository.findByUserId(userId));
    }
}