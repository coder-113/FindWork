package com.project4.JobBoardService.Entity;

import jakarta.persistence.*;
import lombok.Data;


import java.time.LocalDateTime;

@Entity
@Table(name = "pdf_document")
@Data
public class PdfDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 255)
    private String fileName;

    @Lob
    @Column(columnDefinition = "LONGBLOB", nullable = false)
    private byte[] pdfContent;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

