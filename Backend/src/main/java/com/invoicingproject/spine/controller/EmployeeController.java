package com.invoicingproject.spine.controller;

import com.invoicingproject.spine.dto.EmployeeRequest;
import com.invoicingproject.spine.dto.EmployeeResponse;
import com.invoicingproject.spine.entity.Employee;
import com.invoicingproject.spine.repository.EmployeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            employee.setEmployeeRole(request.getEmployeeRole());

            Employee savedEmployee = employeeRepository.save(employee);
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
            employee.setEmployeeRole(request.getEmployeeRole());
            employee.preUpdate();

            Employee savedEmployee = employeeRepository.save(employee);
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

    private EmployeeResponse convertToResponse(Employee employee) {
        EmployeeResponse response = new EmployeeResponse();
        response.setId(employee.getId());
        response.setEmpId(employee.getEmpId());
        response.setName(employee.getName());
        response.setProject(employee.getProject());
        response.setEmployeeRole(employee.getEmployeeRole());
        response.setCreatedAt(employee.getCreatedAt());
        response.setUpdatedAt(employee.getUpdatedAt());
        return response;
    }
}
