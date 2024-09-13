package com.project4.JobBoardService.DTO;

import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.Comment;
import com.project4.JobBoardService.Entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class CommentDTO {
    private String id;
    private BlogResponseDTO blog;
    private List<CommentDTO> children;
    private String content;
    private UserDTO user;
    private Date createdAt;
    private Date updatedAt;
}
