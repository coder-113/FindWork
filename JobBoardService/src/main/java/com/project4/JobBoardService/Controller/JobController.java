package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.JobDTO;
import com.project4.JobBoardService.Entity.Job;
import com.project4.JobBoardService.Entity.Review;
import com.project4.JobBoardService.Service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")

@CrossOrigin(origins = "http://localhost:3000")
public class JobController {

    private final JobService jobService;

    @Autowired
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/count")
    public int getJobsCount(@RequestParam("userId") Long userId) {
        LocalDate now = LocalDate.now();
        int year = now.getYear();
        int month = now.getMonthValue();
        return jobService.countJobsForUserInMonth(userId, year, month);
    }

    @GetMapping("/count/current")
    public int getJobsCountForCurrentMonth(@RequestParam("userId") Long userId) {
        return jobService.countJobsForUserInCurrentMonth(userId);
    }

    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('EMPLOYER')")
    @GetMapping("/{userId}")
    public ResponseEntity<List<JobDTO>> getAllJobsByCompanyId(@PathVariable Long userId) {
        List<JobDTO> jobs = jobService.findAllJobsByCompanyId(userId);
        if (jobs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(jobs);
        }
        return ResponseEntity.ok(jobs);
    }
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('EMPLOYER')")
    @GetMapping("/{userId}/search")
    public ResponseEntity<List<JobDTO>> searchJobsByCompanyId(@PathVariable Long userId, @RequestParam("text") String query) {
        List<JobDTO> jobs = jobService.searchJobsByCompanyId(userId, query);
        if (jobs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(jobs);
        }
        return ResponseEntity.ok(jobs);
    }


    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('EMPLOYER')")
    @GetMapping("/{userId}/filter")
    public ResponseEntity<List<JobDTO>> filterJobsByExpirationStatus(@PathVariable Long userId, @RequestParam boolean isExpired) {
        List<JobDTO> jobs = jobService.filterJobsByExpirationStatus(userId, isExpired);
        if (jobs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(jobs);
        }
        return ResponseEntity.ok(jobs);
    }
    @GetMapping("/super-hot")
    public List<JobDTO> getSuperHotJobs() {
        return jobService.getSuperHotJobs();
    }

    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('EMPLOYER')")
    @PostMapping("/users/{userId}")
    public ResponseEntity<String> createJob(@PathVariable("userId") Long userId,
                                            @RequestBody JobDTO jobDTO) {
        boolean createdJob = jobService.createJob(userId, jobDTO);

        if (!createdJob) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User has reached the limit job postings this month.");
        }

        return ResponseEntity.ok("Job created successfully");
    }


    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('EMPLOYER')")
    @GetMapping("job/{id}")
    public ResponseEntity<JobDTO> getJobById(@PathVariable Long id) {
        Optional<JobDTO> job = jobService.findJobById(id);
        return job.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }


    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('EMPLOYER')" )
    @PutMapping("/edit/{jobId}")
    public ResponseEntity<JobDTO> updateJob(@PathVariable Long jobId, @RequestBody JobDTO jobDTO) {
        JobDTO updatedJob = jobService.updateJob(jobId, jobDTO);
        if (updatedJob != null) {
            return ResponseEntity.ok(updatedJob);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long jobId) {
        jobService.deleteJob(jobId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{jobId}/hide")
    public ResponseEntity<Void> hideJob(@PathVariable Long jobId) {
        jobService.hideJob(jobId);
        return ResponseEntity.ok().build();
    }
    @GetMapping
    public List<JobDTO> getAllJobs() {
        return jobService.getAllJobs();
    }
}