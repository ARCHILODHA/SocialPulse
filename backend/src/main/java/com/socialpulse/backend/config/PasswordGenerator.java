package com.socialpulse.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Component
public class PasswordGenerator implements CommandLineRunner {

    @Override
    public void run(String... args) {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        String password = "Admin@123";

        String hash = encoder.encode(password);

        System.out.println();
        System.out.println("========================================");
        System.out.println("PASSWORD: " + password);
        System.out.println("BCrypt HASH:");
        System.out.println(hash);
        System.out.println("========================================");
        System.out.println();
    }
}