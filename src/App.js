import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/globals.css';
import './styles/site.css';
import Home from './pages/Home';
import Chat from './pages/Chat';
import { FlightDashboard } from './components/dashboard/FlightDashboard';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  // Function to show dashboard when user asks about prices/flights
  const handleShowDashboard = (data) => {
    setDashboardData(data);
    setShowDashboard(true);
  };

  // Function to hide dashboard and return to chat
  const handleHideDashboard = () => {
    setShowDashboard(false);
    setDashboardData(null);
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route 
        path="/chat" 
        element={
          <Chat 
            onShowDashboard={handleShowDashboard}
            showDashboard={showDashboard}
            dashboardData={dashboardData}
            onHideDashboard={handleHideDashboard}
          />
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <FlightDashboard 
            searchData={dashboardData}
            onBack={handleHideDashboard}
          />
        } 
      />
    </Routes>
  );
}

export default App;
