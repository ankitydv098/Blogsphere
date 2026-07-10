package com.blogsphere.api.repository;

import com.blogsphere.api.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for {@link Role} entity.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Find a role by its name (e.g., "ROLE_USER", "ROLE_ADMIN").
     *
     * @param roleName the role name to search
     * @return an Optional containing the role if found
     */
    Optional<Role> findByRoleName(String roleName);
}
