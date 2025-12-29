package com.invoicingproject.spine.repository;

import com.invoicingproject.spine.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

        @Autowired
        private JdbcTemplate jdbcTemplate;

        private final RowMapper<User> userRowMapper = new RowMapper<User>() {
                @Override
                public User mapRow(ResultSet rs, int rowNum) throws SQLException {
                        User user = new User();
                        user.setId(rs.getLong("id"));
                        user.setUsername(rs.getString("username"));
                        user.setPassword(rs.getString("password"));
                        user.setEmail(rs.getString("email"));
                        user.setName(rs.getString("name"));
                        user.setLocation(rs.getString("location"));
                        user.setDepartment(rs.getString("department"));
                        user.setEmployeeNumber(rs.getString("employee_number"));
                        user.setRole(rs.getString("role"));

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

        // Check if username exists
        public boolean existsByUsername(String username) {
                try {
                        String sql = "SELECT COUNT(*) FROM users WHERE username = ?";
                        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);
                        return count != null && count > 0;
                } catch (Exception e) {
                        return false;
                }
        }

        // Check if email exists
        public boolean existsByEmail(String email) {
                try {
                        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
                        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
                        return count != null && count > 0;
                } catch (Exception e) {
                        return false;
                }
        }

        // Check if employee number exists
        public boolean existsByEmployeeNumber(String employeeNumber) {
                try {
                        String sql = "SELECT COUNT(*) FROM users WHERE employee_number = ?";
                        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, employeeNumber);
                        return count != null && count > 0;
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
                String sql = "INSERT INTO users (username, password, email, name, location, department, employee_number, role, created_at, updated_at) "
                                +
                                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                LocalDateTime now = LocalDateTime.now();
                user.setCreatedAt(now);
                user.setUpdatedAt(now);

                jdbcTemplate.update(sql,
                                user.getUsername(),
                                user.getPassword(),
                                user.getEmail(),
                                user.getName(),
                                user.getLocation(),
                                user.getDepartment(),
                                user.getEmployeeNumber(),
                                user.getRole(),
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
}
