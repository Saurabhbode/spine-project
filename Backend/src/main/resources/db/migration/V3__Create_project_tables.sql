-- Flyway Migration V3: Create Project and Project_Category tables
-- Database: spine

-- ============================================
-- 1. CREATE project_category TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS project_category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    category_description VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category_name (category_name),
    INDEX idx_category_active (is_active)
);

-- ============================================
-- 2. INSERT DEFAULT PROJECT CATEGORIES
-- ============================================
INSERT INTO
    project_category (
        category_name,
        category_description
    )
VALUES (
        'Infrastructure',
        'Infrastructure and maintenance projects'
    ),
    (
        'Development',
        'Software development projects'
    ),
    (
        'Research',
        'Research and innovation projects'
    ),
    (
        'Operations',
        'Operational improvement projects'
    ),
    (
        'Training',
        'Training and development initiatives'
    )
ON DUPLICATE KEY UPDATE
    category_description = VALUES(category_description);

-- ============================================
-- 3. CREATE projects TABLE (with projectType)
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(200) NOT NULL,
    project_description TEXT,
    project_code VARCHAR(50) UNIQUE,
    category_id BIGINT,
    project_type VARCHAR(50) DEFAULT 'FTE', -- 'Contingency' or 'FTE'
    status VARCHAR(50) DEFAULT 'ACTIVE',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15, 2),
    location VARCHAR(100),
    department VARCHAR(100),
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES project_category (id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_project_code (project_code),
    INDEX idx_project_category (category_id),
    INDEX idx_project_type (project_type),
    INDEX idx_project_status (status),
    INDEX idx_project_department (department),
    INDEX idx_project_created_by (created_by)
);

-- ============================================
-- 4. INSERT SAMPLE PROJECTS WITH TYPES
-- ============================================
INSERT INTO
    projects (
        project_name,
        project_description,
        project_code,
        category_id,
        project_type,
        status,
        start_date,
        end_date,
        budget,
        location,
        department
    )
VALUES (
        'Precision Medical Billing',
        'Medical billing services for healthcare providers',
        'PMB-001',
        2,
        'Contingency',
        'ACTIVE',
        '2024-01-01',
        '2024-12-31',
        150000.00,
        'New York',
        'Finance'
    ),
    (
        'Demo Project',
        'Sample demonstration project',
        'DEMO-001',
        2,
        'FTE',
        'ACTIVE',
        '2024-01-15',
        '2024-06-30',
        75000.00,
        'Remote',
        'Operations'
    ),
    (
        'Infrastructure Upgrade',
        'Server and network infrastructure improvements',
        'INFRA-001',
        1,
        'FTE',
        'ACTIVE',
        '2024-02-01',
        '2024-08-31',
        200000.00,
        'Chicago',
        'IT'
    ),
    (
        'Research Initiative',
        'New medical research data analysis project',
        'RESEARCH-001',
        3,
        'Contingency',
        'ACTIVE',
        '2024-03-01',
        '2025-02-28',
        300000.00,
        'Boston',
        'Operations'
    ),
    (
        'Training Program',
        'Employee training and certification program',
        'TRAIN-001',
        5,
        'FTE',
        'ACTIVE',
        '2024-01-01',
        '2024-12-31',
        50000.00,
        'Remote',
        'HR'
    ),
    (
        'Operations Optimization',
        'Business process improvement initiative',
        'OPS-001',
        4,
        'Contingency',
        'ACTIVE',
        '2024-04-01',
        '2024-10-31',
        100000.00,
        'Los Angeles',
        'Operations'
    )
ON DUPLICATE KEY UPDATE
    project_description = VALUES(project_description),
    project_type = VALUES(project_type);

-- ============================================
-- 5. VERIFICATION QUERIES
-- ============================================
SELECT '=== project_category table ===' as info;

SELECT * FROM project_category;

SELECT '=== projects table ===' as info;

SELECT id, project_name, project_type, status, budget FROM projects;