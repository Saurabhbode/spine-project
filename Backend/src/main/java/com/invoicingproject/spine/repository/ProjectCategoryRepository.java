package com.invoicingproject.spine.repository;

import com.invoicingproject.spine.entity.ProjectCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class ProjectCategoryRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<ProjectCategory> categoryRowMapper = new RowMapper<ProjectCategory>() {
        @Override
        public ProjectCategory mapRow(ResultSet rs, int rowNum) throws SQLException {
            ProjectCategory category = new ProjectCategory();
            category.setId(rs.getLong("id"));
            category.setCategoryName(rs.getString("category_name"));
            category.setCategoryDescription(rs.getString("category_description"));
            category.setIsActive(rs.getBoolean("is_active"));

            java.sql.Timestamp createdAt = rs.getTimestamp("created_at");
            java.sql.Timestamp updatedAt = rs.getTimestamp("updated_at");

            if (createdAt != null) {
                category.setCreatedAt(createdAt.toLocalDateTime());
            }
            if (updatedAt != null) {
                category.setUpdatedAt(updatedAt.toLocalDateTime());
            }

            return category;
        }
    };

    public List<ProjectCategory> findAll() {
        String sql = "SELECT * FROM project_category ORDER BY category_name";
        return jdbcTemplate.query(sql, categoryRowMapper);
    }

    public List<ProjectCategory> findAllActive() {
        String sql = "SELECT * FROM project_category WHERE is_active = true ORDER BY category_name";
        return jdbcTemplate.query(sql, categoryRowMapper);
    }

    public Optional<ProjectCategory> findById(Long id) {
        String sql = "SELECT * FROM project_category WHERE id = ?";
        List<ProjectCategory> categories = jdbcTemplate.query(sql, categoryRowMapper, id);
        return categories.isEmpty() ? Optional.empty() : Optional.of(categories.get(0));
    }

    public Optional<ProjectCategory> findByName(String name) {
        String sql = "SELECT * FROM project_category WHERE category_name = ?";
        List<ProjectCategory> categories = jdbcTemplate.query(sql, categoryRowMapper, name);
        return categories.isEmpty() ? Optional.empty() : Optional.of(categories.get(0));
    }

    public boolean existsById(Long id) {
        String sql = "SELECT COUNT(*) FROM project_category WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    public ProjectCategory save(ProjectCategory category) {
        if (category.getId() == null) {
            // Insert
            String sql = "INSERT INTO project_category (category_name, category_description, is_active, created_at, updated_at) "
                    +
                    "VALUES (?, ?, ?, ?, ?)";
            category.setCreatedAt(java.time.LocalDateTime.now());
            category.setUpdatedAt(java.time.LocalDateTime.now());
            if (category.getIsActive() == null) {
                category.setIsActive(true);
            }

            jdbcTemplate.update(sql,
                    category.getCategoryName(),
                    category.getCategoryDescription(),
                    category.getIsActive(),
                    category.getCreatedAt(),
                    category.getUpdatedAt());

            String idSql = "SELECT LAST_INSERT_ID()";
            Long id = jdbcTemplate.queryForObject(idSql, Long.class);
            category.setId(id);
        } else {
            // Update
            String sql = "UPDATE project_category SET category_name = ?, category_description = ?, is_active = ?, updated_at = ? WHERE id = ?";
            category.setUpdatedAt(java.time.LocalDateTime.now());
            jdbcTemplate.update(sql,
                    category.getCategoryName(),
                    category.getCategoryDescription(),
                    category.getIsActive(),
                    category.getUpdatedAt(),
                    category.getId());
        }
        return category;
    }

    public boolean deleteById(Long id) {
        String sql = "DELETE FROM project_category WHERE id = ?";
        int rowsAffected = jdbcTemplate.update(sql, id);
        return rowsAffected > 0;
    }
}
