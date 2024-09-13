package com.project4.JobBoardService.payload;


import com.project4.JobBoardService.Entity.Company;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String refreshToken;
    private String firstName;
    private String lastName;
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
    private Long CompanyId;





    public JwtResponse(String accessToken, String refreshToken, Long id, String username, String email, String firstName, String lastName, List<String> roles, Long companyId) {
        this.token = accessToken;
        this.refreshToken = refreshToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;    // Add this
        this.roles = roles;
        this.CompanyId = companyId;

    }
    public String getAccessToken() {
        return token;
    }

    public void setAccessToken(String accessToken) {
        this.token = accessToken;
    }

    public String getTokenType() {
        return type;
    }

    public void setTokenType(String tokenType) {
        this.type = tokenType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getFirstName() {  // Add this
        return firstName;
    }

    public void setFirstName(String firstName) {  // Add this
        this.firstName = firstName;
    }

    public String getLastName() {  // Add this
        return lastName;
    }

    public void setLastName(String lastName) {  // Add this
        this.lastName = lastName;
    }


}