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
    private String role;
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
        this.role = "USER"; // Default role
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public User(String username, String password, String email, String name, String location, String department,
            String employeeNumber, String role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.name = name;
        this.location = location;
        this.department = department;
        this.employeeNumber = employeeNumber;
        this.role = role != null ? role : "USER";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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
        return "ADMIN".equalsIgnoreCase(role);
    }

    public boolean isUser() {
        return "USER".equalsIgnoreCase(role);
    }

    public boolean hasRole(String roleName) {
        return role != null && role.equalsIgnoreCase(roleName);
    }

    public boolean hasAnyRole(String... roleNames) {
        if (role == null)
            return false;
        for (String roleName : roleNames) {
            if (role.equalsIgnoreCase(roleName)) {
                return true;
            }
        }
        return false;
    }
}
