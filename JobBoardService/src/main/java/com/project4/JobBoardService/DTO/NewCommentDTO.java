package com.project4.JobBoardService.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class NewCommentDTO {
    private Long id;
    private Blog_NewCommentDTO blog;
    private String content;
    private Parent_NewComment parent;
    private List<NewCommentDTO> children;
    private UserDTO user;
    private Date createdAt;
    private Date updatedAt;

    @Getter
    @Setter
    static class Blog_NewCommentDTO {
        private Long id;
        private String slug;
        private UserDTO user;
    }

    @Getter
    @Setter
    static class Parent_NewComment {
        private Long id;
    }

}
