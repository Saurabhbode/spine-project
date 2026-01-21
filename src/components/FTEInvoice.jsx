import React from 'react';
import '../styles/pages/fte-invoice.css';

/**
 * FTEInvoice Component
 * Displays FTE Utilization Summary and Allocation Details
 * 
 * @param {string} month - Month name (e.g., "November")
 * @param {number} year - Year (e.g., 2025)
 * @param {Array} summaryData - FTE summary by process
 * @param {Array} allocationData - Detailed FTE allocation by resource
 */
const FTEInvoice = ({ 
  month = '', 
  year = new Date().getFullYear(),
  summaryData = [],
  allocationData = []
}) => {
  // Calculate totals
  const totalFTE = summaryData.reduce((sum, item) => sum + (item.fteCount || 0), 0);
  const totalAllocationFTE = allocationData.reduce((sum, item) => sum + (item.fte || 0), 0);

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
                <td className="text-right">{item.fteCount?.toFixed(2) || '0.00'}</td>
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
              <th>Agency Name</th>
              <th className="text-right">FTE</th>
              <th>Process</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {allocationData.map((item, index) => (
              <tr key={`allocation-${index}`}>
                <td>{item.resourceName}</td>
                <td>{item.agencyName}</td>
                <td className="text-right">{item.fte?.toFixed(2) || '0.00'}</td>
                <td>{item.process}</td>
                <td>{item.remarks || ''}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan="2">Total</td>
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

