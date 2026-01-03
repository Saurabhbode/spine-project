package com.invoicingproject.spine.repository;

import com.invoicingproject.spine.entity.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class EmployeeRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Employee> employeeRowMapper = new RowMapper<Employee>() {
        @Override
        public Employee mapRow(ResultSet rs, int rowNum) throws SQLException {
            Employee employee = new Employee();
            employee.setId(rs.getLong("id"));
            employee.setEmpId(rs.getString("emp_id"));
            employee.setName(rs.getString("name"));
            employee.setProject(rs.getString("project"));
            employee.setEmployeeRole(rs.getString("employee_role"));

            // Handle timestamps
            java.sql.Timestamp createdAt = rs.getTimestamp("created_at");
            java.sql.Timestamp updatedAt = rs.getTimestamp("updated_at");

            if (createdAt != null) {
                employee.setCreatedAt(createdAt.toLocalDateTime());
            }
            if (updatedAt != null) {
                employee.setUpdatedAt(updatedAt.toLocalDateTime());
            }

            return employee;
        }
    };

    public List<Employee> findAll() {
        String sql = "SELECT * FROM employees ORDER BY emp_id ASC";
        return jdbcTemplate.query(sql, employeeRowMapper);
    }

    public List<Employee> findByProject(String project) {
        String sql = "SELECT * FROM employees WHERE project = ? ORDER BY emp_id ASC";
        return jdbcTemplate.query(sql, employeeRowMapper, project);
    }

    public List<Employee> findByEmployeeRole(String employeeRole) {
        String sql = "SELECT * FROM employees WHERE employee_role = ? ORDER BY emp_id ASC";
        return jdbcTemplate.query(sql, employeeRowMapper, employeeRole);
    }

    public Optional<Employee> findById(Long id) {
        String sql = "SELECT * FROM employees WHERE id = ?";
        List<Employee> employees = jdbcTemplate.query(sql, employeeRowMapper, id);
        return employees.isEmpty() ? Optional.empty() : Optional.of(employees.get(0));
    }

    public Optional<Employee> findByEmpId(String empId) {
        String sql = "SELECT * FROM employees WHERE emp_id = ?";
        List<Employee> employees = jdbcTemplate.query(sql, employeeRowMapper, empId);
        return employees.isEmpty() ? Optional.empty() : Optional.of(employees.get(0));
    }

    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM employees WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    public boolean existsByEmpId(String empId) {
        String sql = "SELECT COUNT(*) FROM employees WHERE emp_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, empId);
        return count != null && count > 0;
    }

    public Employee save(Employee employee) {
        LocalDateTime now = LocalDateTime.now();
        employee.setUpdatedAt(now);

        if (employee.getId() == null) {
            // Insert
            String sql = "INSERT INTO employees (emp_id, name, project, employee_role, created_at, updated_at) " +
                    "VALUES (?, ?, ?, ?, ?, ?)";
            employee.setCreatedAt(now);

            jdbcTemplate.update(sql,
                    employee.getEmpId(),
                    employee.getName(),
                    employee.getProject(),
                    employee.getEmployeeRole(),
                    employee.getCreatedAt(),
                    employee.getUpdatedAt());

            String idSql = "SELECT LAST_INSERT_ID()";
            Long id = jdbcTemplate.queryForObject(idSql, Long.class);
            employee.setId(id);
        } else {
            // Update
            String sql = "UPDATE employees SET emp_id = ?, name = ?, project = ?, employee_role = ?, updated_at = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    employee.getEmpId(),
                    employee.getName(),
                    employee.getProject(),
                    employee.getEmployeeRole(),
                    employee.getUpdatedAt(),
                    employee.getId());
        }
        return employee;
    }

    public boolean deleteById(Long id) {
        String sql = "DELETE FROM employees WHERE id = ?";
        int rowsAffected = jdbcTemplate.update(sql, id);
        return rowsAffected > 0;
    }

    public int count() {
        String sql = "SELECT COUNT(*) FROM employees";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count : 0;
    }
}
