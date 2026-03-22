package com.smartstudy.backend.controller;

import com.smartstudy.backend.service.FileExtractorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin(origins = "http://localhost:3000")
public class PdfController {

    @Autowired
    private FileExtractorService fileExtractorService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String filename = file.getOriginalFilename();
            if (filename == null || filename.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "No file selected!"));
            }

            String extractedText = fileExtractorService.extractText(file);

            if (extractedText.startsWith("Error") ||
                    extractedText.startsWith("Unsupported") ||
                    extractedText.equals("Could not extract text.")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", extractedText));
            }

            return ResponseEntity.ok(Map.of(
                    "text", extractedText,
                    "message", "Text extracted successfully!",
                    "filename", filename
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}