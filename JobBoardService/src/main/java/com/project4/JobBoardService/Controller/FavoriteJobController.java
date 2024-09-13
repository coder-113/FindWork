package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.FavoriteJobDTO;
import com.project4.JobBoardService.Entity.Category;
import com.project4.JobBoardService.Service.FavoriteJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorite-jobs")
public class FavoriteJobController {

    @Autowired
    private FavoriteJobService favoriteJobService;

    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<?> addJobToFavorites(@RequestBody Map<String, Long> requestBody,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        Long jobId = requestBody.get("jobId");

        try {
            FavoriteJobDTO favoriteJobDTO = favoriteJobService.addJobToFavorites(jobId, username);
            Map<String, Object> response = new HashMap<>();
            response.put("favoriteId", favoriteJobDTO.getId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @GetMapping("/list")
    public ResponseEntity<?> getFavoriteJobsForUser(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        try {
            List<FavoriteJobDTO> favoriteJobs = favoriteJobService.getFavoriteJobsForUser(username);
            List<Map<String, Object>> responseList = favoriteJobs.stream().map(this::convertToResponse).collect(Collectors.toList());
            return ResponseEntity.ok(responseList);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @DeleteMapping("/delete/{favoriteId}")
    public ResponseEntity<?> deleteFavoriteJob(@PathVariable Long favoriteId) {
        try {
            favoriteJobService.deleteFavoriteJob(favoriteId);
            return ResponseEntity.ok("Favorite job deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private Map<String, Object> convertToResponse(FavoriteJobDTO favoriteJobDTO) {
        Map<String, Object> responseItem = new HashMap<>();
        responseItem.put("favoriteId", favoriteJobDTO.getId());
        responseItem.put("createdAt", favoriteJobDTO.getJob().getCreatedAt());
        responseItem.put("jobId", favoriteJobDTO.getJob().getId());
        responseItem.put("companyId", favoriteJobDTO.getJob().getCompany().getCompanyId());
        responseItem.put("companyLogo", favoriteJobDTO.getJob().getCompany().getLogo());
        responseItem.put("jobTitle", favoriteJobDTO.getJob().getTitle());
        responseItem.put("offeredSalary", favoriteJobDTO.getJob().getOfferedSalary());
        responseItem.put("jobDescription", favoriteJobDTO.getJob().getDescription());
        responseItem.put("responsibilities", favoriteJobDTO.getJob().getResponsibilities());
        responseItem.put("requiredSkills", favoriteJobDTO.getJob().getRequiredSkills());
        responseItem.put("workSchedule", favoriteJobDTO.getJob().getWorkSchedule());
        responseItem.put("experience", favoriteJobDTO.getJob().getExperience());
        responseItem.put("qualification", favoriteJobDTO.getJob().getQualification());
        responseItem.put("jobType", favoriteJobDTO.getJob().getJobType());
        responseItem.put("contractType", favoriteJobDTO.getJob().getContractType());
        responseItem.put("benefit", favoriteJobDTO.getJob().getBenefit());
        responseItem.put("slot", favoriteJobDTO.getJob().getSlot());
        responseItem.put("expire", favoriteJobDTO.getJob().getExpire());
        responseItem.put("position", favoriteJobDTO.getJob().getPosition());
        responseItem.put("location", favoriteJobDTO.getJob().getCompany().getLocation());
        responseItem.put("categoryId", favoriteJobDTO.getJob().getCategories().stream()
                .map(Category::getCategoryId)
                .collect(Collectors.toList()));
        responseItem.put("companyName", favoriteJobDTO.getJob().getCompany().getCompanyName());
        responseItem.put("websiteLink", favoriteJobDTO.getJob().getCompany().getWebsiteLink());
        responseItem.put("companyDescription", favoriteJobDTO.getJob().getCompany().getDescription());
        responseItem.put("keySkills", favoriteJobDTO.getJob().getCompany().getKeySkills());
        responseItem.put("type", favoriteJobDTO.getJob().getCompany().getType());
        responseItem.put("companySize", favoriteJobDTO.getJob().getCompany().getCompanySize());
        responseItem.put("country", favoriteJobDTO.getJob().getCompany().getCountry());
        responseItem.put("countryCode", favoriteJobDTO.getJob().getCompany().getCountryCode());
        responseItem.put("workingDays", favoriteJobDTO.getJob().getCompany().getWorkingDays());
        responseItem.put("username", favoriteJobDTO.getUser().getUsername());
        return responseItem;
    }
}
