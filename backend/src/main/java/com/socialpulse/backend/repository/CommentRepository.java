package com.socialpulse.backend.repository;

import com.socialpulse.backend.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository
        extends MongoRepository<Comment, String> {

    // Comments for a specific post
    List<Comment> findByPostIdOrderByCreatedAtDesc(
            String postId
    );

    // All comments for Admin Dashboard
    List<Comment> findAllByOrderByCreatedAtDesc();
}