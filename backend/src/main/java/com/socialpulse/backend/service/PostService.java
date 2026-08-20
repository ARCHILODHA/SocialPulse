package com.socialpulse.backend.service;

import com.socialpulse.backend.model.Post;
import com.socialpulse.backend.model.User;
import com.socialpulse.backend.repository.PostRepository;
import com.socialpulse.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // Folder for uploaded photos/videos
    private final Path uploadDirectory =
            Paths.get("uploads");


    // =========================================
    // CONSTRUCTOR
    // =========================================

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository
    ) {

        this.postRepository = postRepository;
        this.userRepository = userRepository;

        try {

            Files.createDirectories(
                    uploadDirectory
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not create uploads directory"
            );
        }
    }


    // =========================================
    // CREATE POST
    // =========================================

    public Post createPost(
            String caption,
            MultipartFile file,
            String country,
            String state,
            String email
    ) {

        // =====================================
        // FIND USER
        // =====================================

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        // =====================================
        // LOCATION
        // =====================================

        /*
         * ALWAYS store a location.
         *
         * Priority:
         *
         * 1. Location sent by frontend
         * 2. User's saved location
         * 3. India / Karnataka fallback
         */

        String finalCountry =
                country != null &&
                !country.trim().isEmpty()
                        ? country.trim()
                        : user.getCountry();

        String finalState =
                state != null &&
                !state.trim().isEmpty()
                        ? state.trim()
                        : user.getState();


        // Final fallback
        if (
                finalCountry == null ||
                finalCountry.trim().isEmpty()
        ) {

            finalCountry = "India";

        }


        if (
                finalState == null ||
                finalState.trim().isEmpty()
        ) {

            finalState = "Karnataka";

        }


        // =====================================
        // MEDIA VARIABLES
        // =====================================

        String mediaUrl = null;
        String mediaType = null;


        // =====================================
        // HANDLE PHOTO / VIDEO
        // =====================================

        if (
                file != null &&
                !file.isEmpty()
        ) {

            try {

                String originalFilename =
                        file.getOriginalFilename();


                String extension = "";


                if (
                        originalFilename != null &&
                        originalFilename.contains(".")
                ) {

                    extension =
                            originalFilename.substring(
                                    originalFilename
                                            .lastIndexOf(".")
                            );

                }


                // Generate unique filename
                String filename =
                        UUID.randomUUID()
                                .toString()
                                + extension;


                Path filePath =
                        uploadDirectory.resolve(
                                filename
                        );


                // Save file
                Files.copy(
                        file.getInputStream(),
                        filePath
                );


                // URL stored in MongoDB
                mediaUrl =
                        "/uploads/" + filename;


                // Detect IMAGE / VIDEO
                String contentType =
                        file.getContentType();


                if (
                        contentType != null &&
                        contentType.startsWith("video")
                ) {

                    mediaType = "VIDEO";

                } else {

                    mediaType = "IMAGE";

                }

            } catch (IOException e) {

                throw new RuntimeException(
                        "Failed to upload media"
                );
            }
        }


        // =====================================
        // CREATE POST
        // =====================================

        Post post = new Post();


        post.setUserId(
                user.getId()
        );


        post.setUsername(
                user.getUsername()
        );


        post.setCaption(
                caption
        );


        // Photo / video URL
        post.setImageUrl(
                mediaUrl
        );


        // IMAGE / VIDEO
        post.setMediaType(
                mediaType
        );


        // =====================================
        // SAVE LOCATION
        // =====================================

        post.setCountry(
                finalCountry
        );


        post.setState(
                finalState
        );


        // =====================================
        // COUNTS
        // =====================================

        post.setLikesCount(0);

        post.setCommentsCount(0);


        // =====================================
        // DATES
        // =====================================

        post.setCreatedAt(
                LocalDateTime.now()
        );

        post.setUpdatedAt(
                LocalDateTime.now()
        );


        // =====================================
        // DEBUG
        // =====================================

        System.out.println(
                "================================="
        );

        System.out.println(
                "Creating Post"
        );

        System.out.println(
                "User: " +
                user.getUsername()
        );

        System.out.println(
                "Country: " +
                finalCountry
        );

        System.out.println(
                "State: " +
                finalState
        );

        System.out.println(
                "Media URL: " +
                mediaUrl
        );

        System.out.println(
                "Media Type: " +
                mediaType
        );

        System.out.println(
                "================================="
        );


        // =====================================
        // SAVE TO MONGODB
        // =====================================

        return postRepository.save(post);
    }


    // =========================================
    // GET FEED
    // =========================================

    public List<Post> getFeed() {

        return postRepository
                .findAllByOrderByCreatedAtDesc();
    }


    // =========================================
    // GET SINGLE POST
    // =========================================

    public Post getPostById(
            String id
    ) {

        return postRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Post not found"
                        )
                );
    }


    // =========================================
    // GET USER POSTS
    // =========================================

    public List<Post> getPostsByUser(
            String userId
    ) {

        return postRepository
                .findByUserIdOrderByCreatedAtDesc(
                        userId
                );
    }


    // =========================================
    // LIKE / UNLIKE
    // =========================================

    public Post toggleLike(
            String postId,
            String email
    ) {

        Post post =
                postRepository
                        .findById(postId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Post not found"
                                )
                        );


        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        String userId =
                user.getId();


        if (
                post.getLikedBy()
                        .contains(userId)
        ) {

            // UNLIKE

            post.getLikedBy()
                    .remove(userId);


            post.setLikesCount(
                    Math.max(
                            0,
                            post.getLikesCount() - 1
                    )
            );

        } else {

            // LIKE

            post.getLikedBy()
                    .add(userId);


            post.setLikesCount(
                    post.getLikesCount() + 1
            );

        }


        post.setUpdatedAt(
                LocalDateTime.now()
        );


        return postRepository.save(post);
    }


    // =========================================
    // DELETE POST
    // =========================================

    public void deletePost(
            String postId,
            String email
    ) {

        Post post =
                postRepository
                        .findById(postId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Post not found"
                                )
                        );


        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        // Only owner can delete
        if (
                !post.getUserId()
                        .equals(user.getId())
        ) {

            throw new RuntimeException(
                    "You can only delete your own posts"
            );
        }


        // =====================================
        // DELETE MEDIA FILE
        // =====================================

        if (
                post.getImageUrl() != null &&
                !post.getImageUrl().isBlank()
        ) {

            try {

                String filename =
                        post.getImageUrl()
                                .replace(
                                        "/uploads/",
                                        ""
                                );


                Path filePath =
                        uploadDirectory.resolve(
                                filename
                        );


                Files.deleteIfExists(
                        filePath
                );

            } catch (IOException e) {

                System.out.println(
                        "Could not delete media file"
                );
            }
        }


        // =====================================
        // DELETE POST
        // =====================================

        postRepository.delete(post);
    }
}