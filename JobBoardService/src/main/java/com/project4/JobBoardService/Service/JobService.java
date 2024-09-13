package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.JobDTO;
import com.project4.JobBoardService.Entity.Job;

import java.util.List;
import java.util.Optional;

public interface JobService {
    List<JobDTO> findAllJobsByCompanyId(Long userId);
    //    Integer countJobsByCompanyId(Long companyId);
    List<JobDTO> searchJobsByCompanyId(Long userId, String query);
    List<JobDTO> filterJobsByExpirationStatus(Long userId, boolean isExpired);
    boolean createJob(Long userId, JobDTO jobDTO);
    JobDTO updateJob(Long jobId, JobDTO jobDTO);
    void deleteJob(Long jobId);

    void hideJob(long jobId);
    // Add this method
    Optional<JobDTO> findJobById(Long jobId);

    List<JobDTO> getAllJobs();
    List<Job> getAllJob();
    List<JobDTO> getSuperHotJobs();

    int countJobsForUserInMonth(Long userId, int year, int month);

    int countJobsForUserInCurrentMonth(Long userId);
//    boolean updateJob(Long companyId, Long categoryId, JobDTO jobDTO);
}