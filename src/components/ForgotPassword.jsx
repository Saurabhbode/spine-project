import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log("Password reset requested for:", email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container">
        {/* Left Panel */}
        <div className="left-panel">
          <h2 className="welcome-heading">Reset Link Sent</h2>
          <div className="large-c-graphic">✓</div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <h1 className="signin-heading">Check Your Email</h1>
          
          <div className="login-form">
            <p style={{textAlign: "center", color: "#666", marginBottom: "30px", lineHeight: "1.6"}}>
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your email and follow the instructions to reset your password.
            </p>

            <Link to="/login" className="form-link" style={{textAlign: "center", display: "block", marginBottom: "20px"}}>
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Left Panel */}
      <div className="left-panel">
        <h2 className="welcome-heading">Reset Your Password</h2>
        <button className="read-more-btn">Need Help?</button>
        <div className="large-c-graphic">🔐</div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <h1 className="signin-heading">Forgot Password</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <i className="fas fa-envelope input-icon"></i>
          </div>

          <button type="submit" className="login-btn">
            SEND RESET LINK
          </button>
        </form>

        <div className="form-links">
          <Link to="/login" className="form-link">← Back to Login</Link>
          <Link to="/signup" className="form-link">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
