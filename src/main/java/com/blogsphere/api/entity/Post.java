package com.blogsphere.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Post entity representing a blog article on BlogSphere.
 *
 * <p>Relationships:
 * <ul>
 *   <li>Many Posts → One User (author)</li>
 *   <li>Many Posts → One Category</li>
 *   <li>One Post → Many Comments</li>
 * </ul>
 * </p>
 */
@Entity
@Table(
    name = "posts",
    indexes = {
        @Index(name = "idx_post_title",   columnList = "title"),
        @Index(name = "idx_post_user_id", columnList = "user_id"),
        @Index(name = "idx_post_cat_id",  columnList = "category_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "image_name", length = 255)
    private String imageName;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Many Posts → One User (author).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Many Posts → One Category.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    /**
     * One Post → Many Comments.
     * Comments are deleted when the post is deleted.
     */
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();
}
