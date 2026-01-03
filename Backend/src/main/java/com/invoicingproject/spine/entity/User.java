package com.invoicingproject.spine.entity;

import java.time.LocalDateTime;

public class User {

    private Long id;
    private String username;
    private String password;
    private String email;
    private String name;
    private String location;
    private String department;
    private String employeeNumber;
    private Long roleId; // Foreign key to finance_role table
    private FinanceRole role; // Reference to the role entity
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public User() {
    }

    public User(String username, String password, String email, String name, String location, String department,
            String employeeNumber) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.name = name;
        this.location = location;
        this.department = department;
        this.employeeNumber = employeeNumber;
        this.roleId = 1L; // Default to USER role (id=1)
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public User(String username, String password, String email, String name, String location, String department,
            String employeeNumber, Long roleId) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.name = name;
        this.location = location;
        this.department = department;
        this.employeeNumber = employeeNumber;
        this.roleId = roleId != null ? roleId : 1L;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Constructor that accepts role name as String and converts to roleId
     * 
     * @param roleName Role name (USER, ADMIN, MANAGER, FINANCE)
     */
    public User(String username, String password, String email, String name, String location, String department,
            String employeeNumber, String roleName) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.name = name;
        this.location = location;
        this.department = department;
        this.employeeNumber = employeeNumber;
        this.roleId = roleNameToId(roleName);
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Convert role name to role ID
     */
    private Long roleNameToId(String roleName) {
        if (roleName == null) {
            return 1L; // Default to USER
        }
        switch (roleName.toUpperCase()) {
            case "ADMIN":
                return 2L;
            case "MANAGER":
                return 3L;
            case "FINANCE":
                return 4L;
            case "USER":
            default:
                return 1L;
        }
    }

    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getEmployeeNumber() {
        return employeeNumber;
    }

    public void setEmployeeNumber(String employeeNumber) {
        this.employeeNumber = employeeNumber;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public FinanceRole getRole() {
        return role;
    }

    public void setRole(FinanceRole role) {
        this.role = role;
    }

    // Helper method to get role name
    public String getRoleName() {
        if (role != null) {
            return role.getRoleName();
        }
        // Fallback: derive role name from roleId when role entity is not loaded
        // ADMIN = id 2, USER = id 1, MANAGER = id 3, FINANCE = id 4
        if (roleId != null) {
            if (roleId == 2L) {
                return "ADMIN";
            } else if (roleId == 3L) {
                return "MANAGER";
            } else if (roleId == 4L) {
                return "FINANCE";
            } else {
                return "USER";
            }
        }
        return "USER";
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Check if user belongs to a specific department
    public boolean belongsToDepartment(String dept) {
        return this.department != null && this.department.equalsIgnoreCase(dept);
    }

    // Check if user belongs to Finance department
    public boolean isFinance() {
        return belongsToDepartment("Finance");
    }

    // Check if user belongs to Operations department
    public boolean isOperations() {
        return belongsToDepartment("Operations");
    }

    // Check if user belongs to Trace Sheets department
    public boolean isTraceSheets() {
        return belongsToDepartment("Trace Sheets");
    }

    // Role-based access control methods
    public boolean isAdmin() {
        return hasRole("ADMIN");
    }

    public boolean isUser() {
        return hasRole("USER");
    }

    public boolean hasRole(String roleName) {
        if (role != null) {
            return role.getRoleName() != null && role.getRoleName().equalsIgnoreCase(roleName);
        }
        // Fallback to roleId check if role entity is not loaded
        // ADMIN = id 2, USER = id 1, MANAGER = id 3, FINANCE = id 4
        switch (roleName.toUpperCase()) {
            case "ADMIN":
                return roleId != null && roleId == 2L;
            case "USER":
                return roleId != null && roleId == 1L;
            case "MANAGER":
                return roleId != null && roleId == 3L;
            case "FINANCE":
                return roleId != null && roleId == 4L;
            default:
                return false;
        }
    }

    public boolean hasAnyRole(String... roleNames) {
        for (String roleName : roleNames) {
            if (hasRole(roleName)) {
                return true;
            }
        }
        return false;
    }
}
