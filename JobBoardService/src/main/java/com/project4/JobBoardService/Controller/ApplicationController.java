package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.ApplicationDTO;
import com.project4.JobBoardService.Entity.*;
import com.project4.JobBoardService.Repository.CompanyRepository;
import com.project4.JobBoardService.Repository.JobApplicationRepository;
import com.project4.JobBoardService.Repository.JobRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.EmailService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/application")
public class ApplicationController {
    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private CompanyRepository companyRepository;

//    @PostMapping("/{jobId}/{companyId}")
//    public ResponseEntity<String> applyJob(
//            @PathVariable Long jobId,
//            @PathVariable Long companyId,
//            @RequestParam Long userId,
//            @RequestParam("employeeName") String employeeName,
//            @RequestParam("cvFile") MultipartFile cvFile,
//            @RequestParam("coverLetter") String coverLetter) {
//        try {
//            // Find user by ID
//            User user = userRepository.findById(userId)
//                    .orElseThrow(() -> new RuntimeException("User not found"));
//
//            // Find job by ID
//            Job job = jobRepository.findById(jobId)
//                    .orElseThrow(() -> new RuntimeException("Job not found"));
//
//            // Find company by ID
//            Company company = companyRepository.findById(companyId)
//                    .orElseThrow(() -> new RuntimeException("Company not found"));
//
//            // Convert MultipartFile to byte[]
//            byte[] cvFileBytes = cvFile.getBytes();
//
//            // Create new job application
//            JobApplication jobApplication = new JobApplication();
//            jobApplication.setUser(user);
//            jobApplication.setJob(job);
//            jobApplication.setCompany(company); // Store company object
//            jobApplication.setCvFile(cvFileBytes);
//            jobApplication.setCoverLetter(coverLetter);
//            jobApplication.setEmployeeName(employeeName);
//
//            // Save job application
//            jobApplicationRepository.save(jobApplication);
//
//            return ResponseEntity.ok("Application submitted successfully.");
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("An error occurred while submitting the application: " + e.getMessage());
//        }
//    }
@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
@PostMapping("/{jobId}/{companyId}")
public ResponseEntity<String> applyJob(
        @PathVariable Long jobId,
        @PathVariable Long companyId,
        @RequestParam Long userId,
        @RequestParam("employeeName") String employeeName,
        @RequestParam("cvFile") MultipartFile cvFile,
        @RequestParam("coverLetter") String coverLetter) {
    try {
        // Find user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find job by ID
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Find company by ID
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Convert MultipartFile to byte[]
        byte[] cvFileBytes = cvFile.getBytes();

        // Create new job application
        JobApplication jobApplication = new JobApplication();
        jobApplication.setUser(user);
        jobApplication.setJob(job);
        jobApplication.setCompany(company);
        jobApplication.setCvFile(cvFileBytes);
        jobApplication.setCoverLetter(coverLetter);
        jobApplication.setEmployeeName(employeeName);

        // Save job application
        jobApplicationRepository.save(jobApplication);

        // Send email notification
        String subject = "Job Application Submitted Successfully";
        String message = "Dear " + employeeName + ",\n\n" +
                "Your application for the position of " + job.getTitle() + " at " + company.getCompanyName() +
                " has been successfully submitted.\n\n" +
                "Thank you for your interest. We will review your application and get back to you soon.\n\n" +
                "Best regards,\nThe Job Board Team";

        emailService.sendJobApplicationConfirmation(user.getEmail(), employeeName, job.getTitle(), company.getCompanyName());

        return ResponseEntity.ok("Application submitted successfully and notification email sent.");
    } catch (Exception e) {
        return ResponseEntity.status(500).body("An error occurred while submitting the application: " + e.getMessage());
    }
}
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByUser(@PathVariable Long userId) {
        List<JobApplication> applications = jobApplicationRepository.findByUserId(userId);

        List<ApplicationDTO> applicationDTOs = applications.stream()
                .map(application -> modelMapper.map(application, ApplicationDTO.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(applicationDTOs);
    }
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")

    @GetMapping("/user/{userId}/job/{jobId}")
    public ResponseEntity<Boolean> hasAppliedForJob(
            @PathVariable Long userId,
            @PathVariable Long jobId) {
        boolean hasApplied = jobApplicationRepository.existsByUserIdAndJobId(userId, jobId);
        return ResponseEntity.ok(hasApplied);
    }

    @GetMapping("/download-pdf/{applicationId}")
    public ResponseEntity<byte[]> downloadCvPdf(@PathVariable Long applicationId) {
        try {
            // Find job application by ID
            JobApplication jobApplication = jobApplicationRepository.findById(applicationId)
                    .orElseThrow(() -> new RuntimeException("Job Application not found"));

            // Get the CV file byte array
            byte[] cvFileBytes = jobApplication.getCvFile();

            // Set headers to indicate a file download
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "cv.pdf");
            headers.setContentLength(cvFileBytes.length);

            return new ResponseEntity<>(cvFileBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

}
