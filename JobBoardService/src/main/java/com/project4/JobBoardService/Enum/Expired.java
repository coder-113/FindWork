package com.project4.JobBoardService.Enum;

import java.time.LocalDateTime;

public enum Expired {
    SEVEN_DAYS(7),
    THIRTY_DAYS(30),
    NINETY_DAYS(90);

    private final int days;

    Expired(int days) {
        this.days = days;
    }

    public LocalDateTime calculateExpirationDate(LocalDateTime startDate) {
        return startDate.plusDays(days);
    }
}