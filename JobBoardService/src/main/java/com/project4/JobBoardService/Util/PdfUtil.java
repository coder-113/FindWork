//package com.project4.JobBoardService.Util;
//
//import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
//import org.jsoup.Jsoup;
//import org.jsoup.nodes.Document;
//
//import java.io.ByteArrayOutputStream;
//import java.io.File;
//import java.io.IOException;
//
//public class PdfUtil {
//
//    public static byte[] htmlToPdf(String html) throws IOException {
//        // Parse and clean up the HTML using Jsoup without modifying it significantly
//        Document jsoupDoc = Jsoup.parse(html);
//        jsoupDoc.outputSettings().syntax(Document.OutputSettings.Syntax.xml);
//        String cleanedHtml = jsoupDoc.html();
//
//        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {
//            PdfRendererBuilder builder = new PdfRendererBuilder();
//
//            // Set paper size and orientation
//            builder.useFastMode();
//            builder.withHtmlContent(cleanedHtml, "");
//            builder.toStream(byteArrayOutputStream);
//
//            // Set paper size to A4 (210mm x 297mm)
//            builder.useDefaultPageSize(420, 594, PdfRendererBuilder.PageSizeUnits.MM);
//
//            // Use a custom font if required
//            File fontFile = new File("path/to/font.ttf");
//            if (fontFile.exists()) {
//                builder.useFont(fontFile, "CustomFont");
//            } else {
//                // Optional: Log a warning or use a fallback font
//                System.out.println("Font file not found, using default font.");
//            }
//
//            builder.run();
//
//            return byteArrayOutputStream.toByteArray();
//        } catch (Exception e) {
//            throw new IOException("Error generating PDF", e);
//        }
//    }
//}
