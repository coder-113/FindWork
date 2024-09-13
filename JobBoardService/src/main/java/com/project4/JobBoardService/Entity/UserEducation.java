package com.project4.JobBoardService.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "User_Education")
public class UserEducation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long educationId;

    @ManyToOne
    @JoinColumn(name = "cv_id")
    private UserCV userCV;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    private String degree;
    private String institution;
    private String startDate;
    private String endDate;
    @Column(columnDefinition = "LONGTEXT")
    private String description;

    // Getters and setters
}

