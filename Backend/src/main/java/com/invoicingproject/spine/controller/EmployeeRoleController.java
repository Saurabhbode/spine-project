package com.invoicingproject.spine.controller;

import com.invoicingproject.spine.dto.EmployeeRoleRequest;
import com.invoicingproject.spine.dto.EmployeeRoleResponse;
import com.invoicingproject.spine.entity.EmployeeRole;
import com.invoicingproject.spine.repository.EmployeeRepository;
import com.invoicingproject.spine.repository.EmployeeRoleRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employee-roles")
@CrossOrigin(origins = "*")
public class EmployeeRoleController {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeRoleController.class);

    @Autowired
    private EmployeeRoleRepository employeeRoleRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    /**
     * Get all active employee roles
     */
    @GetMapping
    public ResponseEntity<List<EmployeeRoleResponse>> getAllRoles() {
        List<EmployeeRole> roles = employeeRoleRepository.findByIsActiveTrue();
        List<EmployeeRoleResponse> response = roles.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * Get all roles including inactive ones
     */
    @GetMapping("/all")
    public ResponseEntity<List<EmployeeRoleResponse>> getAllRolesIncludingInactive() {
        List<EmployeeRole> roles = employeeRoleRepository.findAll();
        List<EmployeeRoleResponse> response = roles.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * Get role by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeRoleResponse> getRoleById(@PathVariable Long id) {
        return employeeRoleRepository.findById(id)
                .map(this::mapToResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new employee role
     */
    @PostMapping
    public ResponseEntity<?> createRole(@Valid @RequestBody EmployeeRoleRequest request) {
        // Check if role name already exists
        if (employeeRoleRepository.existsByRoleName(request.getRoleName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse("Role name '" + request.getRoleName() + "' already exists"));
        }

        EmployeeRole role = new EmployeeRole();
        role.setRoleName(request.getRoleName());
        role.setDescription(request.getDescription());
        role.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        EmployeeRole savedRole = employeeRoleRepository.save(role);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(savedRole));
    }

    /**
     * Update an existing employee role
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @Valid @RequestBody EmployeeRoleRequest request) {
        return employeeRoleRepository.findById(id)
                .map(existingRole -> {
                    String oldRoleName = existingRole.getRoleName();
                    String newRoleName = request.getRoleName();

                    // Check if new role name conflicts with another role
                    if (!oldRoleName.equals(newRoleName)
                            && employeeRoleRepository.existsByRoleName(newRoleName)) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(new ErrorResponse("Role name '" + newRoleName + "' already exists"));
                    }

                    // Store the old name for syncing employees
                    existingRole.setRoleName(newRoleName);
                    existingRole.setDescription(request.getDescription());
                    if (request.getIsActive() != null) {
                        existingRole.setIsActive(request.getIsActive());
                    }

                    EmployeeRole updatedRole = employeeRoleRepository.save(existingRole);

                    // Sync all employees that have the old role name to use the new role name
                    if (!oldRoleName.equals(newRoleName)) {
                        logger.info("Syncing employee roles from '{}' to '{}' after role name update", oldRoleName,
                                newRoleName);
                        int employeesUpdated = employeeRepository.updateEmployeeRoleByName(oldRoleName, newRoleName);
                        logger.info("Updated {} employee records to use new role name", employeesUpdated);
                    }

                    return ResponseEntity.ok(mapToResponse(updatedRole));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete (soft delete - set is_active to false) an employee role
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable Long id) {
        return employeeRoleRepository.findById(id)
                .map(role -> {
                    role.setIsActive(false);
                    employeeRoleRepository.save(role);
                    return ResponseEntity.ok(new MessageResponse("Role deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Permanently delete an employee role
     */
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<?> permanentDeleteRole(@PathVariable Long id) {
        if (employeeRoleRepository.existsById(id)) {
            employeeRoleRepository.deleteById(id);
            return ResponseEntity.ok(new MessageResponse("Role permanently deleted"));
        }
        return ResponseEntity.notFound().build();
    }

    private EmployeeRoleResponse mapToResponse(EmployeeRole role) {
        EmployeeRoleResponse response = new EmployeeRoleResponse();
        response.setId(role.getId());
        response.setRoleName(role.getRoleName());
        response.setDescription(role.getDescription());
        response.setIsActive(role.getIsActive());
        return response;
    }

    // Inner classes for error and message responses
    public static class ErrorResponse {
        private String error;

        public ErrorResponse(String error) {
            this.error = error;
        }

        public String getError() {
            return error;
        }

        public void setError(String error) {
            this.error = error;
        }
    }

    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
