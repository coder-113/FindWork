package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.DTO.FavoriteJobDTO;
import com.project4.JobBoardService.Entity.FavoriteJob;
import com.project4.JobBoardService.Entity.Job;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Repository.FavoriteJobRepository;
import com.project4.JobBoardService.Repository.JobRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.FavoriteJobService;
import com.project4.JobBoardService.Service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FavoriteJobServiceImpl implements FavoriteJobService {

    @Autowired
    private FavoriteJobRepository favoriteJobRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobServiceImpl jobServiceImpl;

    @Override
    public FavoriteJobDTO addJobToFavorites(Long jobId, String username) {
        Optional<Job> optionalJob = jobRepository.findById(jobId);
        if (optionalJob.isEmpty()) {
            throw new RuntimeException("Job not found!");
        }
        Job job = optionalJob.get();

        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found!");
        }
        User user = optionalUser.get();

        FavoriteJob favoriteJob = FavoriteJob.builder()
                .job(job)
                .user(user)
                .build();

        favoriteJobRepository.save(favoriteJob);

        return mapToDTO(favoriteJob);
    }

    @Override
    public List<FavoriteJobDTO> getFavoriteJobsForUser(String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found!");
        }
        User user = optionalUser.get();

        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        List<FavoriteJob> favoriteJobs = favoriteJobRepository.findByUser(user);
        return favoriteJobs.stream()
                .filter(job -> {
                    LocalDate expireDate = LocalDate.parse(job.getJob().getExpire(), formatter);
                    boolean notExpired = today.isBefore(expireDate);
                    boolean slotsAvailable = job.getJob().getProfileApproved() < job.getJob().getSlot();
                    return notExpired && slotsAvailable;
                })

                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteFavoriteJob(Long favoriteId) {
        Optional<FavoriteJob> optionalFavoriteJob = favoriteJobRepository.findById(favoriteId);
        if (optionalFavoriteJob.isEmpty()) {
            throw new RuntimeException("Favorite job not found!");
        }
        favoriteJobRepository.deleteById(favoriteId);
    }

    private FavoriteJobDTO mapToDTO(FavoriteJob favoriteJob) {
        return FavoriteJobDTO.builder()
                .id(favoriteJob.getId())
                .job(favoriteJob.getJob())
                .user(favoriteJob.getUser())
                .build();
    }
}

