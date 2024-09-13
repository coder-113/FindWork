package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.NotificationDTO;
import com.project4.JobBoardService.Entity.Notification;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Service.NotificationService;
import com.project4.JobBoardService.Service.UserService;
import org.apache.coyote.Response;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping("/send")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER') or hasRole('ROLE_EMPLOYER') or hasRole('ROLE_MODERATOR')")
    public ResponseEntity<NotificationDTO> sendNotification(@RequestBody NotificationDTO notificationDTO) {
       try {
           User sender = userService.findByUsername(notificationDTO.getSender().getUsername()).orElse(null);
           User recipient = userService.findByUsername(notificationDTO.getRecipient().getUsername()).orElse(null);

           if (sender == null || recipient == null || sender == recipient) {
               return ResponseEntity.badRequest().build();
           }

           Notification notification = modelMapper.map(notificationDTO, Notification.class);
           notification.setSender(sender);
           notification.setRecipient(recipient);

           Notification created = notificationService.createNotification(notification);
           NotificationDTO response = modelMapper.map(created, NotificationDTO.class);

           template.convertAndSend("/topic/notifications", response);
           return ResponseEntity.ok(response);
       }catch(Exception e){
            return ResponseEntity.internalServerError().build();
       }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER') or hasRole('ROLE_EMPLOYER') or hasRole('ROLE_MODERATOR')")
    public ResponseEntity<List<NotificationDTO>> getNotificationByRecipientId(@PathVariable Long id){
           try {
              User user = userService.findById(id).orElse(null);
               if(user == null){
                   return ResponseEntity.badRequest().build();
               }
               List<Notification> list = notificationService.getNotificationByRecipient(user);
               List<NotificationDTO> listDTO = list.stream().map(notification ->
                    modelMapper.map(notification, NotificationDTO.class)
               ).collect(Collectors.toList());
                return ResponseEntity.ok(listDTO);
           }catch(Exception e){
               return ResponseEntity.internalServerError().build();
           }
    }

    @PutMapping("/read/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER') or hasRole('ROLE_EMPLOYER') or hasRole('ROLE_MODERATOR')")
    public ResponseEntity<NotificationDTO> updateIsReadNotification(@PathVariable Long id) {
        try {

            Notification updated = notificationService.updateIsRead(id);
            NotificationDTO response = modelMapper.map(updated, NotificationDTO.class);
            return ResponseEntity.ok(response);
        }catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER') or hasRole('ROLE_EMPLOYER') or hasRole('ROLE_MODERATOR')")
    public ResponseEntity<NotificationDTO> deleteNotification(@PathVariable Long id){
        try {
            notificationService.deleteNotification(id);
            return ResponseEntity.noContent().build();
        }catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }
}
