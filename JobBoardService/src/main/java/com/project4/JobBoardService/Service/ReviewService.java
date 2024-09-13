package com.project4.JobBoardService.Service;


import com.project4.JobBoardService.DTO.CompanyDTO;
import com.project4.JobBoardService.DTO.ReviewDTO;
import com.project4.JobBoardService.Entity.Company;
import com.project4.JobBoardService.Entity.Review;

import java.util.List;

public interface ReviewService {
    List<ReviewDTO> getAllReviews(Long companyId);

    ReviewDTO addReview(Long companyId, ReviewDTO reviewDTO);
    Review getReview(Long companyId, Long reviewId, String username);
    boolean updateReview(Long companyId, Long reviewId, String username, Review updatedReview);
    Company convertCompanyToEntity(CompanyDTO companyDTO);
    boolean hasUserReviewedCompany(Long companyId, String username);
    boolean likeReview(Long companyId,Long reviewId, String username);
    boolean unlikeReview(Long reviewId, String username);
}
