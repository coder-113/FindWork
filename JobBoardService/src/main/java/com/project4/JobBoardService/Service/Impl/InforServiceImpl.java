package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.CertificateDTO;
import com.project4.JobBoardService.DTO.InforUserDTO;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Repository.CertificateRepository;
import com.project4.JobBoardService.Repository.PermissionRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.InforService;
import com.project4.JobBoardService.Util.FileUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InforServiceImpl implements InforService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PermissionRepository permissionRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private CertificateRepository certificateRepository;

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User updateUser1(Long id, User user, MultipartFile multipartFile) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser != null) {
            updateUserDetails(existingUser, user);
            handleImageFile(existingUser, multipartFile, "update");
            return userRepository.save(existingUser);
        } else {
            return null;
        }
    }

    private void updateUserDetails(User existingBlog, User updatedBlog) {
        existingBlog.setFirstName(updatedBlog.getFirstName());
        existingBlog.setLastName(updatedBlog.getLastName());
        existingBlog.setBio(updatedBlog.getBio());
        existingBlog.setNumberphone(updatedBlog.getNumberphone());
        existingBlog.setFacebook(updatedBlog.getFacebook());
        existingBlog.setDateOfBirth(updatedBlog.getDateOfBirth());
        existingBlog.setCurrentAddress(updatedBlog.getCurrentAddress());
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

                // Save thumbnail
                int thumbnailWidth = 400;
                int thumbnailHeight = 400;
                Path thumbnailFilePath = FileUtils.saveResizedImage(imageFile, "user", thumbnailWidth, thumbnailHeight);
                String thumbnailImageUrl = FileUtils.convertToUrl(thumbnailFilePath, "user/thumbnail");
                user.setThumbnailUrl(thumbnailImageUrl);
            } catch (IllegalArgumentException | IOException e) {
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
                }
            }
        }
    }

}
