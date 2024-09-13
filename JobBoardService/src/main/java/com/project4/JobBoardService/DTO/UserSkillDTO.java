package com.project4.JobBoardService.DTO;

import lombok.Data;

@Data
public class UserSkillDTO {
    private Long skillId;
    private Long userCVId; // Assuming you want to transfer CV ID only
    private String skillName;
    private String proficiency;

    // Constructors, getters, setters as needed
}
