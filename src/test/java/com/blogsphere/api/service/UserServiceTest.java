package com.blogsphere.api.service;

import com.blogsphere.api.dto.request.UpdateUserRequest;
import com.blogsphere.api.dto.response.UserResponse;
import com.blogsphere.api.entity.User;
import com.blogsphere.api.exception.ResourceNotFoundException;
import com.blogsphere.api.mapper.UserMapper;
import com.blogsphere.api.repository.UserRepository;
import com.blogsphere.api.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;

/**
 * Unit tests for {@link UserServiceImpl}.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Unit Tests")
class UserServiceTest {

    @Mock private UserRepository  userRepository;
    @Mock private UserMapper      userMapper;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L).name("Test User")
                .email("test@blogsphere.com")
                .password("hashed_password")
                .build();
    }

    @Test
    @DisplayName("getAllUsers() - should return list of all users")
    void getAllUsers_shouldReturnAllUsers() {
        // Arrange
        UserResponse response = UserResponse.builder()
                .id(1L).name("Test User").email("test@blogsphere.com").build();
        given(userRepository.findAll()).willReturn(List.of(testUser));
        given(userMapper.toResponse(testUser)).willReturn(response);

        // Act
        List<UserResponse> result = userService.getAllUsers();

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEmail()).isEqualTo("test@blogsphere.com");
    }

    @Test
    @DisplayName("getUserById() - should return user when found")
    void getUserById_shouldReturnUser_whenExists() {
        // Arrange
        UserResponse expected = UserResponse.builder()
                .id(1L).email("test@blogsphere.com").build();
        given(userRepository.findById(1L)).willReturn(Optional.of(testUser));
        given(userMapper.toResponse(testUser)).willReturn(expected);

        // Act
        UserResponse actual = userService.getUserById(1L);

        // Assert
        assertThat(actual.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("getUserById() - should throw ResourceNotFoundException when not found")
    void getUserById_shouldThrow_whenUserNotFound() {
        // Arrange
        given(userRepository.findById(999L)).willReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userService.getUserById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User");
    }

    @Test
    @DisplayName("updateUser() - should update user successfully")
    void updateUser_shouldUpdateAndReturnUser() {
        // Arrange
        UpdateUserRequest request = new UpdateUserRequest("Updated Name", "updated@blogsphere.com", null);
        UserResponse expected = UserResponse.builder()
                .id(1L).name("Updated Name").email("updated@blogsphere.com").build();

        given(userRepository.findById(1L)).willReturn(Optional.of(testUser));
        given(userRepository.save(any(User.class))).willReturn(testUser);
        given(userMapper.toResponse(testUser)).willReturn(expected);

        // Act
        UserResponse actual = userService.updateUser(1L, request);

        // Assert
        assertThat(actual.getName()).isEqualTo("Updated Name");
        then(userRepository).should().save(testUser);
    }

    @Test
    @DisplayName("deleteUser() - should delete user when found")
    void deleteUser_shouldDeleteUser_whenExists() {
        // Arrange
        given(userRepository.findById(1L)).willReturn(Optional.of(testUser));
        willDoNothing().given(userRepository).delete(testUser);

        // Act
        assertThatCode(() -> userService.deleteUser(1L)).doesNotThrowAnyException();

        // Assert
        then(userRepository).should().delete(testUser);
    }
}
