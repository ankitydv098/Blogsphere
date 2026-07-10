package com.blogsphere.api.repository;

import com.blogsphere.api.entity.Post;
import com.blogsphere.api.entity.Category;
import com.blogsphere.api.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository for {@link Post} entity.
 *
 * <p>Includes custom JPQL queries for:
 * <ul>
 *   <li>Finding posts by author (User)</li>
 *   <li>Finding posts by category</li>
 *   <li>Full-text keyword search across title and content</li>
 * </ul>
 * </p>
 */
@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    /**
     * Retrieve all posts authored by a specific user, with pagination.
     *
     * @param user     the author entity
     * @param pageable pagination and sorting parameters
     * @return a page of posts by that user
     */
    Page<Post> findByUser(User user, Pageable pageable);

    /**
     * Retrieve all posts belonging to a specific category, with pagination.
     *
     * @param category the category entity
     * @param pageable pagination and sorting parameters
     * @return a page of posts in that category
     */
    Page<Post> findByCategory(Category category, Pageable pageable);

    /**
     * Search posts by keyword in title OR content (case-insensitive).
     *
     * <p>Uses JPQL LIKE with wildcards on both the {@code title}
     * and {@code content} fields.</p>
     *
     * @param titleKeyword   keyword to match against the title
     * @param contentKeyword keyword to match against the content
     * @param pageable       pagination parameters
     * @return a page of matching posts
     */
    @Query("SELECT p FROM Post p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :titleKeyword, '%')) OR " +
           "p.content LIKE CONCAT('%', :contentKeyword, '%')")
    Page<Post> searchPosts(
            @Param("titleKeyword")   String titleKeyword,
            @Param("contentKeyword") String contentKeyword,
            Pageable pageable
    );
}
