package com.socialpulse.backend.controller;

import com.socialpulse.backend.model.User;
import com.socialpulse.backend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(
            Authentication authentication) {

        try {

            String email = authentication.getName();

            User user = userService.getUserByEmail(email);

            Map<String, Object> response = new HashMap<>();

            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, String> error = new HashMap<>();

            error.put("message", e.getMessage());

            return ResponseEntity
                    .status(404)
                    .body(error);
        }
    }
}