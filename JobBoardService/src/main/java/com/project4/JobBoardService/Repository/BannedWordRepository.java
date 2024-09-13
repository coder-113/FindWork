package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.BannedWord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BannedWordRepository extends JpaRepository<BannedWord, Long> {
}

