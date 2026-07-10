package com.blogsphere.api.controller;

import com.blogsphere.api.dto.request.PostRequest;
import com.blogsphere.api.dto.response.ApiResponse;
import com.blogsphere.api.dto.response.PagedResponse;
import com.blogsphere.api.dto.response.PostResponse;
import com.blogsphere.api.service.FileService;
import com.blogsphere.api.service.PostService;
import com.blogsphere.api.utils.AppConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

/**
 * REST controller for blog post management.
 *
 * <p>Public GET endpoints:
 * <ul>
 *   <li>GET /api/posts — All posts (paginated)</li>
 *   <li>GET /api/posts/{id} — Single post</li>
 *   <li>GET /api/posts/search?keyword=... — Search</li>
 *   <li>GET /api/users/{id}/posts — Posts by user</li>
 *   <li>GET /api/categories/{id}/posts — Posts by category</li>
 * </ul>
 * </p>
 *
 * <p>Protected endpoints require JWT authentication.</p>
 */
@RestController
@RequiredArgsConstructor
@Tag(name = "Posts", description = "Blog post management endpoints")
public class PostController {

    private final PostService postService;
    private final FileService fileService;

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    // ======================== CREATE ========================

    @PostMapping("/api/posts")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new blog post")
    public ResponseEntity<PostResponse> createPost(
            @Valid @RequestBody PostRequest request,
            Authentication authentication) {

        PostResponse response = postService.createPost(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ======================== READ ========================

    @GetMapping("/api/posts")
    @Operation(summary = "Get all posts (paginated and sorted)")
    public ResponseEntity<PagedResponse<PostResponse>> getAllPosts(
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int pageNumber,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE)   int pageSize,
            @RequestParam(defaultValue = AppConstants.DEFAULT_SORT_BY)     String sortBy,
            @RequestParam(defaultValue = AppConstants.DEFAULT_SORT_DIR)    String sortDir) {

        return ResponseEntity.ok(
                postService.getAllPosts(pageNumber, pageSize, sortBy, sortDir));
    }

    @GetMapping("/api/posts/{id}")
    @Operation(summary = "Get a single post by ID")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @GetMapping("/api/users/{userId}/posts")
    @Operation(summary = "Get all posts by a specific user")
    public ResponseEntity<PagedResponse<PostResponse>> getPostsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int pageNumber,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE)   int pageSize) {

        return ResponseEntity.ok(postService.getPostsByUser(userId, pageNumber, pageSize));
    }

    @GetMapping("/api/categories/{categoryId}/posts")
    @Operation(summary = "Get all posts in a specific category")
    public ResponseEntity<PagedResponse<PostResponse>> getPostsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int pageNumber,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE)   int pageSize) {

        return ResponseEntity.ok(postService.getPostsByCategory(categoryId, pageNumber, pageSize));
    }

    @GetMapping("/api/posts/search")
    @Operation(summary = "Search posts by keyword in title or content")
    public ResponseEntity<PagedResponse<PostResponse>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int pageNumber,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE)   int pageSize) {

        return ResponseEntity.ok(postService.searchPosts(keyword, pageNumber, pageSize));
    }

    // ======================== UPDATE ========================

    @PutMapping("/api/posts/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update a blog post (author or admin)")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostRequest request,
            Authentication authentication) {

        PostResponse response = postService.updatePost(id, request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    // ======================== DELETE ========================

    @DeleteMapping("/api/posts/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a blog post (author or admin)")
    public ResponseEntity<ApiResponse> deletePost(
            @PathVariable Long id,
            Authentication authentication) {

        postService.deletePost(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.of(AppConstants.POST_DELETED, true));
    }

    // ======================== IMAGE UPLOAD ========================

    @PostMapping(value = "/api/posts/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Upload an image for a blog post")
    public ResponseEntity<PostResponse> uploadPostImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image) throws IOException {

        String fileName = fileService.uploadImage(uploadDir, image);
        PostResponse response = postService.updatePostImage(id, fileName);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/images/{imageName}")
    @Operation(summary = "Serve a blog post image")
    public void serveImage(
            @PathVariable String imageName,
            HttpServletResponse response) throws IOException {

        InputStream resource = fileService.getResource(uploadDir, imageName);
        response.setContentType(MediaType.IMAGE_JPEG_VALUE);
        StreamUtils.copy(resource, response.getOutputStream());
    }
}
