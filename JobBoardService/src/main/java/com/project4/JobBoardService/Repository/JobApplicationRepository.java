package com.project4.JobBoardService.Repository;
import com.project4.JobBoardService.Entity.JobApplication;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    @Query("SELECT ja FROM JobApplication ja JOIN ja.job j WHERE j.company.id = :companyId")
    List<JobApplication> findApplicationsByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(ja) FROM JobApplication ja JOIN ja.job j WHERE j.company.id = :companyId")
    long countApplicationsByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT ja FROM JobApplication ja WHERE ja.company.id = :companyId AND ja.isNew = true")
    List<JobApplication> findNewApplicationsByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(j) FROM JobApplication j WHERE j.company.id = :companyId AND j.isNew = true")
    long countNewApplicationsByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(j) FROM JobApplication j WHERE j.company.id = :companyId AND j.approved = true")
    long countApprovedApplicationsByCompanyId(@Param("companyId") Long companyId);


    @Query("SELECT COUNT(ja) FROM JobApplication ja WHERE ja.job.id = :jobId")
    long countApprovedApplicationsByJobId(@Param("jobId") Long jobId);

    @Modifying
    @Transactional
    @Query("UPDATE JobApplication ja SET ja.isNew = false WHERE ja.id = :applicationId")
    void markAsRead(@Param("applicationId") Long applicationId);

    List<JobApplication> findByUserId(Long userId);


    boolean existsByUserIdAndJobId(Long userId, Long jobId);



}