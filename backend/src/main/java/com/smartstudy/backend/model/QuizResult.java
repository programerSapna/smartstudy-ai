package com.smartstudy.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "quiz_results")
@Data
public class QuizResult {

    @Id
    private String id;

    private String userId;
    private int score;
    private int totalQuestions;
    private LocalDateTime attemptedAt = LocalDateTime.now();
}