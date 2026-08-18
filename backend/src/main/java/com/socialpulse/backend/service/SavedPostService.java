package com.socialpulse.backend.service;

import com.socialpulse.backend.model.Post;
import com.socialpulse.backend.model.SavedPost;
import com.socialpulse.backend.model.User;
import com.socialpulse.backend.repository.PostRepository;
import com.socialpulse.backend.repository.SavedPostRepository;
import com.socialpulse.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SavedPostService {

    private final SavedPostRepository savedPostRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public SavedPostService(
            SavedPostRepository savedPostRepository,
            UserRepository userRepository,
            PostRepository postRepository
    ) {
        this.savedPostRepository = savedPostRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    // =========================================
    // SAVE / UNSAVE
    // =========================================

    public boolean toggleSave(
            String postId,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        postRepository.findById(postId)
                .orElseThrow(() ->
                        new RuntimeException("Post not found"));

        var existing =
                savedPostRepository.findByUserIdAndPostId(
                        user.getId(),
                        postId
                );

        if (existing.isPresent()) {

            savedPostRepository.delete(
                    existing.get()
            );

            return false;
        }

        savedPostRepository.save(
                new SavedPost(
                        user.getId(),
                        postId
                )
        );

        return true;
    }


    // =========================================
    // CHECK SAVED STATUS
    // =========================================

    public boolean isSaved(
            String postId,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return savedPostRepository
                .existsByUserIdAndPostId(
                        user.getId(),
                        postId
                );
    }


    // =========================================
    // GET SAVED POSTS
    // =========================================

    public List<Post> getSavedPosts(
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<SavedPost> savedPosts =
                savedPostRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                user.getId()
                        );

        List<Post> posts = new ArrayList<>();

        for (SavedPost savedPost : savedPosts) {

            postRepository
                    .findById(savedPost.getPostId())
                    .ifPresent(posts::add);
        }

        return posts;
    }
}