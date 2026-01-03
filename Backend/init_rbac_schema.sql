-- RBAC Schema for Spine Database
-- Role-Based Access Control with Users, Roles, and Permissions

USE spine;

-- ============================================
-- 1. CREATE finance_roles TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS finance_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_description VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role_name (role_name),
    INDEX idx_role_active (is_active)
);

-- ============================================
-- 2. CREATE permissions TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    permission_description VARCHAR(255),
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_perm_name (permission_name),
    INDEX idx_perm_resource (resource),
    INDEX idx_perm_resource_action (resource, action)
);

-- ============================================
-- 3. CREATE role_permissions JUNCTION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS role_permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES finance_roles (id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id),
    INDEX idx_rp_role (role_id),
    INDEX idx_rp_permission (permission_id)
);

-- ============================================
-- 4. INSERT DEFAULT ROLES
-- ============================================
INSERT INTO
    finance_roles (role_name, role_description)
VALUES (
        'USER',
        'Regular user with basic access'
    ),
    (
        'ADMIN',
        'Administrator with full access'
    ),
    (
        'MANAGER',
        'Manager with elevated permissions'
    ),
    (
        'FINANCE',
        'Finance department user'
    )
ON DUPLICATE KEY UPDATE
    role_description = VALUES(role_description);

-- ============================================
-- 5. INSERT DEFAULT PERMISSIONS
-- ============================================

-- User Management Permissions
INSERT INTO
    permissions (
        permission_name,
        permission_description,
        resource,
        action
    )
VALUES (
        'USER_READ',
        'View user information',
        'users',
        'read'
    ),
    (
        'USER_CREATE',
        'Create new users',
        'users',
        'create'
    ),
    (
        'USER_UPDATE',
        'Update user information',
        'users',
        'update'
    ),
    (
        'USER_DELETE',
        'Delete users',
        'users',
        'delete'
    ),
    (
        'USER_ASSIGN_ROLE',
        'Assign roles to users',
        'users',
        'assign_role'
    ),

-- Role Management Permissions
(
    'ROLE_READ',
    'View role information',
    'roles',
    'read'
),
(
    'ROLE_CREATE',
    'Create new roles',
    'roles',
    'create'
),
(
    'ROLE_UPDATE',
    'Update role information',
    'roles',
    'update'
),
(
    'ROLE_DELETE',
    'Delete roles',
    'roles',
    'delete'
),
(
    'ROLE_ASSIGN_PERMISSION',
    'Assign permissions to roles',
    'roles',
    'assign_permission'
),

-- Invoice Permissions
(
    'INVOICE_READ',
    'View invoices',
    'invoices',
    'read'
),
(
    'INVOICE_CREATE',
    'Create invoices',
    'invoices',
    'create'
),
(
    'INVOICE_UPDATE',
    'Update invoices',
    'invoices',
    'update'
),
(
    'INVOICE_DELETE',
    'Delete invoices',
    'invoices',
    'delete'
),
(
    'INVOICE_APPROVE',
    'Approve invoices',
    'invoices',
    'approve'
),
(
    'INVOICE_REJECT',
    'Reject invoices',
    'invoices',
    'reject'
),

-- Finance Dashboard Permissions
(
    'FINANCE_DASHBOARD_ACCESS',
    'Access finance dashboard',
    'dashboard',
    'finance_access'
),
(
    'FINANCE_REPORTS_VIEW',
    'View finance reports',
    'reports',
    'finance_view'
),
(
    'FINANCE_REPORTS_EXPORT',
    'Export finance reports',
    'reports',
    'finance_export'
),

-- Operations Permissions
(
    'OPERATIONS_DASHBOARD_ACCESS',
    'Access operations dashboard',
    'dashboard',
    'operations_access'
),
(
    'TRACE_SHEETS_ACCESS',
    'Access trace sheets',
    'trace_sheets',
    'access'
),

-- System Permissions
(
    'SYSTEM_SETTINGS',
    'Access system settings',
    'system',
    'settings'
),
(
    'AUDIT_LOGS_VIEW',
    'View audit logs',
    'audit',
    'view'
)
ON DUPLICATE KEY UPDATE
    permission_description = VALUES(permission_description);

-- ============================================
-- 6. INSERT ROLE-PERMISSION MAPPINGS
-- ============================================

-- USER Role Permissions (Basic access)
INSERT IGNORE INTO
    role_permissions (role_id, permission_id)
SELECT fr.id, p.id
FROM finance_roles fr, permissions p
WHERE
    fr.role_name = 'USER'
    AND p.permission_name IN (
        'USER_READ',
        'INVOICE_READ',
        'FINANCE_DASHBOARD_ACCESS'
    );

-- ADMIN Role Permissions (Full access)
INSERT IGNORE INTO
    role_permissions (role_id, permission_id)
SELECT fr.id, p.id
FROM finance_roles fr, permissions p
WHERE
    fr.role_name = 'ADMIN';

-- MANAGER Role Permissions
INSERT IGNORE INTO
    role_permissions (role_id, permission_id)
SELECT fr.id, p.id
FROM finance_roles fr, permissions p
WHERE
    fr.role_name = 'MANAGER'
    AND p.permission_name IN (
        'USER_READ',
        'USER_CREATE',
        'USER_UPDATE',
        'ROLE_READ',
        'INVOICE_READ',
        'INVOICE_CREATE',
        'INVOICE_UPDATE',
        'INVOICE_APPROVE',
        'FINANCE_DASHBOARD_ACCESS',
        'FINANCE_REPORTS_VIEW',
        'OPERATIONS_DASHBOARD_ACCESS',
        'TRACE_SHEETS_ACCESS',
        'AUDIT_LOGS_VIEW'
    );

-- FINANCE Role Permissions
INSERT IGNORE INTO
    role_permissions (role_id, permission_id)
SELECT fr.id, p.id
FROM finance_roles fr, permissions p
WHERE
    fr.role_name = 'FINANCE'
    AND p.permission_name IN (
        'USER_READ',
        'INVOICE_READ',
        'INVOICE_CREATE',
        'INVOICE_UPDATE',
        'INVOICE_APPROVE',
        'INVOICE_REJECT',
        'FINANCE_DASHBOARD_ACCESS',
        'FINANCE_REPORTS_VIEW',
        'FINANCE_REPORTS_EXPORT'
    );

-- ============================================
-- 7. UPDATE users TABLE TO USE finance_roles
-- ============================================
-- Add role_id column if not exists (for users that might not have it)
-- Note: IF NOT EXISTS is only supported in MySQL 8.0+
-- For MySQL 5.x, we need to check if column exists first
-- Check if role_id column already exists
SELECT @column_exists := IF(
        (
            SELECT COUNT(*)
            FROM information_schema.COLUMNS
            WHERE
                TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'users'
                AND COLUMN_NAME = 'role_id'
        ) > 0, 1, 0
    );

-- Add role_id column only if it doesn't exist
SET
    @sql = IF(
        @column_exists = 0,
        'ALTER TABLE users ADD COLUMN role_id BIGINT DEFAULT 1 AFTER employee_number',
        'SELECT ''Column role_id already exists, skipping'' as status'
    );

PREPARE stmt FROM @sql;

EXECUTE stmt;

DEALLOCATE PREPARE stmt;

-- Update foreign key constraint (optional, uncomment if needed)
-- ALTER TABLE users ADD CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES finance_roles(id);

-- Update existing users without role_id to default USER role
UPDATE users u
SET
    role_id = (
        SELECT id
        FROM finance_roles
        WHERE
            role_name = 'USER'
        LIMIT 1
    )
WHERE
    role_id IS NULL;

-- ============================================
-- 8. VERIFICATION QUERIES
-- ============================================
SELECT '=== finance_roles table ===' as info;

SELECT * FROM finance_roles;

SELECT '=== permissions table ===' as info;

SELECT * FROM permissions;

SELECT '=== role_permissions table ===' as info;

SELECT rp.id, fr.role_name, p.permission_name, p.resource, p.action
FROM
    role_permissions rp
    JOIN finance_roles fr ON rp.role_id = fr.id
    JOIN permissions p ON rp.permission_id = p.id
ORDER BY fr.role_name, p.resource;

SELECT '=== User-Role mapping ===' as info;

SELECT u.id, u.username, u.name, fr.role_name
FROM users u
    LEFT JOIN finance_roles fr ON u.role_id = fr.id
LIMIT 10;