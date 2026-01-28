-- Create invoices table to store invoice data from the create invoice modal
CREATE TABLE IF NOT EXISTS invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    project_id BIGINT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    employee_id BIGINT NOT NULL,
    employee_name VARCHAR(255) NOT NULL,
    employee_agency VARCHAR(255),
    billing_type VARCHAR(50) NOT NULL,
    billing_start_date DATE NOT NULL,
    billing_end_date DATE NOT NULL,
    tenure INT,
    rate_per_fte DECIMAL(10,2) NOT NULL,
    number_of_ftes DECIMAL(5,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key constraints
    CONSTRAINT fk_invoice_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_invoice_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT fk_invoice_created_by FOREIGN KEY (created_by) REFERENCES users(id),

    -- Indexes for performance
    INDEX idx_invoice_number (invoice_number),
    INDEX idx_project_id (project_id),
    INDEX idx_employee_id (employee_id),
    INDEX idx_billing_type (billing_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_billing_dates (billing_start_date, billing_end_date)
);

-- Create invoice_items table for detailed FTE allocation (if needed for complex invoices)
CREATE TABLE IF NOT EXISTS invoice_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    resource_name VARCHAR(255) NOT NULL,
    employee_role VARCHAR(255),
    agency_name VARCHAR(255),
    fte DECIMAL(5,2) NOT NULL,
    process VARCHAR(255),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key constraint
    CONSTRAINT fk_invoice_item_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,

    -- Indexes
    INDEX idx_invoice_id (invoice_id),
    INDEX idx_process (process)
);
