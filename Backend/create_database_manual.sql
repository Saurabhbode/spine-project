-- Manual SQL script to create spine database and users table
-- Execute this script directly in MySQL if Flyway is not configured

-- Step 1: Create database
CREATE DATABASE IF NOT EXISTS spine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Step 2: Switch to spine database
USE spine;

-- Step 3: Create users table
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_employee_number (employee_number),
    INDEX idx_department (department),
    INDEX idx_created_at (created_at)
);

-- Step 4: Verify table creation
SHOW TABLES;

DESCRIBE users;