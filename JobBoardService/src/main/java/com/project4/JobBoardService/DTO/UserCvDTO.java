package com.project4.JobBoardService.DTO;

import java.time.LocalDateTime;
import java.util.List;

import com.project4.JobBoardService.Entity.*;
import lombok.Data;

@Data
public class UserCvDTO {
    private Long cvId;
    private Long userId;
    private Long templateId;
    private String cvTitle;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<UserDetailDTO> userDetails; // Assuming single detail DTO for simplicity
    private List<UserEducationDTO> userEducations;
    private List<UserExperienceDTO> userExperiences;
    private List<UserSkillDTO> userSkills;
    private List<UserProjectDTO> userProjects;
    private List<UserLanguageDTO> userLanguages;

}
