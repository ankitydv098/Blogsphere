package com.blogsphere.api.dto.response;

import lombok.*;

import java.time.LocalDateTime;

/**
 * Response DTO for comment data.
 *
 * <p>Includes the comment author's basic info so clients
 * can display the commenter's name without a separate API call.</p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {

    private Long id;
    private String content;
    private LocalDateTime createdAt;

    /** Simplified info about who wrote this comment. */
    private UserResponse user;

    /** ID of the post this comment belongs to. */
    private Long postId;
}
