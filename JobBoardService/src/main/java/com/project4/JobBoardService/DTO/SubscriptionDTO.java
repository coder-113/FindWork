package com.project4.JobBoardService.DTO;

import lombok.*;

import java.time.LocalDate;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionDTO {
    private Long id;
    private Long userId;
    private int postLimit;
    private String service;
    private LocalDate startDate;
    private LocalDate endDate;
    private double amount;
}
