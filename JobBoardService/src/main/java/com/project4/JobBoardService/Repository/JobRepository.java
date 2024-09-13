package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.DTO.JobDTO;
import com.project4.JobBoardService.Entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findAllByUserId(Long userId);

    List<Job> findByUser_IdAndTitleContaining(Long userId, String title);

    List<Job> findByUser_IdAndExpiredBefore(Long userId, LocalDate date);

    List<Job> findByUser_IdAndExpiredAfter(Long userId, LocalDate date);

    @Query("SELECT COUNT(j) FROM Job j WHERE j.user.id = :userId AND FUNCTION('YEAR', j.createdAt) = :year AND FUNCTION('MONTH', j.createdAt) = :month")
    int countJobsByUserIdAndMonth(@Param("userId") Long userId, @Param("year") int year, @Param("month") int month);

    // Method to get the current month's data
    default int countJobsForUserInCurrentMonth(Long userId) {
        LocalDate now = LocalDate.now();
        return countJobsByUserIdAndMonth(userId, now.getYear(), now.getMonthValue());
    }



}
