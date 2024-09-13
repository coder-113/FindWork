package com.project4.JobBoardService.Util;

import com.project4.JobBoardService.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class AuthorizationUtils {

    @Autowired
    private  JwtUtils jwtUtils;


    public ResponseEntity<?> authorize(String token, String username) {
        try {
            String authToken = token.replace("Bearer ", "");
            String tokenUsername = jwtUtils.getUserNameFromJwtToken(authToken);
            if (!tokenUsername.equals(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this user");
            }
            return null;
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Authorization failed");
        }
    }
}
