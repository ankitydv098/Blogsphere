package com.blogsphere.api.service;

import com.blogsphere.api.dto.request.CategoryRequest;
import com.blogsphere.api.dto.response.CategoryResponse;

import java.util.List;

/**
 * Service interface for category management.
 * Create/Update/Delete operations are admin-only.
 */
public interface CategoryService {

    /**
     * Create a new category. (ADMIN only)
     *
     * @param request category data
     * @return created CategoryResponse DTO
     */
    CategoryResponse createCategory(CategoryRequest request);

    /**
     * Update an existing category. (ADMIN only)
     *
     * @param categoryId the category to update
     * @param request    updated category data
     * @return updated CategoryResponse DTO
     */
    CategoryResponse updateCategory(Long categoryId, CategoryRequest request);

    /**
     * Delete a category. (ADMIN only)
     *
     * @param categoryId the category to delete
     */
    void deleteCategory(Long categoryId);

    /**
     * Retrieve a single category by ID.
     *
     * @param categoryId the category's ID
     * @return CategoryResponse DTO
     */
    CategoryResponse getCategoryById(Long categoryId);

    /**
     * Retrieve all categories.
     *
     * @return list of all categories
     */
    List<CategoryResponse> getAllCategories();
}
