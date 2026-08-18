package com.socialpulse.backend.controller;

import com.socialpulse.backend.dto.LoginRequest;
import com.socialpulse.backend.dto.RegisterRequest;
import com.socialpulse.backend.model.User;
import com.socialpulse.backend.service.JwtService;
import com.socialpulse.backend.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    // ============================
    // REGISTER
    // ============================

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        try {

            User user = userService.registerUser(request);

            Map<String, Object> response = new HashMap<>();

            response.put("message", "User registered successfully");
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {

            Map<String, String> error = new HashMap<>();

            error.put("message", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error);
        }
    }

    // ============================
    // LOGIN
    // ============================

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {

            User user = userService.loginUser(
                    request.getEmail(),
                    request.getPassword()
            );

            // Generate JWT
            String token = jwtService.generateToken(
                    user.getEmail(),
                    user.getRole()
            );

            Map<String, Object> response = new HashMap<>();

            response.put("message", "Login successful");
            response.put("token", token);
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
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(error);
        }
    }
}