package com.socialpulse.backend.service;

import com.socialpulse.backend.model.Follow;
import com.socialpulse.backend.model.User;
import com.socialpulse.backend.repository.FollowRepository;
import com.socialpulse.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public FollowService(
            FollowRepository followRepository,
            UserRepository userRepository,
            NotificationService notificationService
    ) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public boolean toggleFollow(
            String targetUserId,
            String email
    ) {

        User follower = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        User target = userRepository.findById(targetUserId)
                .orElseThrow(() ->
                        new RuntimeException("Target user not found"));

        if (follower.getId().equals(target.getId())) {
            throw new RuntimeException(
                    "You cannot follow yourself"
            );
        }

        var existing =
                followRepository.findByFollowerIdAndFollowingId(
                        follower.getId(),
                        target.getId()
                );

        if (existing.isPresent()) {

            followRepository.delete(existing.get());

            return false;
        }

        Follow follow = new Follow(
                follower.getId(),
                target.getId()
        );

        followRepository.save(follow);

        notificationService.createNotification(
                target.getId(),
                follower.getId(),
                follower.getUsername(),
                "FOLLOW",
                follower.getUsername() +
                        " started following you",
                null
        );

        return true;
    }

    public boolean isFollowing(
            String targetUserId,
            String email
    ) {

        User follower = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return followRepository
                .existsByFollowerIdAndFollowingId(
                        follower.getId(),
                        targetUserId
                );
    }

    public long getFollowersCount(
            String userId
    ) {
        return followRepository
                .countByFollowingId(userId);
    }

    public long getFollowingCount(
            String userId
    ) {
        return followRepository
                .countByFollowerId(userId);
    }

    public List<Follow> getFollowers(
            String userId
    ) {
        return followRepository
                .findByFollowingId(userId);
    }

    public List<Follow> getFollowing(
            String userId
    ) {
        return followRepository
                .findByFollowerId(userId);
    }
}
