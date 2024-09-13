package com.project4.JobBoardService.DTO;
import com.project4.JobBoardService.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ContactDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String subject;
    private String message;
    private boolean archived;
    private LocalDateTime createdAt;

}