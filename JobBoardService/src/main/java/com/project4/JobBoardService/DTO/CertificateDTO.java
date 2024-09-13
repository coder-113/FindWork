package com.project4.JobBoardService.DTO;

import lombok.Data;

import java.time.LocalDate;
import java.time.YearMonth;

@Data
public class CertificateDTO {
    private Long id;
    private String name;
    private String organization;
    private LocalDate issueDate;
    private String link;
    private String description;
    private Long userId;
    private String source;

}