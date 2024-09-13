package com.project4.JobBoardService.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResultDTO {
    private Long questionId;
    private String selectedAnswer;
    private String correctAnswer;
    private Long userId;
    private boolean isCorrect;

    // Constructor, getters and setters
    public QuestionResultDTO(Long questionId, String selectedAnswer, String correctAnswer, Long userId) {
        this.questionId = questionId;
        this.selectedAnswer = selectedAnswer;
        this.correctAnswer = correctAnswer;
        this.userId = userId;
        this.isCorrect = selectedAnswer.equals(correctAnswer);
    }

    public void setResults(List<QuestionResultDTO> results) {
    }

    public void setScore(double score) {
    }
}
