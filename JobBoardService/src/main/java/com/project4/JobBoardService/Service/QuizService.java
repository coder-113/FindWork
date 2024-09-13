package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.Config.ResourceNotFoundException;
import com.project4.JobBoardService.DTO.QuestionResultDTO;
import com.project4.JobBoardService.DTO.QuizDTO;
import com.project4.JobBoardService.DTO.QuizSubmissionDTO;
import com.project4.JobBoardService.Entity.Quiz;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface QuizService {
//    Quiz createQuiz(Quiz quiz, MultipartFile imageFile ) throws IOException;

//    Quiz createQuiz(QuizDTO quizDto, MultipartFile imageFile) throws IOException, ResourceNotFoundException;

    Quiz createQuiz(Quiz quiz, MultipartFile imageFile, Long categoryId) throws IOException;

    List<QuizDTO> getAllQuizzes();
    Quiz getQuizById(Long id);
    Quiz updateQuiz(Long id, Quiz updatedQuiz, MultipartFile imageFile, Long categoryId)  throws IOException;
    void deleteQuiz(Long id);
    int calculateScore(QuizSubmissionDTO quizSubmission);


    List<QuestionResultDTO> calculateDetailedScore(QuizSubmissionDTO quizSubmission);

    void completeQuiz(Long quizId, Long userId) throws ResourceNotFoundException;


}