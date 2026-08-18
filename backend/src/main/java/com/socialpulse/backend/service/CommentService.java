package com.socialpulse.backend.service;

import com.socialpulse.backend.dto.CommentRequest;
import com.socialpulse.backend.model.Comment;
import com.socialpulse.backend.model.Post;
import com.socialpulse.backend.model.User;
import com.socialpulse.backend.repository.CommentRepository;
import com.socialpulse.backend.repository.PostRepository;
import com.socialpulse.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;


    public CommentService(
            CommentRepository commentRepository,
            PostRepository postRepository,
            UserRepository userRepository,
            NotificationService notificationService
    ) {

        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }


    // =========================================
    // ADD COMMENT
    // =========================================

    public Comment addComment(
            String postId,
            CommentRequest request,
            String email
    ) {

        Post post =
                postRepository.findById(postId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Post not found"
                                ));


        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));


        // =====================================
        // CREATE COMMENT
        // =====================================

        Comment comment = new Comment(
                post.getId(),
                user.getId(),
                user.getUsername(),
                request.getText()
        );


        // =====================================
        // UPDATE COMMENT COUNT
        // =====================================

        post.setCommentsCount(
                post.getCommentsCount() + 1
        );

        postRepository.save(post);


        // =====================================
        // SAVE COMMENT
        // =====================================

        Comment savedComment =
                commentRepository.save(comment);


        // =====================================
        // CREATE NOTIFICATION
        // =====================================

        notificationService.createNotification(

                post.getUserId(),

                user.getId(),

                user.getUsername(),

                "COMMENT",

                user.getUsername()
                        + " commented on your post",

                post.getId()
        );


        return savedComment;
    }


    // =========================================
    // GET COMMENTS
    // =========================================

    public List<Comment> getComments(
            String postId
    ) {

        return commentRepository
                .findByPostIdOrderByCreatedAtDesc(
                        postId
                );
    }
}