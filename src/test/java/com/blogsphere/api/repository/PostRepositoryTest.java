package com.blogsphere.api.repository;

import com.blogsphere.api.entity.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Repository tests for {@link PostRepository}.
 *
 * <p>Uses @DataJpaTest with H2 in-memory database.
 * Tests cover custom JPQL queries for search and filtering.</p>
 */
@DataJpaTest
@ActiveProfiles("test")
@DisplayName("PostRepository Integration Tests")
class PostRepositoryTest {

    @Autowired private PostRepository     postRepository;
    @Autowired private UserRepository     userRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private RoleRepository     roleRepository;

    private User     testUser;
    private Category javaCategory;
    private Category springCategory;

    @BeforeEach
    void setUp() {
        // Create role and user
        Role role = roleRepository.save(Role.builder().roleName("ROLE_USER").build());
        testUser = userRepository.save(User.builder()
                .name("Test User")
                .email("test@blogsphere.com")
                .password("password")
                .roles(Set.of(role))
                .build());

        // Create categories
        javaCategory   = categoryRepository.save(
                Category.builder().categoryName("Java").description("Java content").build());
        springCategory = categoryRepository.save(
                Category.builder().categoryName("Spring Boot").description("Spring content").build());

        // Create sample posts
        postRepository.saveAll(List.of(
            Post.builder().title("Java Collections Guide").content("HashMap TreeMap ArrayList in Java")
                    .imageName("default.png").user(testUser).category(javaCategory).build(),
            Post.builder().title("Spring Boot REST API").content("Build REST APIs with Spring Boot 3")
                    .imageName("default.png").user(testUser).category(springCategory).build(),
            Post.builder().title("Java OOP Principles").content("Encapsulation Polymorphism Inheritance")
                    .imageName("default.png").user(testUser).category(javaCategory).build()
        ));
    }

    @Test
    @DisplayName("findByUser() - should return posts by specific user")
    void findByUser_shouldReturnUserPosts() {
        Page<Post> result = postRepository.findByUser(testUser, PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(3);
        assertThat(result.getContent())
                .allMatch(post -> post.getUser().getEmail().equals("test@blogsphere.com"));
    }

    @Test
    @DisplayName("findByCategory() - should return posts in specific category")
    void findByCategory_shouldReturnCategoryPosts() {
        Page<Post> result = postRepository.findByCategory(javaCategory, PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent())
                .allMatch(post -> post.getCategory().getCategoryName().equals("Java"));
    }

    @Test
    @DisplayName("searchPosts() - should find posts by title keyword")
    void searchPosts_shouldFindByTitleKeyword() {
        Page<Post> result = postRepository.searchPosts("Spring", "Spring", PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).contains("Spring");
    }

    @Test
    @DisplayName("searchPosts() - should find posts by content keyword")
    void searchPosts_shouldFindByContentKeyword() {
        Page<Post> result = postRepository.searchPosts("HashMap", "HashMap", PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getContent()).contains("HashMap");
    }

    @Test
    @DisplayName("searchPosts() - should be case insensitive")
    void searchPosts_shouldBeCaseInsensitive() {
        Page<Post> result = postRepository.searchPosts("java", "java", PageRequest.of(0, 10));

        // Should find all 3 posts: 2 with "Java" in title, 1 with "java" in content
        assertThat(result.getContent()).isNotEmpty();
    }

    @Test
    @DisplayName("searchPosts() - should return empty when no match")
    void searchPosts_shouldReturnEmpty_whenNoMatch() {
        Page<Post> result = postRepository.searchPosts("nonexistent", "nonexistent", PageRequest.of(0, 10));

        assertThat(result.getContent()).isEmpty();
    }
}
