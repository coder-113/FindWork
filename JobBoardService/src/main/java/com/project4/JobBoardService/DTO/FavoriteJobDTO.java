package com.project4.JobBoardService.DTO;

import com.project4.JobBoardService.Entity.Job;
import com.project4.JobBoardService.Entity.User;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FavoriteJobDTO {
    private Long id;
    private Job job;
    private User user;
}
