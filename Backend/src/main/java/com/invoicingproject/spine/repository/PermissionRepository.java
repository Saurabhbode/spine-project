package com.invoicingproject.spine.repository;

import com.invoicingproject.spine.entity.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public class PermissionRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Permission> permissionRowMapper = new RowMapper<Permission>() {
        @Override
        public Permission mapRow(ResultSet rs, int rowNum) throws SQLException {
            Permission permission = new Permission();
            permission.setId(rs.getLong("id"));
            permission.setPermissionName(rs.getString("permission_name"));
            permission.setPermissionDescription(rs.getString("permission_description"));
            permission.setResource(rs.getString("resource"));
            permission.setAction(rs.getString("action"));

            Timestamp createdAt = rs.getTimestamp("created_at");
            Timestamp updatedAt = rs.getTimestamp("updated_at");
            permission.setCreatedAt(createdAt != null ? createdAt.toLocalDateTime() : null);
            permission.setUpdatedAt(updatedAt != null ? updatedAt.toLocalDateTime() : null);

            Boolean isActive = rs.getBoolean("is_active");
            permission.setIsActive(isActive);

            return permission;
        }
    };

    // Find all permissions
    public List<Permission> findAll() {
        try {
            String sql = "SELECT * FROM permissions ORDER BY resource, action";
            return jdbcTemplate.query(sql, permissionRowMapper);
        } catch (Exception e) {
            return List.of();
        }
    }

    // Find all active permissions
    public List<Permission> findAllActive() {
        try {
            String sql = "SELECT * FROM permissions WHERE is_active = true ORDER BY resource, action";
            return jdbcTemplate.query(sql, permissionRowMapper);
        } catch (Exception e) {
            return List.of();
        }
    }

    // Find permission by ID
    public Optional<Permission> findById(Long id) {
        try {
            String sql = "SELECT * FROM permissions WHERE id = ?";
            List<Permission> permissions = jdbcTemplate.query(sql, permissionRowMapper, id);
            return permissions.isEmpty() ? Optional.empty() : Optional.of(permissions.get(0));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    // Find permission by name
    public Optional<Permission> findByName(String permissionName) {
        try {
            String sql = "SELECT * FROM permissions WHERE permission_name = ?";
            List<Permission> permissions = jdbcTemplate.query(sql, permissionRowMapper, permissionName);
            return permissions.isEmpty() ? Optional.empty() : Optional.of(permissions.get(0));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    // Find permissions by resource
    public List<Permission> findByResource(String resource) {
        try {
            String sql = "SELECT * FROM permissions WHERE resource = ? AND is_active = true ORDER BY action";
            return jdbcTemplate.query(sql, permissionRowMapper, resource);
        } catch (Exception e) {
            return List.of();
        }
    }

    // Find permissions by role ID
    public List<Permission> findByRoleId(Long roleId) {
        try {
            String sql = "SELECT p.* FROM permissions p " +
                    "INNER JOIN role_permissions rp ON p.id = rp.permission_id " +
                    "WHERE rp.role_id = ? AND p.is_active = true " +
                    "ORDER BY p.resource, p.action";
            return jdbcTemplate.query(sql, permissionRowMapper, roleId);
        } catch (Exception e) {
            return List.of();
        }
    }

    // Find permissions by role name
    public List<Permission> findByRoleName(String roleName) {
        try {
            String sql = "SELECT p.* FROM permissions p " +
                    "INNER JOIN role_permissions rp ON p.id = rp.permission_id " +
                    "INNER JOIN finance_roles fr ON rp.role_id = fr.id " +
                    "WHERE fr.role_name = ? AND p.is_active = true " +
                    "ORDER BY p.resource, p.action";
            return jdbcTemplate.query(sql, permissionRowMapper, roleName);
        } catch (Exception e) {
            return List.of();
        }
    }

    // Check if permission exists by name
    public boolean existsByName(String permissionName) {
        try {
            String sql = "SELECT COUNT(*) FROM permissions WHERE permission_name = ?";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, permissionName);
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }

    // Get permission names set for a role
    public Set<String> getPermissionNamesByRoleId(Long roleId) {
        try {
            String sql = "SELECT p.permission_name FROM permissions p " +
                    "INNER JOIN role_permissions rp ON p.id = rp.permission_id " +
                    "WHERE rp.role_id = ? AND p.is_active = true";
            List<String> names = jdbcTemplate.queryForList(sql, String.class, roleId);
            return new HashSet<>(names);
        } catch (Exception e) {
            return new HashSet<>();
        }
    }

    // Get permission keys (resource:action) for a role
    public Set<String> getPermissionKeysByRoleId(Long roleId) {
        try {
            String sql = "SELECT CONCAT(p.resource, ':', p.action) as perm_key FROM permissions p " +
                    "INNER JOIN role_permissions rp ON p.id = rp.permission_id " +
                    "WHERE rp.role_id = ? AND p.is_active = true";
            List<String> keys = jdbcTemplate.queryForList(sql, String.class, roleId);
            return new HashSet<>(keys);
        } catch (Exception e) {
            return new HashSet<>();
        }
    }

    // Count permissions by resource
    public List<Object[]> countByResource() {
        try {
            String sql = "SELECT resource, COUNT(*) as count FROM permissions WHERE is_active = true GROUP BY resource ORDER BY resource";
            return jdbcTemplate.queryForList(sql).stream()
                    .map(row -> new Object[] { row.get("resource"), row.get("count") })
                    .toList();
        } catch (Exception e) {
            return List.of();
        }
    }
}
