package com.project4.JobBoardService.Controller;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.project4.JobBoardService.DTO.UserCvDTO;
import com.project4.JobBoardService.Entity.*;
import com.project4.JobBoardService.Repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;

@RestController
@RequestMapping("/api/usercv")
public class UserCvController {
    @Autowired
    UserCvRepository userCvRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserDetailRepository userDetailRepository;
    @Autowired
    UserEducationRepository userEducationRepository;
    @Autowired
    UserProjectRepository userProjectRepository;
    @Autowired
    UserSkillRepository userSkillRepository;
    @Autowired
    UserExperienceRepository userExperienceRepository;
    @Autowired
    UserLanguageRepository userLanguageRepository;
    @Autowired
    TemplateRepository templateRepository;

    @Autowired
    private ModelMapper modelMapper;

    //	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
//    @PostMapping("/submit-cv")
//    public ResponseEntity<String> submitCv(@ModelAttribute UserCV userCV,
//                                           @RequestParam("profileImage") MultipartFile profileImage,
//                                           @RequestParam("dob") Long dobTimestamp) {
//        userCV.setCreatedAt(LocalDateTime.now());
//        userCV.setUpdatedAt(LocalDateTime.now());
//
//        // Set the user
//        User user = userRepository.findById(userCV.getUser().getId()).orElse(null);
//        if (user == null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid user ID");
//        }
//        userCV.setUser(user);
//
//        // Convert timestamp to Date
//        Date dob = new Date(dobTimestamp);
//
//        // Set userCV reference in related entities
//        userCV.setUserDetails(userCV.getUserDetails().stream()
//                .map(detail -> userDetailRepository.save(detail))
//                .collect(Collectors.toList()));
//        userCV.setUserEducations(userCV.getUserEducations().stream()
//                .map(education -> userEducationRepository.save(education))
//                .collect(Collectors.toList()));
//        userCV.setUserExperiences(userCV.getUserExperiences().stream()
//                .map(experience -> userExperienceRepository.save(experience))
//                .collect(Collectors.toList()));
//        userCV.setUserSkills(userCV.getUserSkills().stream()
//                .map(skill -> userSkillRepository.save(skill))
//                .collect(Collectors.toList()));
//        userCV.setUserProjects(userCV.getUserProjects().stream()
//                .map(project -> userProjectRepository.save(project))
//                .collect(Collectors.toList()));
//        userCV.setUserLanguages(userCV.getUserLanguages().stream()
//                .map(language -> userLanguageRepository.save(language))
//                .collect(Collectors.toList()));
//
//
//        userCV.getUserDetails().forEach(detail -> {
//            detail.setUserCV(userCV);
//            detail.setDob(dob);
//        });
//
//        userCV.getUserEducations().forEach(education -> education.setUserCV(userCV));
//        userCV.getUserExperiences().forEach(experience -> experience.setUserCV(userCV));
//        userCV.getUserSkills().forEach(skill -> skill.setUserCV(userCV));
//        userCV.getUserProjects().forEach(project -> project.setUserCV(userCV));
//        userCV.getUserLanguages().forEach(language -> language.setUserCV(userCV));
//        // Save the userCV and its related entities
//        UserCV savedUserCV = userCvRepository.save(userCV);
//
//        // Handle the profile image upload
//        if (!profileImage.isEmpty()) {
//            try {
//                byte[] imageBytes = profileImage.getBytes();
//                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
//                UserDetail userDetail = savedUserCV.getUserDetails().get(0);
//                userDetail.setProfileImageBase64(base64Image);
//                userDetailRepository.save(userDetail);
//            } catch (IOException e) {
//                e.printStackTrace();
//                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving profile image");
//            }
//        }
//
//        return ResponseEntity.ok().body("CV Save Success!");
//    }

    @GetMapping("/{cvId}")
    public ResponseEntity<UserCvDTO> getCvById(@PathVariable String cvId) {
        UserCV userCv;
        try {
            Long id = Long.parseLong(cvId);
            userCv = userCvRepository.findById(id).orElse(null);
            if (userCv == null) {
                return ResponseEntity.notFound().build();
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(null);
        }

        UserCvDTO userCvDTO = modelMapper.map(userCv, UserCvDTO.class);
        return ResponseEntity.ok().body(userCvDTO);
    }

    @GetMapping("/check-cvs/{userId}")
    public ResponseEntity<Boolean> checkCvsByUserId(@PathVariable Long userId) {
        try {
            UserCV userCv = userCvRepository.findByUserId(userId);
            boolean hasCvs = userCv != null; // Check if UserCV exists for the given userId
            return ResponseEntity.ok().body(hasCvs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }

    @GetMapping("/list-cvs/{userId}")
    public ResponseEntity<List<UserCvDTO>> listCvs(@PathVariable Long userId) {
        List<UserCV> userCvs = userCvRepository.findAllByUserId(userId);
        if (userCvs.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<UserCvDTO> userCvDTOs = userCvs.stream()
                .map(cv -> modelMapper.map(cv, UserCvDTO.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok().body(userCvDTOs);
    }

    @GetMapping("/view-cv/{cvId}")
    public ResponseEntity<UserCvDTO> viewCv(@PathVariable Long cvId) {
        UserCV existingCv = userCvRepository.findById(cvId).orElse(null);
        if (existingCv == null) {
            return ResponseEntity.notFound().build();
        }

        UserCvDTO userCvDTO = modelMapper.map(existingCv, UserCvDTO.class);
        return ResponseEntity.ok().body(userCvDTO);
    }

    @DeleteMapping("/delete-cv/{cvId}")
    public ResponseEntity<String> deleteCv(@PathVariable Long cvId) {
        try {
            UserCV userCv = userCvRepository.findById(cvId).orElse(null);
            if (userCv != null) {
                userCvRepository.delete(userCv);
                return ResponseEntity.ok().body("CV Deleted Successfully!");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting CV");
        }
    }

    @PutMapping("/update-cv/{cvId}")
    public ResponseEntity<String> updateCv(@PathVariable Long cvId,
                                           @ModelAttribute UserCV updatedUserCV,
                                           @RequestParam("profileImage") MultipartFile profileImage,
                                           @RequestParam("dob") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dob) {
        UserCV existingCv = userCvRepository.findById(cvId).orElse(null);
        if (existingCv == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid CV ID");
        }


                // Update CV fields
        existingCv.setCvTitle(updatedUserCV.getCvTitle());
        existingCv.setUpdatedAt(LocalDateTime.now());

        // Handle User Details including dob
        existingCv.getUserDetails().clear();
        for (UserDetail detail : updatedUserCV.getUserDetails()) {
            detail.setUserCV(existingCv);
            detail.setDob(dob); // Set the date of birth
            existingCv.getUserDetails().add(detail);
        }

        // Handle Education
        existingCv.getUserEducations().clear();
        User user = existingCv.getUser();
        for (UserEducation education : updatedUserCV.getUserEducations()) {
            education.setUserCV(existingCv);
            education.setUser(user);
            existingCv.getUserEducations().add(education);
        }

        // Handle Experiences
        existingCv.getUserExperiences().clear();
        for (UserExperience experience : updatedUserCV.getUserExperiences()) {
            experience.setUserCV(existingCv);
            experience.setUser(user);

            existingCv.getUserExperiences().add(experience);
        }

        // Handle Skills
        existingCv.getUserSkills().clear();
        for (UserSkill skill : updatedUserCV.getUserSkills()) {
            skill.setUserCV(existingCv);
            skill.setUser(user);

            existingCv.getUserSkills().add(skill);
        }

        // Handle Projects
        existingCv.getUserProjects().clear();
        for (UserProject project : updatedUserCV.getUserProjects()) {
            project.setUserCV(existingCv);
            project.setUser(user);

            existingCv.getUserProjects().add(project);
        }

        // Handle Languages
        existingCv.getUserLanguages().clear();
        for (UserLanguage language : updatedUserCV.getUserLanguages()) {
            language.setUserCV(existingCv);
            language.setUser(user);
            existingCv.getUserLanguages().add(language);
        }

        // Handle the profile image upload
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                byte[] imageBytes = profileImage.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                existingCv.getUserDetails().get(0).setProfileImageBase64(base64Image);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating profile image");
            }
        } else {
            UserDetail existingDetail = existingCv.getUserDetails().get(0);
            UserDetail updatedDetail = updatedUserCV.getUserDetails().get(0);
            updatedDetail.setProfileImageBase64(existingDetail.getProfileImageBase64());
        }


        // Save the updated CV with all related entities attached
        userCvRepository.save(existingCv);

        return ResponseEntity.ok().body("CV Update Success!");
    }
    	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @PostMapping("/submit-cv")
    public ResponseEntity<String> submitCv(@ModelAttribute UserCV userCV,
                                           @RequestParam("profileImage") MultipartFile profileImage,
                                           @RequestParam("dob") Long dobTimestamp) {
        userCV.setCreatedAt(LocalDateTime.now());
        userCV.setUpdatedAt(LocalDateTime.now());

        // Set the user
        User user = userRepository.findById(userCV.getUser().getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid user ID");
        }
        userCV.setUser(user);

        // Convert timestamp to Date
        Date dob = new Date(dobTimestamp);

        // Save UserCV first
        UserCV savedUserCV = userCvRepository.save(userCV);

        // Set userCV reference and user in related entities
        for (UserDetail detail : savedUserCV.getUserDetails()) {
            detail.setUserCV(savedUserCV);
            detail.setDob(dob);
            userDetailRepository.save(detail);
        }

        for (UserEducation education : savedUserCV.getUserEducations()) {
            education.setUserCV(savedUserCV);
            education.setUser(user);  // Assign user ID here
            userEducationRepository.save(education);
        }

        for (UserExperience experience : savedUserCV.getUserExperiences()) {
            experience.setUserCV(savedUserCV);
            experience.setUser(user);  // Assign user ID here

            userExperienceRepository.save(experience);
        }

        for (UserSkill skill : savedUserCV.getUserSkills()) {
            skill.setUserCV(savedUserCV);
            skill.setUser(user);  // Assign user ID here

            userSkillRepository.save(skill);
        }

        for (UserProject project : savedUserCV.getUserProjects()) {
            project.setUserCV(savedUserCV);
            project.setUser(user);  // Assign user ID here

            userProjectRepository.save(project);
        }

        for (UserLanguage language : savedUserCV.getUserLanguages()) {
            language.setUserCV(savedUserCV);
            language.setUser(user);
            userLanguageRepository.save(language);
        }

        // Handle the profile image upload
        if (!profileImage.isEmpty()) {
            try {
                byte[] imageBytes = profileImage.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                UserDetail userDetail = savedUserCV.getUserDetails().get(0);
                userDetail.setProfileImageBase64(base64Image);
                userDetailRepository.save(userDetail);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving profile image");
            }
        }

        return ResponseEntity.ok().body("CV Save Success!");
    }
}