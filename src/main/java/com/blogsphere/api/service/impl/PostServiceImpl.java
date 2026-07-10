package com.blogsphere.api.service.impl;

import com.blogsphere.api.dto.request.PostRequest;
import com.blogsphere.api.dto.response.PagedResponse;
import com.blogsphere.api.dto.response.PostResponse;
import com.blogsphere.api.entity.Category;
import com.blogsphere.api.entity.Post;
import com.blogsphere.api.entity.User;
import com.blogsphere.api.exception.ResourceNotFoundException;
import com.blogsphere.api.exception.UnauthorizedException;
import com.blogsphere.api.mapper.PostMapper;
import com.blogsphere.api.repository.CategoryRepository;
import com.blogsphere.api.repository.PostRepository;
import com.blogsphere.api.repository.UserRepository;
import com.blogsphere.api.service.PostService;
import com.blogsphere.api.utils.AppConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link PostService} for blog post management.
 *
 * <p>Business rules enforced:
 * <ul>
 *   <li>Only the post's author OR an admin can update/delete a post</li>
 *   <li>Category must exist before creating/updating a post</li>
 *   <li>All list operations are paginated and sorted</li>
 * </ul>
 * </p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PostServiceImpl implements PostService {

    private final PostRepository     postRepository;
    private final UserRepository     userRepository;
    private final CategoryRepository categoryRepository;
    private final PostMapper         postMapper;

    @Override
    @Transactional
    public PostResponse createPost(PostRequest request, String userEmail) {
        User     author   = findUserByEmailOrThrow(userEmail);
        Category category = findCategoryOrThrow(request.getCategoryId());

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .imageName(request.getImageName() != null
                        ? request.getImageName()
                        : AppConstants.DEFAULT_IMAGE)
                .user(author)
                .category(category)
                .build();

        Post savedPost = postRepository.save(post);
        log.info("Post created: id={} by user={}", savedPost.getId(), userEmail);
        return postMapper.toResponse(savedPost);
    }

    @Override
    @Transactional
    public PostResponse updatePost(Long postId, PostRequest request, String userEmail) {
        Post     post     = findPostOrThrow(postId);
        Category category = findCategoryOrThrow(request.getCategoryId());

        // Authorization check
        assertOwnerOrAdmin(post, userEmail, "update");

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setCategory(category);
        if (request.getImageName() != null) {
            post.setImageName(request.getImageName());
        }

        Post updatedPost = postRepository.save(post);
        log.info("Post updated: id={}", postId);
        return postMapper.toResponse(updatedPost);
    }

    @Override
    @Transactional
    public void deletePost(Long postId, String userEmail) {
        Post post = findPostOrThrow(postId);
        assertOwnerOrAdmin(post, userEmail, "delete");
        postRepository.delete(post);
        log.info("Post deleted: id={}", postId);
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponse getPostById(Long postId) {
        Post post = findPostOrThrow(postId);
        return postMapper.toResponse(post);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PostResponse> getAllPosts(int pageNumber, int pageSize,
                                                   String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<Post> posts  = postRepository.findAll(pageable);
        return buildPagedResponse(posts);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PostResponse> getPostsByUser(Long userId, int pageNumber, int pageSize) {
        User user = findUserOrThrow(userId);
        Pageable pageable = PageRequest.of(pageNumber, pageSize,
                Sort.by(AppConstants.DEFAULT_SORT_BY).descending());
        Page<Post> posts  = postRepository.findByUser(user, pageable);
        return buildPagedResponse(posts);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PostResponse> getPostsByCategory(Long categoryId,
                                                           int pageNumber, int pageSize) {
        Category category = findCategoryOrThrow(categoryId);
        Pageable pageable = PageRequest.of(pageNumber, pageSize,
                Sort.by(AppConstants.DEFAULT_SORT_BY).descending());
        Page<Post> posts  = postRepository.findByCategory(category, pageable);
        return buildPagedResponse(posts);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PostResponse> searchPosts(String keyword, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize,
                Sort.by(AppConstants.DEFAULT_SORT_BY).descending());
        Page<Post> posts  = postRepository.searchPosts(keyword, keyword, pageable);
        return buildPagedResponse(posts);
    }

    @Override
    @Transactional
    public PostResponse updatePostImage(Long postId, String imageName) {
        Post post = findPostOrThrow(postId);
        post.setImageName(imageName);
        return postMapper.toResponse(postRepository.save(post));
    }

    // ======================== PRIVATE HELPERS ========================

    private Post findPostOrThrow(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
    }

    private User findUserByEmailOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    private Category findCategoryOrThrow(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
    }

    /**
     * Verify that the requester is the post's author OR has ROLE_ADMIN.
     * Throws {@link UnauthorizedException} if neither condition is met.
     */
    private void assertOwnerOrAdmin(Post post, String userEmail, String action) {
        boolean isOwner = post.getUser().getEmail().equals(userEmail);
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities()
                .contains(new SimpleGrantedAuthority(AppConstants.ROLE_ADMIN));

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException(
                    "You are not authorized to " + action + " this post");
        }
    }

    private PagedResponse<PostResponse> buildPagedResponse(Page<Post> page) {
        List<PostResponse> content = page.getContent()
                .stream()
                .map(postMapper::toResponse)
                .collect(Collectors.toList());

        return PagedResponse.<PostResponse>builder()
                .content(content)
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .lastPage(page.isLast())
                .build();
    }
}
