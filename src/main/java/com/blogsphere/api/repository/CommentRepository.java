package com.blogsphere.api.repository;

import com.blogsphere.api.entity.Comment;
import com.blogsphere.api.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for {@link Comment} entity.
 */
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    /**
     * Retrieve all comments for a specific post, ordered by creation date.
     *
     * @param post the blog post
     * @return list of comments on that post
     */
    List<Comment> findByPostOrderByCreatedAtDesc(Post post);
}
