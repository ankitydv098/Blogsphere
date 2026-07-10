package com.blogsphere.api.mapper;

import com.blogsphere.api.dto.response.PostResponse;
import com.blogsphere.api.entity.Post;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between {@link Post} entity and its DTOs.
 *
 * <p>Handles nested mapping of User and Category within PostResponse,
 * and computes derived fields like commentCount.</p>
 */
@Component
@RequiredArgsConstructor
public class PostMapper {

    private final ModelMapper    modelMapper;
    private final UserMapper     userMapper;
    private final CategoryMapper categoryMapper;

    /**
     * Convert a Post entity to a PostResponse DTO.
     *
     * <p>The nested {@code user} and {@code category} are mapped via
     * their own mappers to produce clean response objects.</p>
     *
     * @param post the post entity
     * @return PostResponse DTO with nested author and category info
     */
    public PostResponse toResponse(Post post) {
        PostResponse response = modelMapper.map(post, PostResponse.class);

        // Map nested user (author)
        if (post.getUser() != null) {
            response.setUser(userMapper.toResponse(post.getUser()));
        }

        // Map nested category
        if (post.getCategory() != null) {
            response.setCategory(categoryMapper.toResponse(post.getCategory()));
        }

        // Set comment count
        response.setCommentCount(
                post.getComments() != null ? post.getComments().size() : 0
        );

        return response;
    }
}
