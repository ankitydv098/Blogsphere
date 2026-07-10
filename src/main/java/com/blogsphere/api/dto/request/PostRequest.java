package com.blogsphere.api.dto.request;

import com.blogsphere.api.utils.AppConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * Request DTO for creating or updating a blog post.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {

    @NotBlank(message = "Post title is required")
    @Size(min = AppConstants.MIN_TITLE_LENGTH,
          max = AppConstants.MAX_TITLE_LENGTH,
          message = "Title must be between 3 and 255 characters")
    private String title;

    @NotBlank(message = "Post content is required")
    @Size(max = AppConstants.MAX_CONTENT_LENGTH,
          message = "Content cannot exceed 50000 characters")
    private String content;

    private String imageName;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
}
