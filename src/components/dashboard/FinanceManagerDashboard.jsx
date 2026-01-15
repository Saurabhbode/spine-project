import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";
import ProjectService from "../../services/ProjectService";
import EmployeeService from "../../services/EmployeeService";
import Users from "./Users";
import Employees from "./Employees";
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

  // Projects state
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectMessage, setProjectMessage] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [deleteConfirmProject, setDeleteConfirmProject] = useState(null);

  // New project form state
  const [newProject, setNewProject] = useState({
    projectName: "",
    projectDescription: "",
    categoryId: "",
    projectType: "FTE",
    startDate: "",
    endDate: "",
    budget: "",
    location: "",
    department: "Finance"
  });

  // Project filter state
  const [projectFilter, setProjectFilter] = useState("all"); // 'all', 'contingency', 'fte'

  // Get filtered projects based on filter state
  const getFilteredProjects = () => {
    if (projectFilter === "all") {
      return projects;
    } else if (projectFilter === "contingency") {
      return projects.filter(p => p.projectType === "Contingency");
    } else if (projectFilter === "fte") {
      return projects.filter(p => p.projectType === "FTE");
    }
    return projects;
  };

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
    { id: "invoices", label: "Invoices", icon: "fas fa-file-invoice-dollar" },
    { id: "overview", label: "Project Overview", icon: "fas fa-project-diagram" },
    { id: "employees", label: "Employees", icon: "fas fa-user-tie" },
    { id: "users", label: "Users", icon: "fas fa-users" }
  ];

  // Invoices state
  const [invoiceProjects, setInvoiceProjects] = useState([]);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceError, setInvoiceError] = useState(null);
  
  // Invoice form state
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectEmployees, setProjectEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [invoiceFormData, setInvoiceFormData] = useState({
    employeeId: "",
    employeeName: "",
    fteValue: "",
    fteAmount: "",
    invoiceDate: "",
    description: ""
  });
  const [invoiceSubmitting, setInvoiceSubmitting] = useState(false);
  const [invoiceMessage, setInvoiceMessage] = useState(null);

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
    
    // Load projects when navigating to overview section
    if (section === "overview") {
      loadProjects();
    }
    
    // Load invoice projects when navigating to invoices section
    if (section === "invoices") {
      loadInvoiceProjects();
    }
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

  // Load projects from API
  const loadProjects = async () => {
    try {
      const data = await ProjectService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  // Load invoice projects from API
  const loadInvoiceProjects = async () => {
    setInvoiceLoading(true);
    setInvoiceError(null);
    try {
      const data = await ProjectService.getAllProjects();
      setInvoiceProjects(data);
    } catch (error) {
      console.error("Error loading invoice projects:", error);
      setInvoiceError(error.message || "Failed to load projects. Please make sure the backend is running.");
    } finally {
      setInvoiceLoading(false);
    }
  };

  // Open invoice form modal for FTE project
  const openInvoiceModal = async (project) => {
    if (project.projectType !== "FTE") {
      alert("Invoice can only be created for FTE-based projects.");
      return;
    }
    setSelectedProject(project);
    setEmployeesLoading(true);
    setInvoiceMessage(null);
    
    try {
      // Fetch employees working on this project using junction table endpoint
      const employees = await EmployeeService.getEmployeesByProjectFromJunction(project.projectName);
      setProjectEmployees(employees);
      
      setInvoiceFormData({
        employeeId: "",
        employeeName: "",
        fteValue: "",
        fteAmount: "",
        invoiceDate: new Date().toISOString().split('T')[0],
        description: `Invoice for project: ${project.projectName}`
      });
    } catch (error) {
      console.error("Error fetching project employees:", error);
      setProjectEmployees([]);
      // Set default empty form even if employees fail to load
      setInvoiceFormData({
        employeeId: "",
        employeeName: "",
        fteValue: "",
        fteAmount: "",
        invoiceDate: new Date().toISOString().split('T')[0],
        description: `Invoice for project: ${project.projectName}`
      });
    } finally {
      setEmployeesLoading(false);
      setShowInvoiceModal(true);
    }
  };

  // Close invoice form modal
  const closeInvoiceModal = () => {
    setShowInvoiceModal(false);
    setSelectedProject(null);
    setInvoiceMessage(null);
  };

  // Handle invoice form input changes
  const handleInvoiceInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      
      // Auto-fill employee name when employee is selected
      if (name === 'employeeId') {
        const selectedEmployee = projectEmployees.find(emp => emp.id.toString() === value);
        updated.employeeName = selectedEmployee ? selectedEmployee.employeeName : '';
      }
      
      // Auto-calculate total amount
      if (name === 'ratePerHour' || name === 'hoursWorked') {
        const rate = parseFloat(updated.ratePerHour) || 0;
        const hours = parseFloat(updated.hoursWorked) || 0;
        updated.totalAmount = (rate * hours).toFixed(2);
      }
      return updated;
    });
  };

  // Handle invoice form submission
  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();
    setInvoiceSubmitting(true);
    setInvoiceMessage(null);

    try {
      // Simulate invoice creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setInvoiceMessage({
        type: 'success',
        text: `Invoice for project "${selectedProject.projectName}" created successfully!`
      });

      // Close modal after success
      setTimeout(() => {
        closeInvoiceModal();
      }, 2000);
    } catch (error) {
      setInvoiceMessage({
        type: 'error',
        text: error.message || 'Failed to create invoice. Please try again.'
      });
    } finally {
      setInvoiceSubmitting(false);
    }
  };

  // Load categories from API
  const loadCategories = async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    console.log("Loading categories from API...");
    
    try {
      console.log("Calling ProjectService.getAllCategories()...");
      const data = await ProjectService.getAllCategories();
      console.log("Categories loaded successfully:", data);
      setCategories(data);
      
      if (data.length === 0) {
        console.warn("No categories found in database. The project_category table may be empty.");
        setCategoriesError("No categories available. Please add categories first.");
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      
      // Provide more helpful error messages
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        setCategoriesError("Cannot connect to server. Make sure the backend is running on http://localhost:8080");
      } else if (error.message.includes("404")) {
        setCategoriesError("API endpoint not found. Please check backend configuration.");
      } else if (error.message.includes("500")) {
        setCategoriesError("Server error. Please check database connection.");
      } else {
        setCategoriesError(error.message || "Failed to load categories. Please try again.");
      }
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Handle input changes for new project form
  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset new project form
  const resetNewProjectForm = () => {
    setNewProject({
      projectName: "",
      projectDescription: "",
      categoryId: "",
      startDate: "",
      endDate: "",
      budget: "",
      location: "",
      department: "Finance"
    });
    setProjectMessage(null);
  };

  // Open add project modal
  const openAddProjectModal = () => {
    resetNewProjectForm();
    loadCategories();
    setShowAddProjectModal(true);
  };

  // Close add project modal
  const closeAddProjectModal = () => {
    setShowAddProjectModal(false);
    resetNewProjectForm();
  };

  // Handle add project submission
  const handleAddProject = async (e) => {
    e.preventDefault();
    setProjectLoading(true);
    setProjectMessage(null);

    try {
      const projectData = {
        projectName: newProject.projectName,
        projectDescription: newProject.projectDescription,
        categoryId: newProject.categoryId ? parseInt(newProject.categoryId) : null,
        projectType: newProject.projectType || "FTE",
        startDate: newProject.startDate || null,
        endDate: newProject.endDate || null,
        budget: newProject.budget ? parseFloat(newProject.budget) : null,
        location: newProject.location,
        department: newProject.department
      };

      const response = await ProjectService.createProject(projectData);
      
      setProjectMessage({
        type: 'success',
        text: `Project "${response.projectName}" created successfully!`
      });

      // Refresh projects list and close modal after a delay
      setTimeout(() => {
        loadProjects();
        closeAddProjectModal();
      }, 1500);
    } catch (error) {
      setProjectMessage({
        type: 'error',
        text: error.message || 'Failed to create project. Please try again.'
      });
    } finally {
      setProjectLoading(false);
    }
  };

  // Handle edit project button click
  const handleEditProject = (project) => {
    // Populate the form with the project's original values
    setNewProject({
      projectName: project.projectName || "",
      projectDescription: project.projectDescription || "",
      categoryId: project.categoryId ? String(project.categoryId) : "",
      projectType: project.projectType || "FTE",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      budget: project.budget !== null && project.budget !== undefined ? String(project.budget) : "",
      location: project.location || "",
      department: project.department || "Finance"
    });
    setProjectToEdit(project);
    loadCategories();
    setShowEditProjectModal(true);
  };

  // Close edit project modal
  const closeEditProjectModal = () => {
    setShowEditProjectModal(false);
    setProjectToEdit(null);
  };

  // Handle update project submission
  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setProjectLoading(true);
    setProjectMessage(null);

    try {
      const projectData = {
        projectName: newProject.projectName,
        projectDescription: newProject.projectDescription,
        categoryId: newProject.categoryId ? parseInt(newProject.categoryId) : null,
        projectType: newProject.projectType || "FTE",
        startDate: newProject.startDate || null,
        endDate: newProject.endDate || null,
        budget: newProject.budget ? parseFloat(newProject.budget) : null,
        location: newProject.location,
        department: newProject.department
      };

      const response = await ProjectService.updateProject(projectToEdit.id, projectData);
      
      setProjectMessage({
        type: 'success',
        text: `Project "${response.projectName}" updated successfully!`
      });

      // Refresh projects list and close modal after a delay
      setTimeout(() => {
        loadProjects();
        closeEditProjectModal();
      }, 1500);
    } catch (error) {
      setProjectMessage({
        type: 'error',
        text: error.message || 'Failed to update project. Please try again.'
      });
    } finally {
      setProjectLoading(false);
    }
  };

  // Handle delete project button click
  const handleDeleteProject = async () => {
    if (!deleteConfirmProject) return;
    
    setProjectLoading(true);
    setProjectMessage(null);

    try {
      await ProjectService.deleteProject(deleteConfirmProject.id);
      
      setProjectMessage({
        type: 'success',
        text: `Project "${deleteConfirmProject.projectName}" deleted successfully!`
      });

      // Refresh projects list and close modal after a delay
      setTimeout(() => {
        loadProjects();
        setDeleteConfirmProject(null);
      }, 1500);
    } catch (error) {
      setProjectMessage({
        type: 'error',
        text: error.message || 'Failed to delete project. Please try again.'
      });
    } finally {
      setProjectLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteConfirmModal = (project) => {
    setDeleteConfirmProject(project);
  };

  // Close delete confirmation modal
  const closeDeleteConfirmModal = () => {
    setDeleteConfirmProject(null);
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

          {activeSection === "employees" && (
            <Employees />
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

              {/* Projects List Section */}
              <section className="projects-section">
                <div className="projects-header">
                  <div className="projects-title-row">
                    <h2>
                      <i className="fas fa-project-diagram"></i>
                      All Projects
                    </h2>
                    <div className="projects-count">
                      <span className="count-badge">{getFilteredProjects().length} Projects</span>
                    </div>
                  </div>
                  <div className="overview-buttons">
                    <button className="action-btn primary" onClick={openAddProjectModal}>
                      <i className="fas fa-plus-circle"></i>
                      Add Project
                    </button>
                    <button 
                      className={`action-btn ${projectFilter === 'all' ? 'primary' : 'secondary'}`}
                      onClick={() => setProjectFilter('all')}
                    >
                      <i className="fas fa-list"></i>
                      All Projects
                    </button>
                    <button 
                      className={`action-btn ${projectFilter === 'contingency' ? 'primary' : 'secondary'}`}
                      onClick={() => setProjectFilter('contingency')}
                    >
                      <i className="fas fa-handshake"></i>
                      Contingency-Based
                    </button>
                    <button 
                      className={`action-btn ${projectFilter === 'fte' ? 'primary' : 'secondary'}`}
                      onClick={() => setProjectFilter('fte')}
                    >
                      <i className="fas fa-users"></i>
                      FTE Based
                    </button>
                  </div>
                </div>

                {getFilteredProjects().length === 0 ? (
                  <div className="no-projects">
                    <i className="fas fa-folder-open"></i>
                    <h3>No Projects Found</h3>
                    <p>There are no projects to display. Click "Add Project" to create your first project.</p>
                    <button className="action-btn primary" onClick={openAddProjectModal}>
                      <i className="fas fa-plus-circle"></i>
                      Add Project
                    </button>
                  </div>
                ) : (
                  <div className="projects-grid">
                    {getFilteredProjects().map((project) => (
                      <div className="project-card" key={project.id}>
                        <div className="project-card-header">
                          <div className="project-icon">
                            <i className="fas fa-folder"></i>
                          </div>
                          <div className="project-card-actions">
                            <button 
                              className="project-action-btn" 
                              title="Edit Project"
                              onClick={() => handleEditProject(project)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="project-action-btn delete-btn" 
                              title="Delete Project"
                              onClick={() => openDeleteConfirmModal(project)}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                        <div className="project-card-body">
                          <h3 className="project-name">{project.projectName}</h3>
                          {project.projectDescription && (
                            <p className="project-description">{project.projectDescription}</p>
                          )}
                          <div className="project-details">
                            {project.categoryName && (
                              <div className="project-detail">
                                <i className="fas fa-tag"></i>
                                <span>{project.categoryName}</span>
                              </div>
                            )}
                            {project.budget && (
                              <div className="project-detail">
                                <i className="fas fa-dollar-sign"></i>
                                <span>{formatCurrency(project.budget)}</span>
                              </div>
                            )}
                            {project.startDate && (
                              <div className="project-detail">
                                <i className="fas fa-calendar-alt"></i>
                                <span>{new Date(project.startDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            {project.endDate && (
                              <div className="project-detail">
                                <i className="fas fa-calendar-check"></i>
                                <span>{new Date(project.endDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            {project.department && (
                              <div className="project-detail">
                                <i className="fas fa-building"></i>
                                <span>{project.department}</span>
                              </div>
                            )}
                            {project.location && (
                              <div className="project-detail">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>{project.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="project-card-footer">
                          <span className={`project-status ${project.status ? project.status.toLowerCase() : 'active'}`}>
                            {project.status || 'Active'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </section>
          )}

          {activeSection === "users" && (
            <Users />
          )}

          {activeSection === "invoices" && (
            <section className="content-section">
              <div className="section-header">
                <h2>
                  <i className="fas fa-file-invoice-dollar"></i>
                  Invoices - Projects List
                </h2>
                <div className="section-actions">
                  <button className="action-btn primary" onClick={loadInvoiceProjects}>
                    <i className="fas fa-sync-alt"></i>
                    Refresh
                  </button>
                </div>
              </div>

              {invoiceLoading && (
                <div className="loading">
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>Loading projects...</p>
                </div>
              )}

              {invoiceError && (
                <div className="error-message">
                  <i className="fas fa-exclamation-triangle"></i>
                  <p>{invoiceError}</p>
                  <button className="action-btn secondary" onClick={loadInvoiceProjects}>
                    <i className="fas fa-sync-alt"></i>
                    Try Again
                  </button>
                </div>
              )}

              {!invoiceLoading && !invoiceError && invoiceProjects.length === 0 && (
                <div className="empty-state">
                  <i className="fas fa-folder-open"></i>
                  <h3>No Projects Found</h3>
                  <p>There are no projects to display.</p>
                </div>
              )}

              {!invoiceLoading && !invoiceError && invoiceProjects.length > 0 && (
                <div className="table-container" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <tr>
                        <th style={{ padding: '1rem', textAlign: 'left', color: 'white', fontWeight: '600' }}>
                          <i className="fas fa-project-diagram" style={{ marginRight: '8px' }}></i>
                          Project Name
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', color: 'white', fontWeight: '600' }}>
                          <i className="fas fa-users" style={{ marginRight: '8px' }}></i>
                          Type
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', color: 'white', fontWeight: '600' }}>
                          <i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i>
                          Status
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'center', color: 'white', fontWeight: '600' }}>
                          <i className="fas fa-cogs" style={{ marginRight: '8px' }}></i>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceProjects.map((project, index) => (
                        <tr 
                          key={project.id}
                          style={{ 
                            background: index % 2 === 0 ? '#f8f9fa' : 'white',
                            borderBottom: '1px solid #eee'
                          }}
                        >
                          <td style={{ padding: '1rem' }}>
                            <span style={{ fontWeight: '500', color: '#333' }}>
                              {project.projectName}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span className={`project-type-badge ${project.projectType?.toLowerCase()}`} style={{ 
                              background: project.projectType === 'FTE' ? '#e3f2fd' : '#fff3e0',
                              color: project.projectType === 'FTE' ? '#1976d2' : '#f57c00',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              fontWeight: '500'
                            }}>
                              {project.projectType || '-'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span className={`status-badge ${project.status ? project.status.toLowerCase() : 'active'}`} style={{ 
                              background: project.status === 'active' ? '#d4edda' : project.status === 'completed' ? '#cce5ff' : '#f8d7da',
                              color: project.status === 'active' ? '#155724' : project.status === 'completed' ? '#004085' : '#721c24',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              fontWeight: '500'
                            }}>
                              {project.status || 'Active'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <button
                              className="project-name-btn"
                              onClick={() => openInvoiceModal(project)}
                              title="Create Invoice"
                              style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                            >
                              <i className="fas fa-file-invoice-dollar"></i>
                              Create Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {activeSection !== "dashboard" && activeSection !== "overview" && activeSection !== "users" && activeSection !== "invoices" && (
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

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="modal-overlay" onClick={closeAddProjectModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3>
                <i className="fas fa-project-diagram"></i>
                Add New Project
              </h3>
            </div>
            <div className="modal-body">
              <form id="addProjectForm" onSubmit={handleAddProject}>
                {projectMessage && (
                  <div className={`message ${projectMessage.type}-message`}>
                    <i className={`fas ${projectMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                    {projectMessage.text}
                  </div>
                )}

                <div className="input-group">
                  <label htmlFor="projectName">
                    <i className="fas fa-clipboard-list"></i>
                    Project Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    value={newProject.projectName}
                    onChange={handleProjectInputChange}
                    placeholder="Enter project name"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="projectDescription">
                    <i className="fas fa-align-left"></i>
                    Description
                  </label>
                  <textarea
                    id="projectDescription"
                    name="projectDescription"
                    value={newProject.projectDescription}
                    onChange={handleProjectInputChange}
                    placeholder="Enter project description"
                    rows="3"
                    style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px', fontFamily: 'inherit', resize: 'vertical' }}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="categoryId">
                    <i className="fas fa-tags"></i>
                    Category
                  </label>
                  {categoriesLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '12px', color: '#666' }}>
                      <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                      Loading categories...
                    </div>
                  ) : categoriesError ? (
                    <div style={{ padding: '12px', color: '#dc2626', fontSize: '14px' }}>
                      <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                      {categoriesError}
                    </div>
                  ) : (
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={newProject.categoryId}
                      onChange={handleProjectInputChange}
                      className="role-select"
                      style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px' }}
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="projectType">
                    <i className="fas fa-users"></i>
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={newProject.projectType}
                    onChange={handleProjectInputChange}
                    className="role-select"
                    style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px' }}
                  >
                    <option value="FTE">FTE Based</option>
                    <option value="Contingency">Contingency Based</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label htmlFor="startDate">
                      <i className="fas fa-calendar-alt"></i>
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={newProject.startDate}
                      onChange={handleProjectInputChange}
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="endDate">
                      <i className="fas fa-calendar-check"></i>
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={newProject.endDate}
                      onChange={handleProjectInputChange}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label htmlFor="budget">
                      <i className="fas fa-dollar-sign"></i>
                      Budget
                    </label>
                    <input
                      type="number"
                      id="budget"
                      name="budget"
                      value={newProject.budget}
                      onChange={handleProjectInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="department">
                      <i className="fas fa-building"></i>
                      Department
                    </label>
                  <select
                      id="department"
                      name="department"
                      value={newProject.department}
                      onChange={handleProjectInputChange}
                      className="role-select"
                      style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px' }}
                    >
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="location">
                    <i className="fas fa-map-marker-alt"></i>
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={newProject.location}
                    onChange={handleProjectInputChange}
                    placeholder="Enter project location"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={closeAddProjectModal}
                disabled={projectLoading}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button 
                type="submit" 
                form="addProjectForm" 
                className="confirm-btn" 
                disabled={projectLoading || !newProject.projectName.trim()}
                style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
              >
                {projectLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus"></i>
                    Create Project
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditProjectModal && projectToEdit && (
        <div className="modal-overlay" onClick={closeEditProjectModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3>
                <i className="fas fa-edit"></i>
                Edit Project
              </h3>
            </div>
            <div className="modal-body">
              <form id="editProjectForm" onSubmit={handleUpdateProject}>
                {projectMessage && (
                  <div className={`message ${projectMessage.type}-message`}>
                    <i className={`fas ${projectMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                    {projectMessage.text}
                  </div>
                )}

                <div className="input-group">
                  <label htmlFor="editProjectName">
                    <i className="fas fa-clipboard-list"></i>
                    Project Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="editProjectName"
                    name="projectName"
                    value={newProject.projectName}
                    onChange={handleProjectInputChange}
                    placeholder="Enter project name"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="editProjectDescription">
                    <i className="fas fa-align-left"></i>
                    Description
                  </label>
                  <textarea
                    id="editProjectDescription"
                    name="projectDescription"
                    value={newProject.projectDescription}
                    onChange={handleProjectInputChange}
                    placeholder="Enter project description"
                    rows="3"
                    style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px', fontFamily: 'inherit', resize: 'vertical' }}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="editCategoryId">
                    <i className="fas fa-tags"></i>
                    Category
                  </label>
                  {categoriesLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '12px', color: '#666' }}>
                      <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                      Loading categories...
                    </div>
                  ) : categoriesError ? (
                    <div style={{ padding: '12px', color: '#dc2626', fontSize: '14px' }}>
                      <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                      {categoriesError}
                    </div>
                  ) : (
                    <select
                      id="editCategoryId"
                      name="categoryId"
                      value={newProject.categoryId}
                      onChange={handleProjectInputChange}
                      className="role-select"
                      style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px' }}
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="editProjectType">
                    <i className="fas fa-users"></i>
                    Project Type
                  </label>
                  <select
                    id="editProjectType"
                    name="projectType"
                    value={newProject.projectType}
                    onChange={handleProjectInputChange}
                    className="role-select"
                    style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px' }}
                  >
                    <option value="FTE">FTE Based</option>
                    <option value="Contingency">Contingency Based</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label htmlFor="editStartDate">
                      <i className="fas fa-calendar-alt"></i>
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="editStartDate"
                      name="startDate"
                      value={newProject.startDate}
                      onChange={handleProjectInputChange}
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="editEndDate">
                      <i className="fas fa-calendar-check"></i>
                      End Date
                    </label>
                    <input
                      type="date"
                      id="editEndDate"
                      name="endDate"
                      value={newProject.endDate}
                      onChange={handleProjectInputChange}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label htmlFor="editBudget">
                      <i className="fas fa-dollar-sign"></i>
                      Budget
                    </label>
                    <input
                      type="number"
                      id="editBudget"
                      name="budget"
                      value={newProject.budget}
                      onChange={handleProjectInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="editDepartment">
                      <i className="fas fa-building"></i>
                      Department
                    </label>
                  <select
                      id="editDepartment"
                      name="department"
                      value={newProject.department}
                      onChange={handleProjectInputChange}
                      className="role-select"
                      style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px' }}
                    >
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="editLocation">
                    <i className="fas fa-map-marker-alt"></i>
                    Location
                  </label>
                  <input
                    type="text"
                    id="editLocation"
                    name="location"
                    value={newProject.location}
                    onChange={handleProjectInputChange}
                    placeholder="Enter project location"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={closeEditProjectModal}
                disabled={projectLoading}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button 
                type="submit" 
                form="editProjectForm" 
                className="confirm-btn" 
                disabled={projectLoading || !newProject.projectName.trim()}
              >
                {projectLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Update Project
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProject && (
        <div className="modal-overlay" onClick={closeDeleteConfirmModal}>
          <div className="modal small-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <i className="fas fa-exclamation-triangle"></i>
                Confirm Delete
              </h3>
            </div>
            <div className="modal-body">
              {projectMessage && (
                <div className={`message ${projectMessage.type}-message`} style={{ marginBottom: '1rem' }}>
                  <i className={`fas ${projectMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                  {projectMessage.text}
                </div>
              )}
              <p>Are you sure you want to delete the project "<strong>{deleteConfirmProject.projectName}</strong>"?</p>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={closeDeleteConfirmModal}
                disabled={projectLoading}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button 
                type="button" 
                className="confirm-btn" 
                onClick={handleDeleteProject}
                disabled={projectLoading}
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
              >
                {projectLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash-alt"></i>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Form Modal */}
      {showInvoiceModal && selectedProject && (
        <div className="modal-overlay" onClick={closeInvoiceModal}>
          <div className="modal invoice-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Logo Header */}
            <div className="invoice-header" style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              padding: '1.5rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  background: 'white', 
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  <i className="fas fa-file-invoice-dollar" style={{ fontSize: '1.5rem', color: '#667eea' }}></i>
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Create Invoice</h2>
                  <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>{selectedProject.projectName}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="project-type-badge fte" style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  FTE Project
                </span>
              </div>
            </div>

            {/* Modal Body with Two Columns */}
            <div className="modal-body" style={{ padding: '0', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
              {invoiceMessage && (
                <div className={`message ${invoiceMessage.type}-message`} style={{ margin: '1rem 2rem' }}>
                  <i className={`fas ${invoiceMessage.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                  {invoiceMessage.text}
                </div>
              )}

              {/* Invoice Date and Description */}
              <div style={{ padding: '1rem 2rem', background: '#f8f9fa', borderBottom: '1px solid #e1e5e9', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label htmlFor="invoiceDate">
                    <i className="fas fa-calendar-alt"></i>
                    Invoice Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="invoiceDate"
                    name="invoiceDate"
                    value={invoiceFormData.invoiceDate}
                    onChange={handleInvoiceInputChange}
                    required
                  />
                </div>
                <div className="input-group" style={{ flex: 2, marginBottom: 0 }}>
                  <label htmlFor="description">
                    <i className="fas fa-align-left"></i>
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={invoiceFormData.description}
                    onChange={handleInvoiceInputChange}
                    placeholder="Enter invoice description"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flex: 1, gap: '0' }}>
                {/* Left Section - Employee Names */}
                <div style={{ 
                  width: '50%', 
                  borderRight: '2px solid #e1e5e9',
                  padding: '1.5rem',
                  background: '#f8f9fa',
                  overflowY: 'auto',
                  maxHeight: '400px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '2px solid #e1e5e9'
                  }}>
                    <i className="fas fa-users" style={{ color: '#667eea' }}></i>
                    <h3 style={{ margin: 0, color: '#333', fontSize: '1.1rem' }}>Employees Assigned</h3>
                    <span style={{ 
                      background: '#667eea', 
                      color: 'white',
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {projectEmployees.length}
                    </span>
                  </div>

                  {employeesLoading ? (
                    <div className="loading" style={{ padding: '2rem' }}>
                      <i className="fas fa-spinner fa-spin"></i>
                      <p>Loading employees...</p>
                    </div>
                  ) : projectEmployees.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {projectEmployees.map((employee, index) => (
                        <div 
                          key={employee.id}
                          className="employee-card"
                          style={{
                            background: 'white',
                            borderRadius: '10px',
                            padding: '1rem',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                            border: '1px solid #e1e5e9',
                            cursor: 'default',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              background: index % 2 === 0 
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: '600',
                              fontSize: '1rem',
                              flexShrink: 0
                            }}>
                              {employee.name ? employee.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: '600', color: '#333', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {employee.name}
                              </div>
                              <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                <i className="fas fa-id-badge" style={{ marginRight: '4px', color: '#667eea' }}></i>
                                {employee.employeeRole || 'Team Member'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '2rem', 
                      color: '#666',
                      background: 'white',
                      borderRadius: '10px',
                      border: '2px dashed #e1e5e9'
                    }}>
                      <i className="fas fa-users" style={{ fontSize: '2rem', color: '#ccc', marginBottom: '0.5rem' }}></i>
                      <p style={{ margin: 0 }}>No employees assigned to this project</p>
                    </div>
                  )}
                </div>

                {/* Right Section - Editable Amounts */}
                <div style={{ 
                  width: '50%', 
                  padding: '1.5rem',
                  background: 'white',
                  overflowY: 'auto',
                  maxHeight: '400px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '2px solid #e1e5e9'
                  }}>
                    <i className="fas fa-dollar-sign" style={{ color: '#22c55e' }}></i>
                    <h3 style={{ margin: 0, color: '#333', fontSize: '1.1rem' }}>Billable Amounts</h3>
                  </div>

                  {projectEmployees.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {projectEmployees.map((employee, index) => (
                        <div 
                          key={employee.id}
                          style={{
                            background: '#f8f9fa',
                            borderRadius: '10px',
                            padding: '1rem',
                            border: '1px solid #e1e5e9'
                          }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            marginBottom: '0.75rem'
                          }}>
                            <i className="fas fa-user" style={{ color: '#667eea' }}></i>
                            <span style={{ fontWeight: '600', color: '#333' }}>{employee.name}</span>
                          </div>
                          
                          <div className="input-group" style={{ marginBottom: 0 }}>
                            <label htmlFor={`amount_${employee.id}`}>
                              <i className="fas fa-money-bill-wave"></i>
                              Amount ($)
                            </label>
                            <input
                              type="number"
                              id={`amount_${employee.id}`}
                              name={`amount_${employee.id}`}
                              value={invoiceFormData[`amount_${employee.id}`] || ''}
                              onChange={(e) => {
                                const { name, value } = e.target;
                                setInvoiceFormData(prev => ({
                                  ...prev,
                                  [name]: value
                                }));
                              }}
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              style={{ 
                                fontSize: '1.2rem', 
                                fontWeight: '700',
                                textAlign: 'right',
                                color: '#22c55e'
                              }}
                            />
                          </div>
                        </div>
                      ))}

                      {/* Total Amount */}
                      <div style={{ 
                        marginTop: '1rem', 
                        padding: '1.25rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '12px',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)'
                      }}>
                        <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                          <i className="fas fa-calculator" style={{ marginRight: '8px' }}></i>
                          Total Invoice Amount:
                        </span>
                        <span style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                          ${Object.entries(invoiceFormData)
                            .filter(([key]) => key.startsWith('amount_'))
                            .reduce((sum, [, value]) => sum + (parseFloat(value) || 0), 0)
                            .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '2rem', 
                      color: '#666',
                      background: '#f8f9fa',
                      borderRadius: '10px',
                      border: '2px dashed #e1e5e9'
                    }}>
                      <i className="fas fa-dollar-sign" style={{ fontSize: '2rem', color: '#ccc', marginBottom: '0.5rem' }}></i>
                      <p style={{ margin: 0 }}>No employees to assign amounts</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer" style={{ 
              borderTop: '1px solid #e1e5e9',
              padding: '1rem 2rem',
              background: '#f8f9fa'
            }}>
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={closeInvoiceModal}
                disabled={invoiceSubmitting}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button 
                type="button"
                className="confirm-btn" 
                onClick={handleInvoiceSubmit}
                disabled={invoiceSubmitting || projectEmployees.length === 0}
                style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
              >
                {invoiceSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Creating Invoice...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-invoice-dollar"></i>
                    Create Invoice
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceManagerDashboard;
