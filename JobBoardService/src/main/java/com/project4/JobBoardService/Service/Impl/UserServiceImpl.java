package com.project4.JobBoardService.Service.Impl;


import com.project4.JobBoardService.Entity.Permission;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Enum.ERole;
import com.project4.JobBoardService.Repository.PermissionRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.UserService;
import com.project4.JobBoardService.Util.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.*;
import java.util.logging.Logger;

@Service
public class UserServiceImpl implements UserService {
    private static final Logger logger = Logger.getLogger(UserService.class.getName());

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public User updateUserPermissions(Long userId, List<String> permissions) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Remove existing permissions
        user.getPermissions().clear();

        // Add new permissions
        for (String permissionName : permissions) {
            Permission permission = permissionRepository.findByName(permissionName)
                    .orElseThrow(() -> new RuntimeException("Permission not found: " + permissionName));
            user.getPermissions().add(permission);
        }

        return userRepository.save(user);
    }

    @Override
    public List<Map<String, Object>> getUserRegistrationCountsForYear(int year) {
        List<Map<String, Object>> registrationCounts = new ArrayList<>();
        LocalDate startOfYear = LocalDate.of(year, 1, 1);
        LocalDate endOfYear = LocalDate.of(year, 12, 31);

        for (int month = 1; month <= 12; month++) {
            LocalDate startOfMonth = LocalDate.of(year, month, 1);
            LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

            long count = userRepository.countByCreatedAtBetween(startOfMonth.atStartOfDay(), endOfMonth.atTime(23, 59, 59));
            Map<String, Object> countMap = new HashMap<>();
            countMap.put("month", startOfMonth.getMonth().toString());
            countMap.put("count", count);
            registrationCounts.add(countMap);
        }

        return registrationCounts;
    }

    @Override
    public User updatePassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }

    @Override
    public List<Permission> getAllPermission() {
        return permissionRepository.findAll();
    }


    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User updateUser(Long id, User user, MultipartFile multipartFile) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser != null) {
            updateUserDetails(existingUser, user);
            handleImageFile(existingUser, multipartFile, "update");
            return userRepository.save(existingUser);
        } else {
            logger.warning("User not found: " + id);
            return null;
        }
    }

    @Override
    public Page<User> getUsersWithUserRole(ERole roleName, String query, Pageable pageable) {
        return userRepository.searchByRoleAndQuery(roleName, query, pageable);
    }

    @Override
    public Page<User> getAllUsersWithQuery(String query, Pageable pageable) {
        return userRepository.searchAllUsers(query, pageable);
    }


    @Override
    public User updateUserEnableStatus(Long id, Boolean isEnabled) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser != null) {
            existingUser.setIsEnabled(isEnabled);
            return userRepository.save(existingUser);
        } else {
            logger.warning("Blog not found: " + id);
            return null;
        }
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }


    private void handleImageFile(User user, MultipartFile imageFile, String operationType) {
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                if ("update".equals(operationType)) {
                    deleteImageFile(user.getImageUrl());
                    deleteImageFile(user.getThumbnailUrl());
                }
                // Save original image
                Path originalFilePath = FileUtils.saveFile(imageFile, "user");
                String originalImageUrl = FileUtils.convertToUrl(originalFilePath, "user");
                user.setImageUrl(originalImageUrl);
                logger.info("Original image " + ("update".equals(operationType) ? "updated and saved" : "saved") + " to: " + originalImageUrl);

                // Save thumbnail
                int thumbnailWidth = 400;
                int thumbnailHeight = 400;
                Path thumbnailFilePath = FileUtils.saveResizedImage(imageFile, "user", thumbnailWidth, thumbnailHeight);
                String thumbnailImageUrl = FileUtils.convertToUrl(thumbnailFilePath, "user/thumbnail");
                user.setThumbnailUrl(thumbnailImageUrl);
                logger.info("Thumbnail " + ("update".equals(operationType) ? "updated and saved" : "saved") + " to: " + thumbnailImageUrl);
            } catch (IllegalArgumentException | IOException e) {
                logger.warning("Invalid file: " + e.getMessage());
            }
        }
    }

    private void deleteImageFile(String image) {
        if (image != null && !image.isEmpty()) {
            String[] urlParts = image.split("/uploads/");
            if (urlParts.length == 2) {
                String[] pathParts = urlParts[1].split("/");
                String folder = pathParts[0];
                String fileName = pathParts[1];
                if (fileName.equals("thumbnail")) {
                    fileName += "/" + pathParts[2];
                }
                boolean fileDeleted = FileUtils.deleteFile(folder, fileName);
                if (!fileDeleted) {
                    logger.warning("Failed to delete the image file: " + fileName);
                }
            }
        }
    }

    private void updateUserDetails(User existingUser, User updatedUser) {
        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setGender(updatedUser.getGender());
        existingUser.setBio(updatedUser.getBio());
//        existingUser.setImageUrl(updatedUser.getImageUrl());
        existingUser.setDateOfBirth(updatedUser.getDateOfBirth());
    }
}
