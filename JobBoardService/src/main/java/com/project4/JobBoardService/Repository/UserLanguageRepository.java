package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.UserLanguage;
import com.project4.JobBoardService.Entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserLanguageRepository extends JpaRepository<UserLanguage, Long> {
    List<UserLanguage> findByUser_Id(Long userId);

}
