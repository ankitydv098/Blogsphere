package com.blogsphere.api.exception;

import com.blogsphere.api.dto.response.ErrorResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for BlogSphere API.
 *
 * <p>Catches all exceptions across all controllers and returns
 * consistent, structured JSON error responses.</p>
 *
 * <p>Every error response follows this format:
 * <pre>
 * {
 *   "time":    "2024-01-15T10:30:00",
 *   "message": "Resource not found",
 *   "status":  404
 * }
 * </pre>
 * </p>
 */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // ======================== CUSTOM EXCEPTIONS ========================

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {

        ErrorResponse error = ErrorResponse.builder()
                .time(LocalDateTime.now())
                .message(ex.getMessage())
                .status(HttpStatus.NOT_FOUND.value())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequestException(
            BadRequestException ex, WebRequest request) {

        ErrorResponse error = ErrorResponse.builder()
                .time(LocalDateTime.now())
                .message(ex.getMessage())
                .status(HttpStatus.BAD_REQUEST.value())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedException(
            UnauthorizedException ex, WebRequest request) {

        ErrorResponse error = ErrorResponse.builder()
                .time(LocalDateTime.now())
                .message(ex.getMessage())
                .status(HttpStatus.FORBIDDEN.value())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();

        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    // ======================== SPRING SECURITY EXCEPTIONS ========================

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex, WebRequest request) {

        ErrorResponse error = ErrorResponse.builder()
                .time(LocalDateTime.now())
                .message("Access denied: You do not have permission to perform this action")
                .status(HttpStatus.FORBIDDEN.value())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();

        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(
            AuthenticationException ex, WebRequest request) {

        ErrorResponse error = ErrorResponse.builder()
                .time(LocalDateTime.now())
                .message("Authentication failed: " + ex.getMessage())
                .status(HttpStatus.UNAUTHORIZED.value())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();

        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    // ======================== VALIDATION EXCEPTIONS ========================

    /**
     * Handles @Valid annotation failures on @RequestBody.
     * Returns a map of field name → error message.
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName    = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });

        ErrorResponse error = ErrorResponse.builder()
                .time(LocalDateTime.now())
                .message("Validation failed")
                .status(HttpStatus.BAD_REQUEST.value())
                .path(request.getDescription(false).replace("uri=", ""))
                .errors(fieldErrors)
                .build();

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(
            ConstraintViolationException ex, WebRequest request) {

        Map<String, String> fieldErrors = new HashMap<>();
        ex.getConstraintViolations().forEach(cv ->
                fieldErrors.put(cv.getPropertyPath().toString(), cv.getMessage())
        );

        ErrorResponse error = ErrorResponse.builder()
                .time(LocalDateTime.now())
                .message("Validation failed")
                .status(HttpStatus.BAD_REQUEST.value())
                .path(request.getDescription(false).replace("uri=", ""))
                .errors(fieldErrors)
                .build();

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // ======================== GENERIC FALLBACK ========================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex, WebRequest request) {

        ErrorResponse error = ErrorResponse.builder()
                .time(LocalDateTime.now())
                .message("An unexpected error occurred: " + ex.getMessage())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();

        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
