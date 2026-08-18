package com.socialpulse.backend.controller;

import com.socialpulse.backend.model.Post;
import com.socialpulse.backend.service.PostService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }


    // =========================================
    // CREATE POST
    // Supports text + photo + video
    // =========================================

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createPost(

            @RequestParam(required = false)
            String caption,

            @RequestParam(required = false)
            MultipartFile file,

            @RequestParam(required = false)
            String country,

            @RequestParam(required = false)
            String state,

            Authentication authentication
    ) {

        try {

            String email = authentication.getName();

            Post post = postService.createPost(
                    caption,
                    file,
                    country,
                    state,
                    email
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(post);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =========================================
    // GET ALL POSTS / FEED
    // =========================================

    @GetMapping
    public ResponseEntity<List<Post>> getFeed() {

        return ResponseEntity.ok(
                postService.getFeed()
        );
    }


    // =========================================
    // GET SINGLE POST
    // =========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getPost(
            @PathVariable String id
    ) {

        try {

            return ResponseEntity.ok(
                    postService.getPostById(id)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }


    // =========================================
    // GET POSTS OF USER
    // =========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getUserPosts(
            @PathVariable String userId
    ) {

        return ResponseEntity.ok(
                postService.getPostsByUser(userId)
        );
    }


    // =========================================
    // LIKE / UNLIKE
    // =========================================

    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(

            @PathVariable String id,

            Authentication authentication
    ) {

        try {

            String email = authentication.getName();

            Post post = postService.toggleLike(
                    id,
                    email
            );

            return ResponseEntity.ok(post);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }


    // =========================================
    // DELETE POST
    // =========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(

            @PathVariable String id,

            Authentication authentication
    ) {

        try {

            String email = authentication.getName();

            postService.deletePost(
                    id,
                    email
            );

            return ResponseEntity.ok(
                    "Post deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}