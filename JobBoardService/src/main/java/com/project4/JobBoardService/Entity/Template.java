package com.project4.JobBoardService.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Templates")
public class Template {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long templateId;

	private String templateName;
	private String templateDescription;
	private String templateFilePath;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	@Column(columnDefinition = "LONGTEXT")
	private String templateImageBase64;
	@Column(nullable = false)
	private boolean disabled = false;
	// Getters and setters
}
