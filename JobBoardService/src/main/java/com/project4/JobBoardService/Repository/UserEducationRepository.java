package com.project4.JobBoardService.Repository;


import com.project4.JobBoardService.Entity.UserEducation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserEducationRepository extends JpaRepository<UserEducation, Long> {
    List<UserEducation> findByUser_Id(Long userId);

}
