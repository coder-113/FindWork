package com.project4.JobBoardService.DTO;

import com.project4.JobBoardService.Entity.Permission;
import com.project4.JobBoardService.Entity.Role;
import com.project4.JobBoardService.Enum.Gender;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
public class InforUserDTO {
    private Long id;
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private Gender gender;
    private String imageUrl;
    private String bio;
    private Boolean isEnabled;
    private Set<Role> roles;
    private String numberphone;
    private String facebook;
    private List<CertificateDTO> certificates;
    private List<UserEducationDTO> userEducations;
    private List<UserExperienceDTO> userExperiences;
    private List<UserSkillDTO> userSkills;
    private List<UserProjectDTO> userProjects;
    private List<UserLanguageDTO> userLanguages;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dateOfBirth;
    private String currentAddress;
}
