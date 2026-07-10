package com.blogsphere.api.service;

import com.blogsphere.api.dto.request.PostRequest;
import com.blogsphere.api.dto.response.PagedResponse;
import com.blogsphere.api.dto.response.PostResponse;

/**
 * Service interface for blog post management.
 */
public interface PostService {

    /**
     * Create a new blog post authored by the currently authenticated user.
     *
     * @param request   post data
     * @param userEmail email of the authenticated author
     * @return created PostResponse DTO
     */
    PostResponse createPost(PostRequest request, String userEmail);

    /**
     * Update an existing blog post.
     * Only the post's author or an ADMIN can update it.
     *
     * @param postId    the post to update
     * @param request   updated post data
     * @param userEmail email of the requester
     * @return updated PostResponse DTO
     */
    PostResponse updatePost(Long postId, PostRequest request, String userEmail);

    /**
     * Delete a blog post.
     * Only the post's author or an ADMIN can delete it.
     *
     * @param postId    the post to delete
     * @param userEmail email of the requester
     */
    void deletePost(Long postId, String userEmail);

    /**
     * Retrieve a single post by ID.
     *
     * @param postId the post's ID
     * @return PostResponse DTO
     */
    PostResponse getPostById(Long postId);

    /**
     * Retrieve all posts with pagination and sorting.
     *
     * @param pageNumber zero-based page index
     * @param pageSize   number of items per page
     * @param sortBy     field name to sort by
     * @param sortDir    sort direction: "asc" or "desc"
     * @return paged list of posts
     */
    PagedResponse<PostResponse> getAllPosts(int pageNumber, int pageSize,
                                            String sortBy, String sortDir);

    /**
     * Retrieve all posts by a specific user.
     *
     * @param userId     the author's ID
     * @param pageNumber zero-based page index
     * @param pageSize   number of items per page
     * @return paged list of posts by that user
     */
    PagedResponse<PostResponse> getPostsByUser(Long userId, int pageNumber, int pageSize);

    /**
     * Retrieve all posts in a specific category.
     *
     * @param categoryId the category's ID
     * @param pageNumber zero-based page index
     * @param pageSize   number of items per page
     * @return paged list of posts in that category
     */
    PagedResponse<PostResponse> getPostsByCategory(Long categoryId, int pageNumber, int pageSize);

    /**
     * Search posts by keyword in title or content.
     *
     * @param keyword    the search keyword
     * @param pageNumber zero-based page index
     * @param pageSize   number of items per page
     * @return paged list of matching posts
     */
    PagedResponse<PostResponse> searchPosts(String keyword, int pageNumber, int pageSize);

    /**
     * Update the image file name associated with a post.
     *
     * @param postId    the post to update
     * @param imageName the new image file name
     * @return updated PostResponse DTO
     */
    PostResponse updatePostImage(Long postId, String imageName);
}
