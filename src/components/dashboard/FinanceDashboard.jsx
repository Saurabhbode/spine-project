import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";
import "../style.css";

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalInvoices: 245,
    pendingPayments: 12,
    monthlyRevenue: 125000,
    overdueAccounts: 3
  });

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    const currentUser = authService.getUser();
    if (!currentUser || currentUser.department !== "Finance") {
      navigate("/login");
      return;
    }

    setUser(currentUser);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Finance Department Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Quick Stats */}
        <section className="stats-grid">
          <div className="stat-card">
            <h3>Total Invoices</h3>
            <p className="stat-number">{stats.totalInvoices}</p>
            <span className="stat-change positive">+5% this month</span>
          </div>
          
          <div className="stat-card">
            <h3>Pending Payments</h3>
            <p className="stat-number">{stats.pendingPayments}</p>
            <span className="stat-change neutral">2 overdue</span>
          </div>
          
          <div className="stat-card">
            <h3>Monthly Revenue</h3>
            <p className="stat-number">${stats.monthlyRevenue.toLocaleString()}</p>
            <span className="stat-change positive">+12% vs last month</span>
          </div>
          
          <div className="stat-card">
            <h3>Overdue Accounts</h3>
            <p className="stat-number">{stats.overdueAccounts}</p>
            <span className="stat-change negative">Requires attention</span>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn primary">
              <i className="fas fa-file-invoice"></i>
              Create Invoice
            </button>
            <button className="action-btn secondary">
              <i className="fas fa-chart-line"></i>
              Financial Reports
            </button>
            <button className="action-btn secondary">
              <i className="fas fa-credit-card"></i>
              Process Payment
            </button>
            <button className="action-btn secondary">
              <i className="fas fa-calculator"></i>
              Budget Analysis
            </button>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <i className="fas fa-file-invoice activity-icon"></i>
              <div className="activity-content">
                <p><strong>Invoice #INV-2024-001</strong> created for ABC Corp</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <i className="fas fa-money-bill-wave activity-icon"></i>
              <div className="activity-content">
                <p>Payment received from XYZ Ltd - $15,750</p>
                <span className="activity-time">4 hours ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <i className="fas fa-exclamation-triangle activity-icon warning"></i>
              <div className="activity-content">
                <p>Invoice #INV-2023-089 is overdue</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FinanceDashboard;

