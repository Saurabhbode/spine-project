import React, { useState, useEffect } from 'react';

const InvoiceHistory = ({ onClose }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock invoice data - replace with actual API call
  const mockInvoices = [
    {
      id: 1,
      invoiceNumber: 'INV-2024-001',
      projectName: 'Project Alpha',
      projectType: 'FTE',
      amount: 15000.00,
      status: 'paid',
      createdDate: '2024-01-15',
      dueDate: '2024-02-15',
      paidDate: '2024-01-20',
      description: 'Monthly FTE billing for January 2024'
    },
    {
      id: 2,
      invoiceNumber: 'INV-2024-002',
      projectName: 'Project Beta',
      projectType: 'Contingency',
      amount: 25000.00,
      status: 'pending',
      createdDate: '2024-01-20',
      dueDate: '2024-02-20',
      paidDate: null,
      description: 'Contingency project milestone payment'
    },
    {
      id: 3,
      invoiceNumber: 'INV-2024-003',
      projectName: 'Project Gamma',
      projectType: 'FTE',
      amount: 18000.00,
      status: 'overdue',
      createdDate: '2024-01-10',
      dueDate: '2024-01-25',
      paidDate: null,
      description: 'Monthly FTE billing for January 2024'
    },
    {
      id: 4,
      invoiceNumber: 'INV-2024-004',
      projectName: 'Project Delta',
      projectType: 'FTE',
      amount: 22000.00,
      status: 'paid',
      createdDate: '2024-01-25',
      dueDate: '2024-02-25',
      paidDate: '2024-02-01',
      description: 'Monthly FTE billing for January 2024'
    },
    {
      id: 5,
      invoiceNumber: 'INV-2024-005',
      projectName: 'Project Alpha',
      projectType: 'FTE',
      amount: 15500.00,
      status: 'draft',
      createdDate: '2024-01-28',
      dueDate: '2024-02-28',
      paidDate: null,
      description: 'Monthly FTE billing for February 2024'
    }
  ];

  useEffect(() => {
    loadInvoiceHistory();
  }, []);

  const loadInvoiceHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInvoices(mockInvoices);
    } catch (err) {
      setError('Failed to load invoice history. Please try again.');
      console.error('Error loading invoice history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid': return 'status-paid';
      case 'pending': return 'status-pending';
      case 'overdue': return 'status-overdue';
      case 'draft': return 'status-draft';
      default: return 'status-default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return 'fas fa-check-circle';
      case 'pending': return 'fas fa-clock';
      case 'overdue': return 'fas fa-exclamation-triangle';
      case 'draft': return 'fas fa-edit';
      default: return 'fas fa-question-circle';
    }
  };

  // Filter invoices based on status, project, and search term
  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    const matchesProject = filterProject === 'all' || invoice.projectName === filterProject;
    const matchesSearch = searchTerm === '' ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesProject && matchesSearch;
  });

  // Get unique project names for filter dropdown
  const uniqueProjects = [...new Set(invoices.map(inv => inv.projectName))];

  const getTotalAmount = (status) => {
    return filteredInvoices
      .filter(inv => status === 'all' || inv.status === status)
      .reduce((sum, inv) => sum + inv.amount, 0);
  };

  if (loading) {
    return (
      <div className="invoice-history-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading invoice history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-history-container">
      {/* Header */}
      <div className="invoice-history-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="fas fa-history"></i>
          </div>
          <div className="header-text">
            <h2>Invoice History</h2>
            <p>View and manage all invoices across projects</p>
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="invoice-summary-cards">
        <div className="summary-card">
          <div className="card-icon paid">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="card-content">
            <h3>{formatCurrency(getTotalAmount('paid'))}</h3>
            <p>Paid Invoices</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon pending">
            <i className="fas fa-clock"></i>
          </div>
          <div className="card-content">
            <h3>{formatCurrency(getTotalAmount('pending'))}</h3>
            <p>Pending Payment</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon overdue">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="card-content">
            <h3>{formatCurrency(getTotalAmount('overdue'))}</h3>
            <p>Overdue Amount</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon total">
            <i className="fas fa-calculator"></i>
          </div>
          <div className="card-content">
            <h3>{formatCurrency(getTotalAmount('all'))}</h3>
            <p>Total Invoiced</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="invoice-filters">
        <div className="filter-group">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Projects</option>
            {uniqueProjects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>

          <button className="refresh-btn" onClick={loadInvoiceHistory}>
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="invoice-table-container">
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
            <button className="retry-btn" onClick={loadInvoiceHistory}>
              <i className="fas fa-redo"></i>
              Try Again
            </button>
          </div>
        )}

        {!error && filteredInvoices.length === 0 && (
          <div className="no-invoices">
            <i className="fas fa-file-invoice-dollar"></i>
            <h3>No invoices found</h3>
            <p>No invoices match your current filters.</p>
          </div>
        )}

        {!error && filteredInvoices.length > 0 && (
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Project</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th>Due Date</th>
                <th>Paid Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(invoice => (
                <tr key={invoice.id}>
                  <td className="invoice-number">
                    <strong>{invoice.invoiceNumber}</strong>
                  </td>
                  <td>{invoice.projectName}</td>
                  <td>
                    <span className={`project-type-badge ${invoice.projectType.toLowerCase()}`}>
                      {invoice.projectType}
                    </span>
                  </td>
                  <td className="amount-cell">
                    <strong>{formatCurrency(invoice.amount)}</strong>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(invoice.status)}`}>
                      <i className={getStatusIcon(invoice.status)}></i>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td>{formatDate(invoice.createdDate)}</td>
                  <td>{formatDate(invoice.dueDate)}</td>
                  <td>{formatDate(invoice.paidDate)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" title="View Details">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="action-btn download" title="Download PDF">
                        <i className="fas fa-download"></i>
                      </button>
                      <button className="action-btn print" title="Print">
                        <i className="fas fa-print"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="invoice-history-footer">
        <p>Showing {filteredInvoices.length} of {invoices.length} invoices</p>
      </div>

      <style jsx>{`
        .invoice-history-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          overflow: hidden;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }

        .invoice-history-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
          background: white;
          border-radius: 12px;
        }

        .loading-spinner {
          text-align: center;
          color: #666;
        }

        .loading-spinner i {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #667eea;
        }

        .invoice-history-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon {
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .header-text h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .header-text p {
          margin: 0.25rem 0 0 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .close-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: rgba(255,255,255,0.3);
        }

        .invoice-summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          padding: 1.5rem;
          background: #f8f9fa;
        }

        .summary-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .card-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .card-icon.paid { background: #d4edda; color: #155724; }
        .card-icon.pending { background: #fff3cd; color: #856404; }
        .card-icon.overdue { background: #f8d7da; color: #721c24; }
        .card-icon.total { background: #e2e3e5; color: #383d41; }

        .card-content h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
        }

        .card-content p {
          margin: 0.25rem 0 0 0;
          color: #666;
          font-size: 0.9rem;
        }

        .invoice-filters {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e1e5e9;
          background: white;
        }

        .filter-group {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-box i {
          position: absolute;
          left: 12px;
          color: #666;
        }

        .search-box input {
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 0.9rem;
          width: 250px;
        }

        .search-box input:focus {
          outline: none;
          border-color: #667eea;
        }

        .filter-select {
          padding: 0.75rem;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 0.9rem;
          background: white;
        }

        .filter-select:focus {
          outline: none;
          border-color: #667eea;
        }

        .refresh-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          transition: background 0.2s;
        }

        .refresh-btn:hover {
          background: #5a67d8;
        }

        .invoice-table-container {
          flex: 1;
          overflow: auto;
          padding: 1.5rem;
        }

        .error-message {
          text-align: center;
          padding: 3rem;
          color: #dc2626;
        }

        .error-message i {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .retry-btn {
          background: #dc2626;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 1rem;
        }

        .no-invoices {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .no-invoices i {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .invoice-table thead {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .invoice-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .invoice-table td {
          padding: 1rem;
          border-bottom: 1px solid #e1e5e9;
          font-size: 0.9rem;
        }

        .invoice-table tbody tr:hover {
          background: #f8f9fa;
        }

        .invoice-number {
          font-family: 'Courier New', monospace;
        }

        .amount-cell {
          font-weight: 600;
          color: #333;
        }

        .project-type-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .project-type-badge.contingency {
          background: #fff3e0;
          color: #f57c00;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-paid {
          background: #d4edda;
          color: #155724;
        }

        .status-pending {
          background: #fff3cd;
          color: #856404;
        }

        .status-overdue {
          background: #f8d7da;
          color: #721c24;
        }

        .status-draft {
          background: #e2e3e5;
          color: #383d41;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          background: none;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .action-btn.view {
          color: #667eea;
        }

        .action-btn.view:hover {
          background: #eef2ff;
        }

        .action-btn.download {
          color: #10b981;
        }

        .action-btn.download:hover {
          background: #ecfdf5;
        }

        .action-btn.print {
          color: #f59e0b;
        }

        .action-btn.print:hover {
          background: #fffbeb;
        }

        .invoice-history-footer {
          padding: 1rem 1.5rem;
          background: #f8f9fa;
          border-top: 1px solid #e1e5e9;
          text-align: center;
          color: #666;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .invoice-filters {
            flex-direction: column;
            gap: 1rem;
          }

          .filter-group {
            width: 100%;
            justify-content: center;
          }

          .search-box input {
            width: 100%;
          }

          .invoice-table {
            font-size: 0.8rem;
          }

          .invoice-table th,
          .invoice-table td {
            padding: 0.5rem;
          }

          .action-buttons {
            flex-direction: column;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceHistory;
