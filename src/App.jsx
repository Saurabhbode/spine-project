import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import AccountManagement from './components/AccountManagement';
import Profile from './components/Profile';
import InvoiceHistory from './components/InvoiceHistory';
import FinanceManagerDashboard from './components/dashboard/FinanceManagerDashboard';
// import FinanceDashboard from './components/dashboard/FinanceDashboard.jsx';
// import OperationsDashboard from './components/dashboard/OperationsDashboard.jsx';
// import TraceSheetsDashboard from './components/dashboard/TraceSheetsDashboard.jsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/account-management" element={<AccountManagement />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard/finance-manager" element={<FinanceManagerDashboard />} />
          {/* <Route path="/dashboard/finance" element={<FinanceDashboard />} />
          <Route path="/dashboard/operations" element={<OperationsDashboard />} />
          <Route path="/dashboard/tracesheets" element={<TraceSheetsDashboard />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
