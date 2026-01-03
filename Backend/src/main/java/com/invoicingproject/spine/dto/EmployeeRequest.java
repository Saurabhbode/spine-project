package com.invoicingproject.spine.dto;

public class EmployeeRequest {

    private String empId;
    private String name;
    private String project;
    private String employeeRole;

    public EmployeeRequest() {
    }

    public EmployeeRequest(String empId, String name, String project, String employeeRole) {
        this.empId = empId;
        this.name = name;
        this.project = project;
        this.employeeRole = employeeRole;
    }

    // Getters and Setters
    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }

    public String getEmployeeRole() {
        return employeeRole;
    }

    public void setEmployeeRole(String employeeRole) {
        this.employeeRole = employeeRole;
    }
}
