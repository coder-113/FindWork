package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.CategoryDTO;
import com.project4.JobBoardService.Entity.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<CategoryDTO> getAllCategories();
    Optional<CategoryDTO> getCategoryById(Long id);
    void saveCategory(CategoryDTO categoryDTO);
    void deleteCategoryById(Long id);
}
