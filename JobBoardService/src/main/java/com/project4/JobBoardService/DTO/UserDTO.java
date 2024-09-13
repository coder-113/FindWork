package com.project4.JobBoardService.DTO;
import com.project4.JobBoardService.Entity.Permission;
import com.project4.JobBoardService.Entity.Role;
import com.project4.JobBoardService.Enum.ERole;
import com.project4.JobBoardService.Enum.Gender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private Gender gender;
    private String imageUrl;
    private String thumbnailUrl;
    private String bio;
    private Boolean isEnabled;
    private Set<Role> roles;
    private Set<Permission> permissions;
    private Date updatedAt;
    private Boolean verified;
    private LocalDate dateOfBirth;
}
