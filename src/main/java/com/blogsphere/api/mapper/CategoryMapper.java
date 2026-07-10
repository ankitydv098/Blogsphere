package com.blogsphere.api.mapper;

import com.blogsphere.api.dto.response.CategoryResponse;
import com.blogsphere.api.entity.Category;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between {@link Category} entity and its DTOs.
 */
@Component
@RequiredArgsConstructor
public class CategoryMapper {

    private final ModelMapper modelMapper;

    /**
     * Convert a Category entity to a CategoryResponse DTO.
     *
     * @param category the category entity
     * @return CategoryResponse DTO
     */
    public CategoryResponse toResponse(Category category) {
        return modelMapper.map(category, CategoryResponse.class);
    }
}
