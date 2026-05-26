package com.StudentBudgetTracker.service;

import com.StudentBudgetTracker.model.Budget;
import com.StudentBudgetTracker.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository repo;

    public String addBudget(Budget b) throws Exception {
        return repo.save(b);
    }

    public List<Budget> getBudgets(String userId) throws Exception {
        return repo.findByUserId(userId);
    }

    public void deleteBudget(String id, String userId) throws Exception {
        repo.delete(id, userId);
    }
}
