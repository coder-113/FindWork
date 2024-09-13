package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.Service.EmailService;
import com.project4.JobBoardService.Util.HTMLContentProvider;
import jakarta.activation.FileDataSource;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;


import java.io.File;
import java.util.Properties;

import static com.project4.JobBoardService.Util.HTMLContentProvider.generateEmailHTMLContent;
import static com.project4.JobBoardService.Util.HTMLContentProvider.readHTMLContentFlutterReset;

@Service
public class EmailServiceImpl implements EmailService {

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${spring.mail.password}")
    private String fromEmailPassword;

    private final JavaMailSender javaMailSender;

    public EmailServiceImpl(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Async
    @Override
    public void sendVerificationEmail(String toEmail, String username, String firstName, String verificationCode, String email) {
        Properties properties = new Properties();
        properties.setProperty("mail.smtp.host", "smtp.gmail.com");
        properties.setProperty("mail.smtp.port", "587");
        properties.setProperty("mail.smtp.auth", "true");
        properties.setProperty("mail.smtp.starttls.enable", "true");

        String verifyUrl = "http://localhost:8080/api/auth/verify?email=" + email + "&code=" + verificationCode + "&verifyUrl=http://localhost:3000";

        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, fromEmailPassword);
            }
        });

        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(fromEmail));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
            message.setSubject("Email Verification");

            String emailContent = HTMLContentProvider.readHTMLContent();
            emailContent = emailContent.replace("{{username}}", username);
            emailContent = emailContent.replace("{{verifyUrl}}", verifyUrl);

            message.setContent(emailContent, "text/html");

            Transport.send(message);
            System.out.println("Email sent successfully!");
        } catch (MessagingException mex) {
            mex.printStackTrace();
        }
    }

    @Async
    public void sendVerificationEmailEmployer(String toEmail, String name, String verificationCode) {
        String verificationUrl = "http://localhost:3000/SetupCredentials";
        String subject = "Email Verification";
        String body = generateEmailHTMLContent(name, verificationCode, verificationUrl);

        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    @Async
    @Override
    public void sendEmailNotification(String toEmail, String subject, String message) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(message, true);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    @Async
    @Override
    public void sendResetPasswordEmail(String toEmail, String resetUrl) {
        String emailContent = HTMLContentProvider.resetPasswordContent(resetUrl);
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("Reset Password Request");
            helper.setText(emailContent, true);

            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    @Async
    @Override
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


    @Async("emailTaskExecutor")
    @Override
    public void sendEmail(String to, String subject, String text) {
        try {
            sendSimpleMessage(to, subject, text);
        } catch (MessagingException ex) {
            throw new RuntimeException("Failed to send email", ex);
        }
    }
    private void sendSimpleMessage(String to, String subject, String text) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text, true);
        javaMailSender.send(message);
    }

    @Async
    @Override
    public void sendJobApplicationConfirmation(String toEmail, String employeeName, String jobTitle, String companyName) {
        String subject = "Job Application Submitted Successfully";
        String htmlContent =
                "<html>" +
                        "<head>" +
                        "<style>" +
                        "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                        ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                        ".header { background-color: #4CAF50; color: white; text-align: center; padding: 20px; }" +
                        ".content { background-color: #f9f9f9; border: 1px solid #ddd; padding: 20px; }" +
                        "h2 { color: #f8f9fa; }" +
                        "strong { color: #3498DB; }" +
                        ".footer { text-align: center; margin-top: 20px; font-size: 0.8em; color: #777; }" +
                        "</style>" +
                        "</head>" +
                        "<body>" +
                        "<div class='container'>" +
                        "<div class='header'>" +
                        "<h2>Job Application Confirmation</h2>" +
                        "</div>" +
                        "<div class='content'>" +
                        "<p>Dear <strong>" + employeeName + "</strong>,</p>" +
                        "<p>Your application for the position of <strong>" + jobTitle + "</strong> at <strong>" + companyName + "</strong> " +
                        "has been successfully submitted.</p>" +
                        "<p>Thank you for your interest. The recruiter will review your application and get back to you soon if you match their requirements.</p>" +
                        "<p>Best regards,<br>The Job Board Team</p>" +
                        "</div>" +
                        "<div class='footer'>" +
                        "© 2023 Job Board. All rights reserved." +
                        "</div>" +
                        "</div>" +
                        "</body>" +
                        "</html>";

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            javaMailSender.send(mimeMessage);
            System.out.println("Job application confirmation email sent successfully!");
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
    @Async
    @Override
    public void sendVerificationEmailFlutter(String toEmail, String username, String firstName, String verificationCode, String email) {
        Properties properties = new Properties();
        properties.setProperty("mail.smtp.host", "smtp.gmail.com");
        properties.setProperty("mail.smtp.port", "587");
        properties.setProperty("mail.smtp.auth", "true");
        properties.setProperty("mail.smtp.starttls.enable", "true");

        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, fromEmailPassword);
            }
        });

        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(fromEmail));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
            message.setSubject("Email Verification");

            String emailContent = HTMLContentProvider.readHTMLContentFlutter();
            emailContent = emailContent.replace("{{username}}", username);
            emailContent = emailContent.replace("{{verificationCode}}", verificationCode);

            message.setContent(emailContent, "text/html");

            Transport.send(message);
            System.out.println("Email sent successfully!");
        } catch (MessagingException mex) {
            mex.printStackTrace();
        }
    }

    @Async
    @Override
    public void sendResetPasswordEmailFlutter(String toEmail, String username, String verificationCode) {
        Properties properties = new Properties();
        properties.setProperty("mail.smtp.host", "smtp.gmail.com");
        properties.setProperty("mail.smtp.port", "587");
        properties.setProperty("mail.smtp.auth", "true");
        properties.setProperty("mail.smtp.starttls.enable", "true");

        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, fromEmailPassword);
            }
        });

        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(fromEmail));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
            message.setSubject("Reset Password");

            String htmlContent = readHTMLContentFlutterReset(username, verificationCode);

            message.setContent(htmlContent, "text/html; charset=utf-8");

            Transport.send(message);

            System.out.println("Reset password email sent successfully!");
        } catch (MessagingException mex) {
            mex.printStackTrace();
        }
    }
}