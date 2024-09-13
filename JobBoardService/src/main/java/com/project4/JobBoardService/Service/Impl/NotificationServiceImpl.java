package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.Entity.Notification;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Repository.NotificationRepository;
import com.project4.JobBoardService.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public List<Notification> getNotificationByRecipient(User user) {
        return notificationRepository.findByRecipient(user);
    }

    @Override
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Override
    public Notification updateIsRead(Long id) {
        Notification existingNotification = notificationRepository.findById(id).orElse(null);
        if(existingNotification != null){
            existingNotification.setRead(true);
           return notificationRepository.save(existingNotification);
        }
        return null;
    }


    public void sendNotification(String destination, Object message) {
        messagingTemplate.convertAndSend(destination, message);
    }

    @Override
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
