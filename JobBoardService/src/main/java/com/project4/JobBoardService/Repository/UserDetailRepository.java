package com.project4.JobBoardService.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project4.JobBoardService.Entity.UserDetail;

public interface UserDetailRepository extends JpaRepository<UserDetail, Long> {

}
