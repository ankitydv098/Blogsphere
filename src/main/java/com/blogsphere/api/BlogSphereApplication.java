package com.blogsphere.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * BlogSphere API - Main Application Entry Point
 *
 * <p>A production-quality Spring Boot REST API for a blogging platform
 * featuring JWT authentication, role-based access control, and full
 * CRUD operations for posts, categories, and comments.</p>
 *
 * @author BlogSphere Team
 * @version 1.0.0
 */
@SpringBootApplication
public class BlogSphereApplication {

    public static void main(String[] args) {
        SpringApplication.run(BlogSphereApplication.class, args);
    }
}
