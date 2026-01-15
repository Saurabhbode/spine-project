package com.invoicingproject.spine.controller;

import com.invoicingproject.spine.dto.EmployeeRequest;
import com.invoicingproject.spine.dto.EmployeeResponse;
import com.invoicingproject.spine.entity.Employee;
import com.invoicingproject.spine.entity.EmployeeProject;
import com.invoicingproject.spine.entity.Project;
import com.invoicingproject.spine.repository.EmployeeProjectRepository;
import com.invoicingproject.spine.repository.EmployeeRepository;
import com.invoicingproject.spine.repository.ProjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeProjectRepository employeeProjectRepository;

    @Autowired
    private ProjectRepository projectRepository;

    // Get all employees
    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        try {
            List<Employee> employees = employeeRepository.findAll();
            List<EmployeeResponse> responses = employees.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error fetching employees", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get employees by project name (backward compatibility - uses old project
    // column)
    @GetMapping("/project/{projectName}")
    public ResponseEntity<List<EmployeeResponse>> getEmployeesByProject(@PathVariable String projectName) {
        try {
            logger.info("Fetching employees for project: {}", projectName);
            List<Employee> employees = employeeRepository.findByProject(projectName);
            List<EmployeeResponse> responses = employees.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error fetching employees for project: {}", projectName, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get employees by project ID (uses employee_projects junction table)
    @GetMapping("/project-id/{projectId}")
    public ResponseEntity<List<EmployeeResponse>> getEmployeesByProjectId(@PathVariable Long projectId) {
        try {
            logger.info("Fetching employees for project ID: {}", projectId);
            // Get all employee-project associations for this project
            List<EmployeeProject> employeeProjects = employeeProjectRepository.findByProjectId(projectId);

            // Get unique employee IDs
            List<Long> employeeIds = employeeProjects.stream()
                    .map(EmployeeProject::getEmployeeId)
                    .distinct()
                    .collect(Collectors.toList());

            // Fetch employee details
            List<EmployeeResponse> responses = new ArrayList<>();
            for (Long employeeId : employeeIds) {
                Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);
                if (employeeOpt.isPresent()) {
                    responses.add(convertToResponse(employeeOpt.get()));
                }
            }

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error fetching employees for project ID: {}", projectId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get employees by project name using junction table (new approach)
    @GetMapping("/project-junction/{projectName}")
    public ResponseEntity<List<EmployeeResponse>> getEmployeesByProjectFromJunction(@PathVariable String projectName) {
        try {
            logger.info("Fetching employees for project from junction table: {}", projectName);

            // Find project by name first
            Optional<Project> projectOpt = projectRepository.findByProjectName(projectName);
            if (projectOpt.isEmpty()) {
                return ResponseEntity.ok(new ArrayList<>());
            }

            Long projectId = projectOpt.get().getId();

            // Get all employee-project associations for this project
            List<EmployeeProject> employeeProjects = employeeProjectRepository.findByProjectId(projectId);

            // Get unique employee IDs
            List<Long> employeeIds = employeeProjects.stream()
                    .map(EmployeeProject::getEmployeeId)
                    .distinct()
                    .collect(Collectors.toList());

            // Fetch employee details
            List<EmployeeResponse> responses = new ArrayList<>();
            for (Long employeeId : employeeIds) {
                Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);
                if (employeeOpt.isPresent()) {
                    responses.add(convertToResponse(employeeOpt.get()));
                }
            }

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error fetching employees for project from junction: {}", projectName, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        try {
            Optional<Employee> employeeOpt = employeeRepository.findById(id);
            if (employeeOpt.isPresent()) {
                return ResponseEntity.ok(convertToResponse(employeeOpt.get()));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error fetching employee with id: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Create new employee
    @PostMapping
    public ResponseEntity<EmployeeResponse> createEmployee(@RequestBody EmployeeRequest request) {
        try {
            logger.info("Creating new employee: {}", request.getEmpId());

            // Validate required fields
            if (request.getEmpId() == null || request.getEmpId().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            // Check if empId already exists
            if (employeeRepository.existsByEmpId(request.getEmpId())) {
                logger.warn("Employee with empId {} already exists", request.getEmpId());
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }

            Employee employee = new Employee();
            employee.setEmpId(request.getEmpId());
            employee.setName(request.getName());
            employee.setProject(request.getProject());
            employee.setProjectType(request.getProjectType());
            employee.setEmployeeRole(request.getEmployeeRole());
            employee.setBillableStatus(request.getBillableStatus());
            employee.setBillingType(request.getBillingType());
            employee.setStartDate(request.getStartDate());

            Employee savedEmployee = employeeRepository.save(employee);

            // Handle multiple projects
            saveEmployeeProjects(savedEmployee, request);

            EmployeeResponse response = convertToResponse(savedEmployee);

            logger.info("Employee created successfully with id: {}", savedEmployee.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Error creating employee", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update employee
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponse> updateEmployee(@PathVariable Long id,
            @RequestBody EmployeeRequest request) {
        try {
            Optional<Employee> existingOpt = employeeRepository.findById(id);
            if (existingOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Employee employee = existingOpt.get();
            employee.setEmpId(request.getEmpId());
            employee.setName(request.getName());
            employee.setProject(request.getProject());
            employee.setProjectType(request.getProjectType());
            employee.setEmployeeRole(request.getEmployeeRole());
            employee.setBillableStatus(request.getBillableStatus());
            employee.setBillingType(request.getBillingType());
            employee.setStartDate(request.getStartDate());
            employee.preUpdate();

            Employee savedEmployee = employeeRepository.save(employee);

            // Handle multiple projects - update the junction table
            if (request.getProjectIds() != null || request.getProjectNames() != null) {
                // Delete existing employee-project associations
                employeeProjectRepository.deleteByEmployeeId(savedEmployee.getId());
                // Save new associations
                saveEmployeeProjects(savedEmployee, request);
            }

            return ResponseEntity.ok(convertToResponse(savedEmployee));
        } catch (Exception e) {
            logger.error("Error updating employee with id: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete employee
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        try {
            // Delete employee-project associations first
            employeeProjectRepository.deleteByEmployeeId(id);
            // Delete the employee
            boolean deleted = employeeRepository.deleteById(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting employee with id: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Helper method to save employee-project associations
    private void saveEmployeeProjects(Employee employee, EmployeeRequest request) {
        List<Long> projectIds = request.getProjectIds();
        List<String> projectNames = request.getProjectNames();

        if (projectIds != null && !projectIds.isEmpty()) {
            // Save by project IDs
            for (int i = 0; i < projectIds.size(); i++) {
                Long projectId = projectIds.get(i);
                EmployeeProject ep = new EmployeeProject();
                ep.setEmployeeId(employee.getId());
                ep.setProjectId(projectId);
                ep.setAllocationPercentage(new java.math.BigDecimal("100.00"));
                ep.setStartDate(
                        employee.getStartDate() != null ? java.sql.Date.valueOf(employee.getStartDate()) : null);
                ep.setIsPrimary(i == 0); // First project is primary
                employeeProjectRepository.save(ep);
            }
        } else if (projectNames != null && !projectNames.isEmpty()) {
            // Save by project names (for backward compatibility)
            for (int i = 0; i < projectNames.size(); i++) {
                String projectName = projectNames.get(i);
                Optional<Project> projectOpt = projectRepository.findByProjectName(projectName);
                if (projectOpt.isPresent()) {
                    EmployeeProject ep = new EmployeeProject();
                    ep.setEmployeeId(employee.getId());
                    ep.setProjectId(projectOpt.get().getId());
                    ep.setAllocationPercentage(new java.math.BigDecimal("100.00"));
                    ep.setStartDate(
                            employee.getStartDate() != null ? java.sql.Date.valueOf(employee.getStartDate()) : null);
                    ep.setIsPrimary(i == 0);
                    employeeProjectRepository.save(ep);
                }
            }
        }
    }

    private EmployeeResponse convertToResponse(Employee employee) {
        EmployeeResponse response = new EmployeeResponse();
        response.setId(employee.getId());
        response.setEmpId(employee.getEmpId());
        response.setName(employee.getName());
        response.setProject(employee.getProject());
        response.setProjectType(employee.getProjectType());
        response.setEmployeeRole(employee.getEmployeeRole());
        response.setBillableStatus(employee.getBillableStatus());
        response.setBillingType(employee.getBillingType());
        response.setStartDate(employee.getStartDate());
        response.setTenure(employee.getTenure());
        response.setCreatedAt(employee.getCreatedAt());
        response.setUpdatedAt(employee.getUpdatedAt());

        // Load employee projects
        List<EmployeeProject> employeeProjects = employeeProjectRepository.findByEmployeeId(employee.getId());
        List<String> projectNames = new ArrayList<>();
        List<Long> projectIds = new ArrayList<>();

        for (EmployeeProject ep : employeeProjects) {
            // Get project name from repository
            Optional<Project> projectOpt = projectRepository.findById(ep.getProjectId());
            if (projectOpt.isPresent()) {
                projectNames.add(projectOpt.get().getProjectName());
                projectIds.add(ep.getProjectId());
            }
        }

        response.setProjects(projectNames);
        response.setProjectIds(projectIds);

        // For backward compatibility, set 'project' to comma-separated list
        if (!projectNames.isEmpty()) {
            response.setProject(String.join(", ", projectNames));
        }

        return response;
    }
}
