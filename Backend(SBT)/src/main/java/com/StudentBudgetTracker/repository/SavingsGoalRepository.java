package com.StudentBudgetTracker.repository;

import com.StudentBudgetTracker.model.SavingsGoal;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class SavingsGoalRepository {

    private static final String COLLECTION = "savingsGoals";

    private Firestore getDb() {
        return FirestoreClient.getFirestore();
    }

    public String save(SavingsGoal g) throws Exception {
        var doc = getDb().collection(COLLECTION).document();
        g.setId(doc.getId());
        doc.set(g).get();
        return doc.getId();
    }

    public List<SavingsGoal> findByUserId(String userId) throws Exception {
        return getDb().collection(COLLECTION)
                .whereEqualTo("userId", userId)
                .get().get()
                .getDocuments()
                .stream()
                .map(d -> d.toObject(SavingsGoal.class))
                .collect(Collectors.toList());
    }

    public void update(String id, String userId, double newSaved) throws Exception {
        var doc = getDb().collection(COLLECTION).document(id).get().get();
        SavingsGoal goal = doc.toObject(SavingsGoal.class);
        if (!doc.exists() || goal == null || !userId.equals(goal.getUserId())) {
            throw new IllegalArgumentException("Savings goal not found");
        }

        doc.getReference().update("saved", newSaved).get();
    }

    public void delete(String id, String userId) throws Exception {
        var doc = getDb().collection(COLLECTION).document(id).get().get();
        SavingsGoal goal = doc.toObject(SavingsGoal.class);
        if (!doc.exists() || goal == null || !userId.equals(goal.getUserId())) {
            throw new IllegalArgumentException("Savings goal not found");
        }

        doc.getReference().delete().get();
    }
}
