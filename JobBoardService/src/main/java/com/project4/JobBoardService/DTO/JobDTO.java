package com.project4.JobBoardService.DTO;

import com.project4.JobBoardService.Entity.Category;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class JobDTO {
    private Long id;
    private String title;
    private String offeredSalary;
    private String description;
    private String responsibilities;
    private String city;
    private String requiredSkills;
    private String workSchedule;
    private String keySkills;
    private String position;
    private String experience;
    private String qualification;
    private String jobType;
    private String contractType;
    private String benefit;
    private LocalDateTime createdAt;
    private Integer slot;
    private Integer profileApproved = 0;
    private Boolean isSuperHot;
    private List<Long> categoryId = new ArrayList<>();
    private Boolean isHidden;
    private Long companyId;
    private String expire;
    private LocalDateTime expired;
    private Long userId;
}