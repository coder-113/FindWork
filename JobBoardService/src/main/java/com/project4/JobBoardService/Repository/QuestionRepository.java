package com.project4.JobBoardService.Repository;


import com.project4.JobBoardService.Entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByQuizId(Long quizId);
    List<Question> findAllById(Iterable<Long> ids);
    @Modifying
    @Query("DELETE FROM Question q WHERE q.id IN :questionIds")
    void deleteByIdIn(List<Long> questionIds);
    @Modifying
    @Query("DELETE FROM Question q WHERE q.quiz.id = :quizId")
    void deleteByQuizId(Long quizId);

}
