package com.project4.JobBoardService.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionSubmissionDTO {
    private Long questionId;
    private String selectedAnswer;
}
