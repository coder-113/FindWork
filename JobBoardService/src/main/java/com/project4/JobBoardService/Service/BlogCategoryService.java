package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.BlogCategoryDTO;
import com.project4.JobBoardService.Entity.BlogCategory;

import java.util.List;
import java.util.Optional;

public interface BlogCategoryService {
    BlogCategory createBlogCategory(BlogCategory blogCategory);
    BlogCategory getBlogCategoryById(Long id);
    List<BlogCategory> getAllBlogCategories();
    BlogCategory updateBlogCategory(Long id, BlogCategory blogCategory);
    void deleteBlogCategory(Long id);
    int getBlogCount(BlogCategory category);
}
