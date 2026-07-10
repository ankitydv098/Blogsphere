package com.blogsphere.api.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger / OpenAPI 3 configuration for BlogSphere API.
 *
 * <p>Configures:
 * <ul>
 *   <li>API metadata (title, version, description, contact)</li>
 *   <li>Bearer JWT security scheme</li>
 *   <li>Global security requirement so the "Authorize" button appears in Swagger UI</li>
 * </ul>
 * </p>
 *
 * <p>Access Swagger UI at: <a href="http://localhost:8080/swagger-ui.html">
 * http://localhost:8080/swagger-ui.html</a></p>
 */
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title       = "BlogSphere API",
        version     = "v1.0.0",
        description = "Production-quality REST API for a blogging platform — featuring JWT authentication, " +
                      "role-based access control, blog posts, categories, and comments.",
        contact = @Contact(
            name  = "BlogSphere Team",
            email = "support@blogsphere.com",
            url   = "https://github.com/blogsphere"
        ),
        license = @License(
            name = "MIT License",
            url  = "https://opensource.org/licenses/MIT"
        )
    ),
    servers = {
        @Server(url = "http://localhost:8080", description = "Local Development"),
        @Server(url = "https://api.blogsphere.com", description = "Production")
    },
    security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
    name         = "bearerAuth",
    type         = SecuritySchemeType.HTTP,
    scheme       = "bearer",
    bearerFormat = "JWT",
    in           = SecuritySchemeIn.HEADER,
    description  = "JWT token obtained from /api/auth/login. Format: Bearer <token>"
)
public class SwaggerConfig {
    // All configuration is done via annotations above.
}
