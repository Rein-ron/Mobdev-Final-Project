package com.StudentBudgetTracker.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Budget {
    private String id;
    private String category;
    private double limit;
    private String userId;
}