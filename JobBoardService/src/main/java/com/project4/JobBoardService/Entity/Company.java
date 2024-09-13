package com.project4.JobBoardService.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "company")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long companyId;

    @Column(name = "company_name", length = 100, nullable = false)
    private String companyName;

    @Column(length = 255)
    private String logo;

    @Column(name = "website_link", length = 255)
    private String websiteLink;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String location;

    @Column(length = 100)
    private String keySkills;

    @Column(length = 50)
    private String type;

    @Column(length = 100)
    private String companySize;

    @Column(length = 50)
    private String country;

    @Column(length = 20)
    private String countryCode;

    @Column(length = 100)
    private String workingDays;

    @Column(name = "membership_required", nullable = false)
    private Boolean membershipRequired = false;
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> reviews = new ArrayList<>();
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Job> jobs = new ArrayList<>();

}