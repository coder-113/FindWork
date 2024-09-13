package com.project4.JobBoardService.Repository;


import com.project4.JobBoardService.Entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    @Query("SELECT c FROM Company c LEFT JOIN FETCH c.jobs WHERE c.companyId = :id")
    Optional<Company> findByIdWithJobs(@Param("id") Long id);
}
