package com.blogsphere.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when an authenticated user attempts an action
 * they are not authorized to perform.
 *
 * <p>Maps to HTTP 403 Forbidden.</p>
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
