package com.smartstudy.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class PdfService {

    @Value("${ocr.api.key}")
    private String ocrApiKey;

    public String extractTextFromPdf(MultipartFile file) {
        try {
            byte[] bytes = file.getBytes();
            PDDocument document = Loader.loadPDF(bytes);
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            String cleanText = text.replaceAll("(?i)page\\s*\\d+", "")
                    .replaceAll("(?i)aldine.*", "")
                    .replaceAll("(?i)spiral.*", "")
                    .replaceAll("(?i)collegework.*", "")
                    .trim();

            if (cleanText.length() < 100) {
                String ocrText = extractFromPdfAsImages(document);
                document.close();
                return ocrText;
            }

            document.close();
            return text;

        } catch (Exception e) {
            return "Error extracting text: " + e.getMessage();
        }
    }

    private String extractFromPdfAsImages(PDDocument document) {
        try {
            PDFRenderer renderer = new PDFRenderer(document);
            StringBuilder allText = new StringBuilder();

            int pageCount = Math.min(document.getNumberOfPages(), 5);

            for (int page = 0; page < pageCount; page++) {
                BufferedImage image = renderer.renderImageWithDPI(page, 120);

                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(image, "jpg", baos);
                byte[] imageBytes = baos.toByteArray();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);

                System.out.println("Processing page " + (page + 1));

                String pageText = callOcrSpace(base64Image);

                if (pageText != null && !pageText.trim().isEmpty()) {
                    allText.append("Page ").append(page + 1).append(":\n");
                    allText.append(pageText).append("\n\n");
                }

                // Har page ke beech 1 second wait karo
                Thread.sleep(1000);
            }

            return allText.length() > 0 ? allText.toString() : "Could not extract text.";

        } catch (Exception e) {
            return "OCR Error: " + e.getMessage();
        }
    }

    private String callOcrSpace(String base64Image) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            String encodedBase64 = URLEncoder.encode(
                    "data:image/jpg;base64," + base64Image,
                    StandardCharsets.UTF_8
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            String body = "apikey=" + ocrApiKey
                    + "&base64Image=" + encodedBase64
                    + "&isOverlayRequired=false"
                    + "&detectOrientation=true"
                    + "&scale=true"
                    + "&OCREngine=2";

            HttpEntity<String> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.ocr.space/parse/image",
                    entity,
                    Map.class
            );

            System.out.println("OCR Response: " + response.getBody());

            List<Map> parsedResults = (List<Map>) response.getBody().get("ParsedResults");

            if (parsedResults != null && !parsedResults.isEmpty()) {
                String extractedText = (String) parsedResults.get(0).get("ParsedText");
                if (extractedText != null && !extractedText.trim().isEmpty()) {
                    return extractedText;
                }
            }

            Object errorMsg = response.getBody().get("ErrorMessage");
            if (errorMsg != null) {
                System.out.println("OCR Error: " + errorMsg);
            }

            return "";

        } catch (Exception e) {
            System.out.println("OCR Exception: " + e.getMessage());
            return "";
        }
    }
    // Image ke liye public method
    public String callOcrSpacePublic(String base64Image, String mimeType) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            String encodedBase64 = URLEncoder.encode(
                    "data:" + mimeType + ";base64," + base64Image,
                    StandardCharsets.UTF_8
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            String body = "apikey=" + ocrApiKey
                    + "&base64Image=" + encodedBase64
                    + "&isOverlayRequired=false"
                    + "&detectOrientation=true"
                    + "&scale=true"
                    + "&OCREngine=2";

            HttpEntity<String> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.ocr.space/parse/image",
                    entity,
                    Map.class
            );

            List<Map> parsedResults = (List<Map>) response.getBody().get("ParsedResults");

            if (parsedResults != null && !parsedResults.isEmpty()) {
                String extractedText = (String) parsedResults.get(0).get("ParsedText");
                if (extractedText != null && !extractedText.trim().isEmpty()) {
                    return extractedText;
                }
            }
            return "";

        } catch (Exception e) {
            return "";
        }
    }

 // ← ye last wali closing bracket hai
}