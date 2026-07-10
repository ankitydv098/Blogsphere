package com.blogsphere.api.dto.response;

import lombok.*;

import java.time.LocalDateTime;

/**
 * Response DTO for user data.
 *
 * <p>The password is never included in this DTO
 * to prevent sensitive data exposure.</p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
