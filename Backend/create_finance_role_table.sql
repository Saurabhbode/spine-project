-- Migration script to create finance_role table for role management
-- Run this SQL to fix the role assignment issue

USE spine;

-- Create finance_role table
CREATE TABLE IF NOT EXISTS finance_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role_name (role_name)
);

-- Insert default roles
INSERT INTO
    finance_role (role_name, role_description)
VALUES (
        'USER',
        'Regular user with basic access'
    ),
    (
        'ADMIN',
        'Administrator with full access'
    ),
    (
        'MANAGER',
        'Manager with elevated permissions'
    ),
    (
        'FINANCE',
        'Finance department user'
    )
ON DUPLICATE KEY UPDATE
    role_name = role_name;

-- Add role_id column to users table if not exists
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role_id BIGINT DEFAULT 1 AFTER employee_number;

-- Add foreign key constraint (optional, for data integrity)
-- ALTER TABLE users ADD CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES finance_role(id);

-- Update existing users to link to the default USER role
UPDATE users u
SET
    role_id = (
        SELECT id
        FROM finance_role
        WHERE
            role_name = 'USER'
        LIMIT 1
    )
WHERE
    role_id IS NULL;

-- Drop the old role column if it exists
-- ALTER TABLE users DROP COLUMN IF EXISTS role;

-- Verify the setup
SELECT 'finance_role table:' as info;

SELECT * FROM finance_role;

SELECT 'users table updated:' as info;

SELECT id, username, name, role_id FROM users LIMIT 10;