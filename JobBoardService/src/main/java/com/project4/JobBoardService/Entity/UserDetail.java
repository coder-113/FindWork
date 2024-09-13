package com.project4.JobBoardService.Entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;

@Entity
@Data
@Table(name = "User_Details")
public class UserDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long detailId;
    
    @ManyToOne
    @JoinColumn(name = "cv_id")
    private UserCV userCV;

    private String fullName;
    private String email;
    private Date dob;
    private String phone;
    private String address;
    @Column(columnDefinition = "LONGTEXT")
    private String summary;
    @Column(columnDefinition = "TEXT")
    private String profileImageBase64;

    // Getters and setters
}

