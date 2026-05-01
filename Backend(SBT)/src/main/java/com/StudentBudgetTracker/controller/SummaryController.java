package com.StudentBudgetTracker.controller;

import com.StudentBudgetTracker.service.TransactionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/summary")
@RequiredArgsConstructor
public class SummaryController {

    private final TransactionService service;

    @GetMapping
    public ResponseEntity<Map<String, Double>> summary(HttpServletRequest request) throws Exception {
        String userId = (String) request.getAttribute("uid");
        return ResponseEntity.ok(service.getSummary(userId));
    }
}