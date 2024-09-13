package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Certificate;
import com.project4.JobBoardService.Entity.Quiz;
import com.project4.JobBoardService.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByUserId(Long userId);

}