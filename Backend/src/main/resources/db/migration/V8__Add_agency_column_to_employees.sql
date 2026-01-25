-- Add Agency column to employees table after Project column
ALTER TABLE employees
ADD COLUMN agency VARCHAR(255) NULL AFTER project;