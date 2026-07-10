package com.blogsphere.api.dto.response;

import lombok.*;

import java.time.LocalDateTime;

/**
 * Response DTO for JWT authentication (login and register).
 *
 * <p>Returns the JWT token alongside user details so clients
 * can immediately use both the token and display user info.</p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    /** JWT Bearer token to be included in Authorization header. */
    private String token;

    /** Authenticated user's details. */
    private UserResponse user;
}
