package com.project4.JobBoardService.DTO;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CompanyDTO {

    private Long companyId;


    private String companyName;


    private String logo;


    private String websiteLink;
    private String description;
    private String location;
    private String keySkills;
    private String type;
    private String companySize;
    private String country;
    private String countryCode;
    private String workingDays;
    private List<ReviewDTO> reviews;  // List of ReviewDTO
    private List<JobDTO> jobs;  // List of JobDTO

    private Boolean membershipRequired = false;
    public void setReviews(List<ReviewDTO> reviews) {
        this.reviews = reviews;
    }

    public void setJobs(List<JobDTO> jobs) {
        this.jobs = jobs;
    }
}