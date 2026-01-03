package com.invoicingproject.spine.controller;

import com.invoicingproject.spine.dto.CategoryResponse;
import com.invoicingproject.spine.dto.ProjectRequest;
import com.invoicingproject.spine.dto.ProjectResponse;
import com.invoicingproject.spine.entity.Project;
import com.invoicingproject.spine.entity.ProjectCategory;
import com.invoicingproject.spine.repository.ProjectCategoryRepository;
import com.invoicingproject.spine.repository.ProjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectCategoryRepository categoryRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Get all projects
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        try {
            List<Project> projects = projectRepository.findAll();
            List<ProjectResponse> responses = projects.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error fetching projects", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get project by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        try {
            Optional<Project> projectOpt = projectRepository.findById(id);
            if (projectOpt.isPresent()) {
                return ResponseEntity.ok(convertToResponse(projectOpt.get()));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error fetching project with id: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Create new project
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectRequest request) {
        try {
            logger.info("Creating new project: {}", request.getProjectName());

            // Validate required fields
            if (request.getProjectName() == null || request.getProjectName().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Project project = new Project();
            project.setProjectName(request.getProjectName());
            project.setProjectDescription(request.getProjectDescription());
            project.setCategoryId(request.getCategoryId());
            project.setProjectType(request.getProjectType() != null ? request.getProjectType() : "FTE");
            project.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
            project.setStartDate(request.getStartDate());
            project.setEndDate(request.getEndDate());
            project.setBudget(request.getBudget());
            project.setLocation(request.getLocation());
            project.setDepartment(request.getDepartment());

            // Generate project code if not provided
            if (request.getProjectCode() == null || request.getProjectCode().trim().isEmpty()) {
                String generatedCode = "PRJ-" + System.currentTimeMillis();
                project.setProjectCode(generatedCode);
            } else {
                project.setProjectCode(request.getProjectCode());
            }

            Project savedProject = projectRepository.save(project);
            ProjectResponse response = convertToResponse(savedProject);

            logger.info("Project created successfully with id: {}", savedProject.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Error creating project", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update project
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long id, @RequestBody ProjectRequest request) {
        try {
            Optional<Project> existingOpt = projectRepository.findById(id);
            if (existingOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Project project = existingOpt.get();
            project.setProjectName(request.getProjectName());
            project.setProjectDescription(request.getProjectDescription());
            project.setProjectCode(request.getProjectCode());
            project.setCategoryId(request.getCategoryId());
            project.setProjectType(request.getProjectType());
            project.setStatus(request.getStatus());
            project.setStartDate(request.getStartDate());
            project.setEndDate(request.getEndDate());
            project.setBudget(request.getBudget());
            project.setLocation(request.getLocation());
            project.setDepartment(request.getDepartment());
            project.preUpdate();

            Project savedProject = projectRepository.save(project);
            return ResponseEntity.ok(convertToResponse(savedProject));
        } catch (Exception e) {
            logger.error("Error updating project with id: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete project
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        try {
            boolean deleted = projectRepository.deleteById(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting project with id: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get all categories
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        try {
            List<ProjectCategory> categories = categoryRepository.findAllActive();
            List<CategoryResponse> responses = categories.stream()
                    .map(cat -> new CategoryResponse(
                            cat.getId(),
                            cat.getCategoryName(),
                            cat.getCategoryDescription(),
                            cat.getIsActive()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error fetching categories", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Seed/initialize sample data
    @PostMapping("/seed")
    public ResponseEntity<String> seedSampleData() {
        try {
            logger.info("Seeding sample project data...");

            // Create sample categories if they don't exist
            String[] categoryNames = { "Infrastructure", "Development", "Research", "Operations", "Training" };
            String[] categoryDescriptions = {
                    "Infrastructure and maintenance projects",
                    "Software development projects",
                    "Research and innovation projects",
                    "Operational improvement projects",
                    "Training and development initiatives"
            };

            for (int i = 0; i < categoryNames.length; i++) {
                String checkSql = "SELECT COUNT(*) FROM project_category WHERE category_name = ?";
                Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, categoryNames[i]);
                if (count == null || count == 0) {
                    String insertSql = "INSERT INTO project_category (category_name, category_description) VALUES (?, ?)";
                    jdbcTemplate.update(insertSql, categoryNames[i], categoryDescriptions[i]);
                    logger.info("Created category: {}", categoryNames[i]);
                }
            }

            // Create sample projects
            String[][] projectsData = {
                    { "Precision Medical Billing", "PMB-001", "2", "Contingency", "Finance", "New York", "150000.00" },
                    { "Demo Project", "DEMO-001", "2", "FTE", "Operations", "Remote", "75000.00" },
                    { "Infrastructure Upgrade", "INFRA-001", "1", "FTE", "IT", "Chicago", "200000.00" },
                    { "Research Initiative", "RESEARCH-001", "3", "Contingency", "Operations", "Boston", "300000.00" },
                    { "Training Program", "TRAIN-001", "5", "FTE", "HR", "Remote", "50000.00" },
                    { "Operations Optimization", "OPS-001", "4", "Contingency", "Operations", "Los Angeles",
                            "100000.00" }
            };

            for (String[] p : projectsData) {
                String checkSql = "SELECT COUNT(*) FROM projects WHERE project_code = ?";
                Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, p[1]);
                if (count == null || count == 0) {
                    String insertSql = "INSERT INTO projects (project_name, project_description, project_code, category_id, project_type, status, start_date, end_date, budget, location, department, created_at, updated_at) "
                            +
                            "VALUES (?, ?, ?, ?, ?, 'ACTIVE', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), ?, ?, ?, NOW(), NOW())";
                    jdbcTemplate.update(insertSql, p[0], "Sample project description for " + p[0], p[1],
                            Long.parseLong(p[2]), p[3], new java.math.BigDecimal(p[6]), p[4], p[5]);
                    logger.info("Created project: {}", p[0]);
                }
            }

            return ResponseEntity.ok("Sample data seeded successfully!");
        } catch (Exception e) {
            logger.error("Error seeding sample data", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error seeding data: " + e.getMessage());
        }
    }

    // Fix/Update project types for existing projects
    @PostMapping("/fix-project-types")
    public ResponseEntity<String> fixProjectTypes() {
        try {
            logger.info("Fixing project types for existing projects...");

            // Update existing projects with NULL project_type based on project code pattern
            String[][] projectTypeMappings = {
                    { "PMB-", "Contingency" },
                    { "DEMO-", "FTE" },
                    { "INFRA-", "FTE" },
                    { "RESEARCH-", "Contingency" },
                    { "TRAIN-", "FTE" },
                    { "OPS-", "Contingency" }
            };

            int updatedCount = 0;
            for (String[] mapping : projectTypeMappings) {
                String updateSql = "UPDATE projects SET project_type = ? WHERE project_code LIKE ? AND (project_type IS NULL OR project_type = '')";
                int rows = jdbcTemplate.update(updateSql, mapping[1], mapping[0] + "%");
                updatedCount += rows;
                if (rows > 0) {
                    logger.info("Updated {} projects with {} type", rows, mapping[1]);
                }
            }

            // Also update any remaining NULL values to default 'FTE'
            String defaultUpdateSql = "UPDATE projects SET project_type = 'FTE' WHERE project_type IS NULL OR project_type = ''";
            int defaultRows = jdbcTemplate.update(defaultUpdateSql);
            updatedCount += defaultRows;

            return ResponseEntity.ok("Fixed project types for " + updatedCount + " projects successfully!");
        } catch (Exception e) {
            logger.error("Error fixing project types", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fixing project types: " + e.getMessage());
        }
    }

    private ProjectResponse convertToResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setProjectName(project.getProjectName());
        response.setProjectDescription(project.getProjectDescription());
        response.setProjectCode(project.getProjectCode());
        response.setCategoryId(project.getCategoryId());
        response.setProjectType(project.getProjectType());
        response.setStatus(project.getStatus());
        response.setStartDate(project.getStartDate());
        response.setEndDate(project.getEndDate());
        response.setBudget(project.getBudget());
        response.setLocation(project.getLocation());
        response.setDepartment(project.getDepartment());
        response.setCreatedAt(project.getCreatedAt());
        response.setUpdatedAt(project.getUpdatedAt());

        // Fetch category name
        if (project.getCategoryId() != null) {
            Optional<ProjectCategory> categoryOpt = categoryRepository.findById(project.getCategoryId());
            categoryOpt.ifPresent(cat -> response.setCategoryName(cat.getCategoryName()));
        }

        return response;
    }
}
