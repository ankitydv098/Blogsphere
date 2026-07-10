package com.blogsphere.api.service;

import com.blogsphere.api.dto.request.LoginRequest;
import com.blogsphere.api.dto.request.RegisterRequest;
import com.blogsphere.api.dto.response.AuthResponse;

/**
 * Service interface for authentication operations.
 */
public interface AuthService {

    /**
     * Register a new user with ROLE_USER.
     *
     * @param request registration details
     * @return AuthResponse containing JWT token and user info
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticate an existing user and return a JWT token.
     *
     * @param request login credentials
     * @return AuthResponse containing JWT token and user info
     */
    AuthResponse login(LoginRequest request);
}
