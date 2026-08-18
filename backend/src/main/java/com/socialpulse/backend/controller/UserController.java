package com.socialpulse.backend.controller;

import com.socialpulse.backend.model.User;
import com.socialpulse.backend.repository.UserRepository;
import com.socialpulse.backend.service.FollowService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final FollowService followService;

    public UserController(
            UserRepository userRepository,
            FollowService followService
    ) {
        this.userRepository = userRepository;
        this.followService = followService;
    }

    // =========================================
    // CURRENT USER
    // =========================================

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();

            User user =
                    userRepository.findByEmail(email)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    ));

            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =========================================
    // UPDATE PROFILE
    // =========================================

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            @RequestBody User updatedUser,
            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();

            User user =
                    userRepository.findByEmail(email)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    ));


            if (updatedUser.getName() != null &&
                    !updatedUser.getName()
                            .trim()
                            .isEmpty()) {

                user.setName(
                        updatedUser.getName()
                );
            }


            if (updatedUser.getUsername() != null &&
                    !updatedUser.getUsername()
                            .trim()
                            .isEmpty() &&
                    !updatedUser.getUsername()
                            .equals(user.getUsername())) {

                if (userRepository.existsByUsername(
                        updatedUser.getUsername()
                )) {

                    return ResponseEntity
                            .badRequest()
                            .body(
                                    "Username already exists"
                            );
                }

                user.setUsername(
                        updatedUser.getUsername()
                );
            }


            if (updatedUser.getEmail() != null &&
                    !updatedUser.getEmail()
                            .trim()
                            .isEmpty() &&
                    !updatedUser.getEmail()
                            .equals(user.getEmail())) {

                if (userRepository.existsByEmail(
                        updatedUser.getEmail()
                )) {

                    return ResponseEntity
                            .badRequest()
                            .body(
                                    "Email already registered"
                            );
                }

                user.setEmail(
                        updatedUser.getEmail()
                );
            }


            if (updatedUser.getBio() != null) {

                user.setBio(
                        updatedUser.getBio()
                );
            }


            if (updatedUser.getCountry() != null) {

                user.setCountry(
                        updatedUser.getCountry()
                );
            }


            if (updatedUser.getState() != null) {

                user.setState(
                        updatedUser.getState()
                );
            }


            user.setUpdatedAt(
                    java.time.LocalDateTime.now()
            );


            return ResponseEntity.ok(
                    userRepository.save(user)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =========================================
    // GET USER BY ID
    // =========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(
            @PathVariable String id
    ) {

        try {

            User user =
                    userRepository.findById(id)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    ));

            return ResponseEntity.ok(
                    user
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }


    // =========================================
    // SEARCH USERS
    // =========================================

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(
            @RequestParam String q
    ) {

        return ResponseEntity.ok(
                userRepository
                        .findByUsernameContainingIgnoreCaseOrNameContainingIgnoreCase(
                                q,
                                q
                        )
        );
    }


    // =========================================
    // FOLLOW COUNTS
    // =========================================

    @GetMapping("/{id}/follow-counts")
    public ResponseEntity<?> followCounts(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                Map.of(
                        "followers",
                        followService
                                .getFollowersCount(id),

                        "following",
                        followService
                                .getFollowingCount(id)
                )
        );
    }
}