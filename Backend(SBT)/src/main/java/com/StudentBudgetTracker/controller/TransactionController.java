package com.StudentBudgetTracker.controller;

import com.StudentBudgetTracker.model.Transaction;
import com.StudentBudgetTracker.service.TransactionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;

    @PostMapping
    public ResponseEntity<String> add(@RequestBody Transaction t,
                                      HttpServletRequest request) throws Exception {
        String userId = (String) request.getAttribute("uid");
        t.setUserId(userId);
        String id = service.addTransaction(t);
        return ResponseEntity.ok(id);
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAll(HttpServletRequest request) throws Exception {
        String userId = (String) request.getAttribute("uid");
        return ResponseEntity.ok(service.getTransactions(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id,
                                       HttpServletRequest request) throws Exception {
        String userId = (String) request.getAttribute("uid");
        service.deleteTransaction(id, userId);
        return ResponseEntity.noContent().build();
    }
}
