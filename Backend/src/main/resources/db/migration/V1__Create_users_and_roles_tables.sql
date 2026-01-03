-- Flyway Migration V1: Create users and roles tables
-- Database: spine

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    employee_number VARCHAR(50),
    role_id BIGINT DEFAULT 1, -- Default to USER (1)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_employee_number (employee_number),
    INDEX idx_department (department),
    INDEX idx_role_id (role_id),
    INDEX idx_created_at (created_at)
);

-- Create finance_roles table for role definitions
CREATE TABLE IF NOT EXISTS finance_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO
    finance_roles (id, role_name, description)
VALUES (
        1,
        'USER',
        'Regular user with basic access'
    ),
    (
        2,
        'ADMIN',
        'Administrator with full access'
    ),
    (
        3,
        'MANAGER',
        'Manager with elevated access'
    ),
    (
        4,
        'FINANCE',
        'Finance department user'
    )
ON DUPLICATE KEY UPDATE
    description = VALUES(description);