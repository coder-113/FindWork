package com.project4.JobBoardService.Controller;


import com.project4.JobBoardService.DTO.SubscriptionDTO;
import com.project4.JobBoardService.Service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transcation")
public class TranscationController {

    @Autowired
    private TransactionService transcationService;


    @GetMapping("/{userId}")
    public ResponseEntity<List<SubscriptionDTO>> getSubscriptionByUserId(@PathVariable Long userId) {
        List<SubscriptionDTO> subscriptions = transcationService.findAllSubscriptions(userId);
        return ResponseEntity.ok(subscriptions);
    }




}
