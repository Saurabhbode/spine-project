package com.invoicingproject.spine.repository;

import com.invoicingproject.spine.entity.FinanceRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class FinanceRoleRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final @NonNull RowMapper<FinanceRole> roleRowMapper = new RowMapper<FinanceRole>() {
        @Override
        public FinanceRole mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
            FinanceRole role = new FinanceRole();
            role.setId(rs.getLong("id"));
            role.setRoleName(rs.getString("role_name"));
            role.setRoleDescription(rs.getString("role_description"));

            Timestamp createdAt = rs.getTimestamp("created_at");
            Timestamp updatedAt = rs.getTimestamp("updated_at");
            role.setCreatedAt(createdAt != null ? createdAt.toLocalDateTime() : null);
            role.setUpdatedAt(updatedAt != null ? updatedAt.toLocalDateTime() : null);

            Boolean isActive = rs.getBoolean("is_active");
            role.setIsActive(isActive);

            return role;
        }
    };

    // Find all roles
    public List<FinanceRole> findAll() {
        try {
            String sql = "SELECT * FROM finance_roles ORDER BY role_name";
            return jdbcTemplate.query(sql, roleRowMapper);
        } catch (Exception e) {
            return List.of();
        }
    }

    // Find all active roles
    public List<FinanceRole> findAllActive() {
        try {
            String sql = "SELECT * FROM finance_roles WHERE is_active = true ORDER BY role_name";
            return jdbcTemplate.query(sql, roleRowMapper);
        } catch (Exception e) {
            return List.of();
        }
    }

    // Find role by ID
    public Optional<FinanceRole> findById(Long id) {
        try {
            String sql = "SELECT * FROM finance_roles WHERE id = ?";
            List<FinanceRole> roles = jdbcTemplate.query(sql, roleRowMapper, id);
            return roles.isEmpty() ? Optional.empty() : Optional.of(roles.get(0));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    // Find role by name
    public Optional<FinanceRole> findByName(String roleName) {
        try {
            String sql = "SELECT * FROM finance_roles WHERE role_name = ?";
            List<FinanceRole> roles = jdbcTemplate.query(sql, roleRowMapper, roleName);
            return roles.isEmpty() ? Optional.empty() : Optional.of(roles.get(0));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    // Save role
    public FinanceRole save(FinanceRole role) {
        String sql = "INSERT INTO finance_roles (role_name, role_description, is_active, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, ?)";

        LocalDateTime now = LocalDateTime.now();
        role.setCreatedAt(now);
        role.setUpdatedAt(now);
        if (role.getIsActive() == null) {
            role.setIsActive(true);
        }

        jdbcTemplate.update(sql,
                role.getRoleName(),
                role.getRoleDescription(),
                role.getIsActive(),
                role.getCreatedAt(),
                role.getUpdatedAt());

        String idSql = "SELECT LAST_INSERT_ID()";
        Long id = jdbcTemplate.queryForObject(idSql, Long.class);
        role.setId(id);

        return role;
    }

    // Check if role exists - optimized with LIMIT 1
    public boolean existsByName(String roleName) {
        try {
            String sql = "SELECT 1 FROM finance_roles WHERE role_name = ? LIMIT 1";
            return jdbcTemplate.queryForObject(sql, Integer.class, roleName) != null;
        } catch (Exception e) {
            return false;
        }
    }

    // Get role ID by name
    public Long getRoleIdByName(String roleName) {
        try {
            String sql = "SELECT id FROM finance_roles WHERE role_name = ?";
            return jdbcTemplate.queryForObject(sql, Long.class, roleName.toUpperCase());
        } catch (Exception e) {
            return null;
        }
    }

    // Count users by role
    public List<Object[]> countUsersByRole() {
        try {
            String sql = "SELECT fr.role_name, COUNT(u.id) as user_count FROM finance_roles fr LEFT JOIN users u ON fr.id = u.role_id GROUP BY fr.id, fr.role_name ORDER BY fr.id";
            return jdbcTemplate.queryForList(sql).stream()
                    .map(row -> new Object[] { row.get("role_name"), row.get("user_count") })
                    .toList();
        } catch (Exception e) {
            return List.of();
        }
    }

    // Deactivate role
    public boolean deactivateRole(Long roleId) {
        try {
            String sql = "UPDATE finance_roles SET is_active = false, updated_at = NOW() WHERE id = ?";
            int rowsAffected = jdbcTemplate.update(sql, roleId);
            return rowsAffected > 0;
        } catch (Exception e) {
            return false;
        }
    }

    // Activate role
    public boolean activateRole(Long roleId) {
        try {
            String sql = "UPDATE finance_roles SET is_active = true, updated_at = NOW() WHERE id = ?";
            int rowsAffected = jdbcTemplate.update(sql, roleId);
            return rowsAffected > 0;
        } catch (Exception e) {
            return false;
        }
    }
}
