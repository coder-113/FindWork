package com.project4.JobBoardService.DTO;

import lombok.Data;

@Data
public class UserProjectDTO {
    private Long projectId;
    private Long userCVId; // Assuming you want to transfer CV ID only
    private String projectName;
    private String description;
    private String startDate;
    private String endDate;

    // Constructors, getters, setters as needed
}
