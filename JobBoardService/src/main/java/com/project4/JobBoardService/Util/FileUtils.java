package com.project4.JobBoardService.Util;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.web.multipart.MultipartFile;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class FileUtils {

    private static int serverPort = 8080;
    private static String uploadDir = "src/main/resources/uploads";

    public static Path saveFile(MultipartFile file, String folder) throws IOException {
        System.out.println(">>> uploadDir: " + uploadDir);
        Path resourceDirectory = Paths.get(uploadDir + File.separator + folder).toAbsolutePath().normalize();

        // Get the original filename and add a timestamp to make it unique
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            fileExtension = originalFilename.substring(dotIndex);
            originalFilename = originalFilename.substring(0, dotIndex);
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String uniqueFileName = originalFilename + "_" + timestamp + fileExtension;

        Path filePath = resourceDirectory.resolve(uniqueFileName);

        if (Files.notExists(resourceDirectory)) {
            Files.createDirectories(resourceDirectory);
        }

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filePath;
    }

    public static Path saveResizedImage(MultipartFile file, String folder, int targetWidth, int targetHeight) throws IOException {
        Path originalFilePath = saveFile(file, folder);

        // Create a new file name with timestamp
        String fileName = originalFilePath.getFileName().toString();
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String uniqueFileName = "resized_" + timestamp + "_" + fileName;

        // Path for the new image
        Path thumbnailDirectory = originalFilePath.getParent().resolve("thumbnail");
        if (Files.notExists(thumbnailDirectory)) {
            Files.createDirectories(thumbnailDirectory);
        }
        Path resizedFilePath = thumbnailDirectory.resolve(uniqueFileName);

        // Resize the image using Thumbnailator and save it
        Thumbnails.of(originalFilePath.toFile())
                .size(targetWidth, targetHeight)
                .toFile(resizedFilePath.toFile());

        return resizedFilePath;
    }

    public static String convertToUrl(Path filePath, String folder) {
        String fileName = filePath.getFileName().toString();
        return "http://localhost:" + serverPort + "/uploads/" + folder + "/" + fileName;
    }

    public static boolean deleteFile(String folder, String fileName) {
        try {
            Path filePath = Paths.get(uploadDir + "/" + folder, fileName).toAbsolutePath().normalize();
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                return true;
            } else {
                System.out.println("File not found: " + filePath);
                return false;
            }
        } catch (IOException e) {
            System.out.println("Error deleting file: " + e.getMessage());
            return false;
        }
    }

}
