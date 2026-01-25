package com.invoicingproject.spine.repository;

import com.invoicingproject.spine.entity.Project;
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
public class ProjectRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final @NonNull RowMapper<Project> projectRowMapper = new RowMapper<Project>() {
        @Override
        public Project mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
            Project project = new Project();
            project.setId(rs.getLong("id"));
            project.setProjectName(rs.getString("project_name"));
            project.setProjectDescription(rs.getString("project_description"));
            project.setProjectCode(rs.getString("project_code"));
            project.setCategoryId(rs.getLong("category_id"));
            project.setProjectType(rs.getString("project_type"));
            project.setStatus(rs.getString("status"));

            // Handle date fields
            java.sql.Date startDate = rs.getDate("start_date");
            java.sql.Date endDate = rs.getDate("end_date");
            if (startDate != null) {
                project.setStartDate(startDate.toLocalDate());
            }
            if (endDate != null) {
                project.setEndDate(endDate.toLocalDate());
            }

            // Handle budget
            java.math.BigDecimal budget = rs.getBigDecimal("budget");
            project.setBudget(budget);

            project.setLocation(rs.getString("location"));
            project.setDepartment(rs.getString("department"));
            project.setCreatedBy(rs.getLong("created_by"));

            // Handle timestamps
            java.sql.Timestamp createdAt = rs.getTimestamp("created_at");
            java.sql.Timestamp updatedAt = rs.getTimestamp("updated_at");

            if (createdAt != null) {
                project.setCreatedAt(createdAt.toLocalDateTime());
            }
            if (updatedAt != null) {
                project.setUpdatedAt(updatedAt.toLocalDateTime());
            }

            return project;
        }
    };

    public List<Project> findAll() {
        String sql = "SELECT * FROM projects ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, projectRowMapper);
    }

    public List<Project> findByStatus(String status) {
        String sql = "SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, projectRowMapper, status);
    }

    public List<Project> findByCategoryId(Long categoryId) {
        String sql = "SELECT * FROM projects WHERE category_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, projectRowMapper, categoryId);
    }

    public List<Project> findByDepartment(String department) {
        String sql = "SELECT * FROM projects WHERE department = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, projectRowMapper, department);
    }

    public Optional<Project> findById(Long id) {
        String sql = "SELECT * FROM projects WHERE id = ?";
        List<Project> projects = jdbcTemplate.query(sql, projectRowMapper, id);
        return projects.isEmpty() ? Optional.empty() : Optional.of(projects.get(0));
    }

    public Optional<Project> findByCode(String projectCode) {
        String sql = "SELECT * FROM projects WHERE project_code = ?";
        List<Project> projects = jdbcTemplate.query(sql, projectRowMapper, projectCode);
        return projects.isEmpty() ? Optional.empty() : Optional.of(projects.get(0));
    }

    public Optional<Project> findByProjectName(String projectName) {
        String sql = "SELECT * FROM projects WHERE project_name = ?";
        List<Project> projects = jdbcTemplate.query(sql, projectRowMapper, projectName);
        return projects.isEmpty() ? Optional.empty() : Optional.of(projects.get(0));
    }

    // Check if project exists by ID - optimized with LIMIT 1
    public boolean existsById(Long id) {
        String sql = "SELECT 1 FROM projects WHERE id = ? LIMIT 1";
        return jdbcTemplate.queryForObject(sql, Integer.class, id) != null;
    }

    // Check if project exists by code - optimized with LIMIT 1
    public boolean existsByCode(String projectCode) {
        String sql = "SELECT 1 FROM projects WHERE project_code = ? LIMIT 1";
        return jdbcTemplate.queryForObject(sql, Integer.class, projectCode) != null;
    }

    public Project save(Project project) {
        LocalDateTime now = LocalDateTime.now();
        project.setUpdatedAt(now);

        if (project.getId() == null) {
            // Insert
            String sql = "INSERT INTO projects (project_name, project_description, project_code, category_id, " +
                    "project_type, status, start_date, end_date, budget, location, department, created_by, created_at, updated_at) "
                    +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            project.setCreatedAt(now);
            if (project.getStatus() == null) {
                project.setStatus("ACTIVE");
            }
            if (project.getProjectType() == null) {
                project.setProjectType("FTE");
            }

            jdbcTemplate.update(sql,
                    project.getProjectName(),
                    project.getProjectDescription(),
                    project.getProjectCode(),
                    project.getCategoryId(),
                    project.getProjectType(),
                    project.getStatus(),
                    project.getStartDate() != null ? java.sql.Date.valueOf(project.getStartDate()) : null,
                    project.getEndDate() != null ? java.sql.Date.valueOf(project.getEndDate()) : null,
                    project.getBudget(),
                    project.getLocation(),
                    project.getDepartment(),
                    project.getCreatedBy(),
                    project.getCreatedAt(),
                    project.getUpdatedAt());

            String idSql = "SELECT LAST_INSERT_ID()";
            Long id = jdbcTemplate.queryForObject(idSql, Long.class);
            project.setId(id);
        } else {
            // Update
            String sql = "UPDATE projects SET project_name = ?, project_description = ?, project_code = ?, " +
                    "category_id = ?, project_type = ?, status = ?, start_date = ?, end_date = ?, budget = ?, location = ?, "
                    +
                    "department = ?, updated_at = ? WHERE id = ?";
            jdbcTemplate.update(sql,
                    project.getProjectName(),
                    project.getProjectDescription(),
                    project.getProjectCode(),
                    project.getCategoryId(),
                    project.getProjectType(),
                    project.getStatus(),
                    project.getStartDate() != null ? java.sql.Date.valueOf(project.getStartDate()) : null,
                    project.getEndDate() != null ? java.sql.Date.valueOf(project.getEndDate()) : null,
                    project.getBudget(),
                    project.getLocation(),
                    project.getDepartment(),
                    project.getUpdatedAt(),
                    project.getId());
        }
        return project;
    }

    public boolean deleteById(Long id) {
        String sql = "DELETE FROM projects WHERE id = ?";
        int rowsAffected = jdbcTemplate.update(sql, id);
        return rowsAffected > 0;
    }

    public int countByStatus(String status) {
        String sql = "SELECT COUNT(*) FROM projects WHERE status = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, status);
        return count != null ? count : 0;
    }

    public int countByCategoryId(Long categoryId) {
        String sql = "SELECT COUNT(*) FROM projects WHERE category_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, categoryId);
        return count != null ? count : 0;
    }
}
