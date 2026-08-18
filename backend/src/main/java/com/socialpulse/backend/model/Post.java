package com.socialpulse.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "posts")
public class Post {

    @Id
    private String id;

    private String userId;
    private String username;

    private String caption;
    private String imageUrl;

    // IMAGE or VIDEO
    private String mediaType;

    private String country;
    private String state;

    private int likesCount;
    private int commentsCount;

    private List<String> likedBy = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    // =========================================
    // DEFAULT CONSTRUCTOR
    // =========================================

    public Post() {
    }


    // =========================================
    // EXISTING CONSTRUCTOR
    // =========================================

    public Post(
            String userId,
            String username,
            String caption,
            String imageUrl,
            String country,
            String state
    ) {

        this.userId = userId;
        this.username = username;
        this.caption = caption;
        this.imageUrl = imageUrl;
        this.country = country;
        this.state = state;

        this.likesCount = 0;
        this.commentsCount = 0;

        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }


    // =========================================
    // ID
    // =========================================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    // =========================================
    // USER ID
    // =========================================

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }


    // =========================================
    // USERNAME
    // =========================================

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }


    // =========================================
    // CAPTION
    // =========================================

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }


    // =========================================
    // MEDIA URL
    // =========================================

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }


    // =========================================
    // MEDIA TYPE
    // IMAGE / VIDEO
    // =========================================

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }


    // =========================================
    // COUNTRY
    // =========================================

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }


    // =========================================
    // STATE
    // =========================================

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }


    // =========================================
    // LIKES
    // =========================================

    public int getLikesCount() {
        return likesCount;
    }

    public void setLikesCount(int likesCount) {
        this.likesCount = likesCount;
    }


    // =========================================
    // COMMENTS
    // =========================================

    public int getCommentsCount() {
        return commentsCount;
    }

    public void setCommentsCount(int commentsCount) {
        this.commentsCount = commentsCount;
    }


    // =========================================
    // LIKED BY
    // =========================================

    public List<String> getLikedBy() {
        return likedBy;
    }

    public void setLikedBy(List<String> likedBy) {
        this.likedBy = likedBy;
    }


    // =========================================
    // CREATED AT
    // =========================================

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    // =========================================
    // UPDATED AT
    // =========================================

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}