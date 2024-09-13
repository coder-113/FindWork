package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.BlogCategoryDTO;
import com.project4.JobBoardService.Entity.BlogCategory;
import com.project4.JobBoardService.Repository.BlogCategoryRepository;
import com.project4.JobBoardService.Repository.BlogRepository;
import com.project4.JobBoardService.Service.BlogCategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BlogCategoryServiceImpl implements BlogCategoryService {
    @Autowired
    private BlogCategoryRepository blogCategoryRepository;

    @Autowired
    private BlogRepository blogRepository;



    @Override
    public BlogCategory createBlogCategory(BlogCategory blogCategory) {
        return blogCategoryRepository.save(blogCategory);
    }

    @Override
    public BlogCategory getBlogCategoryById(Long id) {
        return blogCategoryRepository.findById(id).orElse(null);
    }

    @Override
    public List<BlogCategory> getAllBlogCategories() {
        return blogCategoryRepository.findAll();
    }

    @Override
    public BlogCategory updateBlogCategory(Long id, BlogCategory blogCategory) {
        Optional<BlogCategory> existingCategoryOpt = blogCategoryRepository.findById(id);
        if (existingCategoryOpt.isPresent()) {
            BlogCategory existingCategory = existingCategoryOpt.get();
            existingCategory.setName(blogCategory.getName());
            return blogCategoryRepository.save(existingCategory);
        } else {
            return null;
        }
    }

    @Override
    public void deleteBlogCategory(Long id) {
        blogCategoryRepository.deleteById(id);
    }

    @Override
    public int getBlogCount(BlogCategory category) {
        return blogRepository.countByCategories(category);
    }
}
