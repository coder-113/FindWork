package com.project4.JobBoardService.Controller;


import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.zip.GZIPOutputStream;


import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.io.source.ByteArrayOutputStream;
import com.project4.JobBoardService.Config.Annotation.CheckPermission;
import com.project4.JobBoardService.Config.ResourceNotFoundException;
import com.project4.JobBoardService.Entity.PdfDocument;
import com.project4.JobBoardService.Enum.EPermissions;
import com.project4.JobBoardService.Repository.PdfDocumentRepository;
import com.project4.JobBoardService.Service.CloudflareConfig;
//import com.project4.JobBoardService.Util.PdfUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.project4.JobBoardService.Entity.Template;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Entity.UserCV;
import com.project4.JobBoardService.Repository.TemplateRepository;
import com.project4.JobBoardService.Repository.UserCvRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.TemplateService;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {

	@Autowired
	private TemplateRepository templateRepository;

	@Autowired
	private UserCvRepository userCvRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PdfDocumentRepository pdfDocumentRepository;

	private final TemplateService templateService;
	private final TemplateEngine templateEngine;
	private CloudflareConfig cloudflareConfig;


	public TemplateController(TemplateService templateService, TemplateEngine templateEngine) {
		this.templateService = templateService;
		this.templateEngine = templateEngine;

	}
	@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
	@CheckPermission(EPermissions.MANAGE_TEMPLATE)
	@PatchMapping("/disable/{id}")
	public ResponseEntity<String> disableTemplate(@PathVariable Long id) {
		try {
			Template template = templateRepository.findById(id)
					.orElseThrow(() -> new ResourceNotFoundException("Template not found"));

			template.setDisabled(true);
			templateRepository.save(template);

			return ResponseEntity.noContent().build();
		} catch (ResourceNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		} catch (Exception ex) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + ex.getMessage());
		}
	}

	@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
	@CheckPermission(EPermissions.MANAGE_TEMPLATE)

	@PatchMapping("/un_disable/{id}")
	public ResponseEntity<String> undisableTemplate(@PathVariable Long id) {
		try {
			Template template = templateRepository.findById(id)
					.orElseThrow(() -> new ResourceNotFoundException("Template not found"));

			template.setDisabled(false);
			templateRepository.save(template);

			return ResponseEntity.noContent().build();
		} catch (ResourceNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		} catch (Exception ex) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + ex.getMessage());
		}
	}
	@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
	@CheckPermission(EPermissions.MANAGE_TEMPLATE)

	@GetMapping
	public ResponseEntity<List<Template>> getAllTemplate() {
		List<Template> templates = templateRepository.findAll();
		return ResponseEntity.ok(templates);
	}
	@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
	@CheckPermission(EPermissions.MANAGE_TEMPLATE)

	@GetMapping("/{id}")
	public ResponseEntity<Template> getTemplateById(@PathVariable Long id) {
		Optional<Template> optionalTemplate = templateRepository.findById(id);
		if (optionalTemplate.isPresent()) {
			return ResponseEntity.ok(optionalTemplate.get());
		} else {
			return ResponseEntity.notFound().build();
		}
	}
	@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
	@CheckPermission(EPermissions.MANAGE_TEMPLATE)

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Map<String, String>> deleteTemplate(@PathVariable("id") Long id) {
		Map<String, String> response = new HashMap<>();

		// Fetch the existing template by id
		Optional<Template> optionalTemplate = templateRepository.findById(id);
		if (optionalTemplate.isPresent()) {
			templateRepository.deleteById(id);
			response.put("message", "Template deleted successfully");
		} else {
			response.put("message", "Template not found");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}

		return ResponseEntity.ok(response);
	}
	@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
	@CheckPermission(EPermissions.MANAGE_TEMPLATE)

	@PutMapping("/update/{id}")
	public Mono<ResponseEntity<Map<String, String>>> updateTemplate(@PathVariable("id") Long id,
																	@ModelAttribute("template") Template template,
																	@RequestParam(value = "templateImage", required = false) MultipartFile templateImage,
																	@RequestParam(value = "templateHtmlFile", required = false) MultipartFile templateHtmlFile) throws IOException {
		Map<String, String> response = new HashMap<>();

		// Fetch the existing template by id
		Optional<Template> optionalTemplate = templateRepository.findById(id);
		if (optionalTemplate.isPresent()) {
			Template existingTemplate = optionalTemplate.get();

			// Handle the image separately if provided
			if (templateImage != null && !templateImage.isEmpty()) {
				byte[] imageBytes = templateImage.getBytes();
				String base64Image = java.util.Base64.getEncoder().encodeToString(imageBytes);
				existingTemplate.setTemplateImageBase64(base64Image);
			}

			// Update fields from the request except templateName
			existingTemplate.setTemplateDescription(template.getTemplateDescription());
			existingTemplate.setUpdatedAt(LocalDateTime.now());

			// Save the updated template using JPA repository
			templateRepository.save(existingTemplate);

			// Handle HTML file upload to Cloudflare
			if (templateHtmlFile != null && !templateHtmlFile.isEmpty()) {
				byte[] htmlBytes = templateHtmlFile.getBytes();
				String htmlContent = new String(htmlBytes);

				return templateService.storeTemplate(existingTemplate.getTemplateName(), htmlContent)
						.map(result -> {
							response.put("message", "Template updated successfully");
							return ResponseEntity.ok(response);
						})
						.onErrorResume(e -> {
							response.put("message", "Failed to update HTML file on Cloudflare: " + e.getMessage());
							return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response));
						});
			} else {
				response.put("message", "Template updated successfully");
				return Mono.just(ResponseEntity.ok(response));
			}
		} else {
			response.put("message", "Template not found");
			return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(response));
		}
	}

	@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
	@CheckPermission(EPermissions.MANAGE_TEMPLATE)

	@PostMapping("/create")
	public ResponseEntity<Map<String, String>> createTemplate(@ModelAttribute("template") Template template,
															  @RequestParam("templateImage") MultipartFile templateImage,
															  @RequestParam("templateFilePath") String templateFilePath) throws IOException {
		Map<String, String> response = new HashMap<>();

		// Handle the image separately
		if (!templateImage.isEmpty()) {
			byte[] imageBytes = templateImage.getBytes();
			String base64Image = Base64.getEncoder().encodeToString(imageBytes);
			template.setTemplateImageBase64(base64Image);
		}

		template.setCreatedAt(LocalDateTime.now());
		template.setUpdatedAt(LocalDateTime.now());
		template.setTemplateFilePath(templateFilePath); // Assuming templateFilePath is a URL

		// Save template using JPA repository
		Template savedTemplate = templateRepository.save(template);
		response.put("message", "Template created successfully");

		return ResponseEntity.ok(response);
	}
	@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
	@CheckPermission(EPermissions.MANAGE_TEMPLATE)

	@PostMapping("/upload")
	public Mono<ResponseEntity<Map<String, String>>> uploadTemplate(@RequestParam("file") MultipartFile file,
																	@RequestParam("templateName") String templateName) throws IOException {
		Map<String, String> response = new HashMap<>();

		// Check if file is null or empty
		if (file == null || file.isEmpty()) {
			response.put("message", "Error uploading template: File must not be null or empty.");
			return Mono.just(ResponseEntity.badRequest().body(response));
		}

		// Save template to Cloudflare using TemplateService
		return templateService.storeTemplate(templateName, new String(file.getBytes()))
				.map(result -> {
					response.put("message", "Template uploaded successfully.");
					return ResponseEntity.ok(response);
				})
				.onErrorResume(e -> {
					response.put("message", "Error uploading template: " + e.getMessage());
					return Mono.just(ResponseEntity.status(500).body(response));
				});
	}

	@PreAuthorize("hasRole('MODERATOR') or hasRole('USER') or hasRole('ADMIN')")
	@GetMapping("/selected")
	public ResponseEntity<String> getTemplateContent(@RequestParam Long templateId) {
		// Find the template by templateId
		Template template = templateRepository.findById(templateId).orElse(null);

		if (template == null) {
			return ResponseEntity.notFound().build();
		}

		// Fetch template content from templateFilePath (assuming it's a URL)
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(template.getTemplateFilePath(), String.class);

		return ResponseEntity.ok(response.getBody());
	}
	@PreAuthorize("hasRole('MODERATOR') or hasRole('USER') or hasRole('ADMIN')")
	@GetMapping("/list-template")
	public List<Template> listTemplates() {
		return templateRepository.findAll();
	}
	@PreAuthorize("hasRole('MODERATOR') or hasRole('USER') or hasRole('ADMIN')")
	@PutMapping("/select-template")
	public ResponseEntity selectTemplate(@RequestParam("userId") Long userId,
										 @RequestParam("cvId") Long cvId,
										 @RequestParam("templateId") Long templateId) {
		try {
			// Find User by userId
			User user = userRepository.findById(userId).orElse(null);
			if (user == null) {
				return ResponseEntity.badRequest().body("Invalid user ID");
			}

			// Find Template by templateId
			Template template = templateRepository.findById(templateId).orElse(null);
			if (template == null) {
				return ResponseEntity.badRequest().body("Invalid template ID");
			}

			// Find UserCV by cvId and user
			UserCV userCV = userCvRepository.findByCvIdAndUser(cvId, user).orElse(null);
			if (userCV == null) {
				return ResponseEntity.notFound().build();
			}

			// Update template
			userCV.setTemplate(template);

			// Save updated UserCV
			userCvRepository.save(userCV);

			return ResponseEntity.ok("UserCV updated successfully with selected template");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Failed to update UserCV: " + e.getMessage());
		}
	}
	@PreAuthorize("hasRole('MODERATOR') or hasRole('USER') or hasRole('ADMIN')")
	@GetMapping("/review-template/{key}/{userId}/{cvId}/{templateId}")
	public Mono<ResponseEntity<String>> getTemplate(@PathVariable("key") String key, @PathVariable("userId") Long userId, @PathVariable("cvId") Long cvId, @PathVariable("templateId") Long templateId) {
		return Mono.fromSupplier(() -> userCvRepository.findByCvIdAndUserId(cvId, userId))
				.flatMap(userCV -> {
					if (userCV == null) {
						return Mono.just(ResponseEntity.notFound().build());
					}

					return templateService.retrieveTemplate(key)
							.map(template -> {
								Context context = new Context();
								context.setVariable("userCV", userCV);

								// Add any other necessary variables to the context
								// context.setVariable("otherVar", otherValue);

								String renderedHtml = templateEngine.process(template, context);
								return ResponseEntity.ok(renderedHtml);
							})
							.onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
									.body("Error retrieving template: " + e.getMessage())));
				});
	}
	@PreAuthorize("hasRole('MODERATOR') or hasRole('USER') or hasRole('ADMIN')")
	@GetMapping("/generate/{userId}/{cvId}")
	public Mono<ResponseEntity<byte[]>> generatePDF(@PathVariable Long userId, @PathVariable Long cvId) {
		// Log input parameters for debugging
		System.out.println("Generating PDF for userId: " + userId + " and cvId: " + cvId);

		return Mono.fromCallable(() -> userCvRepository.findByCvIdAndUserId(cvId, userId))
				.flatMap(userCVOptional -> {
					if (userCVOptional != null) {
						UserCV userCV = userCVOptional;
						String templateKey = userCV.getTemplate().getTemplateName();
						return templateService.retrieveTemplate(templateKey)
								.flatMap(template -> {
									Context context = new Context();
									context.setVariable("userCV", userCV);

									String renderedHtml = templateEngine.process(template, context);

									ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

									ConverterProperties props = new ConverterProperties();
									props.setBaseUri("classpath:/static/");

									try {
										HtmlConverter.convertToPdf(renderedHtml, outputStream, props);
										byte[] pdfBytes = outputStream.toByteArray();

										HttpHeaders headers = new HttpHeaders();
										headers.setContentType(MediaType.APPLICATION_PDF);
										headers.setContentDispositionFormData("filename", "cv.pdf");

										return Mono.just(new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK));
									} catch (Exception e) {
										System.err.println("PDF generation failed: " + e.getMessage());
										e.printStackTrace();
										return Mono.error(new RuntimeException("PDF generation failed", e));
									}
								});
					} else {
						// Log error message when UserCV is not found
						System.err.println("UserCV not found for userId: " + userId + " and cvId: " + cvId);
						return Mono.error(new RuntimeException("UserCV not found for userId: " + userId + " and cvId: " + cvId));
					}
				})
				.onErrorResume(e -> {
					System.err.println("Error generating PDF: " + e.getMessage());
					e.printStackTrace();
					return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
							.body(("Error generating PDF: " + e.getMessage()).getBytes()));
				});
	}
	@PreAuthorize("hasRole('MODERATOR') or hasRole('USER') or hasRole('ADMIN')")
	@PostMapping("/pdf-document/save/{userId}")
	public ResponseEntity<String> savePdfDocument(
			@PathVariable Long userId,
			@RequestParam("name") String name,
			@RequestParam("fileData") MultipartFile fileData) {

		try {
			PdfDocument pdfDocument = new PdfDocument();
			pdfDocument.setUserId(userId);
			pdfDocument.setFileName(name);
			pdfDocument.setPdfContent(fileData.getBytes()); // Directly use fileData.getBytes()

			pdfDocumentRepository.save(pdfDocument);

			return ResponseEntity.ok("PDF document saved successfully.");
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error saving PDF document: " + e.getMessage());
		}
	}
	@PreAuthorize("hasRole('MODERATOR') or hasRole('USER') or hasRole('ADMIN')")
	@GetMapping("/list-document/{userId}")
	public ResponseEntity<List<PdfDocument>> getPdfsByUserId(@PathVariable Long userId) {
		List<PdfDocument> pdfs = pdfDocumentRepository.findByUserId(userId);
		if (pdfs.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(pdfs);
	}
	@PreAuthorize("hasRole('MODERATOR') or hasRole('USER') or hasRole('ADMIN')")
	@GetMapping("/count/{userId}")
	public int countPdfDocumentsByUserId(@PathVariable Long userId) {
		return pdfDocumentRepository.countByUserId(userId);
	}
	@PreAuthorize("hasRole('MODERATOR') or hasRole('USER') or hasRole('ADMIN')")
	@GetMapping("/document/{id}")
	public ResponseEntity<PdfDocument> getPdfById(@PathVariable Long id) {
		Optional<PdfDocument> optionalPdfDocument = pdfDocumentRepository.findById(id);
		if (optionalPdfDocument.isPresent()) {
			return ResponseEntity.ok(optionalPdfDocument.get());
		} else {
			return ResponseEntity.notFound().build();
		}
	}
}