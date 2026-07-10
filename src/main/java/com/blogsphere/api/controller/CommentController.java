package com.blogsphere.api.controller;

import com.blogsphere.api.dto.request.CommentRequest;
import com.blogsphere.api.dto.response.ApiResponse;
import com.blogsphere.api.dto.response.CommentResponse;
import com.blogsphere.api.service.CommentService;
import com.blogsphere.api.utils.AppConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for blog post comments.
 *
 * <p>GET comments is public.
 * Adding and deleting comments require authentication.</p>
 */
@RestController
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Comment management for blog posts")
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/api/posts/{postId}/comments")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add a comment to a blog post")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {

        CommentResponse response = commentService.addComment(
                postId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/posts/{postId}/comments")
    @Operation(summary = "Get all comments for a blog post (public)")
    public ResponseEntity<List<CommentResponse>> getCommentsByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }

    @DeleteMapping("/api/comments/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a comment (author or admin)")
    public ResponseEntity<ApiResponse> deleteComment(
            @PathVariable Long id,
            Authentication authentication) {

        commentService.deleteComment(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.of(AppConstants.COMMENT_DELETED, true));
    }
}
