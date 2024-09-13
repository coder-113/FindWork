package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.ReviewDTO;
import com.project4.JobBoardService.Entity.Review;
import com.project4.JobBoardService.Service.CompanyService;
import com.project4.JobBoardService.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies/{companyId}/reviews")
public class ReviewController {
    private final ReviewService reviewService;
    private final CompanyService companyService;

    @Autowired
    public ReviewController(ReviewService reviewService, CompanyService companyService) {
        this.reviewService = reviewService;
        this.companyService = companyService;
    }

    @GetMapping()
    public ResponseEntity<List<ReviewDTO>> getAllReviews(@PathVariable("companyId") Long companyId) {
        List<ReviewDTO> reviews = reviewService.getAllReviews(companyId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @PostMapping()
    public ResponseEntity<?> addReview(@PathVariable Long companyId,
                                       @RequestBody ReviewDTO reviewDTO,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        reviewDTO.setUsername(username);

        if (reviewService.hasUserReviewedCompany(companyId, username)) {
            return ResponseEntity.badRequest().body("User has already posted a review for this company.");
        }

        ReviewDTO newReview = reviewService.addReview(companyId, reviewDTO); // Return DTO
        if (newReview != null) {
            return ResponseEntity.ok(newReview);
        } else {
            return ResponseEntity.badRequest().body("Failed to add review. Company or user not found.");
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @GetMapping("/{reviewId}")
    public ResponseEntity<?> getReview(@PathVariable Long companyId,
                                       @PathVariable Long reviewId,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        Review review = reviewService.getReview(companyId, reviewId, username);
        if (review != null) {
            return ResponseEntity.ok(review);
        } else {
            return ResponseEntity.badRequest().body("Review not found.");
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(@PathVariable Long companyId,
                                          @PathVariable Long reviewId,
                                          @RequestBody Review updatedReview,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        boolean success = reviewService.updateReview( companyId,  reviewId,  username,  updatedReview);
        if (success) {
            return ResponseEntity.ok("Review updated successfully!");
        } else {
            return ResponseEntity.badRequest().body("Failed to update review. Company or user not found.");
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @GetMapping("/hasReviewed")
    public ResponseEntity<?> hasUserReviewedCompany(@PathVariable Long companyId,
                                                    @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        boolean hasReviewed = reviewService.hasUserReviewedCompany(companyId, username);
        return ResponseEntity.ok(hasReviewed);
    }

    @PostMapping("/{reviewId}/like")
    public ResponseEntity<?> likeReview(@PathVariable Long companyId, @PathVariable Long reviewId,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        System.out.println("Processing likeReview for reviewId: " + reviewId + " and username: " + username);
        System.out.println("Company ID: " + companyId); // Log the company ID

        boolean success = reviewService.likeReview(companyId, reviewId, username);
        if (success) {
            return ResponseEntity.ok("Review liked successfully!");
        } else {
            return ResponseEntity.badRequest().body("Failed to like review. Review not found or already liked.");
        }
    }

    @DeleteMapping("/{reviewId}/unlike")
    public ResponseEntity<?> unlikeReview(@PathVariable Long reviewId,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        boolean success = reviewService.unlikeReview(reviewId, username);
        if (success) {
            return ResponseEntity.ok("Review unliked successfully!");
        } else {
            return ResponseEntity.badRequest().body("Failed to unlike review. Review not found or not liked.");
        }
    }
}
