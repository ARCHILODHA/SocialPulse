package com.socialpulse.backend.controller;

import com.socialpulse.backend.service.FollowService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/follows")
@CrossOrigin(origins = "*")
public class FollowController {

    private final FollowService followService;

    public FollowController(
            FollowService followService
    ) {
        this.followService = followService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> toggleFollow(
            @PathVariable String userId,
            Authentication authentication
    ) {

        try {

            boolean following =
                    followService.toggleFollow(
                            userId,
                            authentication.getName()
                    );

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "following",
                    following
            );

            return ResponseEntity.ok(
                    response
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/{userId}/status")
    public ResponseEntity<?> getStatus(
            @PathVariable String userId,
            Authentication authentication
    ) {

        boolean following =
                followService.isFollowing(
                        userId,
                        authentication.getName()
                );

        return ResponseEntity.ok(
                Map.of(
                        "following",
                        following
                )
        );
    }

    @GetMapping("/{userId}/counts")
    public ResponseEntity<?> getCounts(
            @PathVariable String userId
    ) {

        return ResponseEntity.ok(
                Map.of(
                        "followers",
                        followService
                                .getFollowersCount(userId),

                        "following",
                        followService
                                .getFollowingCount(userId)
                )
        );
    }
}
