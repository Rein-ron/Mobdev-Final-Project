package com.StudentBudgetTracker.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavingsGoal {
    private String id;
    private String name;
    private double target;
    private double saved;
    private String userId;
}