package com.blogsphere.api.dto.response;

import lombok.*;

/**
 * Generic API response wrapper used for success messages.
 *
 * <p>Example usage:
 * <pre>
 * {
 *   "message": "User deleted successfully",
 *   "success": true
 * }
 * </pre>
 * </p>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {

    private String  message;
    private boolean success;

    public static ApiResponse of(String message, boolean success) {
        ApiResponse response = new ApiResponse();
        response.setMessage(message);
        response.setSuccess(success);
        return response;
    }
}
