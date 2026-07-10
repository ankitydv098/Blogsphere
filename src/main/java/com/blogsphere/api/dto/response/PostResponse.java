package com.blogsphere.api.dto.response;

import lombok.*;

import java.time.LocalDateTime;

/**
 * Response DTO for blog post data.
 *
 * <p>Includes nested author and category summaries
 * to provide full context in a single response.</p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {

    private Long id;
    private String title;
    private String content;
    private String imageName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /** Simplified author information. */
    private UserResponse user;

    /** Simplified category information. */
    private CategoryResponse category;

    /** Total number of comments on this post. */
    private int commentCount;
}
