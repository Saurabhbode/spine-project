package com.invoicingproject.spine.controller;
import com.invoicingproject.spine.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" })
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private UserService userService;

    // Health check endpoint for debugging
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "AdminController is working");
        response.put("timestamp", System.currentTimeMillis());

        // Test database connection
        try {
            int userCount = userService.getAllUsers().size();
            response.put("databaseConnected", true);
            response.put("userCount", userCount);
        } catch (Exception e) {
            response.put("databaseConnected", false);
            response.put("databaseError", e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        try {
            System.out.println("AdminController.getAllUsers() called");
            System.out.println("UserService is null? " + (userService == null));

            if (userService == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "UserService is not injected");
                return ResponseEntity.internalServerError().body(errorResponse);
            }

            List<UserService.UserBasicInfo> users = userService.getUsersBasicInfo();
            System.out.println("Fetched " + (users != null ? users.size() : "null") + " users");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("users", users != null ? users : List.of());
            response.put("total", users != null ? users.size() : 0);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in getAllUsers: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch users: " + e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());

            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Get specific user by ID
    @GetMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        try {
            return userService.getUserById(id)
                    .map(user -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", true);
                        response.put("user", user);
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        Map<String, Object> errorResponse = new HashMap<>();
                        errorResponse.put("success", false);
                        errorResponse.put("message", "User not found");
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch user: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Update single user role
    @PutMapping("/users/{id}/role")
    public ResponseEntity<Map<String, Object>> updateUserRole(@PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String role = request.get("role");

            if (role == null || role.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Role is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            if (!userService.isValidRole(role)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Invalid role: " + role);
                return ResponseEntity.badRequest().body(errorResponse);
            }

            logger.info("Updating role for user ID {} to {}", id, role.toUpperCase());
            boolean updated = userService.updateUserRoleById(id, role.toUpperCase());

            if (updated) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "User role updated successfully");
                logger.info("Successfully updated role for user ID {}", id);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Failed to update user role - user not found or database error");
                logger.warn("Failed to update role for user ID {}", id);
                return ResponseEntity.internalServerError().body(errorResponse);
            }
        } catch (Exception e) {
            logger.error("Error updating role for user ID {}: {}", id, e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to update user role: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Bulk update multiple user roles
    @PutMapping("/users/roles")
    public ResponseEntity<Map<String, Object>> updateMultipleUserRoles(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Long> userIds = ((List<Number>) request.get("userIds")).stream()
                    .map(Number::longValue)
                    .toList();
            String role = (String) request.get("role");

            if (userIds == null || userIds.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "User IDs are required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            if (role == null || role.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Role is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            if (!userService.isValidRole(role)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Invalid role: " + role);
                return ResponseEntity.badRequest().body(errorResponse);
            }

            logger.info("Bulk updating roles for {} users to {}", userIds.size(), role.toUpperCase());
            boolean updated = userService.updateMultipleUserRoles(userIds, role.toUpperCase());

            if (updated) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Roles updated successfully for " + userIds.size() + " users");
                response.put("updatedCount", userIds.size());
                logger.info("Successfully updated roles for {} users", userIds.size());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message",
                        "Failed to update user roles - some users may not exist or database error");
                errorResponse.put("debugInfo", "updateMultipleUserRoles returned false");
                logger.warn("Failed to update roles for bulk users - updateMultipleUserRoles returned false");
                return ResponseEntity.internalServerError().body(errorResponse);
            }
        } catch (Exception e) {
            logger.error("Error updating multiple user roles: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to update user roles: " + e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            errorResponse.put("stackTrace", e.getStackTrace());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Get available roles
    @GetMapping("/roles")
    public ResponseEntity<Map<String, Object>> getAvailableRoles() {
        try {
            List<String> roles = userService.getAvailableRoles();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("roles", roles);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch roles: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Get role statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getRoleStatistics() {
        try {
            UserService.RoleStats stats = userService.getRoleStatistics();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stats", stats);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch statistics: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
