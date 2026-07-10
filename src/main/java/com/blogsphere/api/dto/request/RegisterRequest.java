package com.blogsphere.api.dto.request;

import com.blogsphere.api.utils.AppConstants;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * Request DTO for user registration.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = AppConstants.MIN_NAME_LENGTH,
          max = AppConstants.MAX_NAME_LENGTH,
          message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = AppConstants.MIN_PASSWORD_LENGTH,
          max = AppConstants.MAX_PASSWORD_LENGTH,
          message = "Password must be between 6 and 100 characters")
    private String password;
}
