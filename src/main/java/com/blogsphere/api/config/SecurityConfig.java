package com.blogsphere.api.config;

import com.blogsphere.api.security.CustomUserDetailsService;
import com.blogsphere.api.security.JwtAuthenticationFilter;
import com.blogsphere.api.utils.AppConstants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

/**
 * Spring Security 6 configuration for BlogSphere API.
 *
 * <p>Security rules:
 * <ul>
 *   <li><strong>PUBLIC</strong>: Register, Login, GET posts, GET categories, Search, Swagger</li>
 *   <li><strong>USER</strong>: Create/update/delete own posts, add comments</li>
 *   <li><strong>ADMIN</strong>: Manage categories, delete any user/post, manage roles</li>
 * </ul>
 * </p>
 *
 * <p>Sessions are stateless — JWT is used for every request.</p>
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter  jwtAuthenticationFilter;

    public SecurityConfig(CustomUserDetailsService userDetailsService,
                          JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService        = userDetailsService;
        this.jwtAuthenticationFilter   = jwtAuthenticationFilter;
    }

    // ======================== SECURITY FILTER CHAIN ========================

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Disable CSRF — stateless REST API uses JWT, not cookies
            .csrf(AbstractHttpConfigurer::disable)

            // Stateless session — no HttpSession
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Authorization rules
            .authorizeHttpRequests(auth -> auth

                // ── Swagger / OpenAPI UI ──
                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/api-docs/**",
                    "/v3/api-docs/**"
                ).permitAll()

                // ── Authentication endpoints ──
                .requestMatchers("/api/auth/**").permitAll()

                // ── Public read access to posts, categories, images ──
                .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/images/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll()

                // ── Admin-only category management ──
                .requestMatchers(HttpMethod.POST, "/api/categories/**")
                    .hasAuthority(AppConstants.ROLE_ADMIN)
                .requestMatchers(HttpMethod.PUT, "/api/categories/**")
                    .hasAuthority(AppConstants.ROLE_ADMIN)
                .requestMatchers(HttpMethod.DELETE, "/api/categories/**")
                    .hasAuthority(AppConstants.ROLE_ADMIN)

                // ── Everything else requires authentication ──
                .anyRequest().authenticated()
            )

            // Use our custom UserDetailsService + DAO provider
            .authenticationProvider(authenticationProvider())

            // Register JWT filter before the standard auth filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ======================== AUTHENTICATION PROVIDER ========================

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // ======================== CORS CONFIGURATION ========================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control", "Access-Control-Allow-Origin"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // ======================== PASSWORD ENCODER ========================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
