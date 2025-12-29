package com.invoicingproject.spine.dto;

import java.util.Map;

public class AuthResponse {
    
    private boolean success;
    private String message;
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Map<String, Object> user;
    private String[] validDepartments;
    
    public AuthResponse() {}
    
    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    public AuthResponse(boolean success, String message, String accessToken, 
                       String refreshToken, String tokenType, Map<String, Object> user) {
        this.success = success;
        this.message = message;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.user = user;
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
    
    public String getAccessToken() {
        return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
    
    public String getRefreshToken() {
        return refreshToken;
    }
    
    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
    
    public String getTokenType() {
        return tokenType;
    }
    
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
    
    public Map<String, Object> getUser() {
        return user;
    }
    
    public void setUser(Map<String, Object> user) {
        this.user = user;
    }
    
    public String[] getValidDepartments() {
        return validDepartments;
    }
    
    public void setValidDepartments(String[] validDepartments) {
        this.validDepartments = validDepartments;
    }
}
