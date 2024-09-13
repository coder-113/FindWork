package com.project4.JobBoardService.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "User_Languages")
public class UserLanguage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long languageId;

    @ManyToOne
    @JoinColumn(name = "cv_id")
    private UserCV userCV;

    private String languageName;
    private String proficiency;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and setters
}

