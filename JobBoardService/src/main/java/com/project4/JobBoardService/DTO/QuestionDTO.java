package com.project4.JobBoardService.DTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {
    private Long id;


    @JsonProperty("questionText")
    private String questionText;

    @JsonProperty("options")
    private String options;

    @JsonProperty("correctAnswer")
    private String correctAnswer;


    private Long quizId;
}