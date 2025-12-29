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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_username ON users (username);

CREATE INDEX idx_email ON users (email);

CREATE INDEX idx_employee_number ON users (employee_number);

CREATE INDEX idx_department ON users (department);

CREATE INDEX idx_created_at ON users (created_at);