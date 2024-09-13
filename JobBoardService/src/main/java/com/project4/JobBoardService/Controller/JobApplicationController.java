package com.project4.JobBoardService.Controller;
import com.project4.JobBoardService.DTO.JobApplicationDTO;
import com.project4.JobBoardService.Service.JobApplicationService;
import com.project4.JobBoardService.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
    @RequestMapping("/api/job-applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @Autowired
    private NotificationService notificationService;



    @GetMapping("/company/{companyId}/{userIdFromJwt}")
    public List<JobApplicationDTO> getApplicationsByCompanyId(@PathVariable Long companyId,@PathVariable Long userIdFromJwt ) {
        return jobApplicationService.getApplicationsByCompanyId(companyId,userIdFromJwt);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveJobApplication(@PathVariable Long id) {
        try {
            jobApplicationService.approveJobApplication(id);
            return ResponseEntity.ok("Job application acceppted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error");
        }
    }

    @GetMapping("/applicationCount")
        public ResponseEntity<Long> getApplicationCount(@RequestParam Long companyId) {
        long count = jobApplicationService.getApplicationCountByCompany(companyId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count-approved-by-job/{jobId}")
    public ResponseEntity<Long> getApprovedCvCountByJobId(@PathVariable Long jobId) {
        long count = jobApplicationService.getcvJob(jobId);
        return ResponseEntity.ok(count);
    }


    @GetMapping("/newCount")
    public ResponseEntity<Long> getcvCount(@RequestParam Long companyId) {
        long count = jobApplicationService.getNewCvCountByCompanyId(companyId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/approvedCount")
    public ResponseEntity<Long> getappvoredCount(@RequestParam Long companyId) {
        long count = jobApplicationService.getApprovedCvCountByCompanyId(companyId);
        return ResponseEntity.ok(count);
    }



    @GetMapping("/company/{companyId}/new/{userIdFromJwt}")
    public ResponseEntity<List<JobApplicationDTO>> getNewApplicationsByCompanyId(@PathVariable Long companyId,@PathVariable Long userIdFromJwt) {
        List<JobApplicationDTO> newApplications = jobApplicationService.getNewApplicationsByCompanyId(companyId,userIdFromJwt);
        return ResponseEntity.ok(newApplications);
    }

    @PostMapping("/{applicationId}/mark-as-read")
    public ResponseEntity<Void> markApplicationAsRead(@PathVariable Long applicationId) {
        jobApplicationService.markApplicationAsRead(applicationId);
        notificationService.sendNotification("/topic/notifications", "Application " + applicationId + " marked as read");
        return ResponseEntity.ok().build();
    }


    @GetMapping("/api/chart-data")
    public Map<String, Object> getChartData(
            @RequestParam Long companyId,
            @RequestParam(required = false, defaultValue = "MONTH") String filterType) {
        return jobApplicationService.getChartDataByCompany(companyId, filterType);
    }


}
