-- Flyway Migration V6: Add billing_type, start_date, and tenure columns to employees table
-- Database: spine

-- ============================================
-- ADD NEW COLUMNS TO employees TABLE
-- ============================================

-- Add billing_type column (VARCHAR for more flexibility)
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS billing_type VARCHAR(20) DEFAULT 'Non-Billable';

-- Add start_date column (DATE type)
ALTER TABLE employees ADD COLUMN IF NOT EXISTS start_date DATE;

-- Add tenure column (VARCHAR to store calculated tenure)
ALTER TABLE employees ADD COLUMN IF NOT EXISTS tenure VARCHAR(50);

-- ============================================
-- UPDATE EXISTING EMPLOYEES WITH SAMPLE DATA
-- ============================================

-- Update billing_type, start_date, and tenure for EMP001
UPDATE employees
SET
    billing_type = 'Billable',
    start_date = '2023-01-15',
    tenure = CONCAT(
        TIMESTAMPDIFF(YEAR, '2023-01-15', CURDATE()),
        ' years ',
        TIMESTAMPDIFF(
            MONTH,
            '2023-01-15',
            CURDATE()
        ) % 12,
        ' months'
    )
WHERE
    emp_id = 'EMP001';

-- Update billing_type, start_date, and tenure for EMP002
UPDATE employees
SET
    billing_type = 'Billable',
    start_date = '2023-02-20',
    tenure = CONCAT(
        TIMESTAMPDIFF(YEAR, '2023-02-20', CURDATE()),
        ' years ',
        TIMESTAMPDIFF(
            MONTH,
            '2023-02-20',
            CURDATE()
        ) % 12,
        ' months'
    )
WHERE
    emp_id = 'EMP002';

-- Update billing_type, start_date, and tenure for EMP003
UPDATE employees
SET
    billing_type = 'Non-Billable',
    start_date = '2023-03-10',
    tenure = CONCAT(
        TIMESTAMPDIFF(YEAR, '2023-03-10', CURDATE()),
        ' years ',
        TIMESTAMPDIFF(
            MONTH,
            '2023-03-10',
            CURDATE()
        ) % 12,
        ' months'
    )
WHERE
    emp_id = 'EMP003';

-- Update billing_type, start_date, and tenure for EMP004
UPDATE employees
SET
    billing_type = 'Non-Billable',
    start_date = '2023-04-05',
    tenure = CONCAT(
        TIMESTAMPDIFF(YEAR, '2023-04-05', CURDATE()),
        ' years ',
        TIMESTAMPDIFF(
            MONTH,
            '2023-04-05',
            CURDATE()
        ) % 12,
        ' months'
    )
WHERE
    emp_id = 'EMP004';

-- Update billing_type, start_date, and tenure for EMP005
UPDATE employees
SET
    billing_type = 'Billable',
    start_date = '2023-05-18',
    tenure = CONCAT(
        TIMESTAMPDIFF(YEAR, '2023-05-18', CURDATE()),
        ' years ',
        TIMESTAMPDIFF(
            MONTH,
            '2023-05-18',
            CURDATE()
        ) % 12,
        ' months'
    )
WHERE
    emp_id = 'EMP005';

-- Update billing_type, start_date, and tenure for EMP006
UPDATE employees
SET
    billing_type = 'Billable',
    start_date = '2023-06-25',
    tenure = CONCAT(
        TIMESTAMPDIFF(YEAR, '2023-06-25', CURDATE()),
        ' years ',
        TIMESTAMPDIFF(
            MONTH,
            '2023-06-25',
            CURDATE()
        ) % 12,
        ' months'
    )
WHERE
    emp_id = 'EMP006';

-- Update billing_type, start_date, and tenure for EMP007
UPDATE employees
SET
    billing_type = 'Non-Billable',
    start_date = '2023-07-30',
    tenure = CONCAT(
        TIMESTAMPDIFF(YEAR, '2023-07-30', CURDATE()),
        ' years ',
        TIMESTAMPDIFF(
            MONTH,
            '2023-07-30',
            CURDATE()
        ) % 12,
        ' months'
    )
WHERE
    emp_id = 'EMP007';

-- Update billing_type, start_date, and tenure for EMP008
UPDATE employees
SET
    billing_type = 'Billable',
    start_date = '2023-08-12',
    tenure = CONCAT(
        TIMESTAMPDIFF(YEAR, '2023-08-12', CURDATE()),
        ' years ',
        TIMESTAMPDIFF(
            MONTH,
            '2023-08-12',
            CURDATE()
        ) % 12,
        ' months'
    )
WHERE
    emp_id = 'EMP008';

-- ============================================
-- ADD INDEXES FOR BETTER PERFORMANCE
-- ============================================

-- Create index on billing_type for faster filtering
CREATE INDEX IF NOT EXISTS idx_billing_type ON employees (billing_type);

-- Create index on start_date for faster date queries
CREATE INDEX IF NOT EXISTS idx_start_date ON employees (start_date);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- View all employees with new columns
SELECT
    id,
    emp_id,
    name,
    project,
    employee_role,
    billing_type,
    start_date,
    tenure,
    created_at,
    updated_at
FROM employees
ORDER BY emp_id;

-- View summary by billing type
SELECT
    billing_type,
    COUNT(*) AS employee_count,
    MIN(start_date) AS earliest_start_date,
    MAX(start_date) AS latest_start_date
FROM employees
GROUP BY
    billing_type;