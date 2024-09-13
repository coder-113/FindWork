package com.project4.JobBoardService.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "User_Projects")
public class UserProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;

    @ManyToOne
    @JoinColumn(name = "cv_id")
    private UserCV userCV;

    private String projectName;
    @Column(columnDefinition = "LONGTEXT")
    private String description;
    private String startDate;
    private String endDate;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and setters
}

