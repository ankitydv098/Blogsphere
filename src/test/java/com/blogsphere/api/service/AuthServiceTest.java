package com.blogsphere.api.service;

import com.blogsphere.api.dto.request.LoginRequest;
import com.blogsphere.api.dto.request.RegisterRequest;
import com.blogsphere.api.dto.response.AuthResponse;
import com.blogsphere.api.entity.Role;
import com.blogsphere.api.entity.User;
import com.blogsphere.api.exception.BadRequestException;
import com.blogsphere.api.mapper.UserMapper;
import com.blogsphere.api.repository.RoleRepository;
import com.blogsphere.api.repository.UserRepository;
import com.blogsphere.api.security.JwtTokenProvider;
import com.blogsphere.api.service.impl.AuthServiceImpl;
import com.blogsphere.api.utils.AppConstants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

/**
 * Unit tests for {@link AuthServiceImpl}.
 *
 * <p>All dependencies are mocked with Mockito.
 * No Spring context is loaded — these are fast unit tests.</p>
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock private UserRepository        userRepository;
    @Mock private RoleRepository        roleRepository;
    @Mock private PasswordEncoder       passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtTokenProvider      jwtTokenProvider;
    @Mock private UserMapper            userMapper;

    @InjectMocks
    private AuthServiceImpl authService;

    private Role userRole;
    private User testUser;

    @BeforeEach
    void setUp() {
        userRole = Role.builder().id(1L).roleName(AppConstants.ROLE_USER).build();
        testUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@blogsphere.com")
                .password("hashed_password")
                .build();
    }

    // ======================== REGISTER TESTS ========================

    @Test
    @DisplayName("register() - should register new user and return JWT token")
    void register_shouldReturnAuthResponse_whenEmailNotTaken() {
        // Arrange
        RegisterRequest request = new RegisterRequest("Test User", "test@blogsphere.com", "password123");

        given(userRepository.existsByEmail(request.getEmail())).willReturn(false);
        given(roleRepository.findByRoleName(AppConstants.ROLE_USER)).willReturn(Optional.of(userRole));
        given(passwordEncoder.encode(request.getPassword())).willReturn("hashed_password");
        given(userRepository.save(any(User.class))).willReturn(testUser);
        given(jwtTokenProvider.generateTokenFromEmail(testUser.getEmail())).willReturn("mock-jwt-token");
        given(userMapper.toResponse(testUser)).willReturn(
                com.blogsphere.api.dto.response.UserResponse.builder()
                        .id(1L).name("Test User").email("test@blogsphere.com").build()
        );

        // Act
        AuthResponse response = authService.register(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("mock-jwt-token");
        assertThat(response.getUser().getEmail()).isEqualTo("test@blogsphere.com");

        then(userRepository).should().save(any(User.class));
        then(jwtTokenProvider).should().generateTokenFromEmail(testUser.getEmail());
    }

    @Test
    @DisplayName("register() - should throw BadRequestException when email already exists")
    void register_shouldThrowBadRequest_whenEmailAlreadyExists() {
        // Arrange
        RegisterRequest request = new RegisterRequest("Test User", "existing@blogsphere.com", "password123");
        given(userRepository.existsByEmail(request.getEmail())).willReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("already exists");

        then(userRepository).should(never()).save(any(User.class));
    }

    // ======================== LOGIN TESTS ========================

    @Test
    @DisplayName("login() - should return JWT token on valid credentials")
    void login_shouldReturnAuthResponse_whenCredentialsAreValid() {
        // Arrange
        LoginRequest request = new LoginRequest("test@blogsphere.com", "password123");
        Authentication mockAuth = mock(Authentication.class);

        given(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .willReturn(mockAuth);
        given(jwtTokenProvider.generateToken(mockAuth)).willReturn("mock-jwt-token");
        given(userRepository.findByEmail(request.getEmail())).willReturn(Optional.of(testUser));
        given(userMapper.toResponse(testUser)).willReturn(
                com.blogsphere.api.dto.response.UserResponse.builder()
                        .id(1L).name("Test User").email("test@blogsphere.com").build()
        );

        // Act
        AuthResponse response = authService.login(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("mock-jwt-token");
        assertThat(response.getUser().getEmail()).isEqualTo("test@blogsphere.com");
    }
}
