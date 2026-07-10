package com.blogsphere.api.dto.response;

import lombok.*;

/**
 * Response DTO for category data.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {

    private Long id;
    private String categoryName;
    private String description;
}
