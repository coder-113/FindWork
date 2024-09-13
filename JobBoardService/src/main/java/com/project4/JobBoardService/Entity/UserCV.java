package com.project4.JobBoardService.Entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Nullable;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "User_CVs")
public class UserCV {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cvId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Nullable
    @ManyToOne
    @JoinColumn(name = "template_id")
    private Template template;
    
    private String cvTitle;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "userCV", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserDetail> userDetails;

    @OneToMany(mappedBy = "userCV", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserEducation> userEducations;

    @OneToMany(mappedBy = "userCV", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserExperience> userExperiences;

    @OneToMany(mappedBy = "userCV", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserSkill> userSkills;

    @OneToMany(mappedBy = "userCV", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserProject> userProjects;

    @OneToMany(mappedBy = "userCV", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserLanguage> userLanguages;

    
}

