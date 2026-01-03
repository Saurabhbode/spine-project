-- Create emp_roles table
CREATE TABLE IF NOT EXISTS emp_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert employee roles
INSERT INTO
    emp_roles (
        role_name,
        description,
        is_active
    )
VALUES (
        'AR',
        'Accounts Receivable - Handle billing and payment collection',
        TRUE
    ),
    (
        'Billing Posting',
        'Post insurance payments and patient payments',
        TRUE
    ),
    (
        'Coding',
        'Medical coding for procedures and diagnoses',
        TRUE
    ),
    (
        'Patient Calling',
        'Contact patients for appointments and follow-ups',
        TRUE
    ),
    (
        'Authorization',
        'Obtain insurance authorizations for procedures',
        TRUE
    )
ON DUPLICATE KEY UPDATE
    description = VALUES(description);

-- Create index for faster lookups
CREATE INDEX idx_emp_roles_name ON emp_roles (role_name);

CREATE INDEX idx_emp_roles_active ON emp_roles (is_active);