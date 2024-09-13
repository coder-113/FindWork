package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.Config.Annotation.CheckPermission;
import com.project4.JobBoardService.DTO.UserDTO;
import com.project4.JobBoardService.Entity.Permission;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Enum.EPermissions;
import com.project4.JobBoardService.Enum.ERole;
import com.project4.JobBoardService.Service.UserService;
import com.project4.JobBoardService.payload.PaginatedResponse;
import com.project4.JobBoardService.security.jwt.JwtUtils;
import jakarta.annotation.Nullable;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @GetMapping("/registration-count/year")
    public ResponseEntity<List<Map<String, Object>>> getUserRegistrationCountsForYear(@RequestParam int year) {
        List<Map<String, Object>> registrationCounts = userService.getUserRegistrationCountsForYear(year);
        return ResponseEntity.ok(registrationCounts);
    }
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ROLE_USER') OR hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR') or hasRole('ROLE_EMPLOYER')")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                        @ModelAttribute UserDTO userDTO, @RequestParam("imageFile") @Nullable MultipartFile file,
                                        @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        try {
            String authToken = token.replace("Bearer ", "");
            String tokenUsername = jwtUtils.getUserNameFromJwtToken(authToken);

//            if (!tokenUsername.equals(userDTO.getUsername())) {
//                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this user");
//            }

            if (userService.findById(id).orElse(null) == null) {
                return ResponseEntity.notFound().build();
            }

            User user = modelMapper.map(userDTO, User.class);
            User result = userService.updateUser(id, user, file);

            UserDTO resultDTO = modelMapper.map(result, UserDTO.class);
            return ResponseEntity.ok(resultDTO);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    @PutMapping("/{id}/permissions")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateUserPermissions(@PathVariable Long id, @RequestBody List<String> permissions) {
        try {
            User updatedUser = userService.updateUserPermissions(id, permissions);
            UserDTO userDTO = modelMapper.map(updatedUser, UserDTO.class);
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating permissions: " + e.getMessage());
        }
    }

    @GetMapping("/permissions")
    public ResponseEntity<?> getAllPermission(){
        try {
            List<Permission> permissions = userService.getAllPermission();
            return ResponseEntity.ok(permissions);
        }catch(Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    @CheckPermission(EPermissions.MANAGE_USER)
    public ResponseEntity<?> getAllUser(
            @RequestParam String query,
            @RequestParam @Nullable ERole role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<User> userList;
            if(role == null){
                userList = userService.getAllUsersWithQuery(query ,pageable);
            }else{
                userList = userService.getUsersWithUserRole(role, query, pageable);
            }
            List<UserDTO> userDTOS = userList.stream().map(user -> modelMapper.map(user, UserDTO.class)).toList();
            PaginatedResponse<UserDTO> response = new PaginatedResponse<>();
            response.setContent(userDTOS);
            response.setCurrentPage(userList.getNumber());
            response.setTotalPages(userList.getTotalPages());
            response.setTotalItems(userList.getTotalElements());
            return ResponseEntity.ok(response);
        }   catch(Exception e)  {
                return ResponseEntity.internalServerError().body("Error load data: " + e.getMessage());
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username, Authentication authentication){
        try {
            // Get the authenticated user's username
            String authenticatedUsername = authentication.getName();

            // Check if the authenticated user's username matches the requested username
            if (!authenticatedUsername.equals(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to access this user's information.");
            }
            // Fetch the user information
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }
            UserDTO userDTOS = modelMapper.map(user, UserDTO.class);
            return ResponseEntity.ok(userDTOS);
        }catch(Exception e){
            return ResponseEntity.internalServerError().body("Error load data: " + e.getMessage());

        }
    }

    //    public ResponseEntity<?> getUserByUsername(@PathVariable String username){
//        try {
//            User user = userService.findByUsername(username).orElse(null);
//            UserDTO userDTOS = modelMapper.map(user, UserDTO.class);
//            return ResponseEntity.ok(userDTOS);
//        }catch(Exception e){
//            return ResponseEntity.internalServerError().body("Error load data: " + e.getMessage());
//
//        }
//    }

    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ROLE_USER') OR hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR') or hasRole('ROLE_EMPLOYER')")
    public ResponseEntity<?> updatePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordData, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        try {
            String authToken = token.replace("Bearer ", "");
            String tokenUsername = jwtUtils.getUserNameFromJwtToken(authToken);

            // Kiểm tra xem người dùng yêu cầu cập nhật mật khẩu có phải là người dùng hiện tại không
            if (!tokenUsername.equals(userService.findById(id).orElse(null).getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this password");
            }

            // Lấy mật khẩu hiện tại và mật khẩu mới từ yêu cầu
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");

            // Xác thực mật khẩu hiện tại
            User user = userService.findById(id).orElse(null);
            if (user == null || !passwordEncoder.matches(currentPassword, user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Current password is incorrect");
            }

            // Mã hóa mật khẩu mới và cập nhật
            userService.updatePassword(id, newPassword);

            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating password: " + e.getMessage());
        }
    }

    @PutMapping("/status/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    @CheckPermission(EPermissions.MANAGE_USER)
    public ResponseEntity<?> updateUserEnableStatus(@PathVariable Long id, @RequestBody  Boolean isEnabled){
        try {
            User updateUser = userService.updateUserEnableStatus(id, isEnabled);
            if(updateUser == null) return ResponseEntity.notFound().build();
            UserDTO userDTO = modelMapper.map(updateUser, UserDTO.class);
            if(!userDTO.getIsEnabled()){
                messagingTemplate.convertAndSend("/topic/deactivated", userDTO);
            }
            return ResponseEntity.ok(userDTO);
        }catch(Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    @CheckPermission(EPermissions.MANAGE_USER)
    public ResponseEntity<?> deleteUser(@PathVariable Long id, @RequestHeader(HttpHeaders.AUTHORIZATION) String token){
        try {
            // Retrieve the user to be deleted
            User userToDelete = userService.findById(id).orElse(null);
            if (userToDelete == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if the user to be deleted is an admin
            boolean isUserToDeleteAdmin = userToDelete.getRoles().stream()
                    .anyMatch(role -> role.getName().equals(ERole.ROLE_ADMIN.name()));

            // Get the username of the requester
            String authToken = token.replace("Bearer ", "");
            String tokenUsername = jwtUtils.getUserNameFromJwtToken(authToken);

            // Retrieve the requesting user
            User requestingUser = userService.findByUsername(tokenUsername).orElse(null);
            if (requestingUser == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Requesting user not found");
            }

            // Check if the requesting user is a moderator
            boolean isRequestingUserModerator = requestingUser.getRoles().stream()
                    .anyMatch(role -> role.getName().equals(ERole.ROLE_MODERATOR.name()));

            // If the user to be deleted is an admin and the requesting user is a moderator, deny the request
            if (isUserToDeleteAdmin && isRequestingUserModerator) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Moderators cannot delete administrators");
            }

            // Proceed with the deletion
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch(Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
