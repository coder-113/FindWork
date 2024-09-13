package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Employer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployerRepository extends JpaRepository<Employer, Long> {
    Employer findByVerificationCode(String code);
    Boolean existsByEmail(String email);
    List<Employer> findByApproved(boolean approved);

}