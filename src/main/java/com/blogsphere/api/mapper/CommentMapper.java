package com.blogsphere.api.mapper;

import com.blogsphere.api.dto.response.CommentResponse;
import com.blogsphere.api.entity.Comment;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between {@link Comment} entity and its DTOs.
 */
@Component
@RequiredArgsConstructor
public class CommentMapper {

    private final ModelMapper modelMapper;
    private final UserMapper  userMapper;

    /**
     * Convert a Comment entity to a CommentResponse DTO.
     *
     * @param comment the comment entity
     * @return CommentResponse DTO with nested user info
     */
    public CommentResponse toResponse(Comment comment) {
        CommentResponse response = modelMapper.map(comment, CommentResponse.class);

        // Map nested user (commenter)
        if (comment.getUser() != null) {
            response.setUser(userMapper.toResponse(comment.getUser()));
        }

        // Set the parent post ID
        if (comment.getPost() != null) {
            response.setPostId(comment.getPost().getId());
        }

        return response;
    }
}
