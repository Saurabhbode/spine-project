import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/AuthService";
import "./style.css";

const AccountManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [accountsData, setAccountsData] = useState(null);
  const [validationData, setValidationData] = useState(null);
  
  // Form states
  const [linkAccountForm, setLinkAccountForm] = useState({
    targetUsername: "",
    targetDepartment: ""
  });
  
  const [createLinkedAccountForm, setCreateLinkedAccountForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    department: ""
  });

  const user = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadAccountData();
  }, [isAuthenticated, navigate]);

  const loadAccountData = async () => {
    setLoading(true);
    try {
      // Load account information
      const accountsResult = await authService.getMyAccounts(user.username);
      if (accountsResult.success) {
        setAccountsData(accountsResult.data);
      }

      // Load validation data
      const validationResult = await authService.validateAccountLinking(user.username);
      if (validationResult.success) {
        setValidationData(validationResult.data);
      }

    } catch (error) {
      setError("Failed to load account data");
      console.error("Load account data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAccount = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!linkAccountForm.targetUsername || !linkAccountForm.targetDepartment) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const result = await authService.linkAccounts(
        user.username,
        linkAccountForm.targetUsername,
        linkAccountForm.targetDepartment
      );

      if (result.success) {
        setSuccess("Accounts linked successfully!");
        setLinkAccountForm({ targetUsername: "", targetDepartment: "" });
        loadAccountData(); // Reload data
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Failed to link accounts");
      console.error("Link accounts error:", error);
    }
  };

  const handleCreateLinkedAccount = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!createLinkedAccountForm.username || !createLinkedAccountForm.password || 
        !createLinkedAccountForm.department) {
      setError("Please fill in all fields");
      return;
    }

    if (createLinkedAccountForm.password !== createLinkedAccountForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (createLinkedAccountForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const result = await authService.createLinkedAccount(
        createLinkedAccountForm.username,
        createLinkedAccountForm.password,
        createLinkedAccountForm.department,
        accountsData.personId
      );

      if (result.success) {
        setSuccess("Linked account created successfully!");
        setCreateLinkedAccountForm({
          username: "",
          password: "",
          confirmPassword: "",
          department: ""
        });
        loadAccountData(); // Reload data
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Failed to create linked account");
      console.error("Create linked account error:", error);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <h2>Loading Account Management...</h2>
        </div>
      </div>
    );
  }

  const availableDepartments = validationData ? validationData.availableDepartments : [];

  return (
    <div className="container">
      <div className="account-management">
        <div className="header">
          <h1>Account Management</h1>
          <button 
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="error-message" onClick={clearMessages}>
            {error}
          </div>
        )}
        {success && (
          <div className="success-message" onClick={clearMessages}>
            {success}
          </div>
        )}

        {/* Current Accounts */}
        <div className="section">
          <h2>My Accounts</h2>
          {accountsData && (
            <div className="accounts-grid">
              {/* Primary Account */}
              {accountsData.primaryAccount && (
                <div className="account-card primary">
                  <h3>Primary Account</h3>
                  <p><strong>Username:</strong> {accountsData.primaryAccount.username}</p>
                  <p><strong>Department:</strong> {accountsData.primaryAccount.department}</p>
                  <p><strong>Name:</strong> {accountsData.primaryAccount.name}</p>
                  <p><strong>Email:</strong> {accountsData.primaryAccount.email}</p>
                  <p><strong>Person ID:</strong> {accountsData.personId}</p>
                </div>
              )}

              {/* Linked Accounts */}
              {accountsData.linkedAccounts && accountsData.linkedAccounts.map((account, index) => (
                <div className="account-card linked" key={index}>
                  <h3>Linked Account</h3>
                  <p><strong>Username:</strong> {account.username}</p>
                  <p><strong>Department:</strong> {account.department}</p>
                  <p><strong>Name:</strong> {account.name}</p>
                  <p><strong>Email:</strong> {account.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Link Existing Account */}
        <div className="section">
          <h2>Link Existing Account</h2>
          <p>Link an existing account from another department to your person ID.</p>
          
          <form onSubmit={handleLinkAccount} className="account-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Target Username"
                value={linkAccountForm.targetUsername}
                onChange={(e) => setLinkAccountForm({
                  ...linkAccountForm,
                  targetUsername: e.target.value
                })}
                required
              />
            </div>

            <div className="input-group">
              <select
                value={linkAccountForm.targetDepartment}
                onChange={(e) => setLinkAccountForm({
                  ...linkAccountForm,
                  targetDepartment: e.target.value
                })}
                required
              >
                <option value="">Select Department</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Trace Sheets">Trace Sheets</option>
              </select>
            </div>

            <button type="submit" className="submit-btn">
              Link Account
            </button>
          </form>
        </div>

        {/* Create New Linked Account */}
        {validationData && validationData.canCreateLinkedAccount && (
          <div className="section">
            <h2>Create New Linked Account</h2>
            <p>Create a new account in a different department linked to your person ID.</p>
            
            <form onSubmit={handleCreateLinkedAccount} className="account-form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Username"
                  value={createLinkedAccountForm.username}
                  onChange={(e) => setCreateLinkedAccountForm({
                    ...createLinkedAccountForm,
                    username: e.target.value
                  })}
                  required
                />
              </div>

              <div className="input-group">
                <select
                  value={createLinkedAccountForm.department}
                  onChange={(e) => setCreateLinkedAccountForm({
                    ...createLinkedAccountForm,
                    department: e.target.value
                  })}
                  required
                >
                  <option value="">Select Department</option>
                  {availableDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={createLinkedAccountForm.password}
                  onChange={(e) => setCreateLinkedAccountForm({
                    ...createLinkedAccountForm,
                    password: e.target.value
                  })}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={createLinkedAccountForm.confirmPassword}
                  onChange={(e) => setCreateLinkedAccountForm({
                    ...createLinkedAccountForm,
                    confirmPassword: e.target.value
                  })}
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                Create Linked Account
              </button>
            </form>
          </div>
        )}

        {/* Account Summary */}
        {validationData && (
          <div className="section">
            <h2>Account Summary</h2>
            <div className="summary">
              <p><strong>Total Accounts:</strong> {validationData.totalAccounts}</p>
              <p><strong>Existing Departments:</strong> {validationData.existingDepartments.join(", ")}</p>
              <p><strong>Available Departments:</strong> {validationData.availableDepartments.join(", ")}</p>
              <p><strong>Can Create Linked Account:</strong> {validationData.canCreateLinkedAccount ? "Yes" : "No"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountManagement;
