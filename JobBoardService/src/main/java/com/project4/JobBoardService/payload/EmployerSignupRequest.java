package com.project4.JobBoardService.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployerSignupRequest {
    private String name;
    private String title;
    private String email;
    private String phoneNumber;
    private String companyName;
    private String companyAddress;
    private String companyWebsite;

    // Getters and Setters
}