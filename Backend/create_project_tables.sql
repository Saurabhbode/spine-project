-- Manual SQL script to create project_category and projects tables
-- Execute this script directly in MySQL

-- Step 1: Ensure spine database exists
CREATE DATABASE IF NOT EXISTS spine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Step 2: Switch to spine database
USE spine;

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
-- 3. CREATE projects TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(200) NOT NULL,
    project_description TEXT,
    project_code VARCHAR(50) UNIQUE,
    category_id BIGINT,
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
    INDEX idx_project_status (status),
    INDEX idx_project_department (department),
    INDEX idx_project_created_by (created_by)
);

-- ============================================
-- 4. VERIFICATION
-- ============================================
SELECT 'Tables created successfully!' as status;

SHOW TABLES LIKE 'project%';

DESCRIBE project_category;

DESCRIBE projects;

SELECT * FROM project_category;