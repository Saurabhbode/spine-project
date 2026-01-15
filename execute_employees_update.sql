-- SQL Query to Update employees table in spine database
-- Run this directly against your MySQL database

USE spine;

-- ============================================
-- ADD NEW COLUMNS TO employees TABLE
-- ============================================

-- Add billing_type column
ALTER TABLE employees
ADD COLUMN billing_type VARCHAR(20) DEFAULT 'Non-Billable';

-- Add start_date column
ALTER TABLE employees ADD COLUMN start_date DATE;

-- Add tenure column
ALTER TABLE employees ADD COLUMN tenure VARCHAR(50);

-- ============================================
-- UPDATE EXISTING EMPLOYEES
-- ============================================

-- Update EMP001
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

-- Update EMP002
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

-- Update EMP003
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

-- Update EMP004
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

-- Update EMP005
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

-- Update EMP006
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

-- Update EMP007
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

-- Update EMP008
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
-- VERIFICATION
-- ============================================

-- View updated employees
SELECT
    emp_id,
    name,
    project,
    employee_role,
    billing_type,
    start_date,
    tenure
FROM employees
ORDER BY emp_id;