package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.Entity.Blog;
import com.project4.JobBoardService.Entity.HashTag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BlogService {
    List<Blog> getAllBlog();

    Blog createBlog(Blog blog, MultipartFile imageFile, List<String> hashtagNames);

    Blog updateBlog(Long id, Blog updatedBlog, MultipartFile imageFile, List<String> hashtagNames);

    Blog getBlogById(Long id);

    void deleteBlog(Long id);

    Blog getBlogBySlug(String slug);

    Page<Blog> searchBlogs(String query, String type, Pageable pageable, Boolean visibility, Boolean archive);//    int getCommentCount();

    List<HashTag> getAllHashTag();

    int getCommentCountByBlog(Blog blog);  // New method for comment count

    Blog getBlogByTitle(String title);

    void incrementViewBlog(Blog blog);

    List<Blog> getPopularBlog();

    void updateIsArchiveStatus(List<Long> blogIds, boolean isArchive);

    List<Object[]> getBlogCountByUserAndMonth(int year);
}
