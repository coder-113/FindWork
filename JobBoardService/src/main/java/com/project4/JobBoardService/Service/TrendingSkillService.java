package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.TrendingSkillDTO;

import java.util.List;
import java.util.Optional;

public interface TrendingSkillService {
    List<TrendingSkillDTO> getAllTrendingSkills();
    TrendingSkillDTO createTrendingSkill(TrendingSkillDTO trendingSkillDTO);
    void deleteTrendingSkill(Long id);
}
