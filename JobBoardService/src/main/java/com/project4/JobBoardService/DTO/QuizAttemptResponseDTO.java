package com.project4.JobBoardService.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptResponseDTO {
    private int attemptsLeft;
    private boolean locked;
    private LocalDateTime lockEndTime;
    private long timeLeft;

    // getters and setters
}