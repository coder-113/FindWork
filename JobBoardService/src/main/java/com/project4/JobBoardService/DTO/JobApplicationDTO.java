package com.project4.JobBoardService.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class JobApplicationDTO {
    private Long id;
    private String employeeName;
    private Long userId;
    private Long jobId;
    private Long companyId;
    private byte[] cvFile;
    private String coverLetter;
    private String email; // Thêm email
    private String name;  // Thêm tên
    private String title;
    private String description;
    private boolean approved; // Các trường khác...
    private boolean isNew;

}