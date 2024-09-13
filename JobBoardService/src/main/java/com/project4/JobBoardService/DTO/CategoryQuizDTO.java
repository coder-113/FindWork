package com.project4.JobBoardService.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CategoryQuizDTO {
    private Long id;
    private String name;
    private List<QuizDTO> quizzes; // Include quizzes

}
