import React, { useState, useEffect } from 'react';
import EmployeeService from '../services/EmployeeService';

/**
 * InvoiceModal Component
 * Allows creating invoices for FTE projects with employee selection
 * 
 * @param {Object} props
 * @param {Object} props.project - The selected project
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onSubmit - Function to handle invoice submission
 */
const InvoiceModal = ({ project, onClose, onSubmit }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    billingType: 'Monthly',
    billingStartDate: '',
    billingEndDate: '',
    tenure: '',
    ratePerFTE: '',
    numberOfFTEs: '1',
    totalAmount: '',
    notes: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    loadProjectEmployees();
  }, [project]);

  const loadProjectEmployees = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch employees working on this project using junction table endpoint first
      let projectEmployees = [];
      try {
        projectEmployees = await EmployeeService.getEmployeesByProjectFromJunction(project.projectName);
      } catch (junctionError) {
        console.warn("Junction endpoint failed, trying backward compatibility endpoint:", junctionError);
        // Fallback to backward compatibility endpoint
        try {
          projectEmployees = await EmployeeService.getEmployeesByProject(project.projectName);
        } catch (fallbackError) {
          console.warn("Backward compatibility endpoint also failed:", fallbackError);
        }
      }
      
      setEmployees(projectEmployees || []);
      
      if (projectEmployees.length === 0) {
        setError('No employees found working on this project. Please assign employees to the project first.');
      }
    } catch (err) {
      console.error("Error loading project employees:", err);
      setError(err.message || 'Failed to load employees. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };

      // Auto-fill employee name when employee is selected
      if (name === 'employeeId') {
        const selectedEmployee = employees.find(emp => emp.id.toString() === value);
        updated.employeeName = selectedEmployee ? selectedEmployee.employeeName : '';
      }

      // Auto-calculate total amount
      if (name === 'ratePerFTE' || name === 'numberOfFTEs') {
        const rate = parseFloat(updated.ratePerFTE) || 0;
        const ftes = parseFloat(updated.numberOfFTEs) || 0;
        updated.totalAmount = (rate * ftes).toFixed(2);
      }

      return updated;
    });

    // Clear validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.employeeId) {
      errors.employeeId = 'Please select an employee';
    }
    
    if (!formData.billingType) {
      errors.billingType = 'Please select a billing type';
    }
    
    if (!formData.billingStartDate) {
      errors.billingStartDate = 'Please select a start date';
    }
    
    if (!formData.billingEndDate) {
      errors.billingEndDate = 'Please select an end date';
    }
    
    if (formData.billingStartDate && formData.billingEndDate) {
      if (new Date(formData.billingEndDate) < new Date(formData.billingStartDate)) {
        errors.billingEndDate = 'End date must be after start date';
      }
    }
    
    if (!formData.ratePerFTE || parseFloat(formData.ratePerFTE) <= 0) {
      errors.ratePerFTE = 'Please enter a valid rate per FTE';
    }
    
    if (!formData.numberOfFTEs || parseFloat(formData.numberOfFTEs) <= 0) {
      errors.numberOfFTEs = 'Please enter a valid number of FTEs';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      const selectedEmployee = employees.find(emp => emp.id.toString() === formData.employeeId);
      
      const invoiceData = {
        projectId: project.id,
        projectName: project.projectName,
        employeeId: parseInt(formData.employeeId),
        employeeName: formData.employeeName,
        employeeAgency: selectedEmployee?.agency || '',
        billingType: formData.billingType,
        billingStartDate: formData.billingStartDate,
        billingEndDate: formData.billingEndDate,
        tenure: formData.tenure,
        ratePerFTE: parseFloat(formData.ratePerFTE),
        numberOfFTEs: parseFloat(formData.numberOfFTEs),
        totalAmount: parseFloat(formData.totalAmount),
        notes: formData.notes,
        createdAt: new Date().toISOString()
      };

      await onSubmit(invoiceData);
    } catch (err) {
      setError(err.message || 'Failed to create invoice. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal invoice-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '700px', 
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: 'white'
        }}
      >
        {/* Modal Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              background: 'rgba(255,255,255,0.2)', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-file-invoice-dollar" style={{ fontSize: '1.2rem' }}></i>
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>Create Invoice</h2>
              <p style={{ margin: '2px 0 0 0', opacity: 0.9, fontSize: '0.85rem' }}>{project?.projectName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto', 
          padding: '1.5rem',
          background: '#f8f9fa'
        }}>
          {/* Loading State */}
          {loading && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '3rem',
              color: '#666'
            }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem', color: '#667eea' }}></i>
              <p>Loading employees for this project...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div style={{ 
              padding: '1.5rem', 
              background: '#fef2f2', 
              border: '1px solid #fecaca',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', color: '#ef4444', marginBottom: '1rem' }}></i>
              <h3 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>Unable to Load Employees</h3>
              <p style={{ color: '#7f1d1d', marginBottom: '1rem' }}>{error}</p>
              <button 
                onClick={loadProjectEmployees}
                className="action-btn secondary"
              >
                <i className="fas fa-sync-alt"></i>
                Try Again
              </button>
            </div>
          )}

          {/* No Employees State */}
          {!loading && !error && employees.length === 0 && (
            <div style={{ 
              padding: '2rem', 
              background: '#fef3c7', 
              border: '1px solid #fcd34d',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <i className="fas fa-users" style={{ fontSize: '2.5rem', color: '#f59e0b', marginBottom: '1rem' }}></i>
              <h3 style={{ color: '#b45309', marginBottom: '0.5rem' }}>No Employees Assigned</h3>
              <p style={{ color: '#92400e' }}>
                There are no employees currently assigned to this project. 
                Please assign employees to the project before creating an invoice.
              </p>
            </div>
          )}

          {/* Form */}
          {!loading && !error && employees.length > 0 && (
            <form id="invoiceForm" onSubmit={handleSubmit}>
              {/* Employee Selection - Resource Name */}
              <div style={{ 
                background: 'white', 
                padding: '1.25rem', 
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                marginBottom: '1rem'
              }}>
                <h4 style={{ 
                  margin: '0 0 1rem 0', 
                  color: '#333', 
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <i className="fas fa-user-tie" style={{ color: '#667eea' }}></i>
                  Resource Name
                  <span style={{ color: '#ef4444' }}>*</span>
                </h4>
                
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.9rem', color: '#555' }}>
                    Select Employee Working on Project
                  </label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className="role-select"
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      border: validationErrors.employeeId ? '2px solid #ef4444' : '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">-- Select Employee --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.employeeName || emp.name || 'Unnamed Employee'} 
                        {emp.agency ? ` (${emp.agency})` : ''}
                      </option>
                    ))}
                  </select>
                  {validationErrors.employeeId && (
                    <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                      <i className="fas fa-exclamation-circle"></i> {validationErrors.employeeId}
                    </span>
                  )}
                </div>

                {/* Show selected employee details */}
                {formData.employeeId && (
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '1rem', 
                    background: '#f0f9ff', 
                    borderRadius: '8px',
                    border: '1px solid #bae6fd'
                  }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#0369a1', fontWeight: '600' }}>
                      <i className="fas fa-info-circle"></i> Selected Resource Details
                    </p>
                    {(() => {
                      const selected = employees.find(e => e.id.toString() === formData.employeeId);
                      return selected ? (
                        <div style={{ fontSize: '0.9rem', color: '#0c4a6e' }}>
                          <p style={{ margin: '0.25rem 0' }}>
                            <strong>Name:</strong> {selected.employeeName || selected.name}
                          </p>
                          <p style={{ margin: '0.25rem 0' }}>
                            <strong>Agency:</strong> {selected.agency || 'N/A'}
                          </p>
                          {selected.billingType && (
                            <p style={{ margin: '0.25rem 0' }}>
                              <strong>Billing Type:</strong> {selected.billingType}
                            </p>
                          )}
                          {selected.startDate && (
                            <p style={{ margin: '0.25rem 0' }}>
                              <strong>Start Date:</strong> {new Date(selected.startDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>

              {/* Billing Details */}
              <div style={{ 
                background: 'white', 
                padding: '1.25rem', 
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                marginBottom: '1rem'
              }}>
                <h4 style={{ 
                  margin: '0 0 1rem 0', 
                  color: '#333', 
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <i className="fas fa-calendar-alt" style={{ color: '#667eea' }}></i>
                  Billing Details
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.9rem', color: '#555' }}>
                      Billing Type <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      name="billingType"
                      value={formData.billingType}
                      onChange={handleInputChange}
                      className="role-select"
                      style={{ 
                        width: '100%', 
                        padding: '12px 16px', 
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Yearly">Yearly</option>
                      <option value="Hourly">Hourly</option>
                    </select>
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.9rem', color: '#555' }}>
                      Tenure (Months)
                    </label>
                    <input
                      type="number"
                      name="tenure"
                      value={formData.tenure}
                      onChange={handleInputChange}
                      placeholder="e.g., 6"
                      min="1"
                      style={{ 
                        width: '100%', 
                        padding: '12px 16px', 
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.9rem', color: '#555' }}>
                      Billing Start Date <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="date"
                      name="billingStartDate"
                      value={formData.billingStartDate}
                      onChange={handleInputChange}
                      style={{ 
                        width: '100%', 
                        padding: '12px 16px', 
                        border: validationErrors.billingStartDate ? '2px solid #ef4444' : '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '1rem'
                      }}
                    />
                    {validationErrors.billingStartDate && (
                      <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                        <i className="fas fa-exclamation-circle"></i> {validationErrors.billingStartDate}
                      </span>
                    )}
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.9rem', color: '#555' }}>
                      Billing End Date <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="date"
                      name="billingEndDate"
                      value={formData.billingEndDate}
                      onChange={handleInputChange}
                      style={{ 
                        width: '100%', 
                        padding: '12px 16px', 
                        border: validationErrors.billingEndDate ? '2px solid #ef4444' : '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '1rem'
                      }}
                    />
                    {validationErrors.billingEndDate && (
                      <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                        <i className="fas fa-exclamation-circle"></i> {validationErrors.billingEndDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Rate & Amount */}
              <div style={{ 
                background: 'white', 
                padding: '1.25rem', 
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                marginBottom: '1rem'
              }}>
                <h4 style={{ 
                  margin: '0 0 1rem 0', 
                  color: '#333', 
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <i className="fas fa-dollar-sign" style={{ color: '#667eea' }}></i>
                  Rate & Amount
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.9rem', color: '#555' }}>
                      Rate per FTE ($) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      name="ratePerFTE"
                      value={formData.ratePerFTE}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      style={{ 
                        width: '100%', 
                        padding: '12px 16px', 
                        border: validationErrors.ratePerFTE ? '2px solid #ef4444' : '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '1rem'
                      }}
                    />
                    {validationErrors.ratePerFTE && (
                      <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                        <i className="fas fa-exclamation-circle"></i> {validationErrors.ratePerFTE}
                      </span>
                    )}
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.9rem', color: '#555' }}>
                      Number of FTEs <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      name="numberOfFTEs"
                      value={formData.numberOfFTEs}
                      onChange={handleInputChange}
                      placeholder="1"
                      min="0.1"
                      step="0.1"
                      style={{ 
                        width: '100%', 
                        padding: '12px 16px', 
                        border: validationErrors.numberOfFTEs ? '2px solid #ef4444' : '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '1rem'
                      }}
                    />
                    {validationErrors.numberOfFTEs && (
                      <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                        <i className="fas fa-exclamation-circle"></i> {validationErrors.numberOfFTEs}
                      </span>
                    )}
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.9rem', color: '#555' }}>
                      Total Amount ($)
                    </label>
                    <input
                      type="text"
                      value={formData.totalAmount ? `$${parseFloat(formData.totalAmount).toLocaleString()}` : '$0.00'}
                      readOnly
                      style={{ 
                        width: '100%', 
                        padding: '12px 16px', 
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        background: '#f3f4f6',
                        color: '#059669',
                        fontWeight: '600'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div style={{ 
                background: 'white', 
                padding: '1.25rem', 
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}>
                <h4 style={{ 
                  margin: '0 0 1rem 0', 
                  color: '#333', 
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <i className="fas fa-sticky-note" style={{ color: '#667eea' }}></i>
                  Notes (Optional)
                </h4>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes for this invoice..."
                  rows="3"
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ 
          borderTop: '1px solid #e5e7eb',
          padding: '1rem 1.5rem',
          background: 'white',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem',
          flexShrink: 0
        }}>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={onClose}
            disabled={submitting}
          >
            <i className="fas fa-times"></i>
            Cancel
          </button>
          {!loading && !error && employees.length > 0 && (
            <button 
              type="submit" 
              form="invoiceForm" 
              className="confirm-btn" 
              disabled={submitting}
              style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
            >
              {submitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i>
                  Create Invoice
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;

