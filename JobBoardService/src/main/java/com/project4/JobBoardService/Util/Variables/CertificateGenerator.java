package com.project4.JobBoardService.Util.Variables;

import com.itextpdf.io.font.FontProgram;
import com.itextpdf.io.font.FontProgramFactory;
import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import jakarta.activation.FileDataSource;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;


import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class CertificateGenerator {
    @Autowired
    private JavaMailSender javaMailSender;


    public static File generateCertificate(String username, String quizTitle, String firstName, String lastName) {
        String inputPdfPath = "uploads/certificate/certificate.pdf";
        String outputPdfPath = "src/main/resources/uploads/certificate/certificate_" + username + ".pdf";

        try {
            PdfReader reader = new PdfReader(inputPdfPath);
            PdfWriter writer = new PdfWriter(outputPdfPath);
            PdfDocument pdf = new PdfDocument(reader, writer);
            Document document = new Document(pdf, PageSize.A4);


            String fontPath = "uploads/certificate/DejaVuSansCondensed.ttf";
            PdfFont font = PdfFontFactory.createFont(fontPath, PdfFontFactory.EmbeddingStrategy.FORCE_EMBEDDED);

            Color customColor = new DeviceRgb(92, 180, 31);


            Paragraph nameParagraph = new Paragraph(firstName + " " + lastName)
                    .setFont(font)
                    .setFontSize(36)
                    .setFontColor(customColor)
                    .setTextAlignment(TextAlignment.LEFT);
            nameParagraph.setFixedPosition(59, 269, 387);
            document.add(nameParagraph);

            String fontPath1 = "uploads/certificate/Poppins-Regular.ttf";
            FontProgram fontProgram1 = FontProgramFactory.createFont(fontPath1);
            PdfFont font1 = PdfFontFactory.createFont();


            Color customColor1 = new DeviceRgb(2, 91, 64);


            Paragraph quizParagraph = new Paragraph("Congratulations! You have passed the quiz " + quizTitle + " and obtained our certificate.")
                    .setFont(font1)
                    .setFontSize(16)
                    .setFontColor(customColor1)
                    .setTextAlignment(TextAlignment.LEFT);
            quizParagraph.setFixedPosition(59, 235, 612.28f);
            document.add(quizParagraph);

            document.close();
            return new File(outputPdfPath);
        } catch (IOException e) {
            e.printStackTrace();

            return null;
        }
    }
    @Async
    public void sendCertificateEmail(String toEmail, String username, File certificate) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject("Congratulations! Here is your Certificate");
            helper.setText("Dear " + username + ",\n\nCongratulations on your excellent performance! Please find your certificate attached.\n\nBest regards,\nQuiz Team");

            FileDataSource fileDataSource = new FileDataSource(certificate);
            helper.addAttachment("Certificate.pdf", fileDataSource);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

}
