package com.project4.JobBoardService.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuizSubmissionDTO {
    private Long userId;
    private Long quizId;
    private List<QuestionSubmissionDTO> questions = new ArrayList<>();
    private String userName;  // Thêm trường này nếu chưa có
    private String userEmail; // Thêm trường này


}