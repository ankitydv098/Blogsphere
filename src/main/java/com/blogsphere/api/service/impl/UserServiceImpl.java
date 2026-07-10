package com.blogsphere.api.service.impl;

import com.blogsphere.api.dto.request.UpdateUserRequest;
import com.blogsphere.api.dto.response.UserResponse;
import com.blogsphere.api.entity.User;
import com.blogsphere.api.exception.ResourceNotFoundException;
import com.blogsphere.api.mapper.UserMapper;
import com.blogsphere.api.repository.UserRepository;
import com.blogsphere.api.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link UserService} for user management.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository  userRepository;
    private final UserMapper      userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        User user = findUserOrThrow(userId);
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long userId, UpdateUserRequest request) {
        User user = findUserOrThrow(userId);

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Only update password if a new one is provided
        if (StringUtils.hasText(request.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        log.info("User updated: id={}", userId);
        return userMapper.toResponse(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = findUserOrThrow(userId);
        userRepository.delete(user);
        log.info("User deleted: id={}", userId);
    }

    // ======================== PRIVATE HELPERS ========================

    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }
}
