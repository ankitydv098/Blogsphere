package com.blogsphere.api.service;

import com.blogsphere.api.dto.request.PostRequest;
import com.blogsphere.api.dto.response.PagedResponse;
import com.blogsphere.api.dto.response.PostResponse;
import com.blogsphere.api.entity.*;
import com.blogsphere.api.exception.ResourceNotFoundException;
import com.blogsphere.api.exception.UnauthorizedException;
import com.blogsphere.api.mapper.PostMapper;
import com.blogsphere.api.repository.CategoryRepository;
import com.blogsphere.api.repository.PostRepository;
import com.blogsphere.api.repository.UserRepository;
import com.blogsphere.api.service.impl.PostServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

/**
 * Unit tests for {@link PostServiceImpl}.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@DisplayName("PostService Unit Tests")
class PostServiceTest {

    @Mock private PostRepository     postRepository;
    @Mock private UserRepository     userRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private PostMapper         postMapper;

    @InjectMocks
    private PostServiceImpl postService;

    private User       testUser;
    private Category   testCategory;
    private Post       testPost;
    private PostRequest testRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).name("Test User").email("test@blogsphere.com").build();
        testCategory = Category.builder().id(1L).categoryName("Java").build();
        testPost = Post.builder()
                .id(1L).title("Test Post").content("Test content")
                .user(testUser).category(testCategory).comments(Collections.emptyList())
                .build();
        testRequest = new PostRequest("Test Post", "Test content", null, 1L);

        // Mock SecurityContext for authorization checks
        Authentication auth = mock(Authentication.class);
        given(auth.getAuthorities()).willReturn(Collections.emptyList());
        SecurityContext securityContext = mock(SecurityContext.class);
        given(securityContext.getAuthentication()).willReturn(auth);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    @DisplayName("createPost() - should create and return post")
    void createPost_shouldReturnPostResponse_whenValidInput() {
        // Arrange
        PostResponse expected = PostResponse.builder().id(1L).title("Test Post").build();

        given(userRepository.findByEmail(testUser.getEmail())).willReturn(Optional.of(testUser));
        given(categoryRepository.findById(1L)).willReturn(Optional.of(testCategory));
        given(postRepository.save(any(Post.class))).willReturn(testPost);
        given(postMapper.toResponse(testPost)).willReturn(expected);

        // Act
        PostResponse actual = postService.createPost(testRequest, testUser.getEmail());

        // Assert
        assertThat(actual).isNotNull();
        assertThat(actual.getId()).isEqualTo(1L);
        assertThat(actual.getTitle()).isEqualTo("Test Post");
        then(postRepository).should().save(any(Post.class));
    }

    @Test
    @DisplayName("getPostById() - should return post when found")
    void getPostById_shouldReturnPost_whenExists() {
        // Arrange
        PostResponse expected = PostResponse.builder().id(1L).title("Test Post").build();
        given(postRepository.findById(1L)).willReturn(Optional.of(testPost));
        given(postMapper.toResponse(testPost)).willReturn(expected);

        // Act
        PostResponse actual = postService.getPostById(1L);

        // Assert
        assertThat(actual).isNotNull();
        assertThat(actual.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("getPostById() - should throw ResourceNotFoundException when not found")
    void getPostById_shouldThrow_whenNotFound() {
        // Arrange
        given(postRepository.findById(99L)).willReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> postService.getPostById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Post");
    }

    @Test
    @DisplayName("getAllPosts() - should return paged response")
    void getAllPosts_shouldReturnPagedResponse() {
        // Arrange
        Page<Post> page = new PageImpl<>(List.of(testPost));
        given(postRepository.findAll(any(Pageable.class))).willReturn(page);
        given(postMapper.toResponse(testPost))
                .willReturn(PostResponse.builder().id(1L).title("Test Post").build());

        // Act
        PagedResponse<PostResponse> response = postService.getAllPosts(0, 10, "createdAt", "desc");

        // Assert
        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getTotalElements()).isEqualTo(1L);
        assertThat(response.isLastPage()).isTrue();
    }

    @Test
    @DisplayName("deletePost() - should throw UnauthorizedException when not owner or admin")
    void deletePost_shouldThrow_whenNotOwnerOrAdmin() {
        // Arrange
        given(postRepository.findById(1L)).willReturn(Optional.of(testPost));

        // Act & Assert — "other@user.com" is not the owner
        assertThatThrownBy(() -> postService.deletePost(1L, "other@user.com"))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("not authorized");
    }

    @Test
    @DisplayName("deletePost() - should succeed when user is the post owner")
    void deletePost_shouldSucceed_whenUserIsOwner() {
        // Arrange
        given(postRepository.findById(1L)).willReturn(Optional.of(testPost));
        willDoNothing().given(postRepository).delete(testPost);

        // Act & Assert (no exception)
        assertThatCode(() -> postService.deletePost(1L, testUser.getEmail()))
                .doesNotThrowAnyException();

        then(postRepository).should().delete(testPost);
    }
}
