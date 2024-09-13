package com.project4.JobBoardService.payload;

import java.util.Set;

import com.project4.JobBoardService.Enum.Gender;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequest {
    @Setter
    @Getter
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @Setter
    @Getter
    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @Setter
    @Getter
    private Set<String> role;

    @Setter
    @Getter
    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
    @Setter
    @Getter
    @NotBlank
    @Size(max = 50)
    private String firstName;
    @Setter
    @Getter
    @NotBlank
    @Size(max = 50)
    private String lastName;
    @Setter
    @Getter
    @Enumerated(EnumType.STRING)
    private Gender gender;


}