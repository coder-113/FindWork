package com.project4.JobBoardService.Repository;


import com.project4.JobBoardService.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCompany_CompanyId(Long companyId);
    List<Review> findByCompany_CompanyIdAndUserId(Long companyId, Long userId);
    List<Review> findByCompany_CompanyIdAndUser_Username(Long companyId, String username);
}
