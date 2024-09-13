package com.project4.JobBoardService.payload;

import com.project4.JobBoardService.DTO.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class UserResponse {
    private List<UserDTO> users;
    private int totalPages;
    private long totalElements;
    private int currentPage;
    private int pageSize;
}
