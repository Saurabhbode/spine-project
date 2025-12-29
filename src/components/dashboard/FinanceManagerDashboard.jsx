import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";
import "../style.css";

const FinanceManagerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    pendingApprovals: 0,
    monthlyBudget: 0,
    teamMembers: 0,
    pendingExpenses: 0,
    budgetUtilization: 0
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "approval",
      message: "Invoice #INV-2024-001 approved by John Doe",
      timestamp: "2 hours ago",
      icon: "fas fa-check-circle",
      iconClass: "success"
    },
    {
      id: 2,
      type: "expense",
      message: "New expense claim submitted by Jane Smith",
      timestamp: "4 hours ago",
      icon: "fas fa-receipt",
      iconClass: "info"
    },
    {
      id: 3,
      type: "budget",
      message: "Marketing budget utilization reached 85%",
      timestamp: "6 hours ago",
      icon: "fas fa-chart-line",
      iconClass: "warning"
    },
    {
      id: 4,
      type: "report",
      message: "Monthly financial report generated",
      timestamp: "1 day ago",
      icon: "fas fa-file-alt",
      iconClass: "primary"
    }
  ]);

  const [teamMembers] = useState([
    { id: 1, name: "John Doe", role: "Senior Accountant", status: "active", tasks: 5 },
    { id: 2, name: "Jane Smith", role: "Financial Analyst", status: "active", tasks: 3 },
    { id: 3, name: "Mike Johnson", role: "Budget Manager", status: "busy", tasks: 7 },
    { id: 4, name: "Sarah Wilson", role: "Accounts Payable", status: "offline", tasks: 2 }
  ]);

  // Navigation menu items
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: "fas fa-tachometer-alt" },
    { id: "overview", label: "Project Overview", icon: "fas fa-project-diagram" }
  ];

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    const currentUser = authService.getUser();
    
    // Verify user is Finance user
    if (!currentUser || currentUser.department !== "Finance") {
      navigate("/"); // Redirect to landing page if not finance user
      return;
    }

    setUser(currentUser);
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate loading stats data
      setTimeout(() => {
        setStats({
          totalInvoices: 1247,
          pendingApprovals: 23,
          monthlyBudget: 500000,
          teamMembers: teamMembers.length,
          pendingExpenses: 15600,
          budgetUtilization: 78
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleNavigation = (section) => {
    setActiveSection(section);
    // Handle navigation logic based on section
    console.log("Navigating to:", section);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <h2>Loading Finance Manager Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="finance-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-chart-line"></i>
            {!sidebarCollapsed && <span>Finance Manager</span>}
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleNavigation(item.id)}
              title={sidebarCollapsed ? item.label : ''}
            >
              <i className={item.icon}></i>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <h1>
              <i className="fas fa-chart-line"></i>
              Finance Manager Dashboard
            </h1>
            <div className="user-department">
              <span className="department-badge">Finance Department</span>
              <span className="role-badge manager-role">Manager</span>
            </div>
          </div>
          <div className="user-info">
            <div className="user-welcome">
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <span className="username">Welcome, {user?.name}</span>
            </div>
            <button className="profile-btn" onClick={() => navigate('/profile')}>
              <i className="fas fa-user-circle"></i>
              Profile
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="content-area">
          {activeSection === "dashboard" && (
            <>
              {/* Key Metrics */}
              <section className="stats-grid">
                <div className="stat-card">
                  <h3>Total Invoices</h3>
                  <div className="stat-number">{stats.totalInvoices.toLocaleString()}</div>
                  <div className="stat-change positive">
                    <i className="fas fa-arrow-up"></i> +12% from last month
                  </div>
                </div>

                <div className="stat-card">
                  <h3>Pending Approvals</h3>
                  <div className="stat-number">{stats.pendingApprovals}</div>
                  <div className="stat-change neutral">
                    <i className="fas fa-clock"></i> Requires attention
                  </div>
                </div>

                <div className="stat-card">
                  <h3>Monthly Budget</h3>
                  <div className="stat-number">{formatCurrency(stats.monthlyBudget)}</div>
                  <div className="stat-change positive">
                    <i className="fas fa-arrow-up"></i> On track
                  </div>
                </div>

                <div className="stat-card">
                  <h3>Team Members</h3>
                  <div className="stat-number">{stats.teamMembers}</div>
                  <div className="stat-change neutral">
                    <i className="fas fa-users"></i> Active team
                  </div>
                </div>

                <div className="stat-card">
                  <h3>Pending Expenses</h3>
                  <div className="stat-number">{formatCurrency(stats.pendingExpenses)}</div>
                  <div className="stat-change warning">
                    <i className="fas fa-exclamation-triangle"></i> Needs review
                  </div>
                </div>

                <div className="stat-card">
                  <h3>Budget Utilization</h3>
                  <div className="stat-number">{stats.budgetUtilization}%</div>
                  <div className="stat-change positive">
                    <i className="fas fa-chart-pie"></i> Healthy utilization
                  </div>
                </div>

                <div className="stat-card">
                  <h3>Quarterly Revenue</h3>
                  <div className="stat-number">{formatCurrency(2500000)}</div>
                  <div className="stat-change positive">
                    <i className="fas fa-trending-up"></i> +8% growth
                  </div>
                </div>

                <div className="stat-card">
                  <h3>Cost Savings</h3>
                  <div className="stat-number">{formatCurrency(125000)}</div>
                  <div className="stat-change positive">
                    <i className="fas fa-piggy-bank"></i> This quarter
                  </div>
                </div>
              </section>

              {/* Quick Actions */}
              <section className="quick-actions">
                <h2>
                  <i className="fas fa-bolt"></i>
                  Manager Quick Actions
                </h2>
                <div className="action-buttons">
                  <button className="action-btn primary">
                    <i className="fas fa-check-circle"></i>
                    Review Approvals
                  </button>
                  <button className="action-btn primary">
                    <i className="fas fa-chart-bar"></i>
                    Budget Analysis
                  </button>
                  <button className="action-btn secondary">
                    <i className="fas fa-file-invoice-dollar"></i>
                    Generate Report
                  </button>
                  <button className="action-btn secondary">
                    <i className="fas fa-users-cog"></i>
                    Team Management
                  </button>
                  <button className="action-btn secondary">
                    <i className="fas fa-calendar-alt"></i>
                    Schedule Review
                  </button>
                  <button className="action-btn secondary">
                    <i className="fas fa-bell"></i>
                    Set Alerts
                  </button>
                </div>
              </section>

              <div className="dashboard-grid">
                {/* Team Status */}
                <section className="recent-activity">
                  <h2>
                    <i className="fas fa-users"></i>
                    Team Status
                  </h2>
                  <div className="activity-list">
                    {teamMembers.map(member => (
                      <div className="activity-item" key={member.id}>
                        <div className="activity-icon">
                          <i className={`fas fa-user-circle status-${member.status}`}></i>
                        </div>
                        <div className="activity-content">
                          <p><strong>{member.name}</strong> - {member.role}</p>
                          <div className="member-status">
                            <span className={`status-indicator ${member.status}`}>
                              {member.status === 'active' ? '🟢 Active' : 
                               member.status === 'busy' ? '🟡 Busy' : '🔴 Offline'}
                            </span>
                            <span className="task-count">{member.tasks} pending tasks</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Recent Activity */}
                <section className="recent-activity">
                  <h2>
                    <i className="fas fa-clock"></i>
                    Recent Activity
                  </h2>
                  <div className="activity-list">
                    {recentActivities.map(activity => (
                      <div className="activity-item" key={activity.id}>
                        <div className={`activity-icon ${activity.iconClass}`}>
                          <i className={activity.icon}></i>
                        </div>
                        <div className="activity-content">
                          <p>{activity.message}</p>
                          <div className="activity-time">{activity.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Performance Overview */}
                <section className="recent-activity">
                  <h2>
                    <i className="fas fa-chart-bar"></i>
                    Performance Overview
                  </h2>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon success">
                        <i className="fas fa-trophy"></i>
                      </div>
                      <div className="activity-content">
                        <p><strong>Monthly Target Achievement</strong></p>
                        <div className="activity-time">95% completion rate</div>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon primary">
                        <i className="fas fa-dollar-sign"></i>
                      </div>
                      <div className="activity-content">
                        <p><strong>Cost Efficiency</strong></p>
                        <div className="activity-time">12% improvement vs. last quarter</div>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon warning">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div className="activity-content">
                        <p><strong>Average Processing Time</strong></p>
                        <div className="activity-time">2.3 days (target: 2.5 days)</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Key Alerts */}
                <section className="recent-activity">
                  <h2>
                    <i className="fas fa-bell"></i>
                    Key Alerts
                  </h2>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon warning">
                        <i className="fas fa-exclamation-triangle"></i>
                      </div>
                      <div className="activity-content">
                        <p><strong>Budget Threshold Alert</strong></p>
                        <div className="activity-time">Marketing budget at 85% utilization</div>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon info">
                        <i className="fas fa-info-circle"></i>
                      </div>
                      <div className="activity-content">
                        <p><strong>System Maintenance</strong></p>
                        <div className="activity-time">Scheduled for this weekend</div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Manager-Specific Features */}
              <section className="manager-features">
                <h2>
                  <i className="fas fa-crown"></i>
                  Manager Exclusive Features
                </h2>
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-tachometer-alt"></i>
                    </div>
                    <h3>Executive Dashboard</h3>
                    <p>High-level financial overview with KPIs and trends</p>
                    <button className="feature-btn">View Dashboard</button>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-user-tie"></i>
                    </div>
                    <h3>Team Performance</h3>
                    <p>Monitor team productivity and individual performance metrics</p>
                    <button className="feature-btn">View Performance</button>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <h3>Approval Queue</h3>
                    <p>Priority-based approval system for high-value transactions</p>
                    <button className="feature-btn">Review Queue</button>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-hand-holding-usd"></i>
                    </div>
                    <h3>Budget Controls</h3>
                    <p>Advanced budget management and variance analysis tools</p>
                    <button className="feature-btn">Manage Budget</button>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeSection === "overview" && (
            <section className="content-section">
              
              <div className="project-stats">
                <div className="stat-card">
                  <h3>Good Performers</h3>
                  <div className="stat-number">12</div>
                  <div className="stat-change positive">
                    <i className="fas fa-circle good-indicator"></i> Excellent performance
                  </div>
                </div>
                <div className="stat-card">
                  <h3>Average Performers</h3>
                  <div className="stat-number">8</div>
                  <div className="stat-change warning">
                    <i className="fas fa-circle average-indicator"></i> Meeting expectations
                  </div>
                </div>
                <div className="stat-card">
                  <h3>Bad Performers</h3>
                  <div className="stat-number">3</div>
                  <div className="stat-change negative">
                    <i className="fas fa-circle bad-indicator"></i> Needs improvement
                  </div>
                </div>
              </div>
              <div className="project-list">
                <h3>Current Projects</h3>
                <div className="project-item">
                  <div className="project-info">
                    <h4>Financial System Upgrade</h4>
                    <p>Modernizing legacy financial systems</p>
                    <div className="project-progress">
                      <span className="progress-bar">
                        <span className="progress-fill" style={{width: '75%'}}></span>
                      </span>
                      <span className="progress-text">75% Complete</span>
                    </div>
                  </div>
                  <div className="project-status">
                    <span className="status-indicator active">Active</span>
                  </div>
                </div>
                <div className="project-item">
                  <div className="project-info">
                    <h4>Database Migration</h4>
                    <p>Migrating to cloud-based database solutions</p>
                    <div className="project-progress">
                      <span className="progress-bar">
                        <span className="progress-fill" style={{width: '45%'}}></span>
                      </span>
                      <span className="progress-text">45% Complete</span>
                    </div>
                  </div>
                  <div className="project-status">
                    <span className="status-indicator active">Active</span>
                  </div>
                </div>
                <div className="project-item">
                  <div className="project-info">
                    <h4>Security Enhancement</h4>
                    <p>Implementing advanced security measures</p>
                    <div className="project-progress">
                      <span className="progress-bar">
                        <span className="progress-fill" style={{width: '90%'}}></span>
                      </span>
                      <span className="progress-text">90% Complete</span>
                    </div>
                  </div>
                  <div className="project-status">
                    <span className="status-indicator busy">Final Review</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection !== "dashboard" && activeSection !== "overview" && (
            <section className="content-section">
              <h2><i className={`fas ${navigationItems.find(item => item.id === activeSection)?.icon}`}></i> {navigationItems.find(item => item.id === activeSection)?.label}</h2>
              <div className="content-placeholder">
                <p>{navigationItems.find(item => item.id === activeSection)?.label} section is under development.</p>
                <p>Coming soon: Full functionality for this module.</p>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default FinanceManagerDashboard;
