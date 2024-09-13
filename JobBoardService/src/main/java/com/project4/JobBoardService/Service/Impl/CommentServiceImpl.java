package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.CommentDTO;
import com.project4.JobBoardService.Entity.Comment;
import com.project4.JobBoardService.Repository.CommentRepository;
import com.project4.JobBoardService.Service.CommentService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentRepository commentRepository;



    @Override
    public List<Comment> getCommentByBlogSlug(String slug) {
        return commentRepository.findAllByBlogSlugAndParentIsNull(slug);
    }

    @Override
    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }

    @Override
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    @Override
    public Comment getCommentById(Long id) {
        return commentRepository.findById(id).orElse(null);
    }

    @Override
    public Comment updatedComment(Long id, Comment comment) {
        Comment commentExisting = commentRepository.findById(id).orElse(null);
        if(commentExisting != null){
            commentExisting.setContent(comment.getContent());
            return commentRepository.save(commentExisting);
        }
        return null;
    }
}
