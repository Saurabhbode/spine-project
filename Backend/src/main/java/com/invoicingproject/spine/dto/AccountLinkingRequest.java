package com.invoicingproject.spine.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AccountLinkingRequest {

    @NotBlank(message = "Current username is required")
    private String currentUsername;

    @NotBlank(message = "Target username is required")
    private String targetUsername;

    @NotNull(message = "Target department is required")
    private String targetDepartment;

    // Constructors
    public AccountLinkingRequest() {
    }

    public AccountLinkingRequest(String currentUsername, String targetUsername, String targetDepartment) {
        this.currentUsername = currentUsername;
        this.targetUsername = targetUsername;
        this.targetDepartment = targetDepartment;
    }

    // Getters and Setters
    public String getCurrentUsername() {
        return currentUsername;
    }

    public void setCurrentUsername(String currentUsername) {
        this.currentUsername = currentUsername;
    }

    public String getTargetUsername() {
        return targetUsername;
    }

    public void setTargetUsername(String targetUsername) {
        this.targetUsername = targetUsername;
    }

    public String getTargetDepartment() {
        return targetDepartment;
    }

    public void setTargetDepartment(String targetDepartment) {
        this.targetDepartment = targetDepartment;
    }
}
