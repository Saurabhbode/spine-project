import React, { useState, useEffect } from "react";
import EmployeeService from "../../services/EmployeeService";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employeeRoles, setEmployeeRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [showManageRolesModal, setShowManageRolesModal] = useState(false);
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    empId: "",
    name: "",
    project: "",
    employeeRole: ""
  });
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  // Manage Roles Modal State
  const [allRoles, setAllRoles] = useState([]);
  const [newRole, setNewRole] = useState({ roleName: "", description: "" });
  const [editingRole, setEditingRole] = useState(null);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  
  // Message state
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  // Helper function to show success message
  const showSuccessMessage = (msg) => {
    setMessage(msg);
    setMessageType('success');
    setTimeout(() => setMessage(null), 3000);
  };

  // Helper function to show error message
  const showErrorMessage = (msg) => {
    setMessage(msg);
    setMessageType('error');
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    fetchEmployees();
    fetchProjects();
    fetchEmployeeRoles();
    
    // Set loading to false after a timeout to allow API calls to complete
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      if (response.ok) {
        const data = await response.json();
        console.log("Employees fetched:", data);
        setEmployees(data);
      } else {
        console.warn("Failed to fetch employees");
      }
    } catch (error) {
      console.warn("Error fetching employees:", error.message);
    }
  };

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        console.log("Projects fetched:", data);
        setProjects(data);
      } else {
        console.warn("Failed to fetch projects");
      }
    } catch (error) {
      console.warn("Error fetching projects:", error.message);
    }
  };

  // Fetch employee roles from API
  const fetchEmployeeRoles = async () => {
    try {
      const response = await fetch("/api/employee-roles");
      if (response.ok) {
        const data = await response.json();
        console.log("Employee roles fetched:", data);
        setEmployeeRoles(data);
      } else {
        console.warn("Failed to fetch employee roles");
      }
    } catch (error) {
      console.warn("Error fetching employee roles:", error.message);
    }
  };

  // Get project names from API data or fallback
  const projectNames = projects.length > 0 
    ? projects.map(p => p.projectName)
    : [];

  const roleOptions = employeeRoles.length > 0 
    ? employeeRoles.map(r => r.roleName)
    : [];

  // Combined project options for filter (projects from API + special options)
  const filterProjectOptions = [...projectNames, "Trainee", "No Project"];

  const getFilteredEmployees = () => {
    let filtered = employees;

    // Apply project filter
    if (employeeFilter !== "all" && !["Trainee", "No Project"].includes(employeeFilter)) {
      filtered = filtered.filter(emp => emp.project === employeeFilter);
    } else if (employeeFilter === "Trainee") {
      filtered = filtered.filter(emp => emp.project === "Trainee");
    } else if (employeeFilter === "No Project") {
      filtered = filtered.filter(emp => emp.project === "No Project");
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(emp =>
        emp.empId.toLowerCase().includes(term) ||
        (emp.name && emp.name.toLowerCase().includes(term)) ||
        (emp.project && emp.project.toLowerCase().includes(term)) ||
        (emp.employeeRole && emp.employeeRole.toLowerCase().includes(term))
      );
    }

    // Sort by empId in order
    return filtered.sort((a, b) => a.empId.localeCompare(b.empId));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const employeeData = {
        empId: newEmployee.empId,
        name: newEmployee.name,
        project: newEmployee.project,
        employeeRole: newEmployee.employeeRole
      };
      
      const response = await EmployeeService.createEmployee(employeeData);
      if (response) {
        setEmployees([...employees, response]);
        setShowAddEmployeeModal(false);
        setNewEmployee({ empId: "", name: "", project: "", employeeRole: "" });
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee: " + error.message);
    }
  };

  // Handle edit button click
  const handleEditClick = async (employee) => {
    // Refresh employee roles to get any new roles added directly to database
    await fetchEmployeeRoles();
    setEditingEmployee({ ...employee });
    setShowEditEmployeeModal(true);
  };

  // Handle update employee
  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      const employeeData = {
        empId: editingEmployee.empId,
        name: editingEmployee.name,
        project: editingEmployee.project,
        employeeRole: editingEmployee.employeeRole
      };
      
      const response = await EmployeeService.updateEmployee(editingEmployee.id, employeeData);
      if (response) {
        setEmployees(employees.map(emp => 
          emp.id === editingEmployee.id ? response : emp
        ));
        setShowEditEmployeeModal(false);
        setEditingEmployee(null);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee: " + error.message);
    }
  };

  // Handle input change for edit form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Close edit modal
  const closeEditEmployeeModal = () => {
    setShowEditEmployeeModal(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const success = await EmployeeService.deleteEmployee(id);
        if (success) {
          setEmployees(employees.filter(emp => emp.id !== id));
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee: " + error.message);
      }
    }
  };

  const openAddEmployeeModal = async () => {
    // Refresh employee roles to get any new roles added directly to database
    await fetchEmployeeRoles();
    
    // Generate next empId
    const maxId = employees.length > 0 
      ? Math.max(...employees.map(e => {
          const numPart = e.empId.replace("EMP", "");
          return parseInt(numPart) || 0;
        }))
      : 0;
    setNewEmployee({
      empId: `EMP${String(maxId + 1).padStart(3, '0')}`,
      name: "",
      project: "",
      employeeRole: ""
    });
    setShowAddEmployeeModal(true);
  };

  const closeAddEmployeeModal = () => {
    setShowAddEmployeeModal(false);
    setNewEmployee({ empId: "", name: "", project: "", employeeRole: "" });
  };

  // ==============================
  // Role Management Functions
  // ==============================

  const openManageRolesModal = async () => {
    setShowManageRolesModal(true);
    await fetchAllRoles();
    // Also refresh employeeRoles dropdown
    await fetchEmployeeRoles();
  };

  const closeManageRolesModal = () => {
    setShowManageRolesModal(false);
    setAllRoles([]);
    setNewRole({ roleName: "", description: "" });
    setEditingRole(null);
    setShowAddRoleModal(false);
    setShowEditRoleModal(false);
  };

  const fetchAllRoles = async () => {
    setRoleLoading(true);
    try {
      const response = await fetch("/api/employee-roles/all");
      if (response.ok) {
        const data = await response.json();
        console.log("All roles fetched:", data);
        setAllRoles(data);
      } else {
        console.warn("Failed to fetch all roles");
      }
    } catch (error) {
      console.warn("Error fetching all roles:", error.message);
    }
    setRoleLoading(false);
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/employee-roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRole),
      });

      if (response.ok) {
        const createdRole = await response.json();
        setAllRoles([...allRoles, createdRole]);
        setNewRole({ roleName: "", description: "" });
        setShowAddRoleModal(false);
        // Also refresh employeeRoles for dropdowns
        await fetchEmployeeRoles();
      } else {
        const error = await response.json();
        alert("Failed to add role: " + (error.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error adding role:", error);
      alert("Failed to add role: " + error.message);
    }
  };

  const handleEditRoleClick = (role) => {
    setEditingRole({ ...role });
    setShowEditRoleModal(true);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/employee-roles/${editingRole.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingRole),
      });

      if (response.ok) {
        const updatedRole = await response.json();
        setAllRoles(allRoles.map(r => r.id === editingRole.id ? updatedRole : r));
        setShowEditRoleModal(false);
        setEditingRole(null);
        // Also refresh employeeRoles for dropdowns
        await fetchEmployeeRoles();
        // Show success message
        showSuccessMessage("Role updated successfully!");
      } else {
        const error = await response.json();
        showErrorMessage("Failed to update role: " + (error.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating role:", error);
      showErrorMessage("Failed to update role: " + error.message);
    }
  };

  const handleDeleteRole = async (id) => {
    if (window.confirm("Are you sure you want to delete this role? Employees with this role will still work but won't see it in the dropdown.")) {
      try {
        const response = await fetch(`/api/employee-roles/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setAllRoles(allRoles.filter(r => r.id !== id));
          // Also refresh employeeRoles for dropdowns
          await fetchEmployeeRoles();
        } else {
          alert("Failed to delete role");
        }
      } catch (error) {
        console.error("Error deleting role:", error);
        alert("Failed to delete role: " + error.message);
      }
    }
  };

  const openAddRoleModal = () => {
    setNewRole({ roleName: "", description: "" });
    setShowAddRoleModal(true);
  };

  const closeAddRoleModal = () => {
    setShowAddRoleModal(false);
    setNewRole({ roleName: "", description: "" });
  };

  const closeEditRoleModal = () => {
    setShowEditRoleModal(false);
    setEditingRole(null);
  };

  return (
    <section className="content-section">
      {/* Success/Error Message */}
      {message && (
        <div className={`message ${messageType === 'success' ? 'success-message' : 'error-message'}`}>
          <i className={`fas ${messageType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <span>{message}</span>
        </div>
      )}
      
      <div className="projects-header">
        <div className="projects-title-row">
          <h2>
            <i className="fas fa-users"></i>
            Employees
          </h2>
          <div className="projects-count">
            <span className="count-badge">{getFilteredEmployees().length} Employees</span>
          </div>
        </div>
        <div className="overview-buttons">
          <button className="action-btn primary" onClick={openAddEmployeeModal}>
            <i className="fas fa-user-plus"></i>
            Add Employee
          </button>
          <button className="action-btn primary" onClick={openManageRolesModal} style={{ marginLeft: '10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <i className="fas fa-user-tag"></i>
            Manage Roles
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-box" style={{ flex: '1', minWidth: '280px', maxWidth: '400px', position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666', fontSize: '1rem' }}></i>
          <input
            type="text"
            placeholder="Search by ID, name, project or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 15px 12px 45px', border: '2px solid #e1e5e9', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'Montserrat, sans-serif', backgroundColor: 'white', color: '#333', boxSizing: 'border-box', transition: 'border-color 0.3s ease' }}
          />
        </div>
        <div className="filter-dropdown" style={{ minWidth: '200px' }}>
          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="role-select"
            style={{ width: '100%', padding: '12px 15px', border: '2px solid #e1e5e9', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'Montserrat, sans-serif', backgroundColor: 'white', color: '#333', cursor: 'pointer' }}
          >
            <option value="all">All Projects</option>
            {projects.length > 0 ? (
              projects.map(project => (
                <option key={project.id} value={project.projectName}>
                  {project.projectName}
                </option>
              ))
            ) : (
              <>
                <option value="Project Alpha">Project Alpha</option>
                <option value="Project Beta">Project Beta</option>
                <option value="Project Gamma">Project Gamma</option>
                <option value="Project Delta">Project Delta</option>
              </>
            )}
            <option value="Trainee">Trainee</option>
            <option value="No Project">No Project</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="table-container" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', color: 'white', fontWeight: '600' }}>
                <i className="fas fa-id-badge" style={{ marginRight: '8px' }}></i>
                Emp ID
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', color: 'white', fontWeight: '600' }}>
                <i className="fas fa-user" style={{ marginRight: '8px' }}></i>
                Name
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', color: 'white', fontWeight: '600' }}>
                <i className="fas fa-project-diagram" style={{ marginRight: '8px' }}></i>
                Project
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', color: 'white', fontWeight: '600' }}>
                <i className="fas fa-user-tag" style={{ marginRight: '8px' }}></i>
                Employee Role
              </th>
              <th style={{ padding: '1rem', textAlign: 'center', color: 'white', fontWeight: '600' }}>
                <i className="fas fa-cogs" style={{ marginRight: '8px' }}></i>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
                  <p>Loading employees...</p>
                </td>
              </tr>
            ) : getFilteredEmployees().length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                  <i className="fas fa-users" style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ddd' }}></i>
                  <p>No employees found</p>
                </td>
              </tr>
            ) : (
              getFilteredEmployees().map((employee, index) => (
                <tr 
                  key={employee.id}
                  style={{ 
                    background: index % 2 === 0 ? '#f8f9fa' : 'white',
                    borderBottom: '1px solid #eee'
                  }}
                >
                  <td style={{ padding: '1rem', color: '#333', fontWeight: '500' }}>{employee.empId}</td>
                  <td style={{ padding: '1rem', color: '#333' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ 
                        width: '35px', 
                        height: '35px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.85rem'
                      }}>
                        {employee.name ? employee.name.split(' ').map(n => n[0]).join('') : 'N/A'}
                      </div>
                      {employee.name || 'N/A'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#333' }}>
                    <span style={{ 
                      background: '#e3f2fd', 
                      color: '#1976d2',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem'
                    }}>
                      {employee.project || 'N/A'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#333' }}>
                    <span style={{ 
                      background: '#f3e5f5',
                      color: '#7b1fa2',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem'
                    }}>
                      {employee.employeeRole || 'N/A'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        className="project-action-btn edit-btn" 
                        title="Edit Employee"
                        onClick={() => handleEditClick(employee)}
                        style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="project-action-btn delete-btn" 
                        title="Delete Employee"
                        onClick={() => handleDeleteEmployee(employee.id)}
                        style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="modal-overlay" onClick={closeAddEmployeeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>
                <i className="fas fa-user-plus"></i>
                Add New Employee
              </h3>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddEmployee}>
                <div className="input-group">
                  <label htmlFor="empId">
                    <i className="fas fa-id-badge"></i>
                    Employee ID
                  </label>
                  <input
                    type="text"
                    id="empId"
                    name="empId"
                    value={newEmployee.empId}
                    onChange={handleInputChange}
                    placeholder="EMP001"
                    required
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="name">
                    <i className="fas fa-user"></i>
                    Employee Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newEmployee.name}
                    onChange={handleInputChange}
                    placeholder="Enter employee name"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="project">
                    <i className="fas fa-project-diagram"></i>
                    Project <span className="required">*</span>
                  </label>
                  <select
                    id="project"
                    name="project"
                    value={newEmployee.project}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px' }}
                  >
                    <option value="">Select a project</option>
                    {projects.length > 0 ? (
                      projects.map(project => (
                        <option key={project.id} value={project.projectName}>
                          {project.projectName}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Precision Medical Billing">Precision Medical Billing</option>
                        <option value="Demo project">Demo project</option>
                      </>
                    )}
                    <option value="Trainee">Trainee</option>
                    <option value="No Project">No Project</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="employeeRole">
                    <i className="fas fa-user-tag"></i>
                    Employee Role <span className="required">*</span>
                  </label>
                  <select
                    id="employeeRole"
                    name="employeeRole"
                    value={newEmployee.employeeRole}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px' }}
                  >
                    <option value="">Select a role</option>
                    {roleOptions.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={closeAddEmployeeModal}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button 
                type="submit" 
                className="confirm-btn"
                onClick={handleAddEmployee}
                style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
              >
                <i className="fas fa-plus"></i>
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditEmployeeModal && editingEmployee && (
        <div className="modal-overlay" onClick={closeEditEmployeeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>
                <i className="fas fa-user-edit"></i>
                Edit Employee
              </h3>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateEmployee}>
                <div className="input-group">
                  <label htmlFor="editEmpId">
                    <i className="fas fa-id-badge"></i>
                    Employee ID
                  </label>
                  <input
                    type="text"
                    id="editEmpId"
                    name="empId"
                    value={editingEmployee.empId}
                    onChange={handleEditInputChange}
                    placeholder="EMP001"
                    required
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="editName">
                    <i className="fas fa-user"></i>
                    Employee Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="editName"
                    name="name"
                    value={editingEmployee.name}
                    onChange={handleEditInputChange}
                    placeholder="Enter employee name"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="editProject">
                    <i className="fas fa-project-diagram"></i>
                    Project <span className="required">*</span>
                  </label>
                  <select
                    id="editProject"
                    name="project"
                    value={editingEmployee.project}
                    onChange={handleEditInputChange}
                    required
                    style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px' }}
                  >
                    <option value="">Select a project</option>
                    {projects.length > 0 ? (
                      projects.map(project => (
                        <option key={project.id} value={project.projectName}>
                          {project.projectName}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Precision Medical Billing">Precision Medical Billing</option>
                        <option value="Demo project">Demo project</option>
                      </>
                    )}
                    <option value="Trainee">Trainee</option>
                    <option value="No Project">No Project</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="editEmployeeRole">
                    <i className="fas fa-user-tag"></i>
                    Employee Role <span className="required">*</span>
                  </label>
                  <select
                    id="editEmployeeRole"
                    name="employeeRole"
                    value={editingEmployee.employeeRole}
                    onChange={handleEditInputChange}
                    required
                    style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px' }}
                  >
                    <option value="">Select a role</option>
                    {roleOptions.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={closeEditEmployeeModal}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button 
                type="submit" 
                className="confirm-btn"
                onClick={handleUpdateEmployee}
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
              >
                <i className="fas fa-save"></i>
                Update Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Roles Modal */}
      {showManageRolesModal && (
        <div className="modal-overlay" onClick={closeManageRolesModal}>
          <div className="modal manage-roles-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <i className="fas fa-user-tag"></i>
                Manage Employee Roles
              </h3>
              <button 
                className="close-btn" 
                onClick={closeManageRolesModal}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ margin: 0, color: '#666' }}>
                  Add, edit, or remove employee roles from the system.
                </p>
                <button 
                  className="action-btn primary"
                  onClick={openAddRoleModal}
                >
                  <i className="fas fa-plus"></i>
                  Add Role
                </button>
              </div>

              {/* Roles Table */}
              {roleLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#667eea' }}></i>
                  <p style={{ marginTop: '1rem', color: '#666' }}>Loading roles...</p>
                </div>
              ) : allRoles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <i className="fas fa-tags" style={{ fontSize: '3rem', color: '#ddd', marginBottom: '1rem' }}></i>
                  <p style={{ color: '#666' }}>No roles found. Add a new role to get started.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                  <thead style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>
                        Role Name
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>
                        Description
                      </th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>
                        Status
                      </th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRoles.map((role, index) => (
                      <tr 
                        key={role.id}
                        style={{ 
                          background: index % 2 === 0 ? '#f8f9fa' : 'white',
                          borderBottom: '1px solid #eee'
                        }}
                      >
                        <td style={{ padding: '12px', color: '#333', fontWeight: '500' }}>
                          {role.roleName}
                        </td>
                        <td style={{ padding: '12px', color: '#666', fontSize: '0.9rem' }}>
                          {role.description || '-'}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span className={`status-badge ${role.isActive ? 'active' : 'inactive'}`}>
                            {role.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div className="role-actions">
                            <button 
                              className="project-action-btn edit-btn" 
                              title="Edit Role"
                              onClick={() => handleEditRoleClick(role)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="project-action-btn delete-btn" 
                              title="Delete Role"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="modal-overlay" onClick={closeAddRoleModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>
                <i className="fas fa-plus-circle"></i>
                Add New Role
              </h3>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddRole}>
                <div className="input-group">
                  <label htmlFor="roleName">
                    <i className="fas fa-tag"></i>
                    Role Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="roleName"
                    name="roleName"
                    value={newRole.roleName}
                    onChange={(e) => setNewRole({ ...newRole, roleName: e.target.value })}
                    placeholder="Enter role name"
                    required
                    style={{ width: '100%', padding: '12px 15px', border: '2px solid #e1e5e9', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="roleDescription">
                    <i className="fas fa-align-left"></i>
                    Description
                  </label>
                  <textarea
                    id="roleDescription"
                    name="description"
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    placeholder="Enter role description (optional)"
                    rows="3"
                    style={{ width: '100%', padding: '12px 15px', border: '2px solid #e1e5e9', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={closeAddRoleModal}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button 
                type="submit" 
                className="confirm-btn"
                onClick={handleAddRole}
                style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
              >
                <i className="fas fa-plus"></i>
                Add Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditRoleModal && editingRole && (
        <div className="modal-overlay" onClick={closeEditRoleModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>
                <i className="fas fa-edit"></i>
                Edit Role
              </h3>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateRole}>
                <div className="input-group">
                  <label htmlFor="editRoleName">
                    <i className="fas fa-tag"></i>
                    Role Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="editRoleName"
                    name="roleName"
                    value={editingRole.roleName}
                    onChange={(e) => setEditingRole({ ...editingRole, roleName: e.target.value })}
                    placeholder="Enter role name"
                    required
                    style={{ width: '100%', padding: '12px 15px', border: '2px solid #e1e5e9', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="editRoleDescription">
                    <i className="fas fa-align-left"></i>
                    Description
                  </label>
                  <textarea
                    id="editRoleDescription"
                    name="description"
                    value={editingRole.description || ''}
                    onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                    placeholder="Enter role description (optional)"
                    rows="3"
                    style={{ width: '100%', padding: '12px 15px', border: '2px solid #e1e5e9', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                <div className="input-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editingRole.isActive !== false}
                      onChange={(e) => setEditingRole({ ...editingRole, isActive: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <i className="fas fa-check-circle" style={{ color: editingRole.isActive !== false ? '#22c55e' : '#dc2626' }}></i>
                    <span>Active</span>
                  </label>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={closeEditRoleModal}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button 
                type="submit" 
                className="confirm-btn"
                onClick={handleUpdateRole}
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
              >
                <i className="fas fa-save"></i>
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Employees;

