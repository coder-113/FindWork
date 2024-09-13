package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.Entity.Notification;
import com.project4.JobBoardService.Entity.User;

import java.util.List;
import java.util.Optional;

public interface NotificationService {
    List<Notification> getNotificationByRecipient(User user);
    Notification createNotification(Notification notification);
    Notification updateIsRead(Long id);
    void deleteNotification(Long id);

    public void sendNotification(String destination, Object message);
}
