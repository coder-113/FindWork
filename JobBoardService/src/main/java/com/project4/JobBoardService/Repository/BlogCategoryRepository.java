package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.BlogCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogCategoryRepository extends JpaRepository<BlogCategory, Long> {
}
