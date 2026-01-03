-- Update existing projects to have projectType values
-- Based on the sample data from V3 migration

UPDATE projects
SET
    project_type = 'Contingency'
WHERE
    project_name = 'Precision Medical Billing';

UPDATE projects
SET
    project_type = 'FTE'
WHERE
    project_name = 'Demo Project';

UPDATE projects
SET
    project_type = 'FTE'
WHERE
    project_name = 'Infrastructure Upgrade';

UPDATE projects
SET
    project_type = 'Contingency'
WHERE
    project_name = 'Research Initiative';

UPDATE projects
SET
    project_type = 'FTE'
WHERE
    project_name = 'Training Program';

UPDATE projects
SET
    project_type = 'Contingency'
WHERE
    project_name = 'Operations Optimization';

-- Verify the update
SELECT id, project_name, project_type FROM projects;