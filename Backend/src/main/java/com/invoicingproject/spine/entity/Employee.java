package com.invoicingproject.spine.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

import com.fasterxml.jackson.annotation.JsonFormat;

public class Employee {

    private Long id;
    private String empId;
    private String name;
    private String project;
    private String projectType;
    private String employeeRole;
    private Boolean billableStatus;
    private String billingType;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    private String tenure;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Employee() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Employee(String empId, String name, String project, String employeeRole) {
        this.empId = empId;
        this.name = name;
        this.project = project;
        this.employeeRole = employeeRole;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
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
        if (tenure != null && !tenure.isEmpty()) {
            return tenure;
        }
        if (startDate == null) {
            return "N/A";
        }

        LocalDate today = LocalDate.now();
        Period period = Period.between(startDate, today);

        int years = period.getYears();
        int months = period.getMonths();
        int days = period.getDays();

        StringBuilder tenureBuilder = new StringBuilder();
        if (years > 0) {
            tenureBuilder.append(years).append(" year").append(years != 1 ? "s" : "");
        }
        if (months > 0) {
            if (tenureBuilder.length() > 0) {
                tenureBuilder.append(" ");
            }
            tenureBuilder.append(months).append(" month").append(months != 1 ? "s" : "");
        }
        if (days > 0) {
            if (tenureBuilder.length() > 0) {
                tenureBuilder.append(" ");
            }
            tenureBuilder.append(days).append(" day").append(days != 1 ? "s" : "");
        }

        if (tenureBuilder.length() == 0) {
            return "0 days";
        }

        return tenureBuilder.toString();
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

    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
