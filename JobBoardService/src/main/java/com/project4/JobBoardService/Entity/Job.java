package com.project4.JobBoardService.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.project4.JobBoardService.Enum.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

@Table(name = "job")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(name = "offered_salary")
    private String offeredSalary;

    @Column(columnDefinition = "text")
    private String description;

    private String city;

    @Column(columnDefinition = "text")
    private String responsibilities;

    @Column(columnDefinition = "text")
    private String requiredSkills;

    @Column(name = "work_schedule", columnDefinition = "text")
    private String workSchedule;

    @Column(name = "keySkills")
    private String keySkills;

    @Enumerated(EnumType.STRING)
    private Position position;

    @Column(columnDefinition = "text")
    private String experience;

    @Column(columnDefinition = "text")
    private String qualification;

    @Column(name = "job_type")
    @Enumerated(EnumType.STRING)
    private JobType jobType;

    @Column(name = "contract_type")
    @Enumerated(EnumType.STRING)
    private ContractType contractType;

    @Column(columnDefinition = "text")
    private String benefit;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private Integer slot;

    @Builder.Default
    @Column(nullable = false, name = "profile_ approved")
    private Integer profileApproved = 0;

    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean isSuperHot;

    @ManyToMany
    @JoinTable(
            name = "job_category",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @Builder.Default
    private Set<Category> categories = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    private String expire;

    @ManyToOne
    @JoinColumn(name = "user", nullable = false)
    private User user;

    @Column(name = "expired")
    private LocalDateTime expired;

    @Builder.Default
    @Column(name = "is_hidden", nullable = false)
    private Boolean isHidden = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Boolean getIsSuperHot() {
        return isSuperHot;
    }

    public void setIsSuperHot(Boolean isSuperHot) {
        this.isSuperHot = isSuperHot;
    }
}