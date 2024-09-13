package com.project4.JobBoardService.Config;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "You don't have permission to perform this action")
public class PermissionDeniedException extends RuntimeException {
    public PermissionDeniedException() {
        super("You don't have permission to perform this action");
    }
}