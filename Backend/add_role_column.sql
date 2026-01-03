-- Migration script to add role column to users table
-- Run this SQL to fix the role assignment issue

USE spine;

-- Add role column if it doesn't exist
ALTER TABLE users
ADD COLUMN role VARCHAR(20) DEFAULT 'USER' AFTER employee_number;

-- Update existing users to have a default role
UPDATE users SET role = 'USER' WHERE role IS NULL;

-- Create index for role column for faster queries
CREATE INDEX idx_role ON users (role);

-- Verify the column was added
DESCRIBE users;

-- Check if existing users have the role column populated
SELECT id, username, name, role FROM users LIMIT 10;