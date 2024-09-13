package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.CertificateDTO;
import com.project4.JobBoardService.Entity.Certificate;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Repository.CertificateRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.CertificateService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CertificateServiceImpl implements CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<CertificateDTO> getCertificatesByUserId(Long userId) {
        List<Certificate> certificates = certificateRepository.findByUserId(userId);
        return certificates.stream()
                .map(certificate -> {
                    CertificateDTO dto = modelMapper.map(certificate, CertificateDTO.class);
                    dto.setUserId(userId); // Set userId in DTO
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public CertificateDTO createCertificate(CertificateDTO certificateDTO) {
        Certificate certificate = modelMapper.map(certificateDTO, Certificate.class);
        User user = userRepository.findById(certificateDTO.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        certificate.setUser(user);
        certificate.setSource("manual");

        Certificate savedCertificate = certificateRepository.save(certificate);
        return modelMapper.map(savedCertificate, CertificateDTO.class);
    }

    @Override
    public CertificateDTO updateCertificate(Long certificateId, CertificateDTO certificateDTO) {
        Certificate existingCertificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
        existingCertificate.setName(certificateDTO.getName());
        existingCertificate.setOrganization(certificateDTO.getOrganization());
        existingCertificate.setIssueDate(certificateDTO.getIssueDate());
        existingCertificate.setLink(certificateDTO.getLink());
        existingCertificate.setDescription(certificateDTO.getDescription());
        Certificate updatedCertificate = certificateRepository.save(existingCertificate);
        return modelMapper.map(updatedCertificate, CertificateDTO.class);
    }

    @Override
    public void deleteCertificate(Long certificateId) {
        Certificate existingCertificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
        certificateRepository.delete(existingCertificate);
    }

    @Override
    public Certificate saveCertificate(Certificate certificate) {
        return certificateRepository.save(certificate);
    }
}
