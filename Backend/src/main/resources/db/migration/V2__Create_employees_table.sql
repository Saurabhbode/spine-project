-- Flyway Migration V2: Create employees table
-- Database: spine

CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    emp_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    project VARCHAR(200),
    employee_role VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_emp_id (emp_id),
    INDEX idx_project (project),
    INDEX idx_employee_role (employee_role)
);

-- Insert sample employee data
INSERT INTO
    employees (
        emp_id,
        name,
        project,
        employee_role
    )
VALUES (
        'EMP001',
        'John Doe',
        'Precision Medical Billing',
        'AR'
    ),
    (
        'EMP002',
        'Jane Smith',
        'Demo project',
        'Billing Posting'
    ),
    (
        'EMP003',
        'Mike Johnson',
        'Precision Medical Billing',
        'Coding'
    ),
    (
        'EMP004',
        'Sarah Wilson',
        'Trainee',
        'Patient Calling'
    ),
    (
        'EMP005',
        'Tom Brown',
        'Demo project',
        'Authorization'
    ),
    (
        'EMP006',
        'Emily Davis',
        'Precision Medical Billing',
        'AR'
    ),
    (
        'EMP007',
        'Chris Lee',
        'No Project',
        'Billing Posting'
    ),
    (
        'EMP008',
        'Amanda White',
        'Demo project',
        'Coding'
    )
ON DUPLICATE KEY UPDATE
    name = VALUES(name);