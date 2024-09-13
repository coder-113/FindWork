package com.project4.JobBoardService.Repository;


import com.project4.JobBoardService.Entity.UserEducation;
import com.project4.JobBoardService.Entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUser_Id(Long userId);

}
