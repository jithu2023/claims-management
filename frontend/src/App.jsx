import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import ClaimSubmission from './pages/SubmitClaim';
import ClaimsDashboard from './pages/ClaimsDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/submit-claim" element={<ClaimSubmission />} />
        <Route path="/dashboard" element={<ClaimsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;