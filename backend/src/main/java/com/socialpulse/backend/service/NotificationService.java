package com.socialpulse.backend.service;

import com.socialpulse.backend.model.Notification;
import com.socialpulse.backend.model.User;
import com.socialpulse.backend.repository.NotificationRepository;
import com.socialpulse.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public Notification createNotification(
            String userId,
            String actorId,
            String actorUsername,
            String type,
            String message,
            String postId
    ) {

        if (userId.equals(actorId)) {
            return null;
        }

        Notification notification =
                new Notification(
                        userId,
                        actorId,
                        actorUsername,
                        type,
                        message,
                        postId
                );

        return notificationRepository.save(
                notification
        );
    }

    public List<Notification> getNotifications(
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(
                        user.getId()
                );
    }

    public long getUnreadCount(
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return notificationRepository
                .countByUserIdAndReadFalse(
                        user.getId()
                );
    }

    public void markAllRead(
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                user.getId()
                        );

        notifications.forEach(
                notification ->
                        notification.setRead(true)
        );

        notificationRepository.saveAll(
                notifications
        );
    }

    public void deleteAll(
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                user.getId()
                        );

        notificationRepository.deleteAll(
                notifications
        );
    }
}
