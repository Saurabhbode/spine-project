-- Flyway Migration V4: Create employee_roles table
-- Database: spine
-- Purpose: Store all employee roles that are used in the application

-- ============================================
-- 1. CREATE employee_roles TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS employee_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    role_description VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role_name (role_name),
    INDEX idx_role_active (is_active)
);

-- ============================================
-- 2. INSERT DEFAULT EMPLOYEE ROLES
-- ============================================
-- These roles match the hardcoded values in src/components/dashboard/Employees.jsx
INSERT INTO
    employee_roles (
        id,
        role_name,
        role_description
    )
VALUES (
        1,
        'AR',
        'Accounts Receivable - Managing incoming payments and billing'
    ),
    (
        2,
        'Billing Posting',
        'Posting and processing billing entries'
    ),
    (
        3,
        'Coding',
        'Medical coding and procedure documentation'
    ),
    (
        4,
        'Patient Calling',
        'Patient communication and follow-up'
    ),
    (
        5,
        'Authorization',
        'Insurance authorization and verification'
    )
ON DUPLICATE KEY UPDATE
    role_description = VALUES(role_description);

-- ============================================
-- 3. VERIFICATION QUERY
-- ============================================
SELECT '=== employee_roles table ===' as info;

SELECT
    id,
    role_name,
    role_description,
    is_active,
    created_at
FROM employee_roles
ORDER BY id;