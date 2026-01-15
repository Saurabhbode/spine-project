-- SQL Query to Update Billing Type, Start Date, and Tenure in Database Tables
-- Database: spine
-- Input Field Names: empId, billableStatus, startDate, tenure

-- ============================================
-- PART 1: UPDATE billing_type (billable_status) IN employees TABLE
-- ============================================

-- Update billing type for a specific employee
-- Input field: billableStatus
UPDATE employees
SET
    billable_status = TRUE
WHERE
    emp_id = 'EMP001';

-- Update billing type for multiple employees (Batch update)
UPDATE employees
SET
    billable_status = CASE
        WHEN emp_id IN (
            'EMP001',
            'EMP002',
            'EMP005',
            'EMP006',
            'EMP008'
        ) THEN TRUE
        ELSE FALSE
    END;

-- ============================================
-- PART 2: UPDATE start_date IN employees TABLE
-- ============================================

-- Update start date for a specific employee
-- Input field: startDate
UPDATE employees
SET
    start_date = '2024-01-15'
WHERE
    emp_id = 'EMP001';

-- Update start date for multiple employees (Batch update)
UPDATE employees
SET
    start_date = CASE
        WHEN emp_id = 'EMP001' THEN '2023-01-15'
        WHEN emp_id = 'EMP002' THEN '2023-02-20'
        WHEN emp_id = 'EMP003' THEN '2023-03-10'
        WHEN emp_id = 'EMP004' THEN '2023-04-05'
        WHEN emp_id = 'EMP005' THEN '2023-05-18'
        WHEN emp_id = 'EMP006' THEN '2023-06-25'
        WHEN emp_id = 'EMP007' THEN '2023-07-30'
        WHEN emp_id = 'EMP008' THEN '2023-08-12'
        ELSE start_date
    END;

-- ============================================
-- PART 3: UPDATE billing_type (project_type) IN projects TABLE
-- ============================================

-- Update project billing type for specific project
-- Input field: projectType
UPDATE projects
SET
    project_type = 'Contingency'
WHERE
    project_code = 'PMB-001';

-- Update project billing type for multiple projects (Batch update)
UPDATE projects
SET
    project_type = CASE
        WHEN project_code IN (
            'PMB-001',
            'RESEARCH-001',
            'OPS-001'
        ) THEN 'Contingency'
        WHEN project_code IN (
            'DEMO-001',
            'INFRA-001',
            'TRAIN-001'
        ) THEN 'FTE'
        ELSE project_type
    END;

-- ============================================
-- PART 4: COMBINED UPDATE (Billing Type, Start Date, and Tenure)
-- ============================================

-- Update both billing type and start date in a single query
-- Input fields: empId, billableStatus, startDate
UPDATE employees
SET
    billable_status = TRUE,
    start_date = '2024-01-01'
WHERE
    emp_id = 'EMP001';

-- ============================================
-- PART 5: CALCULATED TENURE (Read-only calculation)
-- Note: Tenure is calculated dynamically, not stored in DB
-- Field: tenure (calculated field)
-- ============================================

-- Calculate tenure for all employees (Read-only query)
SELECT
    emp_id,
    name,
    billable_status,
    start_date,
    TIMESTAMPDIFF(YEAR, start_date, CURDATE()) AS years,
    TIMESTAMPDIFF(MONTH, start_date, CURDATE()) % 12 AS months,
    TIMESTAMPDIFF(DAY, start_date, CURDATE()) % 30 AS days,
    CONCAT(
        TIMESTAMPDIFF(YEAR, start_date, CURDATE()),
        ' years ',
        TIMESTAMPDIFF(MONTH, start_date, CURDATE()) % 12,
        ' months ',
        TIMESTAMPDIFF(DAY, start_date, CURDATE()) % 30,
        ' days'
    ) AS tenure
FROM employees
WHERE
    start_date IS NOT NULL;

-- ============================================
-- PART 6: UPDATE WITH JOIN (Update employees based on project billing type)
-- ============================================

-- Update employee billing status based on their project's billing type
UPDATE employees e
INNER JOIN projects p ON e.project = p.project_name
SET
    e.billable_status = CASE
        WHEN p.project_type = 'Contingency' THEN TRUE
        ELSE FALSE
    END;

-- ============================================
-- PART 7: SELECT QUERIES TO VERIFY UPDATES
-- ============================================

-- View all employees with billing info and calculated tenure
-- Input fields: empId, billableStatus, startDate, tenure
SELECT
    id,
    emp_id,
    name,
    project,
    employeeRole,
    billable_status AS billing_type,
    start_date,
    CASE
        WHEN start_date IS NULL THEN 'N/A'
        ELSE CONCAT(
            TIMESTAMPDIFF(YEAR, start_date, CURDATE()),
            ' years ',
            TIMESTAMPDIFF(MONTH, start_date, CURDATE()) % 12,
            ' months'
        )
    END AS tenure,
    created_at,
    updated_at
FROM employees
ORDER BY start_date DESC;

-- View all projects with billing type
SELECT
    id,
    project_name,
    project_code,
    project_type AS billing_type,
    status,
    start_date,
    end_date,
    budget,
    location,
    department
FROM projects
ORDER BY project_type, project_name;

-- ============================================
-- PART 8: ADD NEW COLUMNS (If not already exists)
-- ============================================

-- Add billing_type column to employees table
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS billing_type VARCHAR(20) DEFAULT 'Non-Billable';

-- Add tenure column to employees table (optional - not recommended, should be calculated)
ALTER TABLE employees ADD COLUMN IF NOT EXISTS tenure VARCHAR(50);

-- Update tenure values for all employees
UPDATE employees
SET
    tenure = CASE
        WHEN start_date IS NOT NULL THEN CONCAT(
            TIMESTAMPDIFF(YEAR, start_date, CURDATE()),
            ' years ',
            TIMESTAMPDIFF(MONTH, start_date, CURDATE()) % 12,
            ' months'
        )
        ELSE 'N/A'
    END;

-- ============================================
-- USAGE EXAMPLES
-- ============================================

-- Example 1: Update billing type and start date for new employee
-- Input fields: empId, billableStatus, startDate
/*
UPDATE employees 
SET 
billable_status = TRUE,
start_date = '2024-06-01'
WHERE 
emp_id = 'EMP009';
*/

-- Example 2: Bulk update based on department
/*
UPDATE employees 
SET billable_status = TRUE 
WHERE department = 'Finance' AND employeeRole = 'Senior';
*/

-- Example 3: Update project billing type
/*
UPDATE projects 
SET project_type = 'FTE' 
WHERE department = 'IT' AND status = 'ACTIVE';
*/

-- ============================================
-- FRONTEND INPUT FIELD REFERENCE
-- ============================================
-- Add/Edit Employee Form Fields:
-- 1. empId (text) - Employee ID (now editable)
-- 2. name (text) - Employee Name
-- 3. project (select) - Project Assignment
-- 4. employeeRole (select) - Employee Role
-- 5. billableStatus (select) - Billable Type (true/false)
-- 6. startDate (date) - Start Date
-- 7. tenure (calculated) - Tenure (read-only, calculated from startDate)