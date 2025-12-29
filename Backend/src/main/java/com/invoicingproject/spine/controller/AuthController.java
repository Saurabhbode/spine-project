package com.invoicingproject.spine.controller;

import com.invoicingproject.spine.dto.AccountLinkingRequest;
import com.invoicingproject.spine.dto.AuthRequest;
import com.invoicingproject.spine.dto.AuthResponse;
import com.invoicingproject.spine.dto.CreateLinkedAccountRequest;
import com.invoicingproject.spine.service.AuthService;
import com.invoicingproject.spine.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    /**
     * Register a new user
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@Valid @RequestBody AuthRequest request) {
        try {
            Map<String, Object> result = authService.registerUser(
                    request.getUsername(),
                    request.getPassword(),
                    request.getEmail(),
                    request.getName(),
                    request.getLocation(),
                    request.getDepartment(),
                    request.getEmployeeNumber(),
                    request.getRole());

            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Registration failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Login user - supports username, email, or employee ID
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@Valid @RequestBody AuthRequest request) {
        try {
            // Use username field as identifier for backward compatibility
            Map<String, Object> result = authService.loginUser(
                    request.getUsername(),
                    request.getPassword(),
                    request.getDepartment());

            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Login failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Refresh access token
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshToken(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");
            Map<String, Object> result = authService.refreshToken(refreshToken);

            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Token refresh failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Get user profile
     * GET /api/auth/profile?username={username}
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(@RequestParam String username) {
        try {
            Map<String, Object> result = authService.getUserProfile(username);

            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Failed to get profile: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Get valid departments
     * GET /api/auth/departments
     */
    @GetMapping("/departments")
    public ResponseEntity<Map<String, Object>> getValidDepartments() {
        try {
            String[] departments = authService.getValidDepartments();

            Map<String, Object> response = Map.of(
                    "success", true,
                    "departments", departments);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Failed to get departments: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Health check endpoint
     * GET /api/auth/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = Map.of(
                "status", "UP",
                "service", "Spine Auth Service",
                "timestamp", java.time.LocalDateTime.now().toString(),
                "endpoints", Map.of(
                        "register", "POST /api/auth/register",
                        "login", "POST /api/auth/login",
                        "refresh", "POST /api/auth/refresh",
                        "profile", "GET /api/auth/profile",
                        "departments", "GET /api/auth/departments"));

        return ResponseEntity.ok(response);
    }

    /**
     * Change user password
     * POST /api/auth/change-password
     */
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            // Extract token from Authorization header
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                Map<String, Object> errorResponse = Map.of(
                        "success", false,
                        "message", "Authorization token required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            String token = authorizationHeader.substring(7); // Remove "Bearer " prefix

            // Validate token and get username
            if (!jwtService.validateToken(token)) {
                Map<String, Object> errorResponse = Map.of(
                        "success", false,
                        "message", "Invalid or expired token");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            String username = jwtService.getUsernameFromToken(token);
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");

            if (username == null) {
                Map<String, Object> errorResponse = Map.of(
                        "success", false,
                        "message", "Invalid token payload");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            Map<String, Object> result = authService.changePassword(username, currentPassword, newPassword);

            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Password change failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Update user email
     * POST /api/auth/update-email
     */
    @PostMapping("/update-email")
    public ResponseEntity<Map<String, Object>> updateEmail(
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            // Extract token from Authorization header
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                Map<String, Object> errorResponse = Map.of(
                        "success", false,
                        "message", "Authorization token required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            String token = authorizationHeader.substring(7); // Remove "Bearer " prefix

            // Validate token and get username
            if (!jwtService.validateToken(token)) {
                Map<String, Object> errorResponse = Map.of(
                        "success", false,
                        "message", "Invalid or expired token");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            String username = jwtService.getUsernameFromToken(token);
            String newEmail = request.get("email");

            if (username == null) {
                Map<String, Object> errorResponse = Map.of(
                        "success", false,
                        "message", "Invalid token payload");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            Map<String, Object> result = authService.updateEmail(username, newEmail);

            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", "Email update failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
