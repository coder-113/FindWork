package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.SubscriptionDTO;
import com.project4.JobBoardService.Entity.Subscription;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public void saveTransaction(Subscription transaction) {
        transactionRepository.save(transaction);
    }

    public Optional<Subscription> findActiveSubscriptionByUser(User user, LocalDate now) {
        return transactionRepository.findByUserAndEndDateAfter(user, now);
    }

    public List<SubscriptionDTO> findActiveSubscriptionByUserService(User user, LocalDate now) {
        List<Subscription> subscriptions = transactionRepository.findByUserEndDate(user, now);
        return subscriptions.stream()
                .map(this::toDTO) // Using instance method reference
                .collect(Collectors.toList());
    }

    public List<SubscriptionDTO> findAllSubscriptions(Long userId) {
        List<Subscription> subscriptions = transactionRepository.findAllSubscriptionByUserId(userId);
        return subscriptions.stream()
                .map(this::toDTO) // Using instance method reference
                .collect(Collectors.toList());
    }

    // Private method to convert Subscription entity to SubscriptionDTO
    private SubscriptionDTO toDTO(Subscription subscription) {
        return new SubscriptionDTO(
                subscription.getId(),
                subscription.getUser().getId(),
                subscription.getPostLimit(),
                subscription.getService(),
                subscription.getStartDate(),
                subscription.getEndDate(),
                subscription.getAmount()
        );
    }
}
