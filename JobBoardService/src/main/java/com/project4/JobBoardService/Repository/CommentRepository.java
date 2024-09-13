package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentRepository  extends JpaRepository<Comment, Long> {
    @Query("SELECT c FROM Comment c JOIN c.blog b WHERE b.slug = :slug AND c.parent IS NULL")
    List<Comment> findAllByBlogSlugAndParentIsNull(String slug);

    int countByBlog(Blog blog);  // Method to count comments by blog
}


