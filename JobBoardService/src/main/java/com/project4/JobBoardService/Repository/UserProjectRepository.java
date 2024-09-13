package com.project4.JobBoardService.Repository;


import com.project4.JobBoardService.Entity.UserProject;
import com.project4.JobBoardService.Entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserProjectRepository extends JpaRepository<UserProject, Long> {
    List<UserProject> findByUser_Id(Long userId);

}
