package com.socialpulse.backend.repository;

import com.socialpulse.backend.model.Notification;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository
        extends MongoRepository<Notification, String> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(
            String userId
    );

    long countByUserIdAndReadFalse(
            String userId
    );
}