package com.invoicingproject.spine.service;

import com.invoicingproject.spine.entity.User;
import com.invoicingproject.spine.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    // Constants for valid departments
    public static final String FINANCE_DEPARTMENT = "Finance";
    public static final String OPERATIONS_DEPARTMENT = "Operations";
    public static final String TRACE_SHEETS_DEPARTMENT = "Trace Sheets";

    // Valid departments
    public static final String[] VALID_DEPARTMENTS = {
            FINANCE_DEPARTMENT,
            OPERATIONS_DEPARTMENT,
            TRACE_SHEETS_DEPARTMENT
    };

    // Valid roles
    public static final String USER_ROLE = "USER";
    public static final String ADMIN_ROLE = "ADMIN";
    public static final String MANAGER_ROLE = "MANAGER";

    public static final String[] VALID_ROLES = {
            USER_ROLE,
            ADMIN_ROLE,
            MANAGER_ROLE
    };

    /**
     * Register a new user
     */
    public Map<String, Object> registerUser(String username, String password, String email,
            String name, String location, String department,
            String employeeNumber, String role) {

        Map<String, Object> response = new HashMap<>();

        // Validate input
        if (username == null || username.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Username is required");
            return response;
        }

        if (password == null || password.length() < 6) {
            response.put("success", false);
            response.put("message", "Password must be at least 6 characters");
            return response;
        }

        if (email == null || email.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Email is required");
            return response;
        }

        if (name == null || name.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Name is required");
            return response;
        }

        if (location == null || location.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Location is required");
            return response;
        }

        if (department == null || !isValidDepartment(department)) {
            response.put("success", false);
            response.put("message", "Invalid department selected");
            response.put("validDepartments", VALID_DEPARTMENTS);
            return response;
        }

        // Validate and set role (default to USER if not provided or invalid)
        if (role == null || role.trim().isEmpty() || !isValidRole(role)) {
            role = USER_ROLE; // Default to USER role
        }

        // Check if username already exists
        if (userRepository.existsByUsername(username)) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return response;
        }

        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return response;
        }

        // Check if employee number already exists (if provided)
        if (employeeNumber != null && !employeeNumber.trim().isEmpty() &&
                userRepository.existsByEmployeeNumber(employeeNumber)) {
            response.put("success", false);
            response.put("message", "Employee number already exists");
            return response;
        }

        try {
            // Encode password
            String encodedPassword = passwordEncoder.encode(password);

            // Create new user with validated role
            User user = new User(username, encodedPassword, email, name, location,
                    department, employeeNumber, role);

            // Save user
            User savedUser = userRepository.save(user);

            // Generate tokens
            String accessToken = jwtService.generateToken(username, department);
            String refreshToken = jwtService.generateRefreshToken(username);

            // Prepare response
            response.put("success", true);
            response.put("message", "User registered successfully");

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", savedUser.getId());
            userMap.put("username", savedUser.getUsername());
            userMap.put("email", savedUser.getEmail());
            userMap.put("name", savedUser.getName());
            userMap.put("location", savedUser.getLocation());
            userMap.put("department", savedUser.getDepartment());
            userMap.put("employeeNumber", savedUser.getEmployeeNumber());
            userMap.put("role", savedUser.getRole());
            response.put("user", userMap);

            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken);
            response.put("tokenType", "Bearer");

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
        }

        return response;
    }

    /**
     * Login user - supports username, email, or employee ID
     */
    public Map<String, Object> loginUser(String identifier, String password, String department) {

        Map<String, Object> response = new HashMap<>();

        // Validate input
        if (identifier == null || identifier.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Username, email, or employee ID is required");
            return response;
        }

        if (password == null || password.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Password is required");
            return response;
        }

        try {
            String identifierTrimmed = identifier.trim();
            Optional<User> userOptional = null;

            // Determine login method based on identifier format
            if (identifierTrimmed.contains("@")) {
                // Email login
                userOptional = userRepository.findByEmail(identifierTrimmed);
            } else if (identifierTrimmed.matches("\\d+")) {
                // Employee ID login (assuming numeric)
                userOptional = userRepository.findByEmployeeNumber(identifierTrimmed);
            } else {
                // Username login
                userOptional = userRepository.findByUsername(identifierTrimmed);
            }

            if (userOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "Invalid credentials");
                return response;
            }

            User user = userOptional.get();

            // Verify password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                response.put("success", false);
                response.put("message", "Invalid credentials");
                return response;
            }

            // Verify department if specified
            if (department != null && !department.trim().isEmpty()) {
                if (!user.getDepartment().equalsIgnoreCase(department)) {
                    response.put("success", false);
                    response.put("message", "User does not belong to the selected department");
                    return response;
                }
            }

            // Generate tokens
            String accessToken = jwtService.generateToken(user.getUsername(), user.getDepartment());
            String refreshToken = jwtService.generateRefreshToken(user.getUsername());

            // Get user permissions
            Map<String, Boolean> permissions = jwtService.getUserPermissions(user.getDepartment());

            // Add role-based permissions
            if (user.isAdmin()) {
                permissions.put("admin", true);
                permissions.put("userManagement", true);
                permissions.put("departmentManagement", true);
            }

            // Prepare response
            response.put("success", true);
            response.put("message", "Login successful");

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("name", user.getName());
            userMap.put("location", user.getLocation());
            userMap.put("department", user.getDepartment());
            userMap.put("employeeNumber", user.getEmployeeNumber());
            userMap.put("role", user.getRole());
            userMap.put("isAdmin", user.isAdmin());
            userMap.put("permissions", permissions);
            response.put("user", userMap);

            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken);
            response.put("tokenType", "Bearer");

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
        }

        return response;
    }

    /**
     * Admin: Create user with specific role
     */
    public Map<String, Object> createUserWithRole(String adminUsername, String username, String password,
            String email, String name, String location,
            String department, String employeeNumber, String role) {
        Map<String, Object> response = new HashMap<>();

        // Check if admin has permission
        Optional<User> adminUserOptional = userRepository.findByUsername(adminUsername);
        if (adminUserOptional.isEmpty() || !adminUserOptional.get().isAdmin()) {
            response.put("success", false);
            response.put("message", "Unauthorized: Admin privileges required");
            return response;
        }

        // Validate role
        if (!isValidRole(role)) {
            response.put("success", false);
            response.put("message", "Invalid role selected");
            response.put("validRoles", VALID_ROLES);
            return response;
        }

        // Create user with specified role
        Map<String, Object> userResponse = registerUser(username, password, email, name, location, department,
                employeeNumber, role);

        if ((Boolean) userResponse.get("success")) {
            // Update user role
            userRepository.updateUserRole(username, role);
            User createdUser = userRepository.findByUsername(username).get();

            userResponse.put("message", "User created successfully with role: " + role);

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", createdUser.getId());
            userMap.put("username", createdUser.getUsername());
            userMap.put("email", createdUser.getEmail());
            userMap.put("name", createdUser.getName());
            userMap.put("location", createdUser.getLocation());
            userMap.put("department", createdUser.getDepartment());
            userMap.put("employeeNumber", createdUser.getEmployeeNumber());
            userMap.put("role", createdUser.getRole());
            userMap.put("isAdmin", createdUser.isAdmin());
            userResponse.put("user", userMap);
        }

        return userResponse;
    }

    /**
     * Admin: Get all users
     */
    public Map<String, Object> getAllUsers(String adminUsername) {
        Map<String, Object> response = new HashMap<>();

        // Check if admin has permission
        Optional<User> adminUserOptional = userRepository.findByUsername(adminUsername);
        if (adminUserOptional.isEmpty() || !adminUserOptional.get().isAdmin()) {
            response.put("success", false);
            response.put("message", "Unauthorized: Admin privileges required");
            return response;
        }

        try {
            List<User> users = userRepository.findAll();
            List<Map<String, Object>> userList = users.stream().map(user -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("username", user.getUsername());
                userMap.put("email", user.getEmail());
                userMap.put("name", user.getName());
                userMap.put("location", user.getLocation());
                userMap.put("department", user.getDepartment());
                userMap.put("employeeNumber", user.getEmployeeNumber());
                userMap.put("role", user.getRole());
                userMap.put("isAdmin", user.isAdmin());
                userMap.put("createdAt", user.getCreatedAt());
                userMap.put("updatedAt", user.getUpdatedAt());
                return userMap;
            }).toList();

            response.put("success", true);
            response.put("users", userList);
            response.put("totalUsers", users.size());

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to get users: " + e.getMessage());
        }

        return response;
    }

    /**
     * Admin: Update user role
     */
    public Map<String, Object> updateUserRole(String adminUsername, String targetUsername, String newRole) {
        Map<String, Object> response = new HashMap<>();

        // Check if admin has permission
        Optional<User> adminUserOptional = userRepository.findByUsername(adminUsername);
        if (adminUserOptional.isEmpty() || !adminUserOptional.get().isAdmin()) {
            response.put("success", false);
            response.put("message", "Unauthorized: Admin privileges required");
            return response;
        }

        // Validate role
        if (!isValidRole(newRole)) {
            response.put("success", false);
            response.put("message", "Invalid role selected");
            response.put("validRoles", VALID_ROLES);
            return response;
        }

        try {
            // Find target user
            Optional<User> targetUserOptional = userRepository.findByUsername(targetUsername);
            if (targetUserOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "User not found");
                return response;
            }

            // Update role
            userRepository.updateUserRole(targetUsername, newRole);

            response.put("success", true);
            response.put("message", "User role updated successfully");
            response.put("user", targetUsername);
            response.put("newRole", newRole);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to update user role: " + e.getMessage());
        }

        return response;
    }

    /**
     * Get user profile by username
     */
    public Map<String, Object> getUserProfile(String username) {

        Map<String, Object> response = new HashMap<>();

        try {
            Optional<User> userOptional = userRepository.findByUsername(username);

            if (userOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "User not found");
                return response;
            }

            User user = userOptional.get();

            // Prepare response
            response.put("success", true);

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("name", user.getName());
            userMap.put("location", user.getLocation());
            userMap.put("department", user.getDepartment());
            userMap.put("employeeNumber", user.getEmployeeNumber());
            userMap.put("role", user.getRole());
            userMap.put("isAdmin", user.isAdmin());
            userMap.put("createdAt", user.getCreatedAt());
            userMap.put("updatedAt", user.getUpdatedAt());
            userMap.put("permissions", jwtService.getUserPermissions(user.getDepartment()));
            response.put("user", userMap);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to get user profile: " + e.getMessage());
        }

        return response;
    }

    /**
     * Refresh access token
     */
    public Map<String, Object> refreshToken(String refreshToken) {

        Map<String, Object> response = new HashMap<>();

        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Refresh token is required");
            return response;
        }

        try {
            // Validate refresh token
            if (!jwtService.isRefreshToken(refreshToken) || !jwtService.validateToken(refreshToken)) {
                response.put("success", false);
                response.put("message", "Invalid or expired refresh token");
                return response;
            }

            // Get username from token
            String username = jwtService.getUsernameFromToken(refreshToken);

            // Find user
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (userOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "User not found");
                return response;
            }

            User user = userOptional.get();

            // Generate new access token
            String newAccessToken = jwtService.generateToken(username, user.getDepartment());

            // Prepare response
            response.put("success", true);
            response.put("message", "Token refreshed successfully");
            response.put("accessToken", newAccessToken);
            response.put("tokenType", "Bearer");

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Token refresh failed: " + e.getMessage());
        }

        return response;
    }

    /**
     * Change user password
     */
    public Map<String, Object> changePassword(String username, String currentPassword, String newPassword) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate input
            if (username == null || username.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Username is required");
                return response;
            }

            if (currentPassword == null || currentPassword.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Current password is required");
                return response;
            }

            if (newPassword == null || newPassword.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "New password is required");
                return response;
            }

            if (newPassword.length() < 6) {
                response.put("success", false);
                response.put("message", "New password must be at least 6 characters long");
                return response;
            }

            if (currentPassword.equals(newPassword)) {
                response.put("success", false);
                response.put("message", "New password must be different from current password");
                return response;
            }

            // Find user
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (userOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "User not found");
                return response;
            }

            User user = userOptional.get();

            // Verify current password
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                response.put("success", false);
                response.put("message", "Current password is incorrect");
                return response;
            }

            // Encode new password
            String encodedNewPassword = passwordEncoder.encode(newPassword);

            // Update password using JPQL to avoid overwriting other fields
            userRepository.updateUserPassword(username, encodedNewPassword);

            response.put("success", true);
            response.put("message", "Password changed successfully");

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Password change failed: " + e.getMessage());
        }

        return response;
    }

    /**
     * Update user email
     */
    public Map<String, Object> updateEmail(String username, String newEmail) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate input
            if (username == null || username.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Username is required");
                return response;
            }

            if (newEmail == null || newEmail.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Email is required");
                return response;
            }

            // Basic email validation
            String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
            if (!newEmail.matches(emailRegex)) {
                response.put("success", false);
                response.put("message", "Invalid email format");
                return response;
            }

            // Find user
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (userOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "User not found");
                return response;
            }

            User user = userOptional.get();

            // Check if email already exists (and is not the current user's email)
            if (userRepository.existsByEmail(newEmail)) {
                Optional<User> existingUser = userRepository.findByEmail(newEmail);
                if (existingUser.isPresent() && !existingUser.get().getUsername().equals(username)) {
                    response.put("success", false);
                    response.put("message", "Email already exists");
                    return response;
                }
            }

            // Update email using JPQL to avoid overwriting other fields
            userRepository.updateUserEmail(username, newEmail);

            response.put("success", true);
            response.put("message", "Email updated successfully");
            response.put("email", newEmail);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Email update failed: " + e.getMessage());
        }

        return response;
    }

    /**
     * Validate if department is valid
     */
    public boolean isValidDepartment(String department) {
        if (department == null)
            return false;
        for (String validDept : VALID_DEPARTMENTS) {
            if (validDept.equalsIgnoreCase(department.trim())) {
                return true;
            }
        }
        return false;
    }

    /**
     * Validate if role is valid
     */
    public boolean isValidRole(String role) {
        if (role == null)
            return false;
        for (String validRole : VALID_ROLES) {
            if (validRole.equalsIgnoreCase(role.trim())) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get valid departments
     */
    public String[] getValidDepartments() {
        return VALID_DEPARTMENTS;
    }

    /**
     * Get valid roles
     */
    public String[] getValidRoles() {
        return VALID_ROLES;
    }
}
