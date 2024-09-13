package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    @Query("SELECT COUNT(q) FROM Quiz q")
    long countQuizzes();
}
