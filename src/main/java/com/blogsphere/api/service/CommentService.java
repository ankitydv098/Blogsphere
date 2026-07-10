package com.blogsphere.api.service;

import com.blogsphere.api.dto.request.CommentRequest;
import com.blogsphere.api.dto.response.CommentResponse;

import java.util.List;

/**
 * Service interface for comment management.
 */
public interface CommentService {

    /**
     * Add a comment to a post.
     *
     * @param postId     the post to comment on
     * @param request    comment content
     * @param userEmail  email of the commenter
     * @return created CommentResponse DTO
     */
    CommentResponse addComment(Long postId, CommentRequest request, String userEmail);

    /**
     * Get all comments for a specific post.
     *
     * @param postId the post ID
     * @return list of comments (newest first)
     */
    List<CommentResponse> getCommentsByPost(Long postId);

    /**
     * Delete a comment.
     * Only the comment's author or an ADMIN can delete it.
     *
     * @param commentId the comment to delete
     * @param userEmail email of the requester
     */
    void deleteComment(Long commentId, String userEmail);
}
