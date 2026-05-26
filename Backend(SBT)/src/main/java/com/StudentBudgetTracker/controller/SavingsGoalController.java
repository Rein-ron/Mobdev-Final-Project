package com.StudentBudgetTracker.controller;

import com.StudentBudgetTracker.model.SavingsGoal;
import com.StudentBudgetTracker.service.SavingsGoalService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/savings")
@RequiredArgsConstructor
public class SavingsGoalController {

    private final SavingsGoalService service;

    @PostMapping
    public ResponseEntity<String> add(@RequestBody SavingsGoal g,
                                      HttpServletRequest request) throws Exception {
        String userId = (String) request.getAttribute("uid");
        g.setUserId(userId);
        return ResponseEntity.ok(service.addSavingsGoal(g));
    }

    @GetMapping
    public ResponseEntity<List<SavingsGoal>> getAll(HttpServletRequest request) throws Exception {
        String userId = (String) request.getAttribute("uid");
        return ResponseEntity.ok(service.getSavingsGoals(userId));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> updateSaved(@PathVariable String id,
                                            @RequestBody Map<String, Double> body,
                                            HttpServletRequest request) throws Exception {
        String userId = (String) request.getAttribute("uid");
        service.updateSaved(id, userId, body.get("saved"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id,
                                       HttpServletRequest request) throws Exception {
        String userId = (String) request.getAttribute("uid");
        service.deleteSavingsGoal(id, userId);
        return ResponseEntity.noContent().build();
    }
}
