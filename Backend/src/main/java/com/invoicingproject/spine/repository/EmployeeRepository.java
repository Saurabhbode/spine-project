package com.invoicingproject.spine.repository;

import com.invoicingproject.spine.entity.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.lang.NonNull;
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

    private final @NonNull RowMapper<Employee> employeeRowMapper = new RowMapper<Employee>() {
        @Override
        public Employee mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
            Employee employee = new Employee();
            employee.setId(rs.getLong("id"));
            employee.setEmpId(rs.getString("emp_id"));
            employee.setName(rs.getString("name"));
            employee.setProject(rs.getString("project"));
            employee.setAgency(rs.getString("agency")); // Add agency field mapping
            employee.setProjectType(rs.getString("project_type"));
            employee.setEmployeeRole(rs.getString("employee_role"));
            employee.setBillableStatus(rs.getBoolean("billable_status"));
            employee.setBillingType(rs.getString("billing_type"));

            // Handle date fields
            java.sql.Date startDate = rs.getDate("start_date");
            if (startDate != null) {
                employee.setStartDate(startDate.toLocalDate());
            }

            employee.setTenure(rs.getString("tenure"));

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

    // Check if employee exists by ID - optimized with LIMIT 1
    public boolean existsById(Long id) {
        String sql = "SELECT 1 FROM employees WHERE id = ? LIMIT 1";
        Integer result = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return result != null;
    }

    // Check if employee exists by emp_id - optimized with LIMIT 1
    public boolean existsByEmpId(String empId) {
        String sql = "SELECT 1 FROM employees WHERE emp_id = ? LIMIT 1";
        try {
            Integer result = jdbcTemplate.queryForObject(sql, Integer.class, empId);
            return result != null;
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return false;
        }
    }

    public Employee save(Employee employee) {
        LocalDateTime now = LocalDateTime.now();
        employee.setUpdatedAt(now);

        if (employee.getId() == null) {
            // Insert
            String sql = "INSERT INTO employees (emp_id, name, project, agency, project_type, employee_role, billable_status, billing_type, start_date, tenure, created_at, updated_at) "
                    +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            employee.setCreatedAt(now);

            jdbcTemplate.update(sql,
                    employee.getEmpId(),
                    employee.getName(),
                    employee.getProject(),
                    employee.getAgency(), // Add agency field
                    employee.getProjectType(),
                    employee.getEmployeeRole(),
                    employee.getBillableStatus(),
                    employee.getBillingType(),
                    employee.getStartDate() != null ? java.sql.Date.valueOf(employee.getStartDate()) : null,
                    employee.getTenure(),
                    employee.getCreatedAt(),
                    employee.getUpdatedAt());

            String idSql = "SELECT LAST_INSERT_ID()";
            Long id = jdbcTemplate.queryForObject(idSql, Long.class);
            employee.setId(id);
        } else {
            // Update
            String sql = "UPDATE employees SET emp_id = ?, name = ?, project = ?, agency = ?, project_type = ?, employee_role = ?, billable_status = ?, billing_type = ?, start_date = ?, tenure = ?, updated_at = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    employee.getEmpId(),
                    employee.getName(),
                    employee.getProject(),
                    employee.getAgency(), // Add agency field
                    employee.getProjectType(),
                    employee.getEmployeeRole(),
                    employee.getBillableStatus(),
                    employee.getBillingType(),
                    employee.getStartDate() != null ? java.sql.Date.valueOf(employee.getStartDate()) : null,
                    employee.getTenure(),
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

    /**
     * Update employee_role for all employees that have the old role name.
     * This is used when a role name is updated to automatically sync employee
     * records.
     * 
     * @param oldRoleName The old role name to search for
     * @param newRoleName The new role name to set
     * @return Number of employees updated
     */
    public int updateEmployeeRoleByName(String oldRoleName, String newRoleName) {
        String sql = "UPDATE employees SET employee_role = ?, updated_at = ? WHERE employee_role = ?";
        LocalDateTime now = LocalDateTime.now();
        return jdbcTemplate.update(sql, newRoleName, now, oldRoleName);
    }
}
