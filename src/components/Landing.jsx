import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css"; // Use the existing style.css for consistent styling

const Landing = () => {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Hide animation after 2.5 seconds and show the landing content
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showAnimation) {
    return (
      <div className="welcome-animation-container">
        <div className="welcome-animation">
          <div className="spine-logo-animated">SPINE</div>
          <div className="welcome-text">Welcome to</div>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-container">
      {/* Header Section */}
      <div className="landing-header">
        <h1 className="landing-title">Welcome to Spine</h1>
        <p className="landing-subtitle">Choose your department to continue</p>
      </div>

      {/* Cards Section */}
      <div className="cards-container">
        <Link 
          to="/login" 
          className="department-card"
          onClick={() => localStorage.setItem('selectedDepartment', 'Finance')}
        >
          <div className="card-icon">💰</div>
          <h3 className="card-title">Finance</h3>
          <p className="card-description">Financial management and reporting</p>
        </Link>

        <Link 
          to="/login" 
          className="department-card"
          onClick={() => localStorage.setItem('selectedDepartment', 'Operations')}
        >
          <div className="card-icon">⚙️</div>
          <h3 className="card-title">Operations</h3>
          <p className="card-description">Operational workflows and processes</p>
        </Link>

        <Link 
          to="/login" 
          className="department-card"
          onClick={() => localStorage.setItem('selectedDepartment', 'Trace Sheets')}
        >
          <div className="card-icon">📊</div>
          <h3 className="card-title">Trace Sheets</h3>
          <p className="card-description">Documentation and tracking systems</p>
        </Link>
      </div>

      {/* Footer */}
      <div className="landing-footer">
        <p>© 2024 3GEN. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Landing;
