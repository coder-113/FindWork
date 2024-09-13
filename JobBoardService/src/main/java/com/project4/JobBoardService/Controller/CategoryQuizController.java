package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.CategoryQuizDTO;
import com.project4.JobBoardService.Service.CategoryQuizService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/categoriesquiz")
public class CategoryQuizController {
    @Autowired
    private CategoryQuizService categoryService;

    @PostMapping
    public ResponseEntity<CategoryQuizDTO> createCategory(@RequestBody CategoryQuizDTO categoryDTO) {
        CategoryQuizDTO createdCategory = categoryService.createCategory(categoryDTO);
        return ResponseEntity.status(201).body(createdCategory);
    }

    @GetMapping
    public ResponseEntity<List<CategoryQuizDTO>> getAllCategories() {
        List<CategoryQuizDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryQuizDTO> getCategoryById(@PathVariable Long id) {
        CategoryQuizDTO category = categoryService.getCategoryById(id);
        if (category != null) {
            return ResponseEntity.ok(category);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryQuizDTO> updateCategory(@PathVariable Long id, @RequestBody CategoryQuizDTO categoryDTO) {
        CategoryQuizDTO updatedCategory = categoryService.updateCategory(id, categoryDTO);
        if (updatedCategory != null) {
            return ResponseEntity.ok(updatedCategory);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
