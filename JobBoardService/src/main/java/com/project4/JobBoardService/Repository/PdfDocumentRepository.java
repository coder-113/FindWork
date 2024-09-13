package com.project4.JobBoardService.Repository;

import com.project4.JobBoardService.Entity.PdfDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PdfDocumentRepository extends JpaRepository<PdfDocument, Long> {
    List<PdfDocument> findByUserId(Long userId);
    @Query("SELECT COUNT(p) FROM PdfDocument p WHERE p.userId = :userId")
    int countByUserId(@Param("userId") Long userId);
}
