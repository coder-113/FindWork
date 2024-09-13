package com.project4.JobBoardService.DTO;

import lombok.Data;

import java.util.Date;

@Data
public class UserDetailDTO {
    private Long detailId;
    private Long userCVId; // Assuming you want to transfer CV ID only
    private String fullName;
    private String email;
    private String phone;
    private Date dob;
    private String address;
    private String summary;
    private String profileImageBase64;

    // Constructors, getters, setters as needed
}

