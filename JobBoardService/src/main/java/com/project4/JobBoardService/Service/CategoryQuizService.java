package com.project4.JobBoardService.Service;
import com.project4.JobBoardService.DTO.CategoryQuizDTO;

import java.util.List;
public interface CategoryQuizService {
    CategoryQuizDTO createCategory(CategoryQuizDTO categoryDTO);
    List<CategoryQuizDTO> getAllCategories();
    CategoryQuizDTO getCategoryById(Long id);
    CategoryQuizDTO updateCategory(Long id, CategoryQuizDTO categoryDTO);
    void deleteCategory(Long id);
}
