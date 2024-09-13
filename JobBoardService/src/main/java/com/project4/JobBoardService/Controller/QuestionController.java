package com.project4.JobBoardService.Controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.project4.JobBoardService.DTO.QuestionDTO;
import com.project4.JobBoardService.Service.QuestionService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/quizzes")
public class QuestionController {

    @Autowired
    private QuestionService questionService;
    @PreAuthorize("permitAll()")
    @GetMapping("/{quizId}/questions")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByQuizId(
            @PathVariable Long quizId,
            @RequestParam(required = false) Integer count) {

        List<QuestionDTO> questions = questionService.getAllQuestions()
                .stream()
                .filter(question -> question.getQuizId().equals(quizId))
                .collect(Collectors.toList());

        if (count != null && count > 0 && count <= questions.size()) {
            Collections.shuffle(questions);
            questions = questions.stream().limit(count).collect(Collectors.toList());
        }

        return new ResponseEntity<>(questions, HttpStatus.OK);
    }


    @PreAuthorize("permitAll()")
    @GetMapping("/{quizId}/questions/{questionId}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long quizId, @PathVariable Long questionId) {
        Optional<QuestionDTO> question = questionService.getQuestionById(questionId);
        return question.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{quizId}/questions")
    public ResponseEntity<QuestionDTO> createQuestion(
            @PathVariable Long quizId,
            @RequestParam String questionText,
            @RequestParam String options,
            @RequestParam String correctAnswer) {

        QuestionDTO questionDTO = new QuestionDTO();
        questionDTO.setQuizId(quizId);
        questionDTO.setQuestionText(questionText);
        questionDTO.setOptions(options);
        questionDTO.setCorrectAnswer(correctAnswer);
        QuestionDTO createdQuestion = questionService.createQuestion(quizId, questionDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdQuestion);

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{quizId}/questions/{questionId}")
    public ResponseEntity<QuestionDTO> updateQuestion(@PathVariable Long quizId, @PathVariable Long questionId, @RequestBody QuestionDTO questionDTO) {
        QuestionDTO updatedQuestion = questionService.updateQuestion(questionId, questionDTO);
        return new ResponseEntity<>(updatedQuestion, HttpStatus.OK);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{quizId}/questions/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long quizId, @PathVariable Long questionId) {
        questionService.deleteQuestion(questionId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @DeleteMapping("/{quizId}/questions/delete")
    public ResponseEntity<String> deleteQuestions(
            @PathVariable Long quizId) {
        try {
            questionService.deleteQuestionsByQuizId(quizId);
            return ResponseEntity.ok("Deleted questions for quiz with ID: " + quizId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting questions: " + e.getMessage());
        }
    }

    @PostMapping("/{quizId}/questions/upload")
    public ResponseEntity<?> uploadQuestions(@PathVariable Long quizId, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        List<QuestionDTO> createdQuestions = new ArrayList<>();


        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    continue; // Bỏ qua hàng đầu tiên (header)
                }

                QuestionDTO questionDTO = new QuestionDTO();
                questionDTO.setQuizId(quizId);
                questionDTO.setQuestionText(getCellValueAsString(row.getCell(0)));
                questionDTO.setOptions(String.format("A. %s, B. %s, C. %s, D. %s",
                        getCellValueAsString(row.getCell(1)),
                        getCellValueAsString(row.getCell(2)),
                        getCellValueAsString(row.getCell(3)),
                        getCellValueAsString(row.getCell(4))));
                questionDTO.setCorrectAnswer(getCellValueAsString(row.getCell(5)));

                QuestionDTO createdQuestion = questionService.createQuestion(quizId, questionDTO);
                createdQuestions.add(createdQuestion);
            }

            return new ResponseEntity<>(createdQuestions, HttpStatus.CREATED);

        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return Double.toString(cell.getNumericCellValue());
                }
            case BOOLEAN:
                return Boolean.toString(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            case BLANK:
                return "";
            default:
                return cell.toString();
        }
    }
}
