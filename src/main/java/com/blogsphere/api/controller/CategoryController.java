package com.blogsphere.api.controller;

import com.blogsphere.api.dto.request.CategoryRequest;
import com.blogsphere.api.dto.response.ApiResponse;
import com.blogsphere.api.dto.response.CategoryResponse;
import com.blogsphere.api.service.CategoryService;
import com.blogsphere.api.utils.AppConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for category management.
 *
 * <p>GET endpoints are public.
 * POST / PUT / DELETE are restricted to ROLE_ADMIN
 * (enforced at the security config level).</p>
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Category management endpoints (Admin: create/update/delete)")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new category (ADMIN only)")
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.createCategory(request));
    }

    @GetMapping
    @Operation(summary = "Get all categories (public)")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a category by ID (public)")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update a category (ADMIN only)")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a category (ADMIN only)")
    public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.of(AppConstants.CATEGORY_DELETED, true));
    }
}
