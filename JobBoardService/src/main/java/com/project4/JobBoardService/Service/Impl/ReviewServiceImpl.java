package com.project4.JobBoardService.Service.Impl;
import com.project4.JobBoardService.DTO.CompanyDTO;
import com.project4.JobBoardService.DTO.ReviewDTO;
import com.project4.JobBoardService.Entity.Company;
import com.project4.JobBoardService.Entity.Review;
import com.project4.JobBoardService.Entity.ReviewLike;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Repository.ReviewLikeRepository;
import com.project4.JobBoardService.Repository.ReviewRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.BannedWordService;
import com.project4.JobBoardService.Service.CompanyService;
import com.project4.JobBoardService.Service.ReviewService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final CompanyService companyService;
    private final BannedWordService bannedWordService;
    private final UserRepository userRepository;
    private final ReviewLikeRepository reviewLikeRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public ReviewServiceImpl(ReviewRepository reviewRepository, CompanyService companyService, UserRepository userRepository, BannedWordService bannedWordService, ModelMapper modelMapper, ReviewLikeRepository reviewLikeRepository) {
        this.reviewRepository = reviewRepository;
        this.companyService = companyService;
        this.bannedWordService = bannedWordService;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.reviewLikeRepository = reviewLikeRepository;
    }

//    @Override
//    public List<ReviewDTO> getAllReviews(Long companyId) {
//        List<Review> reviews = reviewRepository.findByCompany_CompanyId(companyId);
//        return reviews.stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }

//    @Override
//    public ReviewDTO addReview(Long companyId, ReviewDTO reviewDTO) {
//        Optional<Company> companyOptional = companyService.getCompanyById(companyId).map(this::convertCompanyToEntity);
//        Optional<User> userOptional = userRepository.findByUsername(reviewDTO.getUsername());
//
//        if (companyOptional.isPresent() && userOptional.isPresent()) {
//            Company company = companyOptional.get();
//            User user = userOptional.get();
//
//            // Combine words from title and description into a single list
//            List<String> wordsToCheck = Arrays.asList(
//                    reviewDTO.getTitle().split("\\s+"),
//                    reviewDTO.getDescription().split("\\s+")
//            ).stream().flatMap(Arrays::stream).distinct().collect(Collectors.toList());
//
//            // Filter banned words from the combined list
//            List<String> bannedWords = bannedWordService.filterBannedWords(wordsToCheck);
//
//            System.out.println("Banned words found: " + bannedWords); // Debugging log
//
//            String cleanTitle = reviewDTO.getTitle();
//            String cleanDescription = reviewDTO.getDescription();
//
//            // Flag to check if any banned words are found
//            boolean hasBannedWords = false;
//
//            // Replace banned words with a single '*'
//            for (String bannedWord : bannedWords) {
//                String regex = "(?i)\\b" + Pattern.quote(bannedWord) + "\\b";
//                if (cleanTitle.matches(".*" + regex + ".*")) {
//                    hasBannedWords = true;
//                    cleanTitle = cleanTitle.replaceAll(regex, "*");
//                }
//                if (cleanDescription.matches(".*" + regex + ".*")) {
//                    hasBannedWords = true;
//                    cleanDescription = cleanDescription.replaceAll(regex, "*");
//                }
//            }
//
//            // Clean up extra spaces
//            cleanTitle = cleanTitle.trim().replaceAll(" +", " ");
//            cleanDescription = cleanDescription.trim().replaceAll(" +", " ");
//
//            // Only save the review if there are banned words (or if the review is clean)
//            Review review = new Review();
//            review.setTitle(cleanTitle); // Remove leading/trailing spaces if any
//            review.setDescription(cleanDescription); // Remove leading/trailing spaces if any
//            review.setRating(reviewDTO.getRating());
//            review.setCompany(company);
//            review.setUser(user);
//
//            Review savedReview = reviewRepository.save(review);
//            return convertToDTO(savedReview); // Return the DTO
//        }
//        return null;
//    }


//    @Override
//    public ReviewDTO addReview(Long companyId, ReviewDTO reviewDTO) {
//        Optional<Company> companyOptional = companyService.getCompanyById(companyId).map(this::convertCompanyToEntity);
//        Optional<User> userOptional = userRepository.findByUsername(reviewDTO.getUsername());
//
//        if (companyOptional.isPresent() && userOptional.isPresent()) {
//            Company company = companyOptional.get();
//            User user = userOptional.get();
//
//            // Combine words from title and description into a single list
//            List<String> wordsToCheck = Arrays.asList(
//                    reviewDTO.getTitle().split("\\s+"),
//                    reviewDTO.getDescription().split("\\s+")
//            ).stream().flatMap(Arrays::stream).distinct().collect(Collectors.toList());
//
//            // Filter banned words from the combined list
//            List<String> bannedWords = bannedWordService.filterBannedWords(wordsToCheck);
//
//            System.out.println("Banned words found: " + bannedWords); // Debugging log
//
//            String cleanTitle = reviewDTO.getTitle();
//            String cleanDescription = reviewDTO.getDescription();
//
//            // Flag to check if any banned words are found
//            boolean hasBannedWords = false;
//
//            // Replace banned words with empty strings in title and description
//            for (String bannedWord : bannedWords) {
//                String regex = "(?i)\\b" + Pattern.quote(bannedWord) + "\\b";
//                if (cleanTitle.matches(".*" + regex + ".*")) {
//                    hasBannedWords = true;
//                    cleanTitle = cleanTitle.replaceAll(regex, "");
//                }
//                if (cleanDescription.matches(".*" + regex + ".*")) {
//                    hasBannedWords = true;
//                    cleanDescription = cleanDescription.replaceAll(regex, "");
//                }
//            }
//
//            // Clean up extra spaces
//            cleanTitle = cleanTitle.trim().replaceAll(" +", " ");
//            cleanDescription = cleanDescription.trim().replaceAll(" +", " ");
//
//            // Only save the review if there are banned words (or if the review is clean)
//            Review review = new Review();
//            review.setTitle(cleanTitle); // Remove leading/trailing spaces if any
//            review.setDescription(cleanDescription); // Remove leading/trailing spaces if any
//            review.setRating(reviewDTO.getRating());
//            review.setCompany(company);
//            review.setUser(user);
//
//            Review savedReview = reviewRepository.save(review);
//            return convertToDTO(savedReview); // Return the DTO
//        }
//        return null;
//    }


    @Override
    public List<ReviewDTO> getAllReviews(Long companyId) {
        // Lấy danh sách các review từ cơ sở dữ liệu
        List<Review> reviews = reviewRepository.findByCompany_CompanyId(companyId);

        // Lấy danh sách các từ cấm từ dịch vụ
        List<String> bannedWords = bannedWordService.getBannedWords();

        // Duyệt qua từng review và thay thế các từ cấm trong tiêu đề và mô tả review
        return reviews.stream()
                .map(review -> {
                    String cleanTitle = bannedWordService.filterBannedWordsInText(review.getTitle(), bannedWords);
                    String cleanDescription = bannedWordService.filterBannedWordsInText(review.getDescription(), bannedWords);

                    // Tạo đối tượng ReviewDTO với tiêu đề và mô tả đã được thay thế
                    ReviewDTO reviewDTO = convertToDTO(review);
                    reviewDTO.setTitle(cleanTitle);
                    reviewDTO.setDescription(cleanDescription);
                    return reviewDTO;
                })
                .collect(Collectors.toList());
    }


    @Override
    public ReviewDTO addReview(Long companyId, ReviewDTO reviewDTO) {
        Optional<Company> companyOptional = companyService.getCompanyById(companyId).map(this::convertCompanyToEntity);
        Optional<User> userOptional = userRepository.findByUsername(reviewDTO.getUsername());

        if (companyOptional.isPresent() && userOptional.isPresent()) {
            Company company = companyOptional.get();
            User user = userOptional.get();

            // Only save the review if there are banned words (or if the review is clean)
            Review review = new Review();
            review.setTitle(reviewDTO.getTitle()); // Remove leading/trailing spaces if any
            review.setDescription(reviewDTO.getDescription()); // Remove leading/trailing spaces if any
            review.setRating(reviewDTO.getRating());
            review.setCompany(company);
            review.setUser(user);

            Review savedReview = reviewRepository.save(review);
            return convertToDTO(savedReview); // Return the DTO
        }
        return null;
    }


    @Override
    public Review getReview(Long companyId, Long reviewId, String username) {
        Optional<CompanyDTO> companyOptional = companyService.getCompanyById(companyId);
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (companyOptional.isPresent() && userOptional.isPresent()) {
            List<Review> reviews = reviewRepository.findByCompany_CompanyId(companyId);
            return reviews.stream()
                    .filter(review -> review.getId().equals(reviewId) && review.getUser().equals(userOptional.get()))
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }

    @Override
    public boolean updateReview(Long companyId, Long reviewId, String username, Review updatedReview) {
        Optional<Company> companyOptional = companyService.getCompanyById(companyId).map(this::convertCompanyToEntity);
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (companyOptional.isPresent() && userOptional.isPresent()) {
            Company company = companyOptional.get(); // Unwrap the Optional
            User user = userOptional.get(); // Unwrap the Optional

            updatedReview.setCompany(company);
            updatedReview.setUser(user);
            updatedReview.setId(reviewId);
            reviewRepository.save(updatedReview);

            return true;
        }
        return false;
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
        company.setType(companyDTO.getType());
        return company;
    }

    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO reviewDTO = modelMapper.map(review, ReviewDTO.class);
        reviewDTO.setId(review.getId());
        reviewDTO.setUsername(review.getUser().getUsername());
        reviewDTO.setImageUrl(review.getUser().getImageUrl());
        reviewDTO.setLikeCount(review.getLikeCount());
        return reviewDTO;
    }

    public boolean hasUserReviewedCompany(Long companyId, String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            return !reviewRepository.findByCompany_CompanyIdAndUserId(companyId, user.getId()).isEmpty();
        }
        return false;
    }

    @Override
    public boolean likeReview(Long companyId, Long reviewId, String username) {
        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (reviewOptional.isPresent() && userOptional.isPresent()) {
            Review review = reviewOptional.get();
            User user = userOptional.get();

            if (reviewLikeRepository.existsByReviewIdAndUserId(reviewId, user.getId())) {
                return false; // User already liked the review
            }

            ReviewLike like = new ReviewLike();
            like.setReview(review);
            like.setUser(user);
            reviewLikeRepository.save(like);

            return true;
        }
        return false;
    }

    @Override
    public boolean unlikeReview(Long reviewId, String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Optional<ReviewLike> likeOptional = reviewLikeRepository.findByReviewIdAndUserId(reviewId, user.getId());

            if (likeOptional.isPresent()) {
                reviewLikeRepository.delete(likeOptional.get());
                return true;
            }
        }
        return false;
    }
}