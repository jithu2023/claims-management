import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import ClaimSubmission from './pages/SubmitClaim';
import ClaimsDashboard from './pages/ClaimsDashboard';
import ManageClaims from './pages/ManageClaims';
import SignUp from './pages/SignUp';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/submit-claim" element={<ClaimSubmission />} />
        <Route path="/dashboard" element={<ClaimsDashboard />} />
        <Route path="/manage" element={<ManageClaims />} />
        <Route path="/signup" element={<SignUp />} />


      </Routes>
    </Router>
  );
}

export default App;