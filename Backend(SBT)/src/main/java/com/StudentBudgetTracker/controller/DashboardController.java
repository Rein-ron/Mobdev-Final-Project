package com.StudentBudgetTracker.controller;

import com.StudentBudgetTracker.model.Budget;
import com.StudentBudgetTracker.model.SavingsGoal;
import com.StudentBudgetTracker.model.Transaction;
import com.StudentBudgetTracker.service.BudgetService;
import com.StudentBudgetTracker.service.SavingsGoalService;
import com.StudentBudgetTracker.service.TransactionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final TransactionService transactionService;
    private final BudgetService budgetService;
    private final SavingsGoalService savingsGoalService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboard(HttpServletRequest request) throws Exception {
        String userId = (String) request.getAttribute("uid");
        List<Transaction> transactions = transactionService.getTransactions(userId);
        List<Budget> budgets = budgetService.getBudgets(userId);
        List<SavingsGoal> savings = savingsGoalService.getSavingsGoals(userId);

        double income = transactions.stream()
                .filter(t -> "income".equals(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();
        double expenses = transactions.stream()
                .filter(t -> "expense".equals(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        return ResponseEntity.ok(Map.of(
                "summary", Map.of(
                        "income", income,
                        "expenses", expenses,
                        "balance", income - expenses
                ),
                "transactions", transactions,
                "budgets", budgets,
                "savings", savings
        ));
    }
}
