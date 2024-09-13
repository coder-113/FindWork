package com.project4.JobBoardService.Entity;

import com.project4.JobBoardService.Enum.ENotificationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "notification")
@Entity
public class Notification extends AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id")
    private User recipient;

    @Enumerated(EnumType.STRING)
    private ENotificationType type;
    private String url;
    private String message;

    private boolean isRead;

    public Notification(User sender, User recipient, ENotificationType type, String url, String message, boolean isRead) {
        this.sender = sender;
        this.recipient = recipient;
        this.type = type;
        this.url = url;
        this.message = message;
        this.isRead = isRead;
    }
}
