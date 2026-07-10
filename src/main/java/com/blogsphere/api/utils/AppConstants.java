package com.blogsphere.api.utils;

/**
 * Application-wide constants for BlogSphere API.
 *
 * <p>Centralizes all magic strings, numbers, and role names
 * to avoid duplication and simplify maintenance.</p>
 */
public final class AppConstants {

    // ======================== PAGINATION ========================
    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE   = "10";
    public static final String DEFAULT_SORT_BY     = "createdAt";
    public static final String DEFAULT_SORT_DIR    = "desc";

    // ======================== ROLES ========================
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_USER  = "ROLE_USER";

    // ======================== SECURITY ========================
    public static final String TOKEN_PREFIX        = "Bearer ";
    public static final String AUTHORIZATION_HEADER = "Authorization";

    // ======================== MESSAGES ========================
    public static final String USER_NOT_FOUND     = "User not found with id: ";
    public static final String POST_NOT_FOUND     = "Post not found with id: ";
    public static final String CATEGORY_NOT_FOUND = "Category not found with id: ";
    public static final String COMMENT_NOT_FOUND  = "Comment not found with id: ";
    public static final String ROLE_NOT_FOUND     = "Role not found: ";

    public static final String USER_DELETED     = "User deleted successfully";
    public static final String POST_DELETED     = "Post deleted successfully";
    public static final String CATEGORY_DELETED = "Category deleted successfully";
    public static final String COMMENT_DELETED  = "Comment deleted successfully";

    // ======================== VALIDATION ========================
    public static final int MIN_PASSWORD_LENGTH  = 6;
    public static final int MAX_PASSWORD_LENGTH  = 100;
    public static final int MIN_TITLE_LENGTH     = 3;
    public static final int MAX_TITLE_LENGTH     = 255;
    public static final int MAX_CONTENT_LENGTH   = 50000;
    public static final int MIN_NAME_LENGTH      = 2;
    public static final int MAX_NAME_LENGTH      = 100;

    // ======================== FILE UPLOAD ========================
    public static final String DEFAULT_IMAGE     = "default.png";
    public static final String IMAGE_PATH_PREFIX = "/api/images/";

    // Prevent instantiation
    private AppConstants() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }
}
