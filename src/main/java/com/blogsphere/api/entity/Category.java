package com.blogsphere.api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Category entity for organizing blog posts.
 *
 * <p>Only admins can create, update, or delete categories.
 * Any authenticated or unauthenticated user can view them.</p>
 */
@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_name", nullable = false, unique = true, length = 100)
    private String categoryName;

    @Column(name = "description", length = 500)
    private String description;

    /**
     * One-to-Many: A category can hold many posts.
     * Posts are NOT deleted when a category is deleted;
     * the FK is set to null instead (handled at service level).
     */
    @OneToMany(mappedBy = "category", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Builder.Default
    private List<Post> posts = new ArrayList<>();
}
