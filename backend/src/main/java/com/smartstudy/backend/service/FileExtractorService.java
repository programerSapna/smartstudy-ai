package com.smartstudy.backend.service;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Iterator;

@Service
public class FileExtractorService {

    @Autowired
    private PdfService pdfService;

    public String extractText(MultipartFile file) {
        String filename = file.getOriginalFilename().toLowerCase();

        try {
            // PDF
            if (filename.endsWith(".pdf")) {
                return pdfService.extractTextFromPdf(file);
            }
            // Word Document
            else if (filename.endsWith(".docx")) {
                return extractFromDocx(file);
            }
            // Excel
            else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                return extractFromExcel(file);
            }
            // Image
            else if (filename.endsWith(".png") || filename.endsWith(".jpg")
                    || filename.endsWith(".jpeg")) {
                return extractFromImage(file);
            }
            // Text file
            else if (filename.endsWith(".txt")) {
                return new String(file.getBytes());
            }
            else {
                return "Unsupported file format!";
            }
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    // Word Document extract
    private String extractFromDocx(MultipartFile file) throws Exception {
        InputStream is = file.getInputStream();
        XWPFDocument document = new XWPFDocument(is);
        StringBuilder text = new StringBuilder();
        for (XWPFParagraph para : document.getParagraphs()) {
            text.append(para.getText()).append("\n");
        }
        document.close();
        return text.toString();
    }

    // Excel extract
    private String extractFromExcel(MultipartFile file) throws Exception {
        InputStream is = file.getInputStream();
        XSSFWorkbook workbook = new XSSFWorkbook(is);
        StringBuilder text = new StringBuilder();

        for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
            var sheet = workbook.getSheetAt(i);
            text.append("Sheet: ").append(sheet.getSheetName()).append("\n");
            sheet.forEach(row -> {
                row.forEach(cell -> {
                    text.append(cell.toString()).append(" | ");
                });
                text.append("\n");
            });
        }
        workbook.close();
        return text.toString();
    }

    // Image extract — OCR.space
    private String extractFromImage(MultipartFile file) throws Exception {
        byte[] imageBytes = file.getBytes();
        String base64Image = java.util.Base64.getEncoder().encodeToString(imageBytes);
        String mimeType = file.getContentType();
        return pdfService.callOcrSpacePublic(base64Image, mimeType);
    }
}