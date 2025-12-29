-- Remove account linking columns from users table
ALTER TABLE users DROP COLUMN person_id;

ALTER TABLE users DROP COLUMN is_primary_account;

-- Add role column with default value
ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'USER';

-- Create index for role for better query performance
CREATE INDEX idx_role ON users (role);

-- Update existing users to have USER role (if any exist)
UPDATE users SET role = 'USER' WHERE role IS NULL;