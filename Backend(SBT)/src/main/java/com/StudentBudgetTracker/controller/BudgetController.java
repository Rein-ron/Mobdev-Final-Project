package com.StudentBudgetTracker.controller;

import com.StudentBudgetTracker.model.Budget;
import com.StudentBudgetTracker.service.BudgetService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService service;

    @PostMapping
    public ResponseEntity<String> add(@RequestBody Budget b,
                                      HttpServletRequest request) throws Exception {
        String userId = (String) request.getAttribute("uid");
        b.setUserId(userId);
        return ResponseEntity.ok(service.addBudget(b));
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getAll(HttpServletRequest request) throws Exception {
        String userId = (String) request.getAttribute("uid");
        return ResponseEntity.ok(service.getBudgets(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id,
                                       HttpServletRequest request) throws Exception {
        String userId = (String) request.getAttribute("uid");
        service.deleteBudget(id, userId);
        return ResponseEntity.noContent().build();
    }
}
