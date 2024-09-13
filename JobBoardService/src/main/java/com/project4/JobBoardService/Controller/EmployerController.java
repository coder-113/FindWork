package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.EmployerDTO;
import com.project4.JobBoardService.Entity.Company;
import com.project4.JobBoardService.Entity.Employer;
import com.project4.JobBoardService.Repository.CompanyRepository;
import com.project4.JobBoardService.Repository.EmployerRepository;
import com.project4.JobBoardService.Service.EmailService;
import com.project4.JobBoardService.payload.MessageResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employer")
public class EmployerController {

    @Autowired
    private EmailService emailService;
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private EmployerRepository employerRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    CompanyRepository companyRepository;
    @GetMapping("/allEmployers")
    public ResponseEntity<List<EmployerDTO>> getAllEmployers() {
        List<Employer> allEmployers = employerRepository.findAll();
        List<EmployerDTO> employerDTOs = allEmployers.stream()
                .map(employer -> modelMapper.map(employer, EmployerDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(employerDTOs);
    }
    @PostMapping("/approveEmployer/{id}")
    public ResponseEntity<?> approveEmployer(@PathVariable Long id) {
        Optional<Employer> optionalEmployer = employerRepository.findById(id);
        if (!optionalEmployer.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Employer not found."));
        }

        Employer employer = optionalEmployer.get();
        employer.setApproved(true);

        Company company = new Company();
        company.setCompanyName(employer.getCompanyName());
        company.setWebsiteLink(employer.getWebsiteLink());
        Company savedCompany = companyRepository.save(company);

        employer.setCompany(savedCompany);
        employerRepository.save(employer);

        emailService.sendVerificationEmailEmployer(employer.getEmail(), employer.getName(), employer.getVerificationCode());

        return ResponseEntity.ok(new MessageResponse("Employer approved and verification email sent."));
    }
}
