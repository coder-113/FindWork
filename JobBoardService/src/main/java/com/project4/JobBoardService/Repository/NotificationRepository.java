package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Notification;
import com.project4.JobBoardService.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipient(User user);
}
