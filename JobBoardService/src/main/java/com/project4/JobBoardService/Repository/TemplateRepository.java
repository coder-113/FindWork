package com.project4.JobBoardService.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project4.JobBoardService.Entity.Template;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Entity.UserCV;

public interface TemplateRepository extends JpaRepository<Template, Long> {

}
