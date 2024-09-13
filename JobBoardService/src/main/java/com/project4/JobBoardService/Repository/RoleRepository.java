package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.Role;
import com.project4.JobBoardService.Enum.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(ERole name);
}