package com.blogsphere.api.service.impl;

import com.blogsphere.api.dto.request.CommentRequest;
import com.blogsphere.api.dto.response.CommentResponse;
import com.blogsphere.api.entity.Comment;
import com.blogsphere.api.entity.Post;
import com.blogsphere.api.entity.User;
import com.blogsphere.api.exception.ResourceNotFoundException;
import com.blogsphere.api.exception.UnauthorizedException;
import com.blogsphere.api.mapper.CommentMapper;
import com.blogsphere.api.repository.CommentRepository;
import com.blogsphere.api.repository.PostRepository;
import com.blogsphere.api.repository.UserRepository;
import com.blogsphere.api.service.CommentService;
import com.blogsphere.api.utils.AppConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link CommentService}.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository    postRepository;
    private final UserRepository    userRepository;
    private final CommentMapper     commentMapper;

    @Override
    @Transactional
    public CommentResponse addComment(Long postId, CommentRequest request, String userEmail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .post(post)
                .user(user)
                .build();

        Comment saved = commentRepository.save(comment);
        log.info("Comment added: postId={} by user={}", postId, userEmail);
        return commentMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        return commentRepository.findByPostOrderByCreatedAtDesc(post)
                .stream()
                .map(commentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, String userEmail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        boolean isOwner = comment.getUser().getEmail().equals(userEmail);
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities()
                .contains(new SimpleGrantedAuthority(AppConstants.ROLE_ADMIN));

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
        log.info("Comment deleted: id={}", commentId);
    }
}
