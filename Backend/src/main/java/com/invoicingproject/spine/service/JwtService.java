package com.invoicingproject.spine.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    
    @Value("${jwt.secret:mySecretKey123456789012345678901234567890}")
    private String jwtSecret;
    
    @Value("${jwt.expiration:86400000}") // 24 hours in milliseconds
    private Long jwtExpirationInMs;
    
    @Value("${jwt.refresh.expiration:604800000}") // 7 days in milliseconds
    private Long refreshTokenExpirationInMs;
    
    /**
     * Generate JWT token with user claims
     */
    public String generateToken(String username, String department) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("department", department);
        claims.put("roles", getUserRoles(department));
        return createToken(claims, username);
    }
    
    /**
     * Generate refresh token
     */
    public String generateRefreshToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        return createToken(claims, username);
    }
    
    /**
     * Create token with claims and subject
     */
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    /**
     * Get username from token
     */
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }
    
    /**
     * Get department from token
     */
    public String getDepartmentFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return (String) claims.get("department");
    }
    
    /**
     * Get user roles based on department
     */
    public String[] getUserRoles(String department) {
        switch (department.toLowerCase()) {
            case "finance":
                return new String[]{"ROLE_USER", "ROLE_FINANCE"};
            case "operations":
                return new String[]{"ROLE_USER", "ROLE_OPERATIONS"};
            case "trace sheets":
                return new String[]{"ROLE_USER", "ROLE_TRACE_SHEETS"};
            default:
                return new String[]{"ROLE_USER"};
        }
    }
    
    /**
     * Get expiration date from token
     */
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }
    
    /**
     * Get specific claim from token
     */
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }
    
    /**
     * Get all claims from token
     */
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    /**
     * Check if token is expired
     */
    public Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }
    
    /**
     * Validate token
     */
    public Boolean validateToken(String token, String username) {
        try {
            final String tokenUsername = getUsernameFromToken(token);
            return (tokenUsername.equals(username) && !isTokenExpired(token));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    
    /**
     * Validate token without username check (for refresh tokens)
     */
    public Boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    
    /**
     * Get token type from token
     */
    public String getTokenType(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return (String) claims.get("type");
        } catch (Exception e) {
            return "access";
        }
    }
    
    /**
     * Check if token is a refresh token
     */
    public Boolean isRefreshToken(String token) {
        String type = getTokenType(token);
        return "refresh".equals(type);
    }
    
    /**
     * Get signing key for JWT
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    /**
     * Get token expiration time in milliseconds
     */
    public Long getJwtExpirationInMs() {
        return jwtExpirationInMs;
    }
    
    /**
     * Get refresh token expiration time in milliseconds
     */
    public Long getRefreshTokenExpirationInMs() {
        return refreshTokenExpirationInMs;
    }
    
    /**
     * Extract user ID from token (if needed)
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        Object userId = claims.get("userId");
        return userId != null ? Long.valueOf(userId.toString()) : null;
    }
    
    /**
     * Get user permissions based on department
     */
    public Map<String, Boolean> getUserPermissions(String department) {
        Map<String, Boolean> permissions = new HashMap<>();
        
        // Base permissions for all users
        permissions.put("read_own_data", true);
        permissions.put("update_own_profile", true);
        
        switch (department.toLowerCase()) {
            case "finance":
                permissions.put("view_financial_reports", true);
                permissions.put("manage_invoices", true);
                permissions.put("view_budgets", true);
                permissions.put("export_financial_data", true);
                break;
            case "operations":
                permissions.put("view_operations_data", true);
                permissions.put("manage_workflows", true);
                permissions.put("view_processes", true);
                permissions.put("manage_operational_reports", true);
                break;
            case "trace sheets":
                permissions.put("view_trace_data", true);
                permissions.put("manage_documents", true);
                permissions.put("view_audit_trails", true);
                permissions.put("manage_compliance", true);
                break;
        }
        
        return permissions;
    }
}
