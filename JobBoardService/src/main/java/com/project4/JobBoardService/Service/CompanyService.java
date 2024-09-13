package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.Config.ResourceNotFoundException;
import com.project4.JobBoardService.DTO.CompanyDTO;
import com.project4.JobBoardService.Entity.Company;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.util.List;
import java.util.Optional;


public interface CompanyService {
    List<CompanyDTO> getAllCompanies();
    Optional<CompanyDTO> getCompanyById(Long id);
    Company saveCompany(CompanyDTO companyDTO);
    Company updateCompany(Long id, CompanyDTO companyDTO);
    void deleteCompany(Long id);
    String uploadLogo(Long id, MultipartFile file) throws IOException;

    Company convertCompanyToEntity(CompanyDTO companyDTO);
}