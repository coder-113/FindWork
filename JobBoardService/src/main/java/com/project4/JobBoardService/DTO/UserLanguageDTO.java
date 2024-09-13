package com.project4.JobBoardService.DTO;

import lombok.Data;

@Data
public class UserLanguageDTO {
    private Long languageId;
    private Long userCVId; // Assuming you want to transfer CV ID only
    private String languageName;
    private String proficiency;

    // Constructors, getters, setters as needed
}
