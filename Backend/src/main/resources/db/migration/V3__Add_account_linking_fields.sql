-- Add account linking fields to users table
ALTER TABLE users
ADD COLUMN person_id VARCHAR(50),
ADD COLUMN is_primary_account BOOLEAN DEFAULT FALSE;

-- Create indexes for account linking
CREATE INDEX idx_person_id ON users (person_id);

CREATE INDEX idx_is_primary_account ON users (is_primary_account);

-- Update existing users to have unique person_id and mark first user as primary
UPDATE users
SET
    person_id = CONCAT('person_', id),
    is_primary_account = TRUE
WHERE
    person_id IS NULL;