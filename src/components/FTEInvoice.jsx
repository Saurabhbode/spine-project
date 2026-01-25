import React, { useState } from 'react';
import '../styles/pages/fte-invoice.css';

/**
 * FTEInvoice Component
 * Displays FTE Utilization Summary and Allocation Details
 * 
 * @param {string} month - Month name (e.g., "November")
 * @param {number} year - Year (e.g., 2025)
 * @param {Array} summaryData - FTE summary by process
 * @param {Array} allocationData - Detailed FTE allocation by resource
 * @param {Function} onAllocationChange - Callback when allocation data changes
 */
const FTEInvoice = ({ 
  month = '', 
  year = new Date().getFullYear(),
  summaryData = [],
  allocationData = [],
  onAllocationChange
}) => {
  // Local state for editable allocation data
  const [editableData, setEditableData] = useState(allocationData.map(item => ({ ...item })));
  const [editingId, setEditingId] = useState(null);

  // Calculate totals
  const totalFTE = summaryData.reduce((sum, item) => sum + (parseFloat(item.fteCount) || 0), 0);
  const totalAllocationFTE = editableData.reduce((sum, item) => sum + (parseFloat(item.fte) || 0), 0);

  // Handle FTE value change
  const handleFteChange = (id, value) => {
    // Allow empty string for editing
    if (value === '') {
      const updatedData = editableData.map(item => 
        item.id === id ? { ...item, fte: '' } : item
      );
      setEditableData(updatedData);
      return;
    }
    
    const newValue = parseFloat(value);
    // Only update if valid number
    if (isNaN(newValue) || newValue < 0) return;

    const updatedData = editableData.map(item => 
      item.id === id ? { ...item, fte: newValue } : item
    );
    setEditableData(updatedData);
    
    // Update summary FTE count - recalculate by role
    const roleTotals = {};
    updatedData.forEach(item => {
      const role = item.process || 'General';
      if (!roleTotals[role]) {
        roleTotals[role] = 0;
      }
      roleTotals[role] += parseFloat(item.fte) || 0;
    });
    
    const newSummaryData = summaryData.map(item => ({
      ...item,
      fteCount: roleTotals[item.process] || 0
    }));
    
    if (onAllocationChange) {
      onAllocationChange(updatedData, newSummaryData);
    }
  };

  // Handle remarks change
  const handleRemarksChange = (id, value) => {
    const updatedData = editableData.map(item => 
      item.id === id ? { ...item, remarks: value } : item
    );
    setEditableData(updatedData);
    
    if (onAllocationChange) {
      onAllocationChange(updatedData, summaryData);
    }
  };

  // Start inline editing
  const startEditing = (id) => {
    setEditingId(id);
  };

  // Stop editing
  const stopEditing = () => {
    setEditingId(null);
  };

  return (
    <div className="fte-invoice-container">
      {/* FTE Utilization Summary */}
      <section className="fte-section">
        <h2 className="fte-section-title">{month} {year} – FTE Utilization Summary</h2>
        <table className="fte-table">
          <thead>
            <tr>
              <th>Process</th>
              <th className="text-right"># of FTE's</th>
              <th>Rate/FTE</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((item, index) => (
              <tr key={`summary-${index}`}>
                <td>{item.process}</td>
                <td className="text-right">{(parseFloat(item.fteCount) || 0).toFixed(2)}</td>
                <td></td>
                <td></td>
              </tr>
            ))}
            <tr className="total-row">
              <td>{month} {year} - Grand TOTAL</td>
              <td className="text-right">{totalFTE.toFixed(2)}</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* FTE Allocation Details */}
      <section className="fte-section">
        <h2 className="fte-section-title">FTE Allocation Details</h2>
        <table className="fte-table">
          <thead>
            <tr>
              <th>Resource Name</th>
              <th>Employee Role</th>
              <th>Agency Name</th>
              <th className="text-right">FTE</th>
              <th>Process</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {editableData.map((item, index) => (
              <tr key={`allocation-${item.id || index}`}>
                <td>{item.resourceName}</td>
                <td>{item.employeeRole || item.role || '-'}</td>
                <td>{item.agencyName}</td>
                <td className="text-right">
                  {editingId === item.id ? (
                    <input
                      type="number"
                      className="fte-input"
                      value={item.fte === '' ? '' : (item.fte === null || item.fte === undefined ? 0 : item.fte)}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow empty string for editing
                        handleFteChange(item.id, value);
                      }}
                      onBlur={() => {
                        // Ensure valid value on blur, convert empty/null to 0
                        if (item.fte === '' || item.fte === null || item.fte === undefined) {
                          handleFteChange(item.id, '0');
                        }
                        stopEditing();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (item.fte === '' || item.fte === null || item.fte === undefined) {
                            handleFteChange(item.id, '0');
                          }
                          stopEditing();
                        }
                      }}
                      autoFocus
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      onFocus={(e) => e.target.select()}
                      style={{ width: '80px', textAlign: 'right', padding: '4px 8px', border: '1px solid #667eea', borderRadius: '4px', fontSize: '0.9rem' }}
                    />
                  ) : (
                    <span 
                      className="editable-fte"
                      onClick={() => startEditing(item.id)}
                      title="Click to edit FTE"
                      style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', background: '#f0f9ff' }}
                    >
                      {item.fte === '' ? '0.00' : (parseFloat(item.fte) || 0).toFixed(2)}
                    </span>
                  )}
                </td>
                <td>{item.process}</td>
                <td>
                  <input
                    type="text"
                    className="remarks-input"
                    value={item.remarks || ''}
                    onChange={(e) => handleRemarksChange(item.id, e.target.value)}
                    placeholder="Add remarks..."
                    style={{ 
                      width: '100%', 
                      maxWidth: '200px',
                      padding: '6px 10px', 
                      border: '1px solid #e1e5e9', 
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}
                  />
                </td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan="3">Total</td>
              <td className="text-right">{totalAllocationFTE.toFixed(2)}</td>
              <td colSpan="2"></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default FTEInvoice;

