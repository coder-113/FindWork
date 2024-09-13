package com.project4.JobBoardService.Controller;

import com.project4.JobBoardService.DTO.TrendingSkillDTO;
import com.project4.JobBoardService.Service.TrendingSkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/trending-skills")
public class TrendingSkillController {
    private final TrendingSkillService trendingSkillService;

    @Autowired
    public TrendingSkillController(TrendingSkillService trendingSkillService) {
        this.trendingSkillService = trendingSkillService;
    }

    @GetMapping
    public List<TrendingSkillDTO> getAllTrendingSkills() {
        return trendingSkillService.getAllTrendingSkills();
    }

    @PostMapping
    public ResponseEntity<TrendingSkillDTO> createTrendingSkill(@RequestBody TrendingSkillDTO trendingSkillDTO) {
        TrendingSkillDTO createdSkill = trendingSkillService.createTrendingSkill(trendingSkillDTO);
        return ResponseEntity.ok(createdSkill);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrendingSkill(@PathVariable Long id) {
        trendingSkillService.deleteTrendingSkill(id);
        return ResponseEntity.noContent().build();
    }
}
