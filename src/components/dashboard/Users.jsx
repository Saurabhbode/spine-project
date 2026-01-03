import React, { useState, useEffect } from "react";
import userService from "../../services/UserService";
import authService from "../../services/AuthService";
import "../style.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await userService.getAllUsers();
      if (result.success) {
        setUsers(result.data);
        setError("");
      } else {
        setError(result.message || "Failed to load users");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const result = await userService.getAvailableRoles();
      if (result.success) {
        setAvailableRoles(result.data);
      }
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
    setError("");
    setSuccess("");
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
    setError("");
    setSuccess("");
  };

  const handleBulkRoleAssignment = () => {
    if (selectedUsers.length === 0) {
      setError("Please select at least one user");
      return;
    }
    
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmBulkAssignment = async () => {
    setActionLoading(true);
    setShowConfirmDialog(false);
    
    try {
      console.log('Users.jsx: Starting bulk role assignment', { selectedUsers, selectedRole });
      const result = await userService.updateMultipleUserRoles(selectedUsers, selectedRole);
      console.log('Users.jsx: Bulk assignment result:', result);
      
      if (result.success) {
        setSuccess(`Successfully updated roles for ${result.updatedCount} users`);
        setSelectedUsers([]);
        setSelectedRole("");
        await loadUsers(); // Refresh the user list
      } else {
        setError(result.message || "Failed to update user roles");
      }
    } catch (error) {
      console.error("Users.jsx: Error updating user roles:", error);
      setError("Failed to update user roles: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatRole = (role) => {
    return userService.formatRole(role);
  };

  const getRoleBadgeClass = (role) => {
    return userService.getRoleBadgeClass(role);
  };

  if (loading) {
    return (
      <div className="users-container">
        <div className="loading">
          <h2>Loading users...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>
          <i className="fas fa-users"></i>
          User Management
        </h2>
        <p>Manage user roles and permissions</p>
      </div>

      {error && (
        <div className="error-message" style={{ 
          color: 'red', 
          padding: '10px', 
          marginBottom: '15px', 
          backgroundColor: '#ffe6e6', 
          borderRadius: '5px',
          textAlign: 'center' 
        }}>
          {error}
        </div>
      )}

      {success && (
        <div className="success-message" style={{ 
          color: 'green', 
          padding: '10px', 
          marginBottom: '15px', 
          backgroundColor: '#e6ffe6', 
          borderRadius: '5px',
          textAlign: 'center' 
        }}>
          {success}
        </div>
      )}

      {/* Bulk Actions Panel */}
      <div className="bulk-actions-panel">
        <div className="bulk-actions-left">
          <div className="selection-info">
            <span className="selected-count">
              {selectedUsers.length} of {users.length} users selected
            </span>
          </div>
          
          {selectedUsers.length > 0 && (
            <button 
              className="clear-selection-btn"
              onClick={() => setSelectedUsers([])}
            >
              <i className="fas fa-times"></i>
              Clear Selection
            </button>
          )}
        </div>

        <div className="bulk-actions-right">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="role-select"
            disabled={selectedUsers.length === 0}
          >
            <option value="">Select Role</option>
            {availableRoles.map(role => (
              <option key={role} value={role}>{formatRole(role)}</option>
            ))}
          </select>

          <button 
            className="bulk-assign-btn"
            onClick={handleBulkRoleAssignment}
            disabled={selectedUsers.length === 0 || !selectedRole || actionLoading}
          >
            {actionLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Updating...
              </>
            ) : (
              <>
                <i className="fas fa-user-cog"></i>
                Assign Role
              </>
            )}
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                  className="user-checkbox"
                />
              </th>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Current Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className={selectedUsers.includes(user.id) ? 'selected-row' : ''}>
                <td className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="user-checkbox"
                  />
                </td>
                <td>
                  <div className="user-name">
                    <i className="fas fa-user"></i>
                    {user.name}
                  </div>
                </td>
                <td>
                  <div className="employee-id">
                    <i className="fas fa-id-badge"></i>
                    {user.employeeNumber}
                  </div>
                </td>
                <td>
                  <div className="department">
                    <i className="fas fa-building"></i>
                    {user.department}
                  </div>
                </td>
                <td>
                  <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                    {formatRole(user.role)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="no-users">
            <i className="fas fa-users"></i>
            <p>No users found</p>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal small-modal">
            <div className="modal-header">
              <h3>Confirm Role Assignment</h3>
            </div>
            <div className="modal-body">
              <p>Assign <strong>{formatRole(selectedRole)}</strong> to {selectedUsers.length} user(s)?</p>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowConfirmDialog(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={confirmBulkAssignment}
                disabled={actionLoading}
              >
                {actionLoading ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
