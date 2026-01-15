package com.invoicingproject.spine.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

public class EmployeeRequest {

    private String empId;
    private String name;
    private String project;
    private String projectType;
    private String employeeRole;
    private Boolean billableStatus;
    private String billingType;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    public EmployeeRequest() {
    }

    public EmployeeRequest(String empId, String name, String project, String employeeRole,
            Boolean billableStatus, LocalDate startDate) {
        this.empId = empId;
        this.name = name;
        this.project = project;
        this.employeeRole = employeeRole;
        this.billableStatus = billableStatus;
        this.startDate = startDate;
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

    public String getProjectType() {
        return projectType;
    }

    public void setProjectType(String projectType) {
        this.projectType = projectType;
    }

    public String getEmployeeRole() {
        return employeeRole;
    }

    public void setEmployeeRole(String employeeRole) {
        this.employeeRole = employeeRole;
    }

    public Boolean getBillableStatus() {
        return billableStatus;
    }

    public void setBillableStatus(Boolean billableStatus) {
        this.billableStatus = billableStatus;
    }

    public String getBillingType() {
        return billingType;
    }

    public void setBillingType(String billingType) {
        this.billingType = billingType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
}
