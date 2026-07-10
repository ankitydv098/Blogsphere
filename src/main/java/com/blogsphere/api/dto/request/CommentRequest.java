package com.blogsphere.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * Request DTO for creating a comment on a blog post.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequest {

    @NotBlank(message = "Comment content is required")
    @Size(min = 1, max = 2000, message = "Comment must be between 1 and 2000 characters")
    private String content;
}
