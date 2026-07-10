package com.blogsphere.api.service;

import com.blogsphere.api.dto.request.UpdateUserRequest;
import com.blogsphere.api.dto.response.UserResponse;

import java.util.List;

/**
 * Service interface for user management operations.
 */
public interface UserService {

    /**
     * Retrieve all registered users.
     *
     * @return list of all users
     */
    List<UserResponse> getAllUsers();

    /**
     * Retrieve a single user by their ID.
     *
     * @param userId the user's ID
     * @return UserResponse DTO
     */
    UserResponse getUserById(Long userId);

    /**
     * Update a user's profile information.
     *
     * @param userId  the user to update
     * @param request updated user data
     * @return updated UserResponse DTO
     */
    UserResponse updateUser(Long userId, UpdateUserRequest request);

    /**
     * Delete a user account and all associated data.
     *
     * @param userId the user to delete
     */
    void deleteUser(Long userId);
}
