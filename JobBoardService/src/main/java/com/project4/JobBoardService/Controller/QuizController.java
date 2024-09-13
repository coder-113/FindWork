package com.project4.JobBoardService.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project4.JobBoardService.DTO.*;
import com.project4.JobBoardService.Entity.*;
import com.project4.JobBoardService.Repository.CertificateRepository;
import com.project4.JobBoardService.Repository.QuizRepository;
import com.project4.JobBoardService.Repository.QuizScoreRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.*;
import com.project4.JobBoardService.Util.Variables.CertificateGenerator;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;



import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private CertificateGenerator certificateGenerator;
    @Autowired
    private QuizService quizService;

    @Autowired
    private EmailService emailService;
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private QuestionService questionService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private QuizScoreRepository quizScoreRepository;

    @Autowired
    private CategoryQuizService categoryQuizService;
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    CertificateRepository certificateRepository;
    public QuizController(QuizService quizService, ModelMapper modelMapper) {
        this.quizService = quizService;
        this.modelMapper = modelMapper;
    }

    @Autowired
    CertificateService certificateService;


    @PostMapping("/createQuiz")
    public ResponseEntity<QuizDTO> createQuiz(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestParam("categoryId") Long categoryId) throws IOException {

        QuizDTO quizDto = new QuizDTO();
        quizDto.setTitle(title);
        quizDto.setDescription(description);

        Quiz quiz = modelMapper.map(quizDto, Quiz.class);
        Quiz createdQuiz = quizService.createQuiz(quiz, imageFile, categoryId);

        QuizDTO responseDto = modelMapper.map(createdQuiz, QuizDTO.class);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }


    @PreAuthorize("permitAll()")
    @GetMapping
    public ResponseEntity<List<QuizDTO>> getAllQuizzes() {
        List<QuizDTO> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }
    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public ResponseEntity<QuizDTO> getQuizById(@PathVariable Long id) {
        Quiz quiz = quizService.getQuizById(id);
        if (quiz != null) {
            QuizDTO quizDto = modelMapper.map(quiz, QuizDTO.class);
            return new ResponseEntity<>(quizDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuizDTO> updateQuiz(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestParam("categoryId") Long categoryId) throws IOException {

        // Create a QuizDTO object from request parameters
        QuizDTO quizDto = new QuizDTO();
        quizDto.setTitle(title);
        quizDto.setDescription(description);

        // Map QuizDTO to Quiz entity
        Quiz updatedQuiz = modelMapper.map(quizDto, Quiz.class);

        // Call service to update quiz
        Quiz quiz = quizService.updateQuiz(id, updatedQuiz, imageFile, categoryId);

        if (quiz != null) {
            // Map result to QuizDTO and return response
            return ResponseEntity.ok(modelMapper.map(quiz, QuizDTO.class));
        } else {
            // Return response if quiz not found
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }
    ///
    @DeleteMapping("/{quizId}/questions")
    @Transactional
    public ResponseEntity<Void> deleteQuestionsByQuizId(@PathVariable Long quizId) {
        questionService.deleteQuestionsByQuizId(quizId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/questions")
    @Transactional
    public ResponseEntity<Void> deleteQuestionsByIds(@RequestBody List<Long> questionIds) {
        questionService.deleteQuestionsByIds(questionIds);
        return ResponseEntity.noContent().build();
    }




    //    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{quizId}/export")
    public ResponseEntity<Resource> exportQuizToExcel(@PathVariable Long quizId ) {
        Quiz quiz = quizService.getQuizById(quizId);
        if (quiz == null) {
            return ResponseEntity.notFound().build();
        }

        List<Question> questions = quiz.getQuestions();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Quiz");

            // Create header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Question Text");
            headerRow.createCell(1).setCellValue("Option A");
            headerRow.createCell(2).setCellValue("Option B");
            headerRow.createCell(3).setCellValue("Option C");
            headerRow.createCell(4).setCellValue("Option D");
            headerRow.createCell(5).setCellValue("Correct Answer");

            int rowNum = 1;
            for (Question question : questions) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(question.getQuestionText());

                String[] options = question.getOptions().split(", ");
                row.createCell(1).setCellValue(options.length > 0 ? options[0].substring(3) : "");
                row.createCell(2).setCellValue(options.length > 1 ? options[1].substring(3) : "");
                row.createCell(3).setCellValue(options.length > 2 ? options[2].substring(3) : "");
                row.createCell(4).setCellValue(options.length > 3 ? options[3].substring(3) : "");
                row.createCell(5).setCellValue(question.getCorrectAnswer());
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            byte[] bytes = outputStream.toByteArray();

            ByteArrayResource resource = new ByteArrayResource(bytes);

            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=quiz_" + quizId + quiz.getTitle().replaceAll("\\s+", "_")  + ".xls" );
            headers.set(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(bytes.length)
                    .body(resource);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    //
    @GetMapping("/{quizId}/attempts")
    public ResponseEntity<QuizAttemptResponseDTO> getQuizAttempts(@PathVariable Long quizId, @RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        QuizScore quizScore = quizScoreRepository.findTopByUserAndQuizOrderByIdDesc(user, quiz);

        QuizAttemptResponseDTO responseDTO = new QuizAttemptResponseDTO();

        int attemptsDone = quizScore != null ? quizScore.getAttempts() : 0;

        int maxAttempts = 3;

        if (attemptsDone >= maxAttempts) {
            attemptsDone = 0;
            if (quizScore != null) {
                quizScore.setAttempts(attemptsDone);
                quizScoreRepository.save(quizScore);
            }
        }

        responseDTO.setAttemptsLeft(maxAttempts - attemptsDone);

        if (quizScore != null && quizScore.isLocked() && quizScore.getLockEndTime().isAfter(LocalDateTime.now())) {
            responseDTO.setLocked(true);
            responseDTO.setLockEndTime(quizScore.getLockEndTime());
            long timeLeft = Duration.between(LocalDateTime.now(), quizScore.getLockEndTime()).getSeconds();
            responseDTO.setTimeLeft(timeLeft > 0 ? timeLeft : 0);
        } else {
            responseDTO.setLocked(false);
        }

        return ResponseEntity.ok(responseDTO);
    }


    @PostMapping("/{quizId}/complete")
    public ResponseEntity<Void> completeQuiz(@PathVariable Long quizId, @RequestBody QuizCompletionRequest request) {
        try {
            quizService.completeQuiz(quizId, request.getUserId());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

//    @PostMapping("/submit")
//    public ResponseEntity<QuizSubmissionResponseDTO> submitQuiz(@RequestBody QuizSubmissionDTO quizSubmission) {
//        User user = userRepository.findById(quizSubmission.getUserId())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//        Quiz quiz = quizRepository.findById(quizSubmission.getQuizId())
//                .orElseThrow(() -> new RuntimeException("Quiz not found"));
//
//        QuizScore quizScore = quizScoreRepository.findTopByUserAndQuizOrderByIdDesc(user, quiz);
//
//        if (quizScore != null && quizScore.isLocked() && quizScore.getLockEndTime().isAfter(LocalDateTime.now())) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
//        }
//
//        if (quizScore != null && quizScore.isLocked() && quizScore.getLockEndTime().isBefore(LocalDateTime.now())) {
//            quizScore.setLocked(false);
//            quizScore.setLockEndTime(null);
//            quizScoreRepository.save(quizScore);
//        }
//
//        List<QuestionResultDTO> results = quizService.calculateDetailedScore(quizSubmission);
//        int correctAnswersCount = (int) results.stream()
//                .filter(result -> result.getSelectedAnswer().equals(result.getCorrectAnswer()))
//                .count();
//        double totalQuestions = results.size();
//        double scorePerQuestion = totalQuestions == 20 ? 0.5 : totalQuestions == 15 ? 0.67 : 1.0;
//        double score = totalQuestions > 0 ? scorePerQuestion * correctAnswersCount : 0;
//
//        if (quizScore == null) {
//            quizScore = new QuizScore();
//            quizScore.setUser(user);
//            quizScore.setQuiz(quiz);
//            quizScore.setAttempts(0);
//        }
//
//        quizScore.setScore(score);
//        quizScore.setAttempts(quizScore.getAttempts() + 1);
//
//        double passingScore = 7.0;
//        if (score < passingScore && quizScore.getAttempts() >= 3) {
//            quizScore.setLocked(true);
////        quizScore.setLockEndTime(LocalDateTime.now().plusDays(6));
//
//            quizScore.setLockEndTime(LocalDateTime.now().plusSeconds(10));
//        }
//
//        quizScoreRepository.save(quizScore);
//
//        if (score >= 8) {
//            try {
//                File certificate = CertificateGenerator.generateCertificate(user.getUsername(), quiz.getTitle(), user.getLastName(), user.getFirstName());
//                certificateGenerator.sendCertificateEmail(user.getEmail(), user.getUsername(), certificate);
//
//
//
//                user.addCompletedQuiz(quiz);
//                userRepository.save(user);
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//        }
//
//        QuizSubmissionResponseDTO responseDTO = new QuizSubmissionResponseDTO();
//        responseDTO.setResults(results);
//        responseDTO.setScore(score);
//
//        return ResponseEntity.ok(responseDTO);
//    }


    @PostMapping("/submit")
    public ResponseEntity<QuizSubmissionResponseDTO> submitQuiz(@RequestBody QuizSubmissionDTO quizSubmission) {
        User user = userRepository.findById(quizSubmission.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Quiz quiz = quizRepository.findById(quizSubmission.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        QuizScore quizScore = quizScoreRepository.findTopByUserAndQuizOrderByIdDesc(user, quiz);

        if (quizScore != null && quizScore.isLocked() && quizScore.getLockEndTime().isAfter(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        if (quizScore != null && quizScore.isLocked() && quizScore.getLockEndTime().isBefore(LocalDateTime.now())) {
            quizScore.setLocked(false);
            quizScore.setLockEndTime(null);
            quizScoreRepository.save(quizScore);
        }

        List<QuestionResultDTO> results = quizService.calculateDetailedScore(quizSubmission);
        int correctAnswersCount = (int) results.stream()
                .filter(result -> result.getSelectedAnswer().equals(result.getCorrectAnswer()))
                .count();
        double totalQuestions = results.size();
        double scorePerQuestion = totalQuestions == 20 ? 0.5 : totalQuestions == 15 ? 0.67 : 1.0;
        double score = totalQuestions > 0 ? scorePerQuestion * correctAnswersCount : 0;

        if (quizScore == null) {
            quizScore = new QuizScore();
            quizScore.setUser(user);
            quizScore.setQuiz(quiz);
            quizScore.setAttempts(0);
        }

        quizScore.setScore(score);
        quizScore.setAttempts(quizScore.getAttempts() + 1);

        double passingScore = 7.0;
        if (score < passingScore && quizScore.getAttempts() >= 3) {
            quizScore.setLocked(true);
            quizScore.setLockEndTime(LocalDateTime.now().plusSeconds(10));
        }

        quizScoreRepository.save(quizScore);

        if (score >= 8) {
            try {
                File certificateFile = certificateGenerator.generateCertificate(user.getUsername(), quiz.getTitle(), user.getFirstName(), user.getLastName());
                certificateGenerator.sendCertificateEmail(user.getEmail(), user.getUsername(), certificateFile);
                Certificate certificate = new Certificate();
                certificate.setName(quiz.getTitle() + " Certificate");
                certificate.setOrganization("IT Grove");
                certificate.setIssueDate(LocalDate.now()); // Thay đổi từ YearMonth.now() thành LocalDate.now()
                certificate.setUser(user);
                certificate.setLink( certificateFile.getName());
                certificate.setDescription("Certificate for successfully passing the quiz " + quiz.getTitle());
                certificate.setSource("quiz");

                certificateService.saveCertificate(certificate);

                user.addCompletedQuiz(quiz);
                userRepository.save(user);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        QuizSubmissionResponseDTO responseDTO = new QuizSubmissionResponseDTO();
        responseDTO.setResults(results);
        responseDTO.setScore(score);

        return ResponseEntity.ok(responseDTO);
    }



    @GetMapping("/{userId}/completed-quizzes")
    public ResponseEntity<List<Long>> getCompletedQuizzes(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<Long> completedQuizIds = user.getCompletedQuizzes().stream()
                .map(Quiz::getId)
                .collect(Collectors.toList());
        return new ResponseEntity<>(completedQuizIds, HttpStatus.OK);

    }





}