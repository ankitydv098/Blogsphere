package com.blogsphere.api.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Role entity representing user authorities in the system.
 *
 * <p>Two roles are supported: ROLE_USER and ROLE_ADMIN.
 * Roles are seeded automatically at application startup.</p>
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role_name", unique = true, nullable = false, length = 50)
    private String roleName;
}
