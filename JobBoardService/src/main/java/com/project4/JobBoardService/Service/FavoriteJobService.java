package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.FavoriteJobDTO;

import java.util.List;

public interface FavoriteJobService {
    FavoriteJobDTO addJobToFavorites(Long jobId, String username);
    List<FavoriteJobDTO> getFavoriteJobsForUser(String username);
    void deleteFavoriteJob(Long favoriteId);
}
