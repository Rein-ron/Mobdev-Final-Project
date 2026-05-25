package com.StudentBudgetTracker.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import java.io.ByteArrayInputStream;
import java.util.Base64;

import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @Value("${FIREBASE_CREDENTIALS:#{null}}")
    private String firebaseCredentials;

    @Value("${firebase.service-account:#{null}}")
    private Resource serviceAccount;

    @PostConstruct
    public void initialize() throws IOException {
        System.out.println("FIREBASE_CREDENTIALS is null: " + (firebaseCredentials == null));
        
        GoogleCredentials credentials;

        if (firebaseCredentials != null && !firebaseCredentials.isEmpty()) {
            byte[] decoded = Base64.getDecoder().decode(firebaseCredentials);
            credentials = GoogleCredentials.fromStream(new ByteArrayInputStream(decoded));
        } else if (serviceAccount != null) {
            credentials = GoogleCredentials.fromStream(serviceAccount.getInputStream());
        } else {
            throw new IllegalStateException("No Firebase credentials found. Set FIREBASE_CREDENTIALS in Railway.");
        }

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(credentials)
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }
}