package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.CertificateDTO;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Service.CertificateService;
import com.project4.JobBoardService.Service.UserService;
import com.project4.JobBoardService.security.jwt.JwtUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private JwtUtils jwtUtils;

//    @GetMapping("/user/{userId}")
//    @PreAuthorize("hasRole('ROLE_USER') OR hasRole('ROLE_ADMIN') OR hasRole('ROLE_MODERATOR') OR hasRole('ROLE_EMPLOYER')")
//    public ResponseEntity<List<CertificateDTO>> getCertificatesByUserId(@PathVariable Long userId) {
//        User user = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
//        List<CertificateDTO> certificates = certificateService.getCertificatesByUserId(user.getId());
//        return ResponseEntity.ok(certificates);
//    }


        @GetMapping("/user/{userId}")
        @PreAuthorize("hasRole('ROLE_USER') OR hasRole('ROLE_ADMIN') OR hasRole('ROLE_MODERATOR') OR hasRole('ROLE_EMPLOYER')")
        public ResponseEntity<List<CertificateDTO>> getCertificatesByUserId(@PathVariable Long userId) {
            User user = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            List<CertificateDTO> certificates = user.getCertificates().stream()
                    .map(certificate -> modelMapper.map(certificate, CertificateDTO.class))
                    .collect(Collectors.toList());
            return new ResponseEntity<>(certificates, HttpStatus.OK);
        }


    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER') OR hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR') or hasRole('ROLE_EMPLOYER')")
    public ResponseEntity<CertificateDTO> createCertificate(@RequestBody CertificateDTO certificateDTO,
                                                            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));
        certificateDTO.setUserId(user.getId());
        CertificateDTO createdCertificate = certificateService.createCertificate(certificateDTO);
        return ResponseEntity.ok(createdCertificate);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER') OR hasRole('ROLE_ADMIN') OR hasRole('ROLE_MODERATOR') OR hasRole('ROLE_EMPLOYER')")
    public ResponseEntity<CertificateDTO> updateCertificate(@PathVariable Long id,
                                                            @RequestBody CertificateDTO certificateDTO) {
        CertificateDTO updatedCertificate = certificateService.updateCertificate(id, certificateDTO);
        return ResponseEntity.ok(updatedCertificate);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER') OR hasRole('ROLE_ADMIN') OR hasRole('ROLE_MODERATOR') OR hasRole('ROLE_EMPLOYER')")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id) {
        certificateService.deleteCertificate(id);
        return ResponseEntity.noContent().build();
    }


//    @PreAuthorize("hasRole('ROLE_USER') OR hasRole('ROLE_ADMIN') OR hasRole('ROLE_MODERATOR') OR hasRole('ROLE_EMPLOYER')")
//    @GetMapping("/certificate/{filename}")
//    public ResponseEntity<ByteArrayResource> getCertificate(@PathVariable String filename) {
//        try {
//            // Use classpath resource loader to load files from resources directory
//            ClassPathResource resource = new ClassPathResource("uploads/certificate/" + filename);
//
//            if (!resource.exists()) {
//                throw new RuntimeException("File not found");
//            }
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + filename);
//
//            ByteArrayResource byteArrayResource = new ByteArrayResource(resource.getInputStream().readAllBytes());
//
//            return ResponseEntity.ok()
//                    .headers(headers)
//                    .contentLength(resource.contentLength())
//                    .contentType(MediaType.APPLICATION_PDF)
//                    .body(byteArrayResource);
//        } catch (IOException e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }
@GetMapping("/certificate/{filename}")
public ResponseEntity<ByteArrayResource> getCertificate(@PathVariable String filename) {
    try {
        String filePath = "src/main/resources/uploads/certificate/" + filename;
        FileSystemResource resource = new FileSystemResource(filePath);

        if (!resource.exists()) {
            throw new RuntimeException("File not found: " + filePath);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + filename);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        InputStream inputStream = resource.getInputStream();
        byte[] buffer = new byte[1024];
        int bytesRead;
        while ((bytesRead = inputStream.read(buffer)) != -1) {
            baos.write(buffer, 0, bytesRead);
        }

        ByteArrayResource byteArrayResource = new ByteArrayResource(baos.toByteArray());

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(resource.contentLength())
                .contentType(MediaType.APPLICATION_PDF)
                .body(byteArrayResource);
    } catch (IOException e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}
}
