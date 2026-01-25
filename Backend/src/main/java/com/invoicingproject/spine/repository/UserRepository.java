package com.invoicingproject.spine.repository;

import com.invoicingproject.spine.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

        private static final Logger logger = LoggerFactory.getLogger(UserRepository.class);

        @Autowired
        private JdbcTemplate jdbcTemplate;

        private final @NonNull RowMapper<User> userRowMapper = new RowMapper<User>() {
                @Override
                public User mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
                        User user = new User();
                        user.setId(rs.getLong("id"));
                        user.setUsername(rs.getString("username"));
                        user.setPassword(rs.getString("password"));
                        user.setEmail(rs.getString("email"));
                        user.setName(rs.getString("name"));
                        user.setLocation(rs.getString("location"));
                        user.setDepartment(rs.getString("department"));
                        user.setEmployeeNumber(rs.getString("employee_number"));

                        // Handle role_id column (foreign key to finance_roles table)
                        try {
                                user.setRoleId(rs.getLong("role_id"));
                        } catch (SQLException e) {
                                // Column might not exist in older databases
                                user.setRoleId(1L); // Default to USER
                        }

                        // Handle nullable timestamps
                        Timestamp createdAt = rs.getTimestamp("created_at");
                        Timestamp updatedAt = rs.getTimestamp("updated_at");
                        user.setCreatedAt(createdAt != null ? createdAt.toLocalDateTime() : null);
                        user.setUpdatedAt(updatedAt != null ? updatedAt.toLocalDateTime() : null);

                        return user;
                }
        };

        // Find user by username
        public Optional<User> findByUsername(String username) {
                try {
                        String sql = "SELECT * FROM users WHERE username = ?";
                        List<User> users = jdbcTemplate.query(sql, userRowMapper, username);
                        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
                } catch (Exception e) {
                        return Optional.empty();
                }
        }

        // Find user by email
        public Optional<User> findByEmail(String email) {
                try {
                        String sql = "SELECT * FROM users WHERE email = ?";
                        List<User> users = jdbcTemplate.query(sql, userRowMapper, email);
                        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
                } catch (Exception e) {
                        return Optional.empty();
                }
        }

        // Find user by employee number
        public Optional<User> findByEmployeeNumber(String employeeNumber) {
                try {
                        String sql = "SELECT * FROM users WHERE employee_number = ?";
                        List<User> users = jdbcTemplate.query(sql, userRowMapper, employeeNumber);
                        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
                } catch (Exception e) {
                        return Optional.empty();
                }
        }

        // Check if username exists - optimized with LIMIT 1
        public boolean existsByUsername(String username) {
                try {
                        String sql = "SELECT 1 FROM users WHERE username = ? LIMIT 1";
                        return jdbcTemplate.queryForObject(sql, Integer.class, username) != null;
                } catch (Exception e) {
                        return false;
                }
        }

        // Check if email exists - optimized with LIMIT 1
        public boolean existsByEmail(String email) {
                try {
                        String sql = "SELECT 1 FROM users WHERE email = ? LIMIT 1";
                        return jdbcTemplate.queryForObject(sql, Integer.class, email) != null;
                } catch (Exception e) {
                        return false;
                }
        }

        // Check if employee number exists - optimized with LIMIT 1
        public boolean existsByEmployeeNumber(String employeeNumber) {
                try {
                        String sql = "SELECT 1 FROM users WHERE employee_number = ? LIMIT 1";
                        return jdbcTemplate.queryForObject(sql, Integer.class, employeeNumber) != null;
                } catch (Exception e) {
                        return false;
                }
        }

        // Find users by department
        public List<User> findByDepartment(String department) {
                try {
                        String sql = "SELECT * FROM users WHERE department = ? ORDER BY username";
                        return jdbcTemplate.query(sql, userRowMapper, department);
                } catch (Exception e) {
                        return List.of();
                }
        }

        // Find users by multiple departments
        public List<User> findByDepartmentIn(List<String> departments) {
                try {
                        if (departments.isEmpty())
                                return List.of();

                        String placeholders = String.join(",", departments.stream().map(d -> "?").toList());
                        String sql = "SELECT * FROM users WHERE department IN (" + placeholders + ") ORDER BY username";
                        return jdbcTemplate.query(sql, userRowMapper, departments.toArray());
                } catch (Exception e) {
                        return List.of();
                }
        }

        // Find Finance department users
        public List<User> findFinanceUsers() {
                try {
                        String sql = "SELECT * FROM users WHERE department = 'Finance' ORDER BY username";
                        return jdbcTemplate.query(sql, userRowMapper);
                } catch (Exception e) {
                        return List.of();
                }
        }

        // Find Operations department users
        public List<User> findOperationsUsers() {
                try {
                        String sql = "SELECT * FROM users WHERE department = 'Operations' ORDER BY username";
                        return jdbcTemplate.query(sql, userRowMapper);
                } catch (Exception e) {
                        return List.of();
                }
        }

        // Find Trace Sheets department users
        public List<User> findTraceSheetsUsers() {
                try {
                        String sql = "SELECT * FROM users WHERE department = 'Trace Sheets' ORDER BY username";
                        return jdbcTemplate.query(sql, userRowMapper);
                } catch (Exception e) {
                        return List.of();
                }
        }

        // Find users by role
        public List<User> findByRole(String role) {
                try {
                        String sql = "SELECT * FROM users WHERE role = ? ORDER BY username";
                        return jdbcTemplate.query(sql, userRowMapper, role);
                } catch (Exception e) {
                        return List.of();
                }
        }

        // Find users by multiple roles
        public List<User> findByRoleIn(List<String> roles) {
                try {
                        if (roles.isEmpty())
                                return List.of();

                        String placeholders = String.join(",", roles.stream().map(r -> "?").toList());
                        String sql = "SELECT * FROM users WHERE role IN (" + placeholders + ") ORDER BY username";
                        return jdbcTemplate.query(sql, userRowMapper, roles.toArray());
                } catch (Exception e) {
                        return List.of();
                }
        }

        // Find admin users
        public List<User> findAdminUsers() {
                try {
                        String sql = "SELECT * FROM users WHERE role = 'ADMIN' ORDER BY username";
                        return jdbcTemplate.query(sql, userRowMapper);
                } catch (Exception e) {
                        return List.of();
                }
        }

        // Find regular users
        public List<User> findUserUsers() {
                try {
                        String sql = "SELECT * FROM users WHERE role = 'USER' ORDER BY username";
                        return jdbcTemplate.query(sql, userRowMapper);
                } catch (Exception e) {
                        return List.of();
                }
        }

        // Find users by department and role
        public List<User> findByDepartmentAndRole(String department, String role) {
                try {
                        String sql = "SELECT * FROM users WHERE department = ? AND role = ? ORDER BY username";
                        return jdbcTemplate.query(sql, userRowMapper, department, role);
                } catch (Exception e) {
                        return List.of();
                }
        }

        // Count users by role
        public List<Object[]> countUsersByRole() {
                try {
                        String sql = "SELECT role, COUNT(*) FROM users GROUP BY role";
                        return jdbcTemplate.queryForList(sql).stream()
                                        .map(row -> new Object[] { row.get("role"), row.get("COUNT(*)") })
                                        .toList();
                } catch (Exception e) {
                        return List.of();
                }
        }

        // Count users by department
        public List<Object[]> countUsersByDepartment() {
                try {
                        String sql = "SELECT department, COUNT(*) FROM users GROUP BY department";
                        return jdbcTemplate.queryForList(sql).stream()
                                        .map(row -> new Object[] { row.get("department"), row.get("COUNT(*)") })
                                        .toList();
                } catch (Exception e) {
                        return List.of();
                }
        }

        // Find users by location
        public List<User> findByLocation(String location) {
                try {
                        String sql = "SELECT * FROM users WHERE location = ? ORDER BY username";
                        return jdbcTemplate.query(sql, userRowMapper, location);
                } catch (Exception e) {
                        return List.of();
                }
        }

        // Custom query to find user by username and department
        public Optional<User> findByUsernameAndDepartment(String username, String department) {
                try {
                        String sql = "SELECT * FROM users WHERE username = ? AND department = ?";
                        List<User> users = jdbcTemplate.query(sql, userRowMapper, username, department);
                        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
                } catch (Exception e) {
                        return Optional.empty();
                }
        }

        // Custom query to find user by email and department
        public Optional<User> findByEmailAndDepartment(String email, String department) {
                try {
                        String sql = "SELECT * FROM users WHERE email = ? AND department = ?";
                        List<User> users = jdbcTemplate.query(sql, userRowMapper, email, department);
                        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
                } catch (Exception e) {
                        return Optional.empty();
                }
        }

        // Find all users
        public List<User> findAll() {
                try {
                        String sql = "SELECT * FROM users ORDER BY username";
                        return jdbcTemplate.query(sql, userRowMapper);
                } catch (Exception e) {
                        return List.of();
                }
        }

        // Save (insert) user
        public User save(User user) {
                String sql = "INSERT INTO users (username, password, email, name, location, department, employee_number, role_id, created_at, updated_at) "
                                +
                                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                LocalDateTime now = LocalDateTime.now();
                user.setCreatedAt(now);
                user.setUpdatedAt(now);
                if (user.getRoleId() == null) {
                        user.setRoleId(1L); // Default to USER
                }

                jdbcTemplate.update(sql,
                                user.getUsername(),
                                user.getPassword(),
                                user.getEmail(),
                                user.getName(),
                                user.getLocation(),
                                user.getDepartment(),
                                user.getEmployeeNumber(),
                                user.getRoleId(),
                                user.getCreatedAt(),
                                user.getUpdatedAt());

                // Get the generated ID
                String idSql = "SELECT LAST_INSERT_ID()";
                Long id = jdbcTemplate.queryForObject(idSql, Long.class);
                user.setId(id);

                return user;
        }

        // Update user password
        public void updateUserPassword(String username, String password) {
                String sql = "UPDATE users SET password = ?, updated_at = ? WHERE username = ?";
                jdbcTemplate.update(sql, password, LocalDateTime.now(), username);
        }

        // Update user email
        public void updateUserEmail(String username, String email) {
                String sql = "UPDATE users SET email = ?, updated_at = ? WHERE username = ?";
                jdbcTemplate.update(sql, email, LocalDateTime.now(), username);
        }

        // Update user role
        public void updateUserRole(String username, String role) {
                String sql = "UPDATE users SET role = ?, updated_at = ? WHERE username = ?";
                jdbcTemplate.update(sql, role, LocalDateTime.now(), username);
        }

        // Delete user by username
        public boolean deleteByUsername(String username) {
                try {
                        String sql = "DELETE FROM users WHERE username = ?";
                        int rowsAffected = jdbcTemplate.update(sql, username);
                        return rowsAffected > 0;
                } catch (Exception e) {
                        return false;
                }
        }

        // Delete user by ID
        public boolean deleteById(Long id) {
                try {
                        String sql = "DELETE FROM users WHERE id = ?";
                        int rowsAffected = jdbcTemplate.update(sql, id);
                        return rowsAffected > 0;
                } catch (Exception e) {
                        return false;
                }
        }

        // Update multiple user roles at once
        public int updateMultipleUserRoles(List<String> usernames, String newRole) {
                try {
                        if (usernames.isEmpty())
                                return 0;

                        String placeholders = String.join(",", usernames.stream().map(u -> "?").toList());
                        String sql = "UPDATE users SET role = ?, updated_at = ? WHERE username IN (" + placeholders
                                        + ")";

                        LocalDateTime now = LocalDateTime.now();

                        // JdbcTemplate doesn't support batch updates directly for this case, so we'll
                        // do individual updates
                        int totalUpdated = 0;
                        for (String username : usernames) {
                                int updated = jdbcTemplate.update(sql, newRole, now, username);
                                totalUpdated += updated;
                        }
                        return totalUpdated;
                } catch (Exception e) {
                        return 0;
                }
        }

        // Find users by ID list
        public List<User> findByIdIn(List<Long> ids) {
                try {
                        if (ids.isEmpty())
                                return List.of();

                        String placeholders = String.join(",", ids.stream().map(id -> "?").toList());
                        String sql = "SELECT * FROM users WHERE id IN (" + placeholders + ") ORDER BY username";
                        return jdbcTemplate.query(sql, userRowMapper, ids.toArray());
                } catch (Exception e) {
                        return List.of();
                }
        }

        // Update user role by ID using role name (direct ID mapping, no lookup needed)
        @Transactional
        public int updateUserRoleById(Long id, String roleName) {
                // Direct role name to ID mapping (no database lookup needed)
                // USER = 1, ADMIN = 2, MANAGER = 3, FINANCE = 4
                Long roleId;
                if (roleName == null) {
                        roleId = 1L; // Default to USER
                } else {
                        switch (roleName.toUpperCase()) {
                                case "ADMIN":
                                        roleId = 2L;
                                        break;
                                case "MANAGER":
                                        roleId = 3L;
                                        break;
                                case "FINANCE":
                                        roleId = 4L;
                                        break;
                                case "USER":
                                default:
                                        roleId = 1L;
                                        break;
                        }
                }

                String sql = "UPDATE users SET role_id = ?, updated_at = ? WHERE id = ?";
                int rowsAffected = jdbcTemplate.update(sql, roleId, LocalDateTime.now(), id);
                logger.info("Updated role for user ID {} to {} (role_id={}). Rows affected: {}", id, roleName,
                                roleId, rowsAffected);
                return rowsAffected;
        }

        // Update user role by ID using role_id directly
        @Transactional
        public int updateUserRoleById(Long id, Long roleId) {
                String sql = "UPDATE users SET role_id = ?, updated_at = ? WHERE id = ?";
                int rowsAffected = jdbcTemplate.update(sql, roleId, LocalDateTime.now(), id);
                logger.info("Updated role for user ID {} to role_id={}. Rows affected: {}", id, roleId, rowsAffected);
                return rowsAffected;
        }

        // Find user by ID
        public Optional<User> findById(Long id) {
                try {
                        String sql = "SELECT * FROM users WHERE id = ?";
                        List<User> users = jdbcTemplate.query(sql, userRowMapper, id);
                        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
                } catch (Exception e) {
                        return Optional.empty();
                }
        }
}
