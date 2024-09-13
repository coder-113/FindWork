package com.project4.JobBoardService.DTO;

import com.project4.JobBoardService.Enum.Gender;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BlogResponseDTO {
    private Long id;
    private String title;
    private String content;
    private List<BlogCategoryDTO> categories; // Change to List<BlogCategoryDTO>
    private UserDTO user;
    private boolean visibility;
    private String slug;
    private String citation;
    private String imageUrl;
    private String thumbnailUrl;
    private Date createdAt;
    private Date updatedAt;
    private int commentCount;
    private List<HashTagDTO> hashtags;
    private int view;

    // Getters and setters

    // Inner class for category DTO
    @Getter
    @Setter
    public static class BlogCategoryDTO {
        private Long id;
        private String name;

        // Getters and setters
    }

    // Inner class for user DTO
    @Getter
    @Setter
    public static class UserDTO {
        private Long id;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String bio;
        private String imageUrl;
        private Gender gender;
        // Getters and setters
    }
}
