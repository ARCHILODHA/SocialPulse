package com.socialpulse.backend.controller;

import com.socialpulse.backend.model.Comment;
import com.socialpulse.backend.model.Post;
import com.socialpulse.backend.model.User;
import com.socialpulse.backend.repository.PostRepository;
import com.socialpulse.backend.repository.UserRepository;
import com.socialpulse.backend.repository.CommentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Comparator;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public AdminController(
            UserRepository userRepository,
            PostRepository postRepository,
            CommentRepository commentRepository
    ) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }


    // =========================================================
    // ADMIN DASHBOARD
    // =========================================================

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(
            Authentication authentication
    ) {

        try {

            List<User> users =
                    userRepository.findAll();

            List<Post> posts =
                    postRepository.findAll();


            // =================================================
            // BASIC STATISTICS
            // =================================================

            long totalUsers =
                    users.size();

            long totalPosts =
                    posts.size();

            long totalLikes =
                    posts.stream()
                            .mapToLong(Post::getLikesCount)
                            .sum();

            long totalComments =
                    posts.stream()
                            .mapToLong(Post::getCommentsCount)
                            .sum();


            // =================================================
            // MAIN RESPONSE
            // =================================================

            Map<String, Object> response =
                    new LinkedHashMap<>();


            response.put(
                    "message",
                    "Welcome to the Admin Dashboard"
            );

            response.put(
                    "email",
                    authentication.getName()
            );

            response.put(
                    "role",
                    "ADMIN"
            );


            // =================================================
            // STATS
            // =================================================

            Map<String, Object> stats =
                    new LinkedHashMap<>();

            stats.put(
                    "totalUsers",
                    totalUsers
            );

            stats.put(
                    "totalPosts",
                    totalPosts
            );

            stats.put(
                    "totalLikes",
                    totalLikes
            );

            stats.put(
                    "totalComments",
                    totalComments
            );

            response.put(
                    "stats",
                    stats
            );


            // =================================================
            // USER GROWTH - LAST 7 DAYS
            // =================================================

            List<Map<String, Object>> userGrowth =
                    new ArrayList<>();

            for (int i = 6; i >= 0; i--) {

                LocalDate date =
                        LocalDate.now().minusDays(i);

                long count =
                        users.stream()
                                .filter(user ->
                                        user.getCreatedAt() != null &&
                                        user.getCreatedAt()
                                                .toLocalDate()
                                                .equals(date)
                                )
                                .count();

                Map<String, Object> day =
                        new LinkedHashMap<>();

                day.put(
                        "label",
                        date.getDayOfWeek()
                                .toString()
                                .substring(0, 3)
                );

                day.put(
                        "value",
                        count
                );

                userGrowth.add(day);
            }

            response.put(
                    "userGrowth",
                    userGrowth
            );


            // =================================================
            // POST ACTIVITY - LAST 7 DAYS
            // =================================================

            List<Map<String, Object>> postActivity =
                    new ArrayList<>();

            for (int i = 6; i >= 0; i--) {

                LocalDate date =
                        LocalDate.now().minusDays(i);

                long count =
                        posts.stream()
                                .filter(post ->
                                        post.getCreatedAt() != null &&
                                        post.getCreatedAt()
                                                .toLocalDate()
                                                .equals(date)
                                )
                                .count();

                Map<String, Object> day =
                        new LinkedHashMap<>();

                day.put(
                        "label",
                        date.getDayOfWeek()
                                .toString()
                                .substring(0, 3)
                );

                day.put(
                        "value",
                        count
                );

                postActivity.add(day);
            }

            response.put(
                    "postActivity",
                    postActivity
            );


            // =================================================
            // CONTENT DISTRIBUTION
            // =================================================

            long images = 0;
            long videos = 0;
            long text = 0;


            for (Post post : posts) {

                String mediaUrl =
                        post.getImageUrl();


                if (mediaUrl == null ||
                        mediaUrl.isBlank()) {

                    text++;

                } else {

                    /*
                     * Detect video from the stored URL.
                     * This also works if mediaType is not
                     * available in an older database record.
                     */

                    String lower =
                            mediaUrl.toLowerCase();

                    if (
                            lower.endsWith(".mp4") ||
                            lower.endsWith(".webm") ||
                            lower.endsWith(".mov") ||
                            lower.endsWith(".avi") ||
                            lower.endsWith(".mkv")
                    ) {

                        videos++;

                    } else {

                        images++;
                    }
                }
            }


            Map<String, Object>
                    contentDistribution =
                    new LinkedHashMap<>();

            contentDistribution.put(
                    "images",
                    images
            );

            contentDistribution.put(
                    "videos",
                    videos
            );

            contentDistribution.put(
                    "text",
                    text
            );

            response.put(
                    "contentDistribution",
                    contentDistribution
            );


            // =================================================
            // TRENDING TOPICS
            // =================================================

            Map<String, Integer> topicCounts =
                    new HashMap<>();


            for (Post post : posts) {

                String caption =
                        post.getCaption();

                if (caption == null ||
                        caption.isBlank()) {

                    continue;
                }


                String[] words =
                        caption.split("\\s+");


                for (String word : words) {

                    word =
                            word
                                    .replaceAll(
                                            "[^a-zA-Z0-9#]",
                                            ""
                                    )
                                    .toLowerCase();


                    if (
                            word.startsWith("#") &&
                            word.length() > 1
                    ) {

                        topicCounts.put(
                                word,
                                topicCounts.getOrDefault(
                                        word,
                                        0
                                ) + 1
                        );
                    }
                }
            }


            List<Map<String, Object>> trending =
                    topicCounts.entrySet()
                            .stream()
                            .sorted(
                                    Map.Entry
                                            .<String, Integer>
                                            comparingByValue()
                                            .reversed()
                            )
                            .limit(5)
                            .map(entry -> {

                                Map<String, Object>
                                        topic =
                                        new LinkedHashMap<>();

                                topic.put(
                                        "topic",
                                        entry.getKey()
                                );

                                topic.put(
                                        "posts",
                                        entry.getValue()
                                );

                                topic.put(
                                        "engagement",
                                        entry.getValue() * 10
                                );

                                return topic;

                            })
                            .collect(
                                    Collectors.toList()
                            );


            response.put(
                    "trending",
                    trending
            );


            // =================================================
            // TOP POSTS
            // =================================================

            List<Map<String, Object>> topPosts =
                    posts.stream()

                            .sorted(
                                    Comparator.comparingInt(
                                            (Post post) ->
                                                    post.getLikesCount()
                                                            +
                                                    post.getCommentsCount()
                                    ).reversed()
                            )

                            .limit(5)

                            .map(post -> {

                                Map<String, Object>
                                        data =
                                        new LinkedHashMap<>();

                                data.put(
                                        "id",
                                        post.getId()
                                );

                                data.put(
                                        "username",
                                        post.getUsername()
                                );

                                data.put(
                                        "caption",
                                        post.getCaption()
                                );

                                data.put(
                                        "likesCount",
                                        post.getLikesCount()
                                );

                                data.put(
                                        "commentsCount",
                                        post.getCommentsCount()
                                );

                                data.put(
                                        "engagement",
                                        post.getLikesCount()
                                                +
                                        post.getCommentsCount()
                                );

                                return data;

                            })

                            .collect(
                                    Collectors.toList()
                            );


            response.put(
                    "topPosts",
                    topPosts
            );


            // =================================================
            // RECENT USERS
            // =================================================

            List<Map<String, Object>>
                    recentUsers =
                    users.stream()

                            .sorted(
                                    Comparator.comparing(
                                            User::getCreatedAt,
                                            Comparator.nullsLast(
                                                    Comparator.reverseOrder()
                                            )
                                    )
                            )

                            .limit(5)

                            .map(user -> {

                                Map<String, Object>
                                        data =
                                        new LinkedHashMap<>();

                                data.put(
                                        "id",
                                        user.getId()
                                );

                                data.put(
                                        "name",
                                        user.getName()
                                );

                                data.put(
                                        "username",
                                        user.getUsername()
                                );

                                data.put(
                                        "email",
                                        user.getEmail()
                                );

                                data.put(
                                        "role",
                                        user.getRole()
                                );

                                data.put(
                                        "createdAt",
                                        user.getCreatedAt()
                                );

                                return data;

                            })

                            .collect(
                                    Collectors.toList()
                            );


            response.put(
                    "recentUsers",
                    recentUsers
            );


            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            Map<String, Object> error =
                    new HashMap<>();

            error.put(
                    "message",
                    "Failed to load admin dashboard"
            );

            error.put(
                    "error",
                    e.getMessage()
            );

            return ResponseEntity
                    .internalServerError()
                    .body(error);
        }
    }
    // =====================================================
// GET ALL USERS
// =====================================================

@GetMapping("/users")
public ResponseEntity<?> getAllUsers() {

    try {

        List<User> users =
                userRepository.findAll();

        List<Map<String, Object>> result =
                users.stream()
                        .map(user -> {

                            Map<String, Object> data =
                                    new LinkedHashMap<>();

                            data.put(
                                    "id",
                                    user.getId()
                            );

                            data.put(
                                    "name",
                                    user.getName()
                            );

                            data.put(
                                    "username",
                                    user.getUsername()
                            );

                            data.put(
                                    "email",
                                    user.getEmail()
                            );

                            data.put(
                                    "role",
                                    user.getRole()
                            );

                            data.put(
                                    "country",
                                    user.getCountry()
                            );

                            data.put(
                                    "state",
                                    user.getState()
                            );

                            data.put(
                                    "createdAt",
                                    user.getCreatedAt()
                            );

                            return data;
                        })
                        .collect(Collectors.toList());

        return ResponseEntity.ok(result);

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .internalServerError()
                .body(
                        "Failed to load users"
                );
    }
}


// =====================================================
// DELETE USER
// =====================================================

@DeleteMapping("/users/{id}")
public ResponseEntity<?> deleteUser(
        @PathVariable String id,
        Authentication authentication
) {

    try {

        User admin =
                userRepository
                        .findByEmail(
                                authentication.getName()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Admin not found"
                                )
                        );


        // Prevent admin from deleting themselves
        if (admin.getId().equals(id)) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "You cannot delete your own admin account"
                    );
        }


        User user =
                userRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        userRepository.delete(user);


        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "User deleted successfully"
                )
        );

    } catch (RuntimeException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .internalServerError()
                .body(
                        "Failed to delete user"
                );
    }
}
// =====================================================
// GET ALL POSTS
// =====================================================

@GetMapping("/posts")
public ResponseEntity<?> getAllPosts() {

    try {

        List<Post> posts =
                postRepository.findAll();

        List<Map<String, Object>> result =
                posts.stream()
                        .sorted(
                                Comparator.comparing(
                                        Post::getCreatedAt,
                                        Comparator.nullsLast(
                                                Comparator.reverseOrder()
                                        )
                                )
                        )
                        .map(post -> {

                            Map<String, Object> data =
                                    new LinkedHashMap<>();

                            data.put("id", post.getId());
                            data.put("userId", post.getUserId());
                            data.put("username", post.getUsername());
                            data.put("caption", post.getCaption());
                            data.put("imageUrl", post.getImageUrl());
                            data.put("mediaType", post.getMediaType());
                            data.put("country", post.getCountry());
                            data.put("state", post.getState());
                            data.put("likesCount", post.getLikesCount());
                            data.put("commentsCount", post.getCommentsCount());
                            data.put("createdAt", post.getCreatedAt());

                            return data;
                        })
                        .collect(Collectors.toList());

        return ResponseEntity.ok(result);

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .internalServerError()
                .body("Failed to load posts");
    }
}


// =====================================================
// ADMIN DELETE POST
// =====================================================

@DeleteMapping("/posts/{id}")
public ResponseEntity<?> deletePost(
        @PathVariable String id
) {

    try {

        Post post =
                postRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Post not found"
                                )
                        );

        postRepository.delete(post);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Post deleted successfully"
                )
        );

    } catch (RuntimeException e) {

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .internalServerError()
                .body("Failed to delete post");
    }
}

    // =====================================================
    // GET ALL COMMENTS
    // =====================================================

    @GetMapping("/comments")
    public ResponseEntity<?> getAllComments() {

        try {

            List<Comment> comments =
                    commentRepository.findAllByOrderByCreatedAtDesc();

            return ResponseEntity.ok(comments);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to load comments");
        }
    }


    // =====================================================
    // ADMIN DELETE COMMENT
    // =====================================================

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable String id
    ) {

        try {

            Comment comment =
                    commentRepository.findById(id)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Comment not found"
                                    )
                            );

            // Keep the post's commentsCount in sync.
            postRepository.findById(
                    comment.getPostId()
            ).ifPresent(post -> {

                post.setCommentsCount(
                        Math.max(
                                0,
                                post.getCommentsCount() - 1
                        )
                );

                postRepository.save(post);
            });

            commentRepository.delete(comment);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Comment deleted successfully"
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to delete comment");
        }
    }
// =====================================================
// ADMIN ANALYTICS
// =====================================================

@GetMapping("/analytics")
public ResponseEntity<?> getAnalytics() {

    try {

        List<User> users =
                userRepository.findAll();

        List<Post> posts =
                postRepository.findAll();

        List<Comment> comments =
                commentRepository.findAll();


        // -----------------------------------------
        // BASIC COUNTS
        // -----------------------------------------

        long totalUsers = users.size();

        long totalPosts = posts.size();

        long totalComments = comments.size();


        long totalLikes =
                posts.stream()
                        .mapToLong(Post::getLikesCount)
                        .sum();


        long totalEngagement =
                totalLikes + totalComments;


        // -----------------------------------------
        // POSTS BY COUNTRY
        // -----------------------------------------

        Map<String, Long> countryStats =
                new LinkedHashMap<>();

        posts.forEach(post -> {

            String country =
                    post.getCountry();

            if (country == null ||
                    country.isBlank()) {

                country = "Unknown";
            }

            countryStats.put(
                    country,
                    countryStats.getOrDefault(
                            country,
                            0L
                    ) + 1
            );
        });


        // -----------------------------------------
        // POSTS BY STATE
        // -----------------------------------------

        Map<String, Long> stateStats =
                new LinkedHashMap<>();

        posts.forEach(post -> {

            String state =
                    post.getState();

            if (state == null ||
                    state.isBlank()) {

                state = "Unknown";
            }

            stateStats.put(
                    state,
                    stateStats.getOrDefault(
                            state,
                            0L
                    ) + 1
            );
        });


        // -----------------------------------------
        // TOP POSTS
        // -----------------------------------------

        List<Map<String, Object>> topPosts =
                new ArrayList<>();

        posts.stream()
                .sorted(
                        Comparator.comparingInt(
                                Post::getLikesCount
                        ).reversed()
                )
                .limit(5)
                .forEach(post -> {

                    Map<String, Object> item =
                            new LinkedHashMap<>();

                    item.put(
                            "id",
                            post.getId()
                    );

                    item.put(
                            "username",
                            post.getUsername()
                    );

                    item.put(
                            "caption",
                            post.getCaption()
                    );

                    item.put(
                            "likes",
                            post.getLikesCount()
                    );

                    item.put(
                            "comments",
                            post.getCommentsCount()
                    );

                    topPosts.add(item);
                });


        // -----------------------------------------
        // RESPONSE
        // -----------------------------------------

        Map<String, Object> analytics =
                new LinkedHashMap<>();

        analytics.put(
                "totalUsers",
                totalUsers
        );

        analytics.put(
                "totalPosts",
                totalPosts
        );

        analytics.put(
                "totalComments",
                totalComments
        );

        analytics.put(
                "totalLikes",
                totalLikes
        );

        analytics.put(
                "totalEngagement",
                totalEngagement
        );

        analytics.put(
                "countryStats",
                countryStats
        );

        analytics.put(
                "stateStats",
                stateStats
        );

        analytics.put(
                "topPosts",
                topPosts
        );


        return ResponseEntity.ok(
                analytics
        );

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .internalServerError()
                .body(
                        "Failed to load analytics"
                );
    }
}
}