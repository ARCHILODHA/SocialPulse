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
    

    // Folder where uploaded photos/videos will be stored
    private final Path uploadDirectory =
            Paths.get("uploads");

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository
    ) {

        this.postRepository = postRepository;
        this.userRepository = userRepository;

        try {

            Files.createDirectories(uploadDirectory);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not create uploads directory"
            );
        }
    }


    // ============================
    // CREATE POST
    // ============================

    public Post createPost(
            String caption,
            MultipartFile file,
            String country,
            String state,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        String mediaUrl = null;
        String mediaType = null;


        // ============================
        // HANDLE PHOTO / VIDEO
        // ============================

        if (file != null && !file.isEmpty()) {

            try {

                String originalFilename =
                        file.getOriginalFilename();

                String extension = "";

                if (originalFilename != null &&
                        originalFilename.contains(".")) {

                    extension =
                            originalFilename.substring(
                                    originalFilename.lastIndexOf(".")
                            );
                }


                // Generate unique filename
                String filename =
                        UUID.randomUUID()
                                .toString()
                                + extension;


                Path filePath =
                        uploadDirectory.resolve(filename);


                // Save file
                Files.copy(
                        file.getInputStream(),
                        filePath
                );


                // URL that frontend will use
                mediaUrl =
                        "/uploads/" + filename;


                // Detect media type
                String contentType =
                        file.getContentType();


                if (contentType != null &&
                        contentType.startsWith("video")) {

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


        // ============================
        // CREATE POST OBJECT
        // ============================

        Post post = new Post();

        post.setUserId(user.getId());

        post.setUsername(
                user.getUsername()
        );

        post.setCaption(caption);

        // Stores photo/video URL
        post.setImageUrl(mediaUrl);

        // Stores IMAGE or VIDEO
        post.setMediaType(mediaType);

        post.setCountry(country);

        post.setState(state);

        post.setLikesCount(0);

        post.setCommentsCount(0);

        post.setCreatedAt(
                LocalDateTime.now()
        );

        post.setUpdatedAt(
                LocalDateTime.now()
        );


        return postRepository.save(post);
    }


    // ============================
    // GET FEED
    // ============================

    public List<Post> getFeed() {

        return postRepository
                .findAllByOrderByCreatedAtDesc();
    }


    // ============================
    // GET SINGLE POST
    // ============================

    public Post getPostById(String id) {

        return postRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Post not found"
                        )
                );
    }


    // ============================
    // GET USER POSTS
    // ============================

    public List<Post> getPostsByUser(
            String userId
    ) {

        return postRepository
                .findByUserIdOrderByCreatedAtDesc(
                        userId
                );
    }


    // ============================
    // LIKE / UNLIKE
    // ============================

    public Post toggleLike(
            String postId,
            String email
    ) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Post not found"
                        )
                );


        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );


        String userId = user.getId();


        if (post.getLikedBy().contains(userId)) {

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


    // ============================
    // DELETE POST
    // ============================

    public void deletePost(
            String postId,
            String email
    ) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Post not found"
                        )
                );


        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );


        // Only owner can delete
        if (!post.getUserId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You can only delete your own posts"
            );
        }


        // Delete uploaded media file
        if (post.getImageUrl() != null &&
                !post.getImageUrl().isBlank()) {

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

                Files.deleteIfExists(filePath);

            } catch (IOException e) {

                System.out.println(
                        "Could not delete media file"
                );
            }
        }


        // Delete post from MongoDB
        postRepository.delete(post);
    }
}