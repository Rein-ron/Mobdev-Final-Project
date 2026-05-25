package com.StudentBudgetTracker.repository;

import com.StudentBudgetTracker.model.Transaction;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class TransactionRepository {

    private static final String COLLECTION = "transactions";

    private Firestore getDb() {
        return FirestoreClient.getFirestore();
    }

    public String save(Transaction t) throws Exception {
        Firestore db = getDb();
        var doc = db.collection(COLLECTION).document();
        t.setId(doc.getId());
        doc.set(t).get();
        return doc.getId();
    }

    public List<Transaction> findByUserId(String userId) throws Exception {
        return getDb().collection(COLLECTION)
            .whereEqualTo("userId", userId)
            .get().get()
            .getDocuments()
            .stream()
            .map(d -> d.toObject(Transaction.class))
            .sorted(Comparator.comparing(Transaction::getDate, Comparator.nullsLast(String::compareTo)).reversed())
            .collect(Collectors.toList());
    }

    public void delete(String id) throws Exception {
        getDb().collection(COLLECTION)
            .document(id)
            .delete()
            .get();
    }
}
