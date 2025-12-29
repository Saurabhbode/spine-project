package com.invoicingproject.spine.dto;

import java.util.List;
import java.util.Map;

public class AccountLinkingResponse {

    private boolean success;
    private String message;
    private Map<String, Object> user;
    private String role;
    private List<String> existingDepartments;
    private String token;

    // Constructors
    public AccountLinkingResponse() {
    }

    public AccountLinkingResponse(boolean success, String message, Map<String, Object> user,
            String role, List<String> existingDepartments, String token) {
        this.success = success;
        this.message = message;
        this.user = user;
        this.role = role;
        this.existingDepartments = existingDepartments;
        this.token = token;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, Object> getUser() {
        return user;
    }

    public void setUser(Map<String, Object> user) {
        this.user = user;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<String> getExistingDepartments() {
        return existingDepartments;
    }

    public void setExistingDepartments(List<String> existingDepartments) {
        this.existingDepartments = existingDepartments;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    // Static factory methods
    public static AccountLinkingResponse success(String message, Map<String, Object> user,
            String role, List<String> existingDepartments, String token) {
        return new AccountLinkingResponse(true, message, user, role, existingDepartments, token);
    }

    public static AccountLinkingResponse error(String message) {
        return new AccountLinkingResponse(false, message, null, null, null, null);
    }
}
