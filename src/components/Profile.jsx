import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/AuthService';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    username: '',
    employeeNumber: '',
    department: '',
    location: ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Email editing state
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailPassword, setEmailPassword] = useState('');
  const [emailPasswordError, setEmailPasswordError] = useState('');
  const [isVerifyingEmailPassword, setIsVerifyingEmailPassword] = useState(false);
  const [editingEmail, setEditingEmail] = useState('');

  // Message state
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    loadUserProfile();
  }, [navigate]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getUser();
      
      // Get fresh user profile from server
      const result = await authService.getUserProfile(currentUser.username);
      
      if (result.success) {
        const userData = result.data;
        setUser(userData);
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          username: userData.username || '',
          employeeNumber: userData.employeeNumber || '',
          department: userData.department || '',
          location: userData.location || ''
        });
      } else {
        setMessage('Failed to load user profile: ' + result.message);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage('Error loading user profile');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors as user types
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePasswordChange = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters long';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'New passwords do not match';
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailEditStart = () => {
    setIsEditingEmail(true);
    setEditingEmail(profileData.email); // Set editing email to current email
    setEmailPassword('');
    setEmailPasswordError('');
    setMessage('');
    setMessageType('');
  };

  const handleEmailEditCancel = () => {
    setIsEditingEmail(false);
    setEditingEmail('');
    setEmailPassword('');
    setEmailPasswordError('');
    setMessage('');
    setMessageType('');
  };

  const verifyEmailPassword = async () => {
    if (!emailPassword.trim()) {
      setEmailPasswordError('Password is required');
      return;
    }

    setIsVerifyingEmailPassword(true);
    setEmailPasswordError('');

    try {
      // Use the change-password endpoint to verify password
      const response = await fetch('http://localhost:8080/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getAccessToken()}`
        },
        body: JSON.stringify({
          currentPassword: emailPassword,
          newPassword: emailPassword // Use same password to verify without changing it
        })
      });

      const data = await response.json();

      if (data.success || response.status === 400 && data.message?.includes('same')) {
        // Success or "same password" means the current password is correct
        setMessage('Password verified. You can now edit your email.');
        setMessageType('success');
        setEmailPassword(''); // Clear password for security
        
        // Auto-hide message after 3 seconds
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
      } else {
        setEmailPasswordError(data.message || 'Invalid password');
      }
    } catch (error) {
      console.error('Password verification error:', error);
      setEmailPasswordError('Network error. Please try again.');
    } finally {
      setIsVerifyingEmailPassword(false);
    }
  };

  const handleEmailUpdate = async () => {
    if (!editingEmail.trim()) {
      setMessage('Email cannot be empty');
      setMessageType('error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingEmail)) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/update-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getAccessToken()}`
        },
        body: JSON.stringify({
          email: editingEmail
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Email updated successfully!');
        setMessageType('success');
        
        // Update the profile data with new email
        setProfileData(prev => ({ ...prev, email: editingEmail }));
        
        // Update the user state
        setUser(prev => ({ ...prev, email: editingEmail }));
        
        // Reset editing state
        setIsEditingEmail(false);
        setEditingEmail('');
        
        // Auto-hide message after 3 seconds
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
      } else {
        setMessage(data.message || 'Failed to update email');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Email update error:', error);
      setMessage('Network error. Please try again.');
      setMessageType('error');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordChange()) {
      return;
    }

    setIsChangingPassword(true);
    setMessage('');

    try {
      console.log('Attempting to change password...');
      
      const token = authService.getAccessToken();
      if (!token) {
        setMessage('Authentication error. Please log in again.');
        setMessageType('error');
        return;
      }

      console.log('Auth token exists:', !!token);

      const response = await fetch('http://localhost:8080/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setMessage('Password changed successfully!');
        setMessageType('success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        // More specific error messages based on response
        let errorMessage = 'Failed to change password';
        
        if (response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (response.status === 400) {
          if (data.message?.toLowerCase().includes('current')) {
            errorMessage = 'Current password is incorrect.';
          } else if (data.message?.toLowerCase().includes('same')) {
            errorMessage = 'New password must be different from current password.';
          } else if (data.message?.toLowerCase().includes('weak')) {
            errorMessage = 'Password is too weak. Please choose a stronger password.';
          } else {
            errorMessage = data.message || 'Invalid password data provided.';
          }
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        setMessage(errorMessage);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Password change error:', error);
      
      let errorMessage = 'Network error. Please try again.';
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      } else if (error.message?.includes('401')) {
        errorMessage = 'Authentication error. Please log in again.';
      }
      
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'manager':
        return 'manager-role';
      case 'user':
      case 'employee':
        return 'user-role';
      default:
        return 'default-role';
    }
  };

  const getDepartmentColor = (department) => {
    switch (department?.toLowerCase()) {
      case 'finance':
        return 'finance-dept';
      case 'operations':
        return 'operations-dept';
      case 'trace sheets':
        return 'tracesheets-dept';
      default:
        return 'default-dept';
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="loading-spinner">
            <h2>Loading Profile...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-btn" onClick={handleBack}>
          <i className="fas fa-arrow-left"></i>
          Back
        </button>
        <h1>
          <i className="fas fa-user-circle"></i>
          User Profile
        </h1>
      </div>

      {message && (
        <div className={`message ${messageType}`} onClick={() => setMessage('')}>
          <i className={`fas ${messageType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {message}
        </div>
      )}

      <div className="profile-content">
        {/* Profile Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user"></i>
            Profile Information
          </button>
          <button 
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <i className="fas fa-lock"></i>
            Change Password
          </button>
        </div>

        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="profile-card">
              {/* Profile Header */}
              <div className="profile-header-section">
                <div className="profile-avatar-large">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="profile-title">
                  <h2>{profileData.name || 'User Name'}</h2>
                  <p className="profile-subtitle">{profileData.email || 'user@company.com'}</p>
                </div>
              </div>

              {/* Department and Role Badges */}
              <div className="profile-badges-large">
                <div className="badge-container">
                  <span className={`department-badge-large ${getDepartmentColor(profileData.department)}`}>
                    <i className="fas fa-building"></i>
                    {profileData.department || 'Department'}
                  </span>
                  <span className={`role-badge-large ${getRoleBadgeColor(user?.role)}`}>
                    <i className="fas fa-user-tie"></i>
                    {user?.role || 'User'}
                  </span>
                </div>
              </div>

              {/* Profile Information Grid */}
              <div className="profile-info-grid">
                <div className="info-card">
                  <div className="info-icon">
                    <i className="fas fa-at"></i>
                  </div>
                  <div className="info-content">
                    <label>Username</label>
                    <span>{profileData.username || 'N/A'}</span>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <i className="fas fa-id-card"></i>
                  </div>
                  <div className="info-content">
                    <label>Employee ID</label>
                    <span>{profileData.employeeNumber || 'N/A'}</span>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="info-content">
                    <label>Location</label>
                    <span>{profileData.location || 'N/A'}</span>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="info-content">
                    <label>Email</label>
                    {isEditingEmail ? (
                      <div className="email-edit-container">
                        <div className="current-email-display">
                          <small>Current: {profileData.email}</small>
                        </div>
                        <input
                          type="email"
                          value={editingEmail}
                          onChange={(e) => setEditingEmail(e.target.value)}
                          className="email-edit-input"
                          placeholder="Enter new email"
                        />
                        <div className="email-edit-actions">
                          <button
                            type="button"
                            onClick={handleEmailUpdate}
                            className="btn-save-email"
                          >
                            <i className="fas fa-save"></i> Save
                          </button>
                          <button
                            type="button"
                            onClick={handleEmailEditCancel}
                            className="btn-cancel-edit"
                          >
                            <i className="fas fa-times"></i> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="email-display">
                        <span>{profileData.email || 'N/A'}</span>
                        <button
                          type="button"
                          onClick={handleEmailEditStart}
                          className="btn-edit-email"
                        >
                          <i className="fas fa-pencil-alt"></i> Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="info-card action-card" onClick={() => setActiveTab('password')}>
                  <div className="info-icon action-icon">
                    <i className="fas fa-lock"></i>
                  </div>
                  <div className="info-content">
                    <label>Security</label>
                    <span className="action-text">Change Password</span>
                    <small className="action-subtitle">Update your account password</small>
                  </div>
                  <div className="action-arrow">
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === 'password' && (
          <div className="profile-section">
            <div className="profile-card">
              <h2>
                <i className="fas fa-lock"></i>
                Change Password
              </h2>

              <form onSubmit={handlePasswordChange} className="password-form">
                <div className="input-group">
                  <label>
                    <i className="fas fa-key"></i>
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter your current password"
                    className={passwordErrors.currentPassword ? 'error' : ''}
                  />
                  {passwordErrors.currentPassword && (
                    <span className="error-text">{passwordErrors.currentPassword}</span>
                  )}
                </div>

                <div className="input-group">
                  <label>
                    <i className="fas fa-lock"></i>
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter your new password (min 6 characters)"
                    className={passwordErrors.newPassword ? 'error' : ''}
                  />
                  {passwordErrors.newPassword && (
                    <span className="error-text">{passwordErrors.newPassword}</span>
                  )}
                </div>

                <div className="input-group">
                  <label>
                    <i className="fas fa-lock"></i>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Confirm your new password"
                    className={passwordErrors.confirmPassword ? 'error' : ''}
                  />
                  {passwordErrors.confirmPassword && (
                    <span className="error-text">{passwordErrors.confirmPassword}</span>
                  )}
                </div>

                <div className="password-requirements">
                  <h4>
                    <i className="fas fa-info-circle"></i>
                    Password Requirements
                  </h4>
                  <ul>
                    <li>At least 6 characters long</li>
                    <li>Must be different from your current password</li>
                    <li>Use a strong password for better security</li>
                  </ul>
                </div>

                <button 
                  type="submit" 
                  className="change-password-btn"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <span>
                      <i className="fas fa-spinner fa-spin"></i>
                      Changing Password...
                    </span>
                  ) : (
                    <span>
                      <i className="fas fa-save"></i>
                      Change Password
                    </span>
                  )}
                </button>

                {/* Debug Information (can be removed in production) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="debug-info" style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    fontSize: '0.8rem'
                  }}>
                    <h4>Debug Information:</h4>
                    <p><strong>Authenticated:</strong> {authService.isAuthenticated() ? 'Yes' : 'No'}</p>
                    <p><strong>Token exists:</strong> {authService.getAccessToken() ? 'Yes' : 'No'}</p>
                    <p><strong>Current Password:</strong> {passwordData.currentPassword ? '✓ Entered' : '✗ Empty'}</p>
                    <p><strong>New Password:</strong> {passwordData.newPassword ? '✓ Entered' : '✗ Empty'}</p>
                    <p><strong>Confirm Password:</strong> {passwordData.confirmPassword ? '✓ Entered' : '✗ Empty'}</p>
                    <p><strong>Passwords Match:</strong> {passwordData.newPassword === passwordData.confirmPassword ? 'Yes' : 'No'}</p>
                    <button 
                      type="button" 
                      onClick={() => {
                        console.log('Profile Data:', profileData);
                        console.log('Password Data:', passwordData);
                        console.log('User:', user);
                        console.log('Auth Token:', authService.getAccessToken());
                      }}
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Log Debug Info to Console
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default Profile;
