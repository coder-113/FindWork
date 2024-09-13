package com.project4.JobBoardService.DTO;

import java.util.List;

public class QuizSubmissionResponseDTO {
    private List<QuestionResultDTO> results;
    private double score;

    // Getters and setters
    public List<QuestionResultDTO> getResults() {
        return results;
    }

    public void setResults(List<QuestionResultDTO> results) {
        this.results = results;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}