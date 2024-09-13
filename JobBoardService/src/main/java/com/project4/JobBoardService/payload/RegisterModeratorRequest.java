package com.project4.JobBoardService.payload;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RegisterModeratorRequest {
    @Valid
    private SignupRequest signupRequest;
    private List<String> permissions;
}
