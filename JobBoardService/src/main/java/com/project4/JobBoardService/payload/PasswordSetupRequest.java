package com.project4.JobBoardService.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PasswordSetupRequest {
    private String code;
    private String username;

    private String password;
    private String confirmPassword;

    // Getters and Setters
}