package com.socialpulse.backend.controller;

import com.socialpulse.backend.dto.CommentRequest;
import com.socialpulse.backend.model.Comment;
import com.socialpulse.backend.service.CommentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable String postId,
            @RequestBody CommentRequest request,
            Authentication authentication
    ) {

        try {

            Comment comment = commentService.addComment(
                    postId,
                    request,
                    authentication.getName()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(comment);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<Comment>> getComments(
            @PathVariable String postId
    ) {

        return ResponseEntity.ok(
                commentService.getComments(postId)
        );
    }
}
