package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.InforUserDTO;
import com.project4.JobBoardService.Entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface InforService {


    User updateUser1(Long id, User user, MultipartFile multipartFile);
    Optional<User> findByUsername(String username);

}
