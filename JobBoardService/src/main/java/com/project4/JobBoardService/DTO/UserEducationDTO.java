package com.project4.JobBoardService.DTO;

import lombok.Data;

@Data
public class UserEducationDTO {
    private Long educationId;
    private Long userCVId; // Assuming you want to transfer CV ID only
    private String degree;
    private String institution;
    private String startDate;
    private String endDate;
    private String description;

    // Constructors, getters, setters as needed
}

