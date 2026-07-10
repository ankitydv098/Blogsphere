package com.blogsphere.api.mapper;

import com.blogsphere.api.dto.response.UserResponse;
import com.blogsphere.api.entity.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between {@link User} entity and its DTOs.
 */
@Component
@RequiredArgsConstructor
public class UserMapper {

    private final ModelMapper modelMapper;

    /**
     * Convert a User entity to a UserResponse DTO.
     * Password is automatically excluded since UserResponse has no password field.
     *
     * @param user the user entity
     * @return UserResponse DTO
     */
    public UserResponse toResponse(User user) {
        return modelMapper.map(user, UserResponse.class);
    }
}
