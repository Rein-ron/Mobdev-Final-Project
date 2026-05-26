package com.StudentBudgetTracker.service;

import com.StudentBudgetTracker.model.Transaction;
import com.StudentBudgetTracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository repo;

    public String addTransaction(Transaction t) throws Exception {
        return repo.save(t);
    }

    public List<Transaction> getTransactions(String userId) throws Exception {
        return repo.findByUserId(userId);
    }

    public void deleteTransaction(String id, String userId) throws Exception {
        repo.delete(id, userId);
    }

    public Map<String, Double> getSummary(String userId) throws Exception {
        List<Transaction> all = repo.findByUserId(userId);

        double income = all.stream()
            .filter(t -> "income".equals(t.getType()))
            .mapToDouble(Transaction::getAmount)
            .sum();

        double expenses = all.stream()
            .filter(t -> "expense".equals(t.getType()))
            .mapToDouble(Transaction::getAmount)
            .sum();

        return Map.of(
            "income", income,
            "expenses", expenses,
            "balance", income - expenses
        );
    }
}
