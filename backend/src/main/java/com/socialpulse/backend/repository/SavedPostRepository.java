package com.socialpulse.backend.repository;

import com.socialpulse.backend.model.SavedPost;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SavedPostRepository
        extends MongoRepository<SavedPost, String> {

    Optional<SavedPost> findByUserIdAndPostId(
            String userId,
            String postId
    );

    boolean existsByUserIdAndPostId(
            String userId,
            String postId
    );

    List<SavedPost> findByUserIdOrderByCreatedAtDesc(
            String userId
    );
}
