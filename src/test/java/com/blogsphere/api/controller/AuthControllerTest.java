package com.blogsphere.api.controller;

import com.blogsphere.api.dto.request.LoginRequest;
import com.blogsphere.api.dto.request.RegisterRequest;
import com.blogsphere.api.dto.response.AuthResponse;
import com.blogsphere.api.dto.response.UserResponse;
import com.blogsphere.api.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for {@link AuthController} using MockMvc.
 *
 * <p>Disables security filters so we can focus on testing the
 * endpoint binding, validation, and JSON serialization in isolation.</p>
 */
@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("AuthController Integration Tests")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private com.blogsphere.api.security.JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private com.blogsphere.api.security.CustomUserDetailsService userDetailsService;

    // ======================== REGISTER TESTS ========================

    @Test
    @DisplayName("POST /api/auth/register - should return 201 on success")
    void register_shouldReturn201_whenValidRequest() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest("John Doe", "john@blogsphere.com", "password123");

        AuthResponse response = AuthResponse.builder()
                .token("mock-token")
                .user(UserResponse.builder().id(1L).name("John Doe").email("john@blogsphere.com").build())
                .build();

        given(authService.register(any(RegisterRequest.class))).willReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("mock-token"))
                .andExpect(jsonPath("$.user.email").value("john@blogsphere.com"));
    }

    @Test
    @DisplayName("POST /api/auth/register - should return 400 when email is invalid")
    void register_shouldReturn400_whenEmailIsInvalid() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest("John", "invalid-email", "password123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/auth/register - should return 400 when name is blank")
    void register_shouldReturn400_whenNameIsBlank() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest("", "john@blogsphere.com", "password123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // ======================== LOGIN TESTS ========================

    @Test
    @DisplayName("POST /api/auth/login - should return 200 with token on valid credentials")
    void login_shouldReturn200_whenValidCredentials() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest("john@blogsphere.com", "password123");

        AuthResponse response = AuthResponse.builder()
                .token("mock-jwt-token")
                .user(UserResponse.builder().id(1L).email("john@blogsphere.com").build())
                .build();

        given(authService.login(any(LoginRequest.class))).willReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.user.email").value("john@blogsphere.com"));
    }

    @Test
    @DisplayName("POST /api/auth/login - should return 400 when password is missing")
    void login_shouldReturn400_whenPasswordIsMissing() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest("john@blogsphere.com", "");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
