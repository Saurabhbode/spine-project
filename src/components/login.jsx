import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../services/AuthService";
import "./style.css"; // adjust path if needed

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Check URL parameters first, then fall back to localStorage
  const urlDepartment = searchParams.get('department');
  const storedDepartment = authService.getSelectedDepartment();
  const selectedDepartment = urlDepartment || storedDepartment;

  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
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

    try {
      const result = await authService.login(
        formData.identifier, 
        formData.password, 
        selectedDepartment
      );

      if (result.success) {
        // Login successful - check user role and department for routing
        const user = result.data.user;
        
        if (user.department === "Finance") {
          // Finance users - redirect to Finance Manager Dashboard
          alert("Login successful! Welcome to Finance Manager Dashboard.");
          navigate("/dashboard/finance-manager");
        } else {
          // Other users - redirect to landing page for now
          alert("Login successful! Welcome to Spine.");
          navigate("/");
        }
      } else {
        setError(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Left Panel */}
      <div className="left-panel">
        <h2 className="welcome-heading">Welcome to Spine</h2>

        <Link 
          to="/" 
          className="back-to-home-btn"
          onClick={() => authService.clearDepartmentSelection()}
        >
          Back to Home
        </Link>
        <div className="large-c-graphic">SPINE</div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        {selectedDepartment && (
          <div className="department-header">
            <span className="department-badge">{selectedDepartment}</span>
          </div>
        )}
        <h1 className="signin-heading">Sign In</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          <div className="input-group">
            <input
              type="text"
              name="identifier"
              placeholder="Enter Employee ID or Email"
              value={formData.identifier}
              onChange={handleChange}
              required
            />
            <i className="fas fa-user input-icon"></i>
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <i className="fas fa-lock input-icon"></i>
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        <div className="form-links">
          <Link to="/signup" className="form-link">Sign Up</Link>
          <Link to="/forgot-password" className="form-link">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
