package com.StudentBudgetTracker.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    private String id;
    private String type;       
    private String category;   
    private double amount;
    private String description;
    private String date;      
    private String userId;
}