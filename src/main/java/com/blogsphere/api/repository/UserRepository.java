package com.blogsphere.api.repository;

import com.blogsphere.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for {@link User} entity.
 *
 * <p>Provides standard CRUD operations plus custom
 * queries for authentication and duplicate checks.</p>
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their email address.
     * Used by Spring Security's UserDetailsService.
     *
     * @param email the user's email
     * @return an Optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check whether a user with the given email already exists.
     * Used during registration to prevent duplicate accounts.
     *
     * @param email the email to check
     * @return true if the email is already registered
     */
    boolean existsByEmail(String email);
}
