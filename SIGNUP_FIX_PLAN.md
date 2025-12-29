# Signup Fix Plan

## Issues Identified

### 1. Database Schema Mismatch

- V4 migration (adding `role` column) exists but Flyway is disabled
- Backend expects `role` column but database may not have it

### 2. Frontend-Backend Role Handling Mismatch

- Frontend sends `role` field in registration request
- Backend `registerUser` method ignores role and always sets "USER"
- Missing role parameter in backend method signature

### 3. Database Configuration Issues

- Flyway disabled in application.properties
- Manual migration needed

### 4. Backend Server Not Running

- Need to start Spring Boot application

## Fix Steps

### Step 1: Check Backend Status and Database

- [ ] Start backend server
- [ ] Verify database connectivity
- [ ] Check current table structure

### Step 2: Apply Database Migration

- [ ] Run V4 migration SQL manually
- [ ] Verify `role` column exists in users table

### Step 3: Fix Backend Role Handling

- [ ] Update AuthService.registerUser to accept role parameter
- [ ] Update AuthController to pass role from request
- [ ] Ensure role validation and default handling

### Step 4: Fix Frontend Role Handling

- [ ] Update signup form to properly send role
- [ ] Ensure role validation works correctly

### Step 5: Test Complete Flow

- [ ] Test database connectivity
- [ ] Test signup with different roles
- [ ] Test login after signup

## Expected Outcomes

- Users can successfully register with department and role selection
- Database schema matches backend expectations
- Frontend and backend role handling is consistent
