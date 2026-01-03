-- Migration script to add role_id column to users table
-- Run this in your MySQL database to fix the assign role button issue

USE spine;

-- Step 1: Add role_id column to users table if it doesn't exist
ALTER TABLE users
ADD COLUMN role_id BIGINT DEFAULT 1 AFTER employee_number;

-- Step 2: Create index for role_id for better performance
CREATE INDEX IF NOT EXISTS idx_role_id ON users (role_id);

-- Step 3: Update existing users with NULL role_id to default USER role (id=1)
UPDATE users SET role_id = 1 WHERE role_id IS NULL;

-- Step 4: Create finance_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS finance_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 5: Insert default roles if they don't exist
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

-- Step 6: Verify the changes
DESCRIBE users;

SELECT * FROM finance_roles;

-- Step 7: Verify users have role_id set
SELECT id, name, employee_number, role_id FROM users LIMIT 10;