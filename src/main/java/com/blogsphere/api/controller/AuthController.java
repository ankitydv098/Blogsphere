package com.blogsphere.api.controller;

import com.blogsphere.api.dto.request.LoginRequest;
import com.blogsphere.api.dto.request.RegisterRequest;
import com.blogsphere.api.dto.response.AuthResponse;
import com.blogsphere.api.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for authentication endpoints.
 *
 * <p>All endpoints in this controller are publicly accessible (no JWT required).
 * After successful login or registration, clients receive a JWT token that
 * must be included in the {@code Authorization: Bearer <token>} header
 * for all protected endpoints.</p>
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register and login endpoints")
public class AuthController {

    private final AuthService authService;

    /**
     * Register a new user account.
     *
     * <p>On success, returns HTTP 201 with a JWT token so the client
     * is immediately authenticated without a separate login call.</p>
     *
     * @param request registration details (name, email, password)
     * @return AuthResponse with JWT token and user info
     */
    @PostMapping("/register")
    @Operation(
        summary     = "Register a new user",
        description = "Creates a new user account with ROLE_USER. Returns JWT token on success."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "User registered successfully"),
        @ApiResponse(responseCode = "400", description = "Validation error or email already taken")
    })
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Authenticate an existing user.
     *
     * @param request login credentials (email, password)
     * @return AuthResponse with JWT token and user info
     */
    @PostMapping("/login")
    @Operation(
        summary     = "Login to BlogSphere",
        description = "Authenticates credentials and returns a JWT token for subsequent requests."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "401", description = "Invalid email or password")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
