package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.Entity.Permission;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Enum.ERole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UserService {
    Optional<User> findByUsername(String username);

    Optional<User> findById(Long id);

    User updateUser(Long id, User user, MultipartFile multipartFile);

    Page<User> getUsersWithUserRole(ERole roleName, String query, Pageable pageable);

    Page<User> getAllUsersWithQuery(String query, Pageable pageable);

    User updateUserEnableStatus(Long id, Boolean isEnabled);

    void deleteUser(Long id);

    User updateUserPermissions(Long userId, List<String> permissions);

    List<Map<String, Object>> getUserRegistrationCountsForYear(int year);

    User updatePassword(Long userId, String newPassword);

    List<Permission> getAllPermission();

}