package com.blogsphere.api.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standardized error response returned by {@code GlobalExceptionHandler}.
 *
 * <p>Format:
 * <pre>
 * {
 *   "time":    "2024-01-15T10:30:00",
 *   "message": "User not found with id: 5",
 *   "status":  404,
 *   "path":    "/api/users/5",
 *   "errors":  {}  // only present for validation failures
 * }
 * </pre>
 * </p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private LocalDateTime time;
    private String message;
    private int status;
    private String path;

    /** Field-level validation errors (only present on validation failures). */
    private Map<String, String> errors;
}
