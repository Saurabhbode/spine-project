# Database Data Loss Fix Plan

## Problem Identified

**Root Cause**: The application.properties file has `spring.jpa.hibernate.ddl-auto=create` which causes Hibernate to DROP and RECREATE the entire database schema every time the application starts, resulting in complete data loss.

## Current Configuration (PROBLEMATIC)

```
spring.jpa.hibernate.ddl-auto=create
```

## Solution Options

### Option 1: Change to Update Mode (RECOMMENDED)

- Change `spring.jpa.hibernate.ddl-auto=create` to `spring.jpa.hibernate.ddl-auto=update`
- This will preserve existing data while applying schema changes
- Best for development environments

### Option 2: Enable Flyway Migrations (PRODUCTION READY)

- Enable Flyway: `spring.flyway.enabled=true`
- Use migration files for schema changes
- More controlled and reliable for production

### Option 3: Validate Only (SAFEST)

- Change to `spring.jpa.hibernate.ddl-auto=validate`
- No schema changes, only validates existing schema
- Use when schema is stable

## Implementation Steps

1. ~~BACKUP CURRENT DATA~~ (if MySQL server is running)
2. ~~MODIFY APPLICATION.PROPERTIES~~ ✅ COMPLETED
3. **TEST DATABASE PERSISTENCE**
4. ~~CLEAN UP MIGRATION FILES~~ (optional)

## Changes Made

- **File**: `Backend/src/main/resources/application.properties`
- **Change**: `spring.jpa.hibernate.ddl-auto=create` → `spring.jpa.hibernate.ddl-auto=update`
- **Effect**: Database schema will no longer be dropped on server restart

## Expected Outcome

- User data will persist between server restarts
- Schema changes will be applied safely without data loss
- Development workflow will be smoother
