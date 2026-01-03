package com.invoicingproject.spine.service;

import com.invoicingproject.spine.entity.FinanceRole;
import com.invoicingproject.spine.entity.User;
import com.invoicingproject.spine.repository.FinanceRoleRepository;
import com.invoicingproject.spine.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FinanceRoleRepository financeRoleRepository;

    @Autowired
    private PermissionService permissionService;

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Update user role by ID
    public boolean updateUserRoleById(Long id, String role) {
        try {
            int rowsAffected = userRepository.updateUserRoleById(id, role.toUpperCase());
            if (rowsAffected > 0) {
                logger.info("Successfully updated role for user ID {} to {}", id, role);
                return true;
            } else {
                logger.warn("No user found with ID {} to update role", id);
                return false;
            }
        } catch (Exception e) {
            logger.error("Failed to update role for user ID {}: {}", id, e.getMessage(), e);
            return false;
        }
    }

    // Update multiple user roles
    public boolean updateMultipleUserRoles(List<Long> userIds, String newRole) {
        try {
            if (userIds.isEmpty()) {
                logger.warn("Empty user IDs list provided for bulk role update");
                return false;
            }

            logger.info("Starting bulk role update for {} users to role {}", userIds.size(), newRole);

            int updatedCount = 0;
            int failedCount = 0;
            for (Long userId : userIds) {
                try {
                    int rowsAffected = userRepository.updateUserRoleById(userId, newRole.toUpperCase());
                    if (rowsAffected > 0) {
                        updatedCount++;
                        logger.debug("Successfully updated role for user ID {}", userId);
                    } else {
                        failedCount++;
                        logger.warn("No rows affected for user ID {}", userId);
                    }
                } catch (Exception e) {
                    failedCount++;
                    logger.error("Failed to update role for user ID {}: {}", userId, e.getMessage());
                }
            }

            logger.info("Bulk role update completed. Requested: {}, Successful: {}, Failed: {}",
                    userIds.size(), updatedCount, failedCount);
            return updatedCount == userIds.size();
        } catch (Exception e) {
            logger.error("Critical error in bulk role update: {}", e.getMessage(), e);
            return false;
        }
    }

    // Get users with basic info for display (name, employee ID, role)
    public List<UserBasicInfo> getUsersBasicInfo() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> new UserBasicInfo(
                        user.getId(),
                        user.getName(),
                        user.getEmployeeNumber(),
                        user.getRoleName(), // Use the helper method to get role name
                        user.getDepartment()))
                .toList();
    }

    // Get role statistics from finance_roles table
    public RoleStats getRoleStatistics() {
        List<Object[]> roleCounts = financeRoleRepository.countUsersByRole();
        int totalUsers = roleCounts.stream()
                .mapToInt(row -> ((Number) row[1]).intValue())
                .sum();

        return new RoleStats(totalUsers, roleCounts);
    }

    // Available roles
    public List<String> getAvailableRoles() {
        return List.of("ADMIN", "USER", "MANAGER", "FINANCE");
    }

    // Validate role
    public boolean isValidRole(String role) {
        return getAvailableRoles().contains(role.toUpperCase());
    }

    // Update user role by username
    public boolean updateUserRoleByUsername(String username, String role) {
        try {
            userRepository.updateUserRole(username, role);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Find users by IDs for bulk operations
    public List<User> findUsersByIds(List<Long> ids) {
        return userRepository.findByIdIn(ids);
    }

    // ========================================
    // Permission-Based Access Control Methods
    // ========================================

    /**
     * Get permissions for a user based on their role ID
     */
    public Set<String> getUserPermissions(Long roleId) {
        if (roleId == null) {
            return new HashSet<>();
        }
        return permissionService.getPermissionNamesByRoleId(roleId);
    }

    /**
     * Check if a user has a specific permission
     */
    public boolean userHasPermission(Long roleId, String permissionName) {
        return permissionService.hasPermission(roleId, permissionName);
    }

    /**
     * Check if a user has permission for a specific resource and action
     */
    public boolean userHasResourcePermission(Long roleId, String resource, String action) {
        return permissionService.hasPermission(roleId, resource, action);
    }

    /**
     * Check if a user has any of the specified permissions
     */
    public boolean userHasAnyPermission(Long roleId, String... permissionNames) {
        return permissionService.userHasAnyPermission(roleId, permissionNames);
    }

    /**
     * Check if a user has all of the specified permissions
     */
    public boolean userHasAllPermissions(Long roleId, String... permissionNames) {
        return permissionService.userHasAllPermissions(roleId, permissionNames);
    }

    /**
     * Check if user can access finance dashboard
     */
    public boolean canAccessFinanceDashboard(Long roleId) {
        return permissionService.hasPermission(roleId, "FINANCE_DASHBOARD_ACCESS") ||
                permissionService.hasPermission(roleId, "dashboard", "finance_access") ||
                roleId == 2L; // ADMIN always has access
    }

    /**
     * Check if user can access operations dashboard
     */
    public boolean canAccessOperationsDashboard(Long roleId) {
        return permissionService.hasPermission(roleId, "OPERATIONS_DASHBOARD_ACCESS") ||
                permissionService.hasPermission(roleId, "dashboard", "operations_access") ||
                roleId == 2L; // ADMIN always has access
    }

    /**
     * Check if user can manage users (CRUD operations)
     */
    public boolean canManageUsers(Long roleId) {
        return permissionService.userHasAnyPermission(roleId,
                "USER_CREATE", "USER_UPDATE", "USER_DELETE", "USER_ASSIGN_ROLE") ||
                roleId == 2L; // ADMIN always has access
    }

    /**
     * Check if user can view audit logs
     */
    public boolean canViewAuditLogs(Long roleId) {
        return permissionService.hasPermission(roleId, "AUDIT_LOGS_VIEW") ||
                roleId == 2L; // ADMIN always has access
    }

    /**
     * Check if user can approve invoices
     */
    public boolean canApproveInvoices(Long roleId) {
        return permissionService.hasPermission(roleId, "INVOICE_APPROVE") ||
                roleId == 2L; // ADMIN always has access
    }

    /**
     * Check if user can export finance reports
     */
    public boolean canExportFinanceReports(Long roleId) {
        return permissionService.hasPermission(roleId, "FINANCE_REPORTS_EXPORT") ||
                roleId == 2L; // ADMIN always has access
    }

    /**
     * Get role-based access summary for a user
     */
    public AccessSummary getUserAccessSummary(Long roleId) {
        Set<String> permissions = getUserPermissions(roleId);
        Set<String> resources = new HashSet<>();

        for (String perm : permissions) {
            // Extract resource from permission name (e.g., USER_READ -> users)
            String resource = perm.substring(0, perm.lastIndexOf('_')).toLowerCase();
            resources.add(resource);
        }

        return new AccessSummary(
                roleId,
                getRoleNameById(roleId),
                permissions,
                resources,
                canAccessFinanceDashboard(roleId),
                canAccessOperationsDashboard(roleId),
                canManageUsers(roleId));
    }

    /**
     * Get role name by ID
     */
    public String getRoleNameById(Long roleId) {
        return financeRoleRepository.findById(roleId)
                .map(FinanceRole::getRoleName)
                .orElse("UNKNOWN");
    }

    // Inner classes for data transfer
    public static class UserBasicInfo {
        private Long id;
        private String name;
        private String employeeNumber;
        private String role;
        private String department;

        public UserBasicInfo(Long id, String name, String employeeNumber, String role, String department) {
            this.id = id;
            this.name = name;
            this.employeeNumber = employeeNumber;
            this.role = role;
            this.department = department;
        }

        // Getters
        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getEmployeeNumber() {
            return employeeNumber;
        }

        public String getRole() {
            return role;
        }

        public String getDepartment() {
            return department;
        }

        // Setters
        public void setId(Long id) {
            this.id = id;
        }

        public void setName(String name) {
            this.name = name;
        }

        public void setEmployeeNumber(String employeeNumber) {
            this.employeeNumber = employeeNumber;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public void setDepartment(String department) {
            this.department = department;
        }
    }

    public static class RoleStats {
        private int totalUsers;
        private List<Object[]> roleCounts;

        public RoleStats(int totalUsers, List<Object[]> roleCounts) {
            this.totalUsers = totalUsers;
            this.roleCounts = roleCounts;
        }

        // Getters
        public int getTotalUsers() {
            return totalUsers;
        }

        public List<Object[]> getRoleCounts() {
            return roleCounts;
        }
    }

    /**
     * Inner class for user access summary
     */
    public static class AccessSummary {
        private Long roleId;
        private String roleName;
        private Set<String> permissions;
        private Set<String> accessibleResources;
        private boolean canAccessFinanceDashboard;
        private boolean canAccessOperationsDashboard;
        private boolean canManageUsers;

        public AccessSummary(Long roleId, String roleName, Set<String> permissions,
                Set<String> accessibleResources, boolean canAccessFinanceDashboard,
                boolean canAccessOperationsDashboard, boolean canManageUsers) {
            this.roleId = roleId;
            this.roleName = roleName;
            this.permissions = permissions;
            this.accessibleResources = accessibleResources;
            this.canAccessFinanceDashboard = canAccessFinanceDashboard;
            this.canAccessOperationsDashboard = canAccessOperationsDashboard;
            this.canManageUsers = canManageUsers;
        }

        // Getters
        public Long getRoleId() {
            return roleId;
        }

        public String getRoleName() {
            return roleName;
        }

        public Set<String> getPermissions() {
            return permissions;
        }

        public Set<String> getAccessibleResources() {
            return accessibleResources;
        }

        public boolean isCanAccessFinanceDashboard() {
            return canAccessFinanceDashboard;
        }

        public boolean isCanAccessOperationsDashboard() {
            return canAccessOperationsDashboard;
        }

        public boolean isCanManageUsers() {
            return canManageUsers;
        }
    }
}
