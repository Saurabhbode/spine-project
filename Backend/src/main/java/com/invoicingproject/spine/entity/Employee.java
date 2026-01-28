package com.invoicingproject.spine.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "emp_id", nullable = false, unique = true)
    private String empId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "project") // Kept for backward compatibility
    private String project;

    @Column(name = "agency")
    private String agency;

    @Column(name = "project_type")
    private String projectType;

    @Column(name = "employee_role")
    private String employeeRole;

    @Column(name = "billable_status")
    private Boolean billableStatus;

    @Column(name = "billing_type")
    private String billingType;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "tenure")
    private String tenure;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Multiple projects relationship via employee_projects junction table
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EmployeeProject> employeeProjects = new ArrayList<>();

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

    public List<EmployeeProject> getEmployeeProjects() {
        return employeeProjects;
    }

    public void setEmployeeProjects(List<EmployeeProject> employeeProjects) {
        this.employeeProjects = employeeProjects;
    }

    // Helper method to get project names as a list
    public List<String> getProjectNames() {
        List<String> names = new ArrayList<>();
        if (employeeProjects != null) {
            for (EmployeeProject ep : employeeProjects) {
                if (ep.getProject() != null) {
                    names.add(ep.getProject().getProjectName());
                }
            }
        }
        return names;
    }

    // Helper method to get comma-separated project names
    public String getProjectsAsString() {
        List<String> names = getProjectNames();
        if (names.isEmpty()) {
            return project != null ? project : "No Project"; // Fallback for backward compatibility
        }
        return String.join(", ", names);
    }

    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
