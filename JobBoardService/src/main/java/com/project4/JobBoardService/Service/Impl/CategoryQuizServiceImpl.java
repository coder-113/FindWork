package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.CategoryQuizDTO;
import com.project4.JobBoardService.DTO.QuizDTO;
import com.project4.JobBoardService.Entity.CategoryQuiz;
import com.project4.JobBoardService.Repository.CategoryQuizRepository;
import com.project4.JobBoardService.Service.CategoryQuizService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class CategoryQuizServiceImpl implements CategoryQuizService {
    @Autowired
    private CategoryQuizRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public CategoryQuizDTO createCategory(CategoryQuizDTO categoryDTO) {
        CategoryQuiz category = modelMapper.map(categoryDTO, CategoryQuiz.class);
        CategoryQuiz savedCategory = categoryRepository.save(category);
        return modelMapper.map(savedCategory, CategoryQuizDTO.class);
    }
    @Override
    public List<CategoryQuizDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToCategoryQuizDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryQuizDTO getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .map(this::convertToCategoryQuizDTO)
                .orElse(null);
    }

    @Override
    public CategoryQuizDTO updateCategory(Long id, CategoryQuizDTO categoryDTO) {
        CategoryQuiz category = categoryRepository.findById(id).orElse(null);
        if (category != null) {
            category.setName(categoryDTO.getName());
            CategoryQuiz updatedCategory = categoryRepository.save(category);
            return modelMapper.map(updatedCategory, CategoryQuizDTO .class);
        }
        return null;
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    private CategoryQuizDTO convertToCategoryQuizDTO(CategoryQuiz category) {
        CategoryQuizDTO categoryDTO = modelMapper.map(category, CategoryQuizDTO.class);
        List<QuizDTO> quizDTOs = category.getQuizzes().stream()
                .map(quiz -> modelMapper.map(quiz, QuizDTO.class))
                .collect(Collectors.toList());
        categoryDTO.setQuizzes(quizDTOs);
        return categoryDTO;
    }
}
