package com.blogsphere.api.utils;

import com.blogsphere.api.entity.*;
import com.blogsphere.api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/**
 * Database seeder that runs automatically on application startup.
 *
 * <p>Populates the database with sample data if it's empty:
 * <ul>
 *   <li>2 roles (ROLE_USER, ROLE_ADMIN)</li>
 *   <li>1 admin account</li>
 *   <li>5 normal user accounts</li>
 *   <li>5 categories (Java, Spring Boot, Technology, AI, Programming)</li>
 *   <li>20 realistic blog posts</li>
 *   <li>50 random comments distributed across posts</li>
 * </ul>
 * </p>
 *
 * <p>GitHub reviewers can test the project immediately without manually adding data.</p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository     roleRepository;
    private final UserRepository     userRepository;
    private final CategoryRepository categoryRepository;
    private final PostRepository     postRepository;
    private final CommentRepository  commentRepository;
    private final PasswordEncoder    passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() > 0) {
            log.info("Database already seeded. Skipping data seeder.");
            return;
        }

        log.info("========== Starting BlogSphere Data Seeder ==========");

        // ── Roles ──────────────────────────────────────────────────────────────
        Role adminRole = roleRepository.save(Role.builder().roleName(AppConstants.ROLE_ADMIN).build());
        Role userRole  = roleRepository.save(Role.builder().roleName(AppConstants.ROLE_USER).build());
        log.info("Roles created: ROLE_ADMIN, ROLE_USER");

        // ── Admin User ─────────────────────────────────────────────────────────
        User admin = userRepository.save(User.builder()
                .name("Admin User")
                .email("admin@blogsphere.com")
                .password(passwordEncoder.encode("admin@123"))
                .roles(Set.of(adminRole, userRole))
                .build());
        log.info("Admin created: admin@blogsphere.com / admin@123");

        // ── Normal Users ───────────────────────────────────────────────────────
        List<User> users = userRepository.saveAll(List.of(
            buildUser("Aarav Sharma",     "aarav@blogsphere.com",   "password123", userRole),
            buildUser("Priya Patel",      "priya@blogsphere.com",   "password123", userRole),
            buildUser("Rohan Gupta",      "rohan@blogsphere.com",   "password123", userRole),
            buildUser("Sneha Verma",      "sneha@blogsphere.com",   "password123", userRole),
            buildUser("Kiran Reddy",      "kiran@blogsphere.com",   "password123", userRole)
        ));
        log.info("5 users created");

        // ── Categories ─────────────────────────────────────────────────────────
        List<Category> categories = categoryRepository.saveAll(List.of(
            Category.builder().categoryName("Java")
                    .description("Core Java, OOP, Collections, Streams, and Modern Java features").build(),
            Category.builder().categoryName("Spring Boot")
                    .description("Spring Boot 3.x, Spring Security, Spring Data JPA tutorials").build(),
            Category.builder().categoryName("Technology")
                    .description("Latest trends in software engineering and tech industry news").build(),
            Category.builder().categoryName("Artificial Intelligence")
                    .description("Machine learning, deep learning, LLMs, and AI applications").build(),
            Category.builder().categoryName("Programming")
                    .description("General programming concepts, design patterns, and best practices").build()
        ));
        log.info("5 categories created");

        Category javaCat    = categories.get(0);
        Category springCat  = categories.get(1);
        Category techCat    = categories.get(2);
        Category aiCat      = categories.get(3);
        Category progCat    = categories.get(4);

        // ── Blog Posts ─────────────────────────────────────────────────────────
        List<Post> posts = postRepository.saveAll(List.of(

            // Java Category
            buildPost("Complete Java 21 Features Roadmap",
                "Java 21 brings exciting features like Virtual Threads (Project Loom), " +
                "Record Patterns, Sequenced Collections, and String Templates. " +
                "Virtual Threads make writing highly concurrent applications effortless. " +
                "Record Patterns extend pattern matching to allow deconstruction of record values. " +
                "In this guide, we cover every major feature with practical code examples " +
                "so you can modernize your Java codebase today.",
                admin, javaCat),

            buildPost("Java OOP Concepts Every Developer Must Know",
                "Object-Oriented Programming is the backbone of Java. Understanding the four pillars — " +
                "Encapsulation, Inheritance, Polymorphism, and Abstraction — is crucial for writing " +
                "clean, maintainable code. We also explore SOLID principles and how they apply " +
                "to real-world Java applications.",
                users.get(0), javaCat),

            buildPost("Java Collections Framework Deep Dive",
                "The Java Collections Framework provides a unified architecture for storing and " +
                "manipulating groups of objects. From ArrayList to HashMap, LinkedList to TreeSet, " +
                "choosing the right data structure significantly impacts performance. " +
                "This guide covers time complexity, thread safety, and practical use cases.",
                users.get(1), javaCat),

            buildPost("Java Stream API: From Beginner to Advanced",
                "Java Streams are one of the most powerful features introduced in Java 8. " +
                "They allow functional-style operations on collections. In this article, " +
                "we explore map, filter, reduce, collect, flatMap, and terminal operations " +
                "with real-world examples. We also compare performance with traditional loops.",
                users.get(2), javaCat),

            // Spring Boot Category
            buildPost("Understanding JWT Authentication in Spring Boot",
                "JSON Web Tokens (JWT) provide a stateless, secure way to authenticate API requests. " +
                "In this comprehensive guide, we build a complete JWT authentication system " +
                "using Spring Boot 3.x and Spring Security 6. We cover token generation, " +
                "validation, refresh tokens, and best practices for production deployments.",
                admin, springCat),

            buildPost("Spring Boot 3 REST API Best Practices",
                "Building production-quality REST APIs with Spring Boot 3 requires following " +
                "established patterns and conventions. We cover API versioning, error handling " +
                "with @ControllerAdvice, input validation with Bean Validation, DTOs, " +
                "pagination, and Swagger documentation. A must-read for every Spring developer.",
                users.get(0), springCat),

            buildPost("Spring Data JPA — One-to-Many and Many-to-Many Relationships",
                "Understanding JPA relationships is essential for building relational database " +
                "backed applications. This guide explains @OneToMany, @ManyToOne, @ManyToMany, " +
                "and @OneToOne with practical examples. We also cover fetch types, cascade, " +
                "orphan removal, and how to avoid N+1 query problems.",
                users.get(1), springCat),

            buildPost("Spring Security 6 — Complete Role-Based Access Control",
                "Spring Security 6 introduces a new configuration model without the deprecated " +
                "WebSecurityConfigurerAdapter. In this tutorial, we configure RBAC using " +
                "@EnableMethodSecurity, @PreAuthorize, and SecurityFilterChain. " +
                "We implement ROLE_USER, ROLE_ADMIN, and custom permission logic.",
                users.get(3), springCat),

            buildPost("Building Microservices with Spring Boot and Spring Cloud",
                "Microservices architecture breaks large monolithic applications into small, " +
                "independently deployable services. This guide covers service discovery with Eureka, " +
                "API Gateway with Spring Cloud Gateway, inter-service communication with Feign Client, " +
                "and distributed configuration with Spring Cloud Config.",
                admin, springCat),

            // Technology Category
            buildPost("Docker for Java Developers — Complete Guide",
                "Docker enables you to package your Java application with all its dependencies " +
                "into a lightweight container. We cover writing a Dockerfile, multi-stage builds " +
                "to minimize image size, docker-compose for local development, and deploying " +
                "containers to cloud platforms like AWS and Google Cloud Run.",
                users.get(2), techCat),

            buildPost("Introduction to Microservices Architecture",
                "Microservices is an architectural approach where an application is built as " +
                "a collection of small, loosely coupled services. Each service runs in its own " +
                "process and communicates over HTTP or messaging queues. We discuss the benefits, " +
                "trade-offs, and when to choose microservices over a monolith.",
                users.get(3), techCat),

            buildPost("System Design: Building a Scalable Blog Platform",
                "Designing a blog platform at scale requires careful consideration of database " +
                "sharding, caching strategies, CDN for static assets, and message queues for " +
                "async processing. This article walks through the architecture decisions behind " +
                "a Medium-like platform handling millions of daily active users.",
                users.get(4), techCat),

            buildPost("DevOps Roadmap for Java Developers",
                "Modern Java developers are expected to understand DevOps practices. This roadmap " +
                "covers CI/CD pipelines with GitHub Actions and Jenkins, container orchestration " +
                "with Kubernetes, infrastructure as code with Terraform, monitoring with " +
                "Prometheus and Grafana, and cloud platforms (AWS, Azure, GCP).",
                admin, techCat),

            buildPost("Tech Innovations and Engineering Growth in India",
                "India has emerged as one of the world's premier tech hubs, producing world-class " +
                "software engineering talent in Java, Spring Boot, microservices, and AI. " +
                "From unicorn startups in Bengaluru to global engineering centers in Hyderabad and Pune, " +
                "the tech landscape in India continues to accelerate rapidly.",
                users.get(0), techCat),

            // AI Category
            buildPost("Getting Started with Machine Learning in Java",
                "While Python dominates the ML landscape, Java has excellent ML libraries " +
                "including Weka, Deeplearning4j, and Tribuo. We demonstrate training a simple " +
                "classification model in Java, evaluating performance metrics, and integrating " +
                "the model into a Spring Boot REST API endpoint.",
                users.get(0), aiCat),

            buildPost("Understanding Large Language Models (LLMs)",
                "Large Language Models like GPT-4 and Gemini have revolutionized AI. " +
                "We explain how transformers work, what attention mechanisms do, " +
                "and why these models can perform a wide variety of language tasks. " +
                "We also discuss fine-tuning, prompt engineering, and RAG architectures.",
                users.get(1), aiCat),

            buildPost("Spring AI: Building AI-Powered Java Applications",
                "Spring AI brings AI capabilities to the Spring ecosystem, enabling Java developers " +
                "to integrate OpenAI, Google Gemini, and other LLM providers into their applications. " +
                "We build a chatbot, document summarizer, and semantic search engine " +
                "using Spring AI's fluent API.",
                users.get(4), aiCat),

            // Programming Category
            buildPost("SOLID Principles with Real Java Examples",
                "SOLID is an acronym for five design principles that make software more " +
                "maintainable and extensible. Single Responsibility, Open/Closed, " +
                "Liskov Substitution, Interface Segregation, and Dependency Inversion. " +
                "We demonstrate each principle with Java code showing the before and after.",
                users.get(2), progCat),

            buildPost("Design Patterns Every Java Developer Should Know",
                "Design patterns are reusable solutions to commonly occurring problems in software design. " +
                "We cover the most important patterns: Singleton, Factory, Builder, Observer, " +
                "Strategy, Decorator, and Proxy — all implemented in Java with practical examples " +
                "from popular frameworks like Spring and Hibernate.",
                users.get(3), progCat),

            buildPost("Clean Code Principles for Java Developers",
                "Writing clean code is about writing code that is easy to read, understand, and maintain. " +
                "Based on Robert C. Martin's Clean Code, we apply these principles to Java: " +
                "meaningful names, small functions, avoiding comments as excuses, " +
                "error handling, and unit testing.",
                users.get(4), progCat),

            buildPost("Git and GitHub: Professional Workflow for Developers",
                "Every professional developer needs to master Git. Beyond basic add, commit, push — " +
                "we cover branching strategies (Git Flow, Trunk-Based Development), " +
                "pull request best practices, squashing commits, cherry-picking, " +
                "rebasing, and resolving complex merge conflicts.",
                users.get(0), progCat)
        ));
        log.info("20 blog posts created");

        // ── Comments ───────────────────────────────────────────────────────────
        List<String> commentTexts = List.of(
            "Great article! Really helped me understand the concept.",
            "Thanks for the clear explanation with examples.",
            "I've been struggling with this topic. This cleared it up!",
            "Could you write a follow-up on advanced topics?",
            "Excellent writing style. Very easy to follow.",
            "Bookmarked! Will refer back to this often.",
            "The code examples are very practical and useful.",
            "I implemented this in my project and it worked perfectly!",
            "Best explanation I've found on this topic.",
            "Please keep writing more articles like this!"
        );

        int commentCount = 0;
        List<User> allUsers = userRepository.findAll();

        for (int i = 0; i < posts.size() && commentCount < 50; i++) {
            Post post = posts.get(i);
            int commentsForPost = (i < 5) ? 4 : 2; // First 5 posts get 4 comments, rest get 2

            for (int j = 0; j < commentsForPost && commentCount < 50; j++) {
                User commenter = allUsers.get((i + j) % allUsers.size());
                String text    = commentTexts.get((i + j) % commentTexts.size());

                commentRepository.save(Comment.builder()
                        .content(text)
                        .post(post)
                        .user(commenter)
                        .build());
                commentCount++;
            }
        }
        log.info("{} comments created", commentCount);
        log.info("========== Data Seeder Complete ==========");
        log.info("Admin Login  → admin@blogsphere.com  / admin@123");
        log.info("User Login   → aarav@blogsphere.com  / password123");
        log.info("Swagger UI   → http://localhost:8080/swagger-ui.html");
    }

    // ======================== PRIVATE HELPERS ========================

    private User buildUser(String name, String email, String rawPassword, Role role) {
        return User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .roles(Set.of(role))
                .build();
    }

    private Post buildPost(String title, String content, User user, Category category) {
        return Post.builder()
                .title(title)
                .content(content)
                .imageName(AppConstants.DEFAULT_IMAGE)
                .user(user)
                .category(category)
                .build();
    }
}
