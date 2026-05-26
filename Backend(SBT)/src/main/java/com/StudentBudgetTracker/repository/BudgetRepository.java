package com.StudentBudgetTracker.repository;

import com.StudentBudgetTracker.model.Budget;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class BudgetRepository {

    private static final String COLLECTION = "budgets";

    private Firestore getDb() {
        return FirestoreClient.getFirestore();
    }

    public String save(Budget b) throws Exception {
        var doc = getDb().collection(COLLECTION).document();
        b.setId(doc.getId());
        doc.set(b).get();
        return doc.getId();
    }

    public List<Budget> findByUserId(String userId) throws Exception {
        return getDb().collection(COLLECTION)
                .whereEqualTo("userId", userId)
                .get().get()
                .getDocuments()
                .stream()
                .map(d -> d.toObject(Budget.class))
                .collect(Collectors.toList());
    }

    public void delete(String id, String userId) throws Exception {
        var doc = getDb().collection(COLLECTION).document(id).get().get();
        Budget budget = doc.toObject(Budget.class);
        if (!doc.exists() || budget == null || !userId.equals(budget.getUserId())) {
            throw new IllegalArgumentException("Budget not found");
        }

        doc.getReference().delete().get();
    }
}
