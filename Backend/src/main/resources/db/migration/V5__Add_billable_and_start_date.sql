-- Flyway Migration V5: Add billable_status and start_date columns
-- Database: spine

-- Add new columns to employees table
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS billable_status BOOLEAN DEFAULT FALSE;

ALTER TABLE employees ADD COLUMN IF NOT EXISTS start_date DATE;

-- Update sample employee data with billable status and start dates
UPDATE employees
SET
    billable_status = TRUE,
    start_date = '2023-01-15'
WHERE
    emp_id = 'EMP001';

UPDATE employees
SET
    billable_status = TRUE,
    start_date = '2023-02-20'
WHERE
    emp_id = 'EMP002';

UPDATE employees
SET
    billable_status = FALSE,
    start_date = '2023-03-10'
WHERE
    emp_id = 'EMP003';

UPDATE employees
SET
    billable_status = FALSE,
    start_date = '2023-04-05'
WHERE
    emp_id = 'EMP004';

UPDATE employees
SET
    billable_status = TRUE,
    start_date = '2023-05-18'
WHERE
    emp_id = 'EMP005';

UPDATE employees
SET
    billable_status = TRUE,
    start_date = '2023-06-25'
WHERE
    emp_id = 'EMP006';

UPDATE employees
SET
    billable_status = FALSE,
    start_date = '2023-07-30'
WHERE
    emp_id = 'EMP007';

UPDATE employees
SET
    billable_status = TRUE,
    start_date = '2023-08-12'
WHERE
    emp_id = 'EMP008';