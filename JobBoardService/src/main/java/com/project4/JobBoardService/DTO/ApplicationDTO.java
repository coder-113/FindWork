package com.project4.JobBoardService.DTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApplicationDTO {
    private Long id;
    private String employeeName;
    private Long userId;
    private JobDTO jobDTO;
    private CompanyDTO companyDTO;
    private byte[] cvFile;
    private String coverLetter;
    private boolean approved; // Added field
    private boolean isNew; // Added field
    private LocalDateTime createdAt; // Added field
}
