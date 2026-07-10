package com.blogsphere.api.service.impl;

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
import com.blogsphere.api.service.AuthService;
import com.blogsphere.api.utils.AppConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

/**
 * Implementation of {@link AuthService} providing user registration and login.
 *
 * <p>On registration, the new user is assigned {@code ROLE_USER} by default.
 * Passwords are hashed with BCrypt before being stored.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository        userRepository;
    private final RoleRepository        roleRepository;
    private final PasswordEncoder       passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider      jwtTokenProvider;
    private final UserMapper            userMapper;

    /**
     * {@inheritDoc}
     *
     * <p>Steps:
     * <ol>
     *   <li>Check for duplicate email</li>
     *   <li>Hash the password with BCrypt</li>
     *   <li>Assign ROLE_USER</li>
     *   <li>Save user to database</li>
     *   <li>Generate JWT token and return AuthResponse</li>
     * </ol>
     * </p>
     */
    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Step 1: Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException(
                    "An account with email '" + request.getEmail() + "' already exists");
        }

        // Step 2: Look up the ROLE_USER role
        Role userRole = roleRepository.findByRoleName(AppConstants.ROLE_USER)
                .orElseThrow(() -> new RuntimeException(
                        AppConstants.ROLE_NOT_FOUND + AppConstants.ROLE_USER));

        // Step 3: Build and save the user entity
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(userRole))
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered: {}", savedUser.getEmail());

        // Step 4: Generate JWT token directly (no need to authenticate again)
        String token = jwtTokenProvider.generateTokenFromEmail(savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .user(userMapper.toResponse(savedUser))
                .build();
    }

    /**
     * {@inheritDoc}
     *
     * <p>Delegates credential validation to Spring Security's
     * {@link AuthenticationManager}, which uses the configured
     * {@code DaoAuthenticationProvider} + BCrypt.</p>
     */
    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);
        log.info("User logged in: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        return AuthResponse.builder()
                .token(token)
                .user(userMapper.toResponse(user))
                .build();
    }
}
