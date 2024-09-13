package com.project4.JobBoardService.DTO;

import lombok.Data;

@Data
public class UserExperienceDTO {
    private Long experienceId;
    private Long userCVId; // Assuming you want to transfer CV ID only
    private String jobTitle;
    private String company;
    private String startDate;
    private String endDate;
    private String description;

    // Constructors, getters, setters as needed
}
