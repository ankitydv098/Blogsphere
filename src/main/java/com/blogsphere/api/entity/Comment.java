package com.blogsphere.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Comment entity representing a user's comment on a blog post.
 *
 * <p>Relationships:
 * <ul>
 *   <li>Many Comments → One User</li>
 *   <li>Many Comments → One Post</li>
 * </ul>
 * </p>
 */
@Entity
@Table(
    name = "comments",
    indexes = {
        @Index(name = "idx_comment_post_id", columnList = "post_id"),
        @Index(name = "idx_comment_user_id", columnList = "user_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /**
     * Many Comments → One User.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Many Comments → One Post.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
}
