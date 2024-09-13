package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.Repository.BlogRepository;
import com.project4.JobBoardService.Repository.QuizRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private BlogRepository blogRepository;

    @Override
    public long getTotalUsers() {
        return userRepository.findUsersWithRoleUser();
    }

    @Override
    public long getTotalBlogs() {
        return blogRepository.countBlogs();
    }

    @Override
    public long getTotalQuizzes() {
        return quizRepository.countQuizzes();
    }
}
