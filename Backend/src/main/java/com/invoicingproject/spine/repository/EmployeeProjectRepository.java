package com.invoicingproject.spine.repository;

import com.invoicingproject.spine.entity.EmployeeProject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class EmployeeProjectRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final @NonNull RowMapper<EmployeeProject> employeeProjectRowMapper = new RowMapper<EmployeeProject>() {
        @Override
        public EmployeeProject mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
            EmployeeProject ep = new EmployeeProject();
            ep.setId(rs.getLong("id"));
            ep.setEmployeeId(rs.getLong("employee_id"));
            ep.setProjectId(rs.getLong("project_id"));
            ep.setAllocationPercentage(rs.getBigDecimal("allocation_percentage"));

            java.sql.Date startDate = rs.getDate("start_date");
            if (startDate != null) {
                ep.setStartDate(startDate);
            }

            java.sql.Date endDate = rs.getDate("end_date");
            if (endDate != null) {
                ep.setEndDate(endDate);
            }

            ep.setIsPrimary(rs.getBoolean("is_primary"));

            java.sql.Timestamp createdAt = rs.getTimestamp("created_at");
            java.sql.Timestamp updatedAt = rs.getTimestamp("updated_at");

            if (createdAt != null) {
                ep.setCreatedAt(createdAt);
            }
            if (updatedAt != null) {
                ep.setUpdatedAt(updatedAt);
            }

            return ep;
        }
    };

    public List<EmployeeProject> findByEmployeeId(Long employeeId) {
        String sql = "SELECT ep.* FROM employee_projects ep WHERE ep.employee_id = ? ORDER BY ep.is_primary DESC, ep.id ASC";
        return jdbcTemplate.query(sql, employeeProjectRowMapper, employeeId);
    }

    public List<EmployeeProject> findByProjectId(Long projectId) {
        String sql = "SELECT ep.* FROM employee_projects ep WHERE ep.project_id = ?";
        return jdbcTemplate.query(sql, employeeProjectRowMapper, projectId);
    }

    public EmployeeProject findById(Long id) {
        String sql = "SELECT ep.* FROM employee_projects ep WHERE ep.id = ?";
        List<EmployeeProject> results = jdbcTemplate.query(sql, employeeProjectRowMapper, id);
        return results.isEmpty() ? null : results.get(0);
    }

    public EmployeeProject save(EmployeeProject employeeProject) {
        java.sql.Timestamp now = new java.sql.Timestamp(System.currentTimeMillis());

        if (employeeProject.getId() == null) {
            // Insert
            String sql = "INSERT INTO employee_projects (employee_id, project_id, allocation_percentage, start_date, end_date, is_primary, created_at, updated_at) "
                    +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            jdbcTemplate.update(sql,
                    employeeProject.getEmployeeId(),
                    employeeProject.getProjectId(),
                    employeeProject.getAllocationPercentage(),
                    employeeProject.getStartDate(),
                    employeeProject.getEndDate(),
                    employeeProject.getIsPrimary(),
                    now,
                    now);

            String idSql = "SELECT LAST_INSERT_ID()";
            Long id = jdbcTemplate.queryForObject(idSql, Long.class);
            employeeProject.setId(id);
        } else {
            // Update
            String sql = "UPDATE employee_projects SET allocation_percentage = ?, start_date = ?, end_date = ?, is_primary = ?, updated_at = ? WHERE id = ?";

            jdbcTemplate.update(sql,
                    employeeProject.getAllocationPercentage(),
                    employeeProject.getStartDate(),
                    employeeProject.getEndDate(),
                    employeeProject.getIsPrimary(),
                    now,
                    employeeProject.getId());
        }

        employeeProject.setUpdatedAt(now);
        return employeeProject;
    }

    public boolean deleteById(Long id) {
        String sql = "DELETE FROM employee_projects WHERE id = ?";
        int rowsAffected = jdbcTemplate.update(sql, id);
        return rowsAffected > 0;
    }

    public boolean deleteByEmployeeId(Long employeeId) {
        String sql = "DELETE FROM employee_projects WHERE employee_id = ?";
        int rowsAffected = jdbcTemplate.update(sql, employeeId);
        return rowsAffected > 0;
    }

    public boolean deleteByEmployeeAndProject(Long employeeId, Long projectId) {
        String sql = "DELETE FROM employee_projects WHERE employee_id = ? AND project_id = ?";
        int rowsAffected = jdbcTemplate.update(sql, employeeId, projectId);
        return rowsAffected > 0;
    }

    public int count() {
        String sql = "SELECT COUNT(*) FROM employee_projects";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count : 0;
    }
}
