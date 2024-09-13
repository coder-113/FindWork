package com.project4.JobBoardService.Repository;


import com.project4.JobBoardService.Entity.UserExperience;
import com.project4.JobBoardService.Entity.UserLanguage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserExperienceRepository extends JpaRepository<UserExperience, Long> {
    List<UserExperience> findByUser_Id(Long userId);

}
