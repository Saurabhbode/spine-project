-- Migration: Add employee_projects junction table for Many-to-Many relationship
-- This allows employees to be assigned to multiple projects

-- Create the employee_projects junction table
CREATE TABLE IF NOT EXISTS employee_projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    allocation_percentage DECIMAL(5, 2) DEFAULT 100.00,
    start_date DATE,
    end_date DATE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    UNIQUE KEY unique_employee_project (employee_id, project_id)
);

-- Copy existing project assignments to the new junction table
INSERT INTO
    employee_projects (
        employee_id,
        project_id,
        allocation_percentage,
        start_date,
        is_primary,
        created_at,
        updated_at
    )
SELECT
    e.id as employee_id,
    p.id as project_id,
    100.00 as allocation_percentage,
    e.start_date,
    TRUE as is_primary,
    NOW() as created_at,
    NOW() as updated_at
FROM employees e
    CROSS JOIN projects p
WHERE
    e.project = p.project_name
    AND e.project IS NOT NULL
    AND e.project != ''
    AND e.project != 'Trainee'
    AND e.project != 'No Project';

-- Verify the data was copied
-- SELECT COUNT(*) as assigned_employees FROM employee_projects;