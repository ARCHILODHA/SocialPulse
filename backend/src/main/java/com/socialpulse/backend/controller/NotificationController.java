package com.socialpulse.backend.controller;

import com.socialpulse.backend.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService
    ) {
        this.notificationService =
                notificationService;
    }

    @GetMapping
    public ResponseEntity<?> getNotifications(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                notificationService.getNotifications(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> unreadCount(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                notificationService.getUnreadCount(
                        authentication.getName()
                )
        );
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllRead(
            Authentication authentication
    ) {

        notificationService.markAllRead(
                authentication.getName()
        );

        return ResponseEntity.ok(
                "Notifications marked as read"
        );
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAll(
            Authentication authentication
    ) {

        notificationService.deleteAll(
                authentication.getName()
        );

        return ResponseEntity.ok(
                "Notifications cleared"
        );
    }
}
