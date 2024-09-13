package com.project4.JobBoardService.Util;

public class HTMLContentProvider {

    public static String readHTMLContent() {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Email Verification</title>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 0; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #007bff; color: #fff; padding: 20px; text-align: center; }" +
                ".content { padding: 20px; background-color: #fff; }" +
                ".button { display: block; width: 200px; margin: 0 auto; background-color: #007bff; color: #fff; text-decoration: none; text-align: center; padding: 10px; border-radius: 5px; font-weight: bold; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Email Verification</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Hello {{username}},</p>" +
                "<p>Please use the following code to verify your email:</p>" +
                "<a href='{{verifyUrl}}' class='button'>Verify Email</a>" +
                "<p>Thank you!</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
    public static String verifyemailsuccess(String username, String verifyUrl) {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Email Verification</title>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 0; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #007bff; color: #fff; padding: 20px; text-align: center; }" +
                ".content { padding: 20px; background-color: #fff; }" +
                ".button { display: block; width: 200px; margin: 0 auto; background-color: #007bff; color: #fff; text-decoration: none; text-align: center; padding: 10px; border-radius: 5px; font-weight: bold; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Email Verification</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Hello " + username + ",</p>" +
                "<p>Your email has been verified successfully!</p>" +
                "<p>Thank you!</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
    public static String resetPasswordContent(String resetUrl) {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Reset Password</title>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 0; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #007bff; color: #fff; padding: 20px; text-align: center; }" +
                ".content { padding: 20px; background-color: #fff; }" +
                ".button { display: block; width: 200px; margin: 0 auto; background-color: #007bff; color: #fff; text-decoration: none; text-align: center; padding: 10px; border-radius: 5px; font-weight: bold; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Reset Password</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>To reset your password, please click on the following link:</p>" +
                "<a href='" + resetUrl + "' class='button'>Reset Password</a>" +
                "<p>If you did not request a password reset, please ignore this email.</p>" +
                "<p>Thank you!</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
    public static String generateEmailHTMLContent(String name, String verificationCode, String verificationUrl) {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Email Verification</title>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }" +
                ".container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }" +
                ".header { background-color: #007bff; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }" +
                ".content { padding: 20px; }" +
                ".button { display: block; width: 200px; margin: 20px auto; background-color: #007bff; color: #fff; text-decoration: none; text-align: center; padding: 10px; border-radius: 5px; font-weight: bold; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Email Verification</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Hello " + name + ",</p>" +
                "<p>Thank you for registering. Please complete your registration by entering the verification code on the setup page:</p>" +
                "<p style='font-size: 20px; font-weight: bold;'>" + verificationCode + "</p>" +
                "<a href='" + verificationUrl + "' class='button'>Setup Your Credentials</a>" +
                "<p>Best regards,<br>JobBoard Team</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    public static String readHTMLContentFlutter() {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Email Verification</title>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 0; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #007bff; color: #fff; padding: 20px; text-align: center; }" +
                ".content { padding: 20px; background-color: #fff; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Email Verification</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Hello {{username}},</p>" +
                "<p>Please use the following code to verify your email:</p>" +
                "<p style='font-size: 24px; font-weight: bold;'>{{verificationCode}}</p>" + // Display verification code
                "<p>Thank you!</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
    public static String readHTMLContentFlutterReset(String username, String verificationCode) {
        return "<!DOCTYPE html>" +
                "<html lang='en'>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>Email Verification</title>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 0; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #007bff; color: #fff; padding: 20px; text-align: center; }" +
                ".content { padding: 20px; background-color: #fff; }" +
                ".verification-code { font-size: 24px; font-weight: bold; color: #007bff; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Email Verification</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Hello " + username + ",</p>" +
                "<p>Please use the following verification code to reset your password:</p>" +
                "<p class='verification-code'>" + verificationCode + "</p>" +
                "<p>If you did not request a password reset, please ignore this email.</p>" +
                "<p>Thank you!</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}
