package com.project4.JobBoardService.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmployerDTO {
    private Long id;
    private String name;
    private String title;
    private String email;
    private String phoneNumber;
    private String companyName;
    private String companyAddress;
    private String companyWebsite;
    private boolean verified;
    private boolean approved;
}
