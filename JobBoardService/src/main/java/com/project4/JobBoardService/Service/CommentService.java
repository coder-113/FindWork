package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.CommentDTO;
import com.project4.JobBoardService.Entity.Comment;

import java.util.List;

public interface CommentService {
    List<Comment> getCommentByBlogSlug(String slug);
    Comment createComment(Comment comment);
    void deleteComment(Long id);
    Comment getCommentById(Long id);
    Comment updatedComment(Long id, Comment comment);
}
