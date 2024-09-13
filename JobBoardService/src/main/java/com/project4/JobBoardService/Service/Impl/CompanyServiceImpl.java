package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.CompanyDTO;
import com.project4.JobBoardService.DTO.JobDTO;
import com.project4.JobBoardService.DTO.ReviewDTO;
import com.project4.JobBoardService.Entity.Company;
import com.project4.JobBoardService.Entity.Job;
import com.project4.JobBoardService.Entity.Review;
import com.project4.JobBoardService.Enum.WorkSchedule;
import com.project4.JobBoardService.Repository.CompanyRepository;
import com.project4.JobBoardService.Service.CompanyService;
import com.project4.JobBoardService.Util.FileUtils;
import com.project4.JobBoardService.Util.Variables.FileVariables;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class CompanyServiceImpl implements CompanyService {
    @Autowired
    private CompanyRepository companyRepository;


    private static final Logger logger = Logger.getLogger(CompanyServiceImpl.class.getName());
    @Override
    public List<CompanyDTO> getAllCompanies() {
        List<Company> companies = companyRepository.findAll();
        return companies.stream()
                .map(this::convertCompanyToDTOWithReviewsAndJobs)
                .collect(Collectors.toList());
    }
    @Override
    public Optional<CompanyDTO> getCompanyById(Long id) {
        return companyRepository.findByIdWithJobs(id)
                .map(this::convertCompanyToDTOWithReviewsAndJobs);
    }

    @Override
    public Company saveCompany(CompanyDTO companyDTO) {
        Company company = new Company();
        company.setCompanyName(companyDTO.getCompanyName());
        company.setWebsiteLink(companyDTO.getWebsiteLink());
        company.setDescription(companyDTO.getDescription());
        company.setLocation(companyDTO.getLocation());
        company.setKeySkills(companyDTO.getKeySkills());
        company.setType(companyDTO.getType());
        company.setCompanySize(companyDTO.getCompanySize());
        company.setCountry(companyDTO.getCountry());
        company.setCountryCode(companyDTO.getCountryCode());
        company.setWorkingDays(companyDTO.getWorkingDays());
        company.setMembershipRequired(companyDTO.getMembershipRequired());
        return companyRepository.save(company);
    }

    @Override
    public Company updateCompany(Long id, CompanyDTO companyDTO) {
        Optional<Company> existingCompany = companyRepository.findById(id);
        if (existingCompany.isPresent()) {
            Company company = existingCompany.get();
            company.setCompanyName(companyDTO.getCompanyName());
            company.setWebsiteLink(companyDTO.getWebsiteLink());
            company.setDescription(companyDTO.getDescription());
            company.setLocation(companyDTO.getLocation());
            company.setKeySkills(companyDTO.getKeySkills());
            company.setType(companyDTO.getType());
            company.setCompanySize(companyDTO.getCompanySize());
            company.setCountry(companyDTO.getCountry());
            company.setCountryCode(companyDTO.getCountryCode());
            company.setWorkingDays(companyDTO.getWorkingDays());

            company.setMembershipRequired(companyDTO.getMembershipRequired());
            return companyRepository.save(company);
        } else {
            return null;
        }
    }

    @Override
    public void deleteCompany(Long id) {
        companyRepository.deleteById(id);
    }

    @Override
    public String uploadLogo(Long id, MultipartFile file) throws IOException {
        Optional<Company> existingCompany = companyRepository.findById(id);
        if (existingCompany.isPresent()) {
            Company company = existingCompany.get();

            // Save the file using FileUtils
            Path savedFilePath = FileUtils.saveFile(file, FileVariables.UPLOAD_DIR);

            // Convert the saved file path to a URL
            String fileUrl = FileUtils.convertToUrl(savedFilePath, FileVariables.UPLOAD_DIR);

            // Log the file saving process
            logger.info("File saved to: " + savedFilePath.toString());

            // Update the company's logo URL
            company.setLogo(fileUrl);
            companyRepository.save(company); // Save the updated company

            return fileUrl;
        } else {
            logger.warning("Company not found: " + id);
            return null;
        }
    }



    private CompanyDTO convertCompanyToDTO(Company company) {
        CompanyDTO companyDTO = new CompanyDTO();
        companyDTO.setCompanyId(company.getCompanyId());
        companyDTO.setCompanyName(company.getCompanyName());
        companyDTO.setLogo(company.getLogo());
        companyDTO.setWebsiteLink(company.getWebsiteLink());
        companyDTO.setDescription(company.getDescription());
        companyDTO.setLocation(company.getLocation());
        companyDTO.setKeySkills(company.getKeySkills());
        companyDTO.setType(company.getType());
        companyDTO.setCompanySize(company.getCompanySize());
        companyDTO.setCountry(company.getCountry());
        companyDTO.setCountryCode(company.getCountryCode());
        companyDTO.setWorkingDays(company.getWorkingDays());
        List<ReviewDTO> reviewDTOs = company.getReviews().stream()
                .map(this::convertReviewToDTO)
                .collect(Collectors.toList());
        companyDTO.setReviews(reviewDTOs);  // Set reviews in CompanyDTO

        return companyDTO;
    }

    @Override
    public Company convertCompanyToEntity(CompanyDTO companyDTO) {
        Company company = new Company();
        company.setCompanyId(companyDTO.getCompanyId());
        company.setCompanyName(companyDTO.getCompanyName());
        company.setLogo(companyDTO.getLogo());
        company.setWebsiteLink(companyDTO.getWebsiteLink());
        company.setDescription(companyDTO.getDescription());
        company.setLocation(companyDTO.getLocation());
        company.setKeySkills(companyDTO.getKeySkills());
        company.setType(companyDTO.getType());
        company.setCompanySize(companyDTO.getCompanySize());
        company.setCountry(companyDTO.getCountry());
        company.setCountryCode(companyDTO.getCountryCode());
        company.setWorkingDays(companyDTO.getWorkingDays());
        return company;
    }


    private ReviewDTO convertReviewToDTO(Review review) {
        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setTitle(review.getTitle());
        reviewDTO.setDescription(review.getDescription());
        reviewDTO.setRating(review.getRating());
        // Set other fields as needed

        return reviewDTO;
    }


    private CompanyDTO convertCompanyToDTOWithReviewsAndJobs(Company company) {
        CompanyDTO companyDTO = convertCompanyToDTO(company);
        List<ReviewDTO> reviewDTOs = company.getReviews().stream()
                .map(this::convertReviewToDTO)
                .collect(Collectors.toList());
        companyDTO.setReviews(reviewDTOs);

        // Fetch jobs for the company
        List<JobDTO> jobDTOs = company.getJobs().stream()
                .map(this::convertJobToDTO)
                .collect(Collectors.toList());
        companyDTO.setJobs(jobDTOs);

        return companyDTO;
    }
    private JobDTO convertJobToDTO(Job job) {
        JobDTO jobDTO = new JobDTO();
        jobDTO.setId(job.getId());
        jobDTO.setTitle(job.getTitle());
        // Set other job fields as needed
        return jobDTO;
    }
}
