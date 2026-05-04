package com.StudentBudgetTracker.service;

import com.StudentBudgetTracker.model.SavingsGoal;
import com.StudentBudgetTracker.repository.SavingsGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavingsGoalService {

    private final SavingsGoalRepository repo;

    public String addSavingsGoal(SavingsGoal g) throws Exception {
        return repo.save(g);
    }

    public List<SavingsGoal> getSavingsGoals(String userId) throws Exception {
        return repo.findByUserId(userId);
    }

    public void updateSaved(String id, double newSaved) throws Exception {
        repo.update(id, newSaved);
    }

    public void deleteSavingsGoal(String id) throws Exception {
        repo.delete(id);
    }
}