import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/AuthService";
import "./style.css";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlDepartment = searchParams.get('department');
  const storedDepartment = authService.getSelectedDepartment();
  const selectedDepartment = urlDepartment || storedDepartment;
  const isAutoSelected = !!storedDepartment; // True if department came from landing page

  const [formData, setFormData] = useState({
    name: "",
    employeeNumber: "",
    email: "",
    location: "",
    password: "",
    confirmPassword: "",
    department: selectedDepartment || ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState(["Finance", "Operations", "Trace Sheets"]);

  useEffect(() => {
    // Load valid departments from API
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const result = await authService.getValidDepartments();
    if (result.success) {
      setDepartments(result.departments);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "department" && isAutoSelected) {
      // Don't allow department changes when auto-selected
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate department selected (only if not auto-selected)
    if (!formData.department && !isAutoSelected) {
      setError("Please select a department");
      setLoading(false);
      return;
    }

    try {
      const result = await authService.register({
        username: formData.name,  // Map name field to username
        employeeNumber: formData.employeeNumber,
        name: formData.name,
        email: formData.email,
        location: formData.location,
        department: formData.department,
        password: formData.password
      });

      if (result.success) {
        alert("Registration successful! Welcome to Spine.");
        // Redirect to landing page for now (dashboard routes commented out)
        navigate("/");
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Left Panel */}
      <div className="left-panel">
        <h2 className="welcome-heading">Join Spine</h2>

        <button className="read-more-btn">Learn More</button>
        <div className="large-c-graphic">SPINE</div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        {isAutoSelected && (
          <div className="department-header">
            <span className="department-badge">{formData.department}</span>
          </div>
        )}
        <h1 className="signin-heading">Sign Up</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <i className="fas fa-user input-icon"></i>
          </div>

          <div className="input-group">
            <input
              type="number"
              name="employeeNumber"
              placeholder="Employee ID"
              value={formData.employeeNumber}
              onChange={handleChange}
              required
            />
            <i className="fas fa-id-badge input-icon"></i>
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <i className="fas fa-envelope input-icon"></i>
          </div>

          <div className="input-group">
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <i className="fas fa-map-marker-alt input-icon"></i>
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <i className="fas fa-lock input-icon"></i>
          </div>

          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <i className="fas fa-lock input-icon"></i>
          </div>

          {/* Department field - Only show dropdown for manual selection */}
          {!isAutoSelected && (
            <div className="input-group">
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="role-select"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <i className="fas fa-building input-icon"></i>
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? "SIGNING UP..." : "SIGN UP"}
          </button>
        </form>

        <div className="form-links">
          <Link to="/login" className="form-link">Back to Login</Link>
          <Link 
            to="/" 
            className="form-link"
            onClick={() => authService.clearDepartmentSelection()}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
