import React from "react";
import { Link } from "react-router-dom";
import "./style.css"; // Use the existing style.css for consistent styling

const Landing = () => {
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
