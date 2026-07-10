package com.blogsphere.api.security;

import com.blogsphere.api.utils.AppConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT authentication filter — runs once per request.
 *
 * <p>Intercepts every HTTP request and:
 * <ol>
 *   <li>Extracts the JWT token from the {@code Authorization: Bearer <token>} header</li>
 *   <li>Validates the token signature and expiry</li>
 *   <li>Loads the user from the database via their email</li>
 *   <li>Sets the authentication in Spring Security's {@code SecurityContextHolder}</li>
 * </ol>
 * </p>
 */
@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider         jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider,
                                   CustomUserDetailsService userDetailsService) {
        this.jwtTokenProvider   = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            String token = extractTokenFromRequest(request);

            if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
                String email = jwtTokenProvider.getEmailFromToken(token);

                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
                log.debug("Authenticated user '{}' via JWT", email);
            }
        } catch (Exception ex) {
            log.error("Could not set user authentication in security context: {}", ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Extract the raw JWT token from the Authorization header.
     *
     * @param request the incoming HTTP request
     * @return the token string if present and properly formatted, otherwise null
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AppConstants.AUTHORIZATION_HEADER);

        if (StringUtils.hasText(bearerToken) &&
                bearerToken.startsWith(AppConstants.TOKEN_PREFIX)) {
            return bearerToken.substring(AppConstants.TOKEN_PREFIX.length());
        }
        return null;
    }
}
