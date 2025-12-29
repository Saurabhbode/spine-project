package com.invoicingproject.spine.dto;

import java.util.Map;

public class CreateLinkedAccountResponse {

    private boolean success;
    private String message;
    private Map<String, Object> newAccount;
    private String errorCode;

    // Constructors
    public CreateLinkedAccountResponse() {
    }

    public CreateLinkedAccountResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public CreateLinkedAccountResponse(boolean success, String message, Map<String, Object> newAccount) {
        this.success = success;
        this.message = message;
        this.newAccount = newAccount;
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

    public Map<String, Object> getNewAccount() {
        return newAccount;
    }

    public void setNewAccount(Map<String, Object> newAccount) {
        this.newAccount = newAccount;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    // Utility methods
    public static CreateLinkedAccountResponse success(String message) {
        return new CreateLinkedAccountResponse(true, message);
    }

    public static CreateLinkedAccountResponse success(String message, Map<String, Object> newAccount) {
        return new CreateLinkedAccountResponse(true, message, newAccount);
    }

    public static CreateLinkedAccountResponse error(String message) {
        return new CreateLinkedAccountResponse(false, message);
    }

    public static CreateLinkedAccountResponse error(String message, String errorCode) {
        CreateLinkedAccountResponse response = new CreateLinkedAccountResponse(false, message);
        response.setErrorCode(errorCode);
        return response;
    }
}
