# Database Setup Instructions - MySQL User Table Creation

## Overview

This guide explains how to create the user table in your MySQL database for the Spine project.

## Prerequisites

1. MySQL server running on localhost:3306
2. MySQL command line tool or MySQL Workbench
3. Database user with CREATE privileges (root user with no password)

## Option 1: Automatic Creation (Recommended)

When you start the Spring Boot application, Flyway will automatically:

- Create the 'spine' database
- Create the 'users' table
- Apply all migrations

**Steps:**

1. Start MySQL server on localhost:3306
2. Update `application.properties` with your MySQL password
3. Run the Spring Boot application: `./mvnw spring-boot:run`
4. Check logs for "FlywayMigration" success messages

## Option 2: Manual SQL Execution

If you prefer to create the database manually:

### Step 1: Create Database

```sql
CREATE DATABASE IF NOT EXISTS spine
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### Step 2: Create User Table

```sql
USE spine;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    employee_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_username ON users (username);
CREATE INDEX idx_email ON users (email);
CREATE INDEX idx_employee_number ON users (employee_number);
CREATE INDEX idx_department ON users (department);
CREATE INDEX idx_created_at ON users (created_at);
```

### Step 3: Verify Creation

```sql
USE spine;
SHOW TABLES;
DESCRIBE users;
```

## Configuration Files Created

### 1. Migration Files (Auto-executed by Flyway)

- `Backend/src/main/resources/db/migration/V2__Create_users_table.sql`

### 2. Manual SQL Script

- `Backend/create_database_manual.sql` - Complete SQL script for manual execution

### 3. Application Configuration

- `Backend/src/main/resources/application.properties` - Updated with Flyway config
- `Backend/pom.xml` - Added Flyway dependency

## Database Schema Details

### Users Table Structure

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    employee_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Indexes Created

- `idx_username` - For username lookups
- `idx_email` - For email lookups
- `idx_employee_number` - For employee ID searches
- `idx_department` - For department filtering
- `idx_created_at` - For date-based queries

## Current Status: ✅ Ready

All files are prepared for automatic database creation when the application starts.

## Next Steps

1. **Configure MySQL password** in `application.properties`
2. **Start MySQL server** on localhost:3306
3. **Start Spring Boot application** - Flyway will create everything automatically

The user table will be created automatically with proper indexes and constraints for optimal performance.
