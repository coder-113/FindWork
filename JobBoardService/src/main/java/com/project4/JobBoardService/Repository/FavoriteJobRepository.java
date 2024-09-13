package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.FavoriteJob;
import com.project4.JobBoardService.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteJobRepository extends JpaRepository<FavoriteJob, Long> {
    List<FavoriteJob> findByUser(User user);
    // Các phương thức truy vấn tùy chỉnh nếu cần
}