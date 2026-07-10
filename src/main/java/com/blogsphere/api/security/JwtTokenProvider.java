package com.blogsphere.api.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * Utility component for generating and validating JWT tokens.
 *
 * <p>Uses jjwt 0.12.x with HMAC-SHA256 signing algorithm.
 * The secret key must be at least 256 bits (32 characters) long.</p>
 *
 * <p>Token structure:
 * <ul>
 *   <li>Subject: user's email address</li>
 *   <li>IssuedAt: current timestamp</li>
 *   <li>Expiration: configurable via {@code app.jwt.expiration}</li>
 * </ul>
 * </p>
 */
@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpiration;

    /**
     * Build the signing key from the configured secret.
     *
     * @return HMAC-SHA SecretKey
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
                java.util.Base64.getEncoder().encodeToString(jwtSecret.getBytes())
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generate a JWT token for a successfully authenticated user.
     *
     * @param authentication Spring Security Authentication object
     * @return signed JWT token string
     */
    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return buildToken(userDetails.getUsername());
    }

    /**
     * Generate a JWT token directly from an email address.
     * Used after registration to return a token without re-authenticating.
     *
     * @param email the user's email
     * @return signed JWT token string
     */
    public String generateTokenFromEmail(String email) {
        return buildToken(email);
    }

    private String buildToken(String subject) {
        Date now        = new Date();
        Date expiration = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .subject(subject)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extract the email (subject) from a JWT token.
     *
     * @param token the JWT token string
     * @return the email embedded in the token's subject claim
     */
    public String getEmailFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Validate a JWT token: check signature and expiry.
     *
     * @param token the JWT token string
     * @return true if valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (SignatureException ex) {
            log.error("Invalid JWT signature: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            log.error("JWT token has expired: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            log.error("JWT token is unsupported: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty: {}", ex.getMessage());
        }
        return false;
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
