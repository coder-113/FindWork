package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Subscription;
import com.project4.JobBoardService.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface TransactionRepository extends JpaRepository<Subscription, Long> {

    @Query("SELECT s FROM Subscription s WHERE s.user = :user AND s.endDate > :now AND (s.service IS NULL OR s.service = '')")
    Optional<Subscription> findByUserAndEndDateAfter(@Param("user") User user, @Param("now") LocalDate now);


    @Query(value = "SELECT * FROM Subscription s WHERE s.user_id = :userId", nativeQuery = true)
    List<Subscription> findAllSubscriptionByUserId(@Param("userId") Long userId);


    @Query("SELECT s.service FROM Subscription s WHERE s.user.id = :userId AND s.endDate > CURRENT_DATE")
    List<String> findServicesByUserId(Long userId);

    @Query("SELECT s FROM Subscription s WHERE s.user = :user AND s.endDate > :now")
    List<Subscription> findByUserEndDate(@Param("user") User user, @Param("now") LocalDate now);


}
