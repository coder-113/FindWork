package com.project4.JobBoardService.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Nullable;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BlogDTO {
    @NotNull
    private String title;
    @NotNull
    private String content;
    @NotNull
    private List<Long> categoryIds;
    @NotNull
    private String citation;
    @NotNull
    public  String username;
    @NotNull
    private boolean visibility;
    @NotNull
    private String slug;
    @Nullable
    private MultipartFile image;
    private List<String> hashtags;
}
