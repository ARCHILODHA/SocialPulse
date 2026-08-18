package com.socialpulse.backend.controller;

import com.socialpulse.backend.service.SavedPostService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/saved")
@CrossOrigin(origins = "*")
public class SavedPostController {

    private final SavedPostService savedPostService;

    public SavedPostController(
            SavedPostService savedPostService
    ) {
        this.savedPostService =
                savedPostService;
    }

    @PostMapping("/{postId}")
    public ResponseEntity<?> toggleSave(
            @PathVariable String postId,
            Authentication authentication
    ) {

        try {

            boolean saved =
                    savedPostService.toggleSave(
                            postId,
                            authentication.getName()
                    );

            return ResponseEntity.ok(
                    Map.of("saved", saved)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/{postId}/status")
    public ResponseEntity<?> getStatus(
            @PathVariable String postId,
            Authentication authentication
    ) {

        boolean saved =
                savedPostService.isSaved(
                        postId,
                        authentication.getName()
                );

        return ResponseEntity.ok(
                Map.of("saved", saved)
        );
    }

    @GetMapping
    public ResponseEntity<?> getSaved(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                savedPostService.getSavedPosts(
                        authentication.getName()
                )
        );
    }
}
