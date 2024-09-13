package com.project4.JobBoardService.DTO;

import com.project4.JobBoardService.Entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizDTO {
    private Long id;
    private String title;
    private String description;

    private String imageUrl;
    private String thumbnailUrl;

    private List<QuestionDTO> questions;
    private int numberOfUsers; // Add this field
    private Long categoryId; // Only ID
    private String categoryName;
}