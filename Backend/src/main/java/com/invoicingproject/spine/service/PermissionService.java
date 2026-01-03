package com.invoicingproject.spine.service;

import com.invoicingproject.spine.entity.Permission;
import com.invoicingproject.spine.repository.PermissionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class PermissionService {

    private static final Logger logger = LoggerFactory.getLogger(PermissionService.class);

    @Autowired
    private PermissionRepository permissionRepository;

    // Get all permissions
    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    // Get all active permissions
    public List<Permission> getAllActivePermissions() {
        return permissionRepository.findAllActive();
    }

    // Get permission by ID
    public Optional<Permission> getPermissionById(Long id) {
        return permissionRepository.findById(id);
    }

    // Get permission by name
    public Optional<Permission> getPermissionByName(String name) {
        return permissionRepository.findByName(name);
    }

    // Get permissions by resource
    public List<Permission> getPermissionsByResource(String resource) {
        return permissionRepository.findByResource(resource);
    }

    // Get permissions by role ID
    public List<Permission> getPermissionsByRoleId(Long roleId) {
        return permissionRepository.findByRoleId(roleId);
    }

    // Get permissions by role name
    public List<Permission> getPermissionsByRoleName(String roleName) {
        return permissionRepository.findByRoleName(roleName);
    }

    // Get permission names set by role ID
    public Set<String> getPermissionNamesByRoleId(Long roleId) {
        return permissionRepository.getPermissionNamesByRoleId(roleId);
    }

    // Get permission keys (resource:action) by role ID
    public Set<String> getPermissionKeysByRoleId(Long roleId) {
        return permissionRepository.getPermissionKeysByRoleId(roleId);
    }

    // Check if role has a specific permission
    public boolean hasPermission(Long roleId, String permissionName) {
        Set<String> permissions = permissionRepository.getPermissionNamesByRoleId(roleId);
        return permissions.contains(permissionName);
    }

    // Check if role has permission for a specific resource and action
    public boolean hasPermission(Long roleId, String resource, String action) {
        Set<String> permissionKeys = permissionRepository.getPermissionKeysByRoleId(roleId);
        String key = resource + ":" + action;
        return permissionKeys.contains(key);
    }

    // Check if user has permission (based on user's role)
    public boolean userHasPermission(Long userRoleId, String permissionName) {
        return hasPermission(userRoleId, permissionName);
    }

    // Check if user has any of the specified permissions
    public boolean userHasAnyPermission(Long userRoleId, String... permissionNames) {
        Set<String> userPermissions = permissionRepository.getPermissionNamesByRoleId(userRoleId);
        for (String permission : permissionNames) {
            if (userPermissions.contains(permission)) {
                return true;
            }
        }
        return false;
    }

    // Check if user has all specified permissions
    public boolean userHasAllPermissions(Long userRoleId, String... permissionNames) {
        Set<String> userPermissions = permissionRepository.getPermissionNamesByRoleId(userRoleId);
        for (String permission : permissionNames) {
            if (!userPermissions.contains(permission)) {
                return false;
            }
        }
        return true;
    }

    // Check if user has permission for resource:action
    public boolean userHasResourcePermission(Long userRoleId, String resource, String action) {
        return hasPermission(userRoleId, resource, action);
    }

    // Get permission statistics by resource
    public List<Object[]> getPermissionStatsByResource() {
        return permissionRepository.countByResource();
    }

    // Available permission resources
    public List<String> getAvailableResources() {
        return List.of("users", "roles", "invoices", "dashboard", "reports", "trace_sheets", "system", "audit");
    }

    // Available actions
    public List<String> getAvailableActions() {
        return List.of("read", "create", "update", "delete", "approve", "reject",
                "assign_role", "assign_permission", "access", "export", "view", "settings");
    }

    // Inner class for permission check result
    public static class PermissionCheckResult {
        private boolean allowed;
        private String reason;
        private String requiredPermission;

        public PermissionCheckResult(boolean allowed, String reason) {
            this.allowed = allowed;
            this.reason = reason;
        }

        public PermissionCheckResult(boolean allowed, String reason, String requiredPermission) {
            this.allowed = allowed;
            this.reason = reason;
            this.requiredPermission = requiredPermission;
        }

        public boolean isAllowed() {
            return allowed;
        }

        public String getReason() {
            return reason;
        }

        public String getRequiredPermission() {
            return requiredPermission;
        }
    }

    // Check permission with detailed result
    public PermissionCheckResult checkPermission(Long roleId, String permissionName) {
        if (roleId == null) {
            return new PermissionCheckResult(false, "User has no role assigned", permissionName);
        }

        if (!permissionRepository.existsByName(permissionName)) {
            return new PermissionCheckResult(false, "Permission does not exist: " + permissionName, permissionName);
        }

        boolean hasPermission = hasPermission(roleId, permissionName);
        if (hasPermission) {
            return new PermissionCheckResult(true, "Permission granted", permissionName);
        } else {
            return new PermissionCheckResult(false, "Permission denied. User role does not have: " + permissionName,
                    permissionName);
        }
    }
}
