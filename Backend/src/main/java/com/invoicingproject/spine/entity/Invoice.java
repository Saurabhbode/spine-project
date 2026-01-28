package com.invoicingproject.spine.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", nullable = false, unique = true)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "project_name", nullable = false)
    private String projectName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "employee_name", nullable = false)
    private String employeeName;

    @Column(name = "employee_agency")
    private String employeeAgency;

    @Column(name = "billing_type", nullable = false)
    private String billingType;

    @Column(name = "billing_start_date", nullable = false)
    private LocalDate billingStartDate;

    @Column(name = "billing_end_date", nullable = false)
    private LocalDate billingEndDate;

    @Column(name = "tenure")
    private Integer tenure;

    @Column(name = "rate_per_fte", nullable = false, precision = 10, scale = 2)
    private BigDecimal ratePerFte;

    @Column(name = "number_of_ftes", nullable = false, precision = 5, scale = 2)
    private BigDecimal numberOfFtes;

    @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "discount", precision = 10, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "status")
    private String status = "DRAFT";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Default constructor
    public Invoice() {}

    // Constructor for creating invoice from modal data
    public Invoice(String invoiceNumber, Project project, String projectName,
                   Employee employee, String employeeName, String employeeAgency,
                   String billingType, LocalDate billingStartDate, LocalDate billingEndDate,
                   Integer tenure, BigDecimal ratePerFte, BigDecimal numberOfFtes,
                   BigDecimal totalAmount, BigDecimal discount, String notes, User createdBy) {
        this.invoiceNumber = invoiceNumber;
        this.project = project;
        this.projectName = projectName;
        this.employee = employee;
        this.employeeName = employeeName;
        this.employeeAgency = employeeAgency;
        this.billingType = billingType;
        this.billingStartDate = billingStartDate;
        this.billingEndDate = billingEndDate;
        this.tenure = tenure;
        this.ratePerFte = ratePerFte;
        this.numberOfFtes = numberOfFtes;
        this.totalAmount = totalAmount;
        this.discount = discount != null ? discount : BigDecimal.ZERO;
        this.notes = notes;
        this.createdBy = createdBy;
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

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getEmployeeAgency() {
        return employeeAgency;
    }

    public void setEmployeeAgency(String employeeAgency) {
        this.employeeAgency = employeeAgency;
    }

    public String getBillingType() {
        return billingType;
    }

    public void setBillingType(String billingType) {
        this.billingType = billingType;
    }

    public LocalDate getBillingStartDate() {
        return billingStartDate;
    }

    public void setBillingStartDate(LocalDate billingStartDate) {
        this.billingStartDate = billingStartDate;
    }

    public LocalDate getBillingEndDate() {
        return billingEndDate;
    }

    public void setBillingEndDate(LocalDate billingEndDate) {
        this.billingEndDate = billingEndDate;
    }

    public Integer getTenure() {
        return tenure;
    }

    public void setTenure(Integer tenure) {
        this.tenure = tenure;
    }

    public BigDecimal getRatePerFte() {
        return ratePerFte;
    }

    public void setRatePerFte(BigDecimal ratePerFte) {
        this.ratePerFte = ratePerFte;
    }

    public BigDecimal getNumberOfFtes() {
        return numberOfFtes;
    }

    public void setNumberOfFtes(BigDecimal numberOfFtes) {
        this.numberOfFtes = numberOfFtes;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
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

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
