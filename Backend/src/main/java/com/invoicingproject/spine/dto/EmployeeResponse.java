package com.invoicingproject.spine.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class EmployeeResponse {

    private Long id;
    private String empId;
    private String name;
    private String project; // Kept for backward compatibility
    private String agency;
    private String projectType;
    private String employeeRole;
    private Boolean billableStatus;
    private String billingType;
    private LocalDate startDate;
    private String tenure;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Multiple projects support
    private List<String> projects;
    private List<Long> projectIds;

    public EmployeeResponse() {
    }

    public EmployeeResponse(Long id, String empId, String name, String project, String employeeRole,
            Boolean billableStatus, LocalDate startDate, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.empId = empId;
        this.name = name;
        this.project = project;
        this.employeeRole = employeeRole;
        this.billableStatus = billableStatus;
        this.startDate = startDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getAgency() {
        return agency;
    }

    public void setAgency(String agency) {
        this.agency = agency;
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

    public String getTenure() {
        return tenure;
    }

    public void setTenure(String tenure) {
        this.tenure = tenure;
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

    public List<String> getProjects() {
        return projects;
    }

    public void setProjects(List<String> projects) {
        this.projects = projects;
    }

    public List<Long> getProjectIds() {
        return projectIds;
    }

    public void setProjectIds(List<Long> projectIds) {
        this.projectIds = projectIds;
    }
}
