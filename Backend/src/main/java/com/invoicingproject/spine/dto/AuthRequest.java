package com.invoicingproject.spine.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthRequest {

    @NotBlank
    @Size(max = 50)
    private String username;

    @NotBlank
    @Size(max = 120)
    private String password;

    @Email
    @Size(max = 100)
    private String email;

    @Size(max = 100)
    private String name;

    @Size(max = 50)
    private String location;

    @Size(max = 50)
    private String department;

    private String employeeNumber;

    @Size(max = 50)
    private String role;

    public AuthRequest() {
    }

    public AuthRequest(String username, String password, String email, String name,
            String location, String department, String employeeNumber) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.name = name;
        this.location = location;
        this.department = department;
        this.employeeNumber = employeeNumber;
    }

    public AuthRequest(String username, String password, String department) {
        this.username = username;
        this.password = password;
        this.department = department;
    }

    // Getters and Setters
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
}
