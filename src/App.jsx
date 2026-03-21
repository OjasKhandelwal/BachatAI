import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SavingsPage from './pages/SavingsPage';
import GoalsPage from './pages/GoalsPage';
import InsightsPage from './pages/InsightsPage';
import SettingsPage from './pages/SettingsPage';
import QuestionnairePage from './pages/QuestionnairePage';
import SimulatorPage from './pages/SimulatorPage';
import PageTransition from './components/PageTransition';
import './index.css';

const GOOGLE_CLIENT_ID = '201259173791-d9h3un1b29asdch81no6il0pjtkjp0al.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <PageTransition>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/questionnaire" element={<QuestionnairePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/savings" element={<SavingsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </PageTransition>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
