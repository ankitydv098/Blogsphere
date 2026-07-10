package com.blogsphere.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * User entity representing a registered member of BlogSphere.
 *
 * <p>Relationships:
 * <ul>
 *   <li>One User → Many Posts</li>
 *   <li>One User → Many Comments</li>
 *   <li>Many Users ↔ Many Roles (ROLE_USER / ROLE_ADMIN)</li>
 * </ul>
 * </p>
 */
@Entity
@Table(
    name = "users",
    indexes = {
        @Index(name = "idx_user_email", columnList = "email")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Many-to-Many relationship with roles.
     * Fetch eagerly so Security can read roles immediately.
     */
    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "user_roles",
        joinColumns        = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    /**
     * One-to-Many: A user can author many posts.
     * Posts are removed when the user is deleted.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Post> posts = new ArrayList<>();

    /**
     * One-to-Many: A user can write many comments.
     * Comments are removed when the user is deleted.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();
}
