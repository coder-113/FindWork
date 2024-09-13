package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.TrendingSkillDTO;
import com.project4.JobBoardService.Entity.TrendingSkill;
import com.project4.JobBoardService.Repository.TrendingSkillRepository;
import com.project4.JobBoardService.Service.TrendingSkillService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TrendingSkillServiceImpl implements TrendingSkillService {
    private final TrendingSkillRepository trendingSkillRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public TrendingSkillServiceImpl(TrendingSkillRepository trendingSkillRepository, ModelMapper modelMapper) {
        this.trendingSkillRepository = trendingSkillRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<TrendingSkillDTO> getAllTrendingSkills() {
        List<TrendingSkill> skills = trendingSkillRepository.findAll();
        return skills.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TrendingSkillDTO createTrendingSkill(TrendingSkillDTO trendingSkillDTO) {
        TrendingSkill trendingSkill = convertToEntity(trendingSkillDTO);
        TrendingSkill savedSkill = trendingSkillRepository.save(trendingSkill);
        return convertToDto(savedSkill);
    }

    @Override
    public void deleteTrendingSkill(Long id) {
        trendingSkillRepository.deleteById(id);
    }

    private TrendingSkillDTO convertToDto(TrendingSkill trendingSkill) {
        return modelMapper.map(trendingSkill, TrendingSkillDTO.class);
    }

    private TrendingSkill convertToEntity(TrendingSkillDTO trendingSkillDTO) {
        return modelMapper.map(trendingSkillDTO, TrendingSkill.class);
    }
}
