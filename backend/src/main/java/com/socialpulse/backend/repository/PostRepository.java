package com.socialpulse.backend.repository;

import com.socialpulse.backend.model.Post;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {

    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Post> findByCountry(String country);

    List<Post> findByState(String state);
}
