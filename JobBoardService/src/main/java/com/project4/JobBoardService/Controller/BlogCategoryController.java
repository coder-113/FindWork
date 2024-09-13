package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.BlogCategoryDTO;
import com.project4.JobBoardService.Entity.BlogCategory;
import com.project4.JobBoardService.Service.BlogCategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/blog-category")
public class BlogCategoryController {

    @Autowired
    private BlogCategoryService blogCategoryService;

    @Autowired
    private ModelMapper modelMapper;

    // Create a new BlogCategory
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<BlogCategoryDTO> createBlogCategory(@RequestBody BlogCategory blogCategory) {
        try {
            BlogCategory createdCategory = blogCategoryService.createBlogCategory(blogCategory);
            BlogCategoryDTO createdCategoryDTO = modelMapper.map(createdCategory, BlogCategoryDTO.class);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCategoryDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get all BlogCategories
    @GetMapping
    public ResponseEntity<List<BlogCategoryDTO>> getAllBlogCategories() {
        try {
            List<BlogCategory> categories = blogCategoryService.getAllBlogCategories();
            List<BlogCategoryDTO> categoryDTOS = categories.stream()
                    .map(category -> {
                        BlogCategoryDTO dto = modelMapper.map(category, BlogCategoryDTO.class);
                        dto.setBlogCount(blogCategoryService.getBlogCount(category));
                        return dto;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(categoryDTOS);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update BlogCategory by ID
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<BlogCategoryDTO> updateBlogCategory(@PathVariable Long id, @RequestBody BlogCategory updatedCategory) {
        try {
            BlogCategory category = blogCategoryService.updateBlogCategory(id, updatedCategory);
            if (category != null) {
                BlogCategoryDTO updatedCategoryDTO = modelMapper.map(category, BlogCategoryDTO.class);
                updatedCategoryDTO.setBlogCount(blogCategoryService.getBlogCount(category));
                return ResponseEntity.ok(updatedCategoryDTO);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete BlogCategory by ID
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlogCategory(@PathVariable Long id) {
        try {
            blogCategoryService.deleteBlogCategory(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
