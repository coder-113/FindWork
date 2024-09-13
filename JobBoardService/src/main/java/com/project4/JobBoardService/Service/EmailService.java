package com.project4.JobBoardService.Service;

import org.springframework.scheduling.annotation.Async;

import java.io.File;

public interface EmailService {
    void sendVerificationEmail(String toEmail,String username, String firstName, String verificationCode, String email);
    void sendEmailNotification(String toEmail, String subject, String message);
    void sendVerificationEmailEmployer(String toEmail, String name, String verificationCode);
    void sendResetPasswordEmail(String toEmail, String resetToken);
    void sendJobApplicationConfirmation(String toEmail, String employeeName, String jobTitle, String companyName);

    void sendCertificateEmail(String toEmail, String username, File certificate);

    @Async("emailTaskExecutor")
    void sendEmail(String to, String subject, String text);

    @Async
    void sendVerificationEmailFlutter(String toEmail, String username, String firstName, String verificationCode, String email);

    @Async
    void sendResetPasswordEmailFlutter(String toEmail, String username, String resetToken);
}