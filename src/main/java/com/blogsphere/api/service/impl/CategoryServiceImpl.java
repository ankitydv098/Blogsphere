package com.blogsphere.api.service.impl;

import com.blogsphere.api.dto.request.CategoryRequest;
import com.blogsphere.api.dto.response.CategoryResponse;
import com.blogsphere.api.entity.Category;
import com.blogsphere.api.exception.BadRequestException;
import com.blogsphere.api.exception.ResourceNotFoundException;
import com.blogsphere.api.mapper.CategoryMapper;
import com.blogsphere.api.repository.CategoryRepository;
import com.blogsphere.api.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link CategoryService}.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper     categoryMapper;

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new BadRequestException(
                    "Category '" + request.getCategoryName() + "' already exists");
        }

        Category category = Category.builder()
                .categoryName(request.getCategoryName())
                .description(request.getDescription())
                .build();

        Category saved = categoryRepository.save(category);
        log.info("Category created: {}", saved.getCategoryName());
        return categoryMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long categoryId, CategoryRequest request) {
        Category category = findCategoryOrThrow(categoryId);
        category.setCategoryName(request.getCategoryName());
        category.setDescription(request.getDescription());
        Category updated = categoryRepository.save(category);
        log.info("Category updated: id={}", categoryId);
        return categoryMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = findCategoryOrThrow(categoryId);
        categoryRepository.delete(category);
        log.info("Category deleted: id={}", categoryId);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long categoryId) {
        return categoryMapper.toResponse(findCategoryOrThrow(categoryId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    private Category findCategoryOrThrow(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
    }
}
