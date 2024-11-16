import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Feed } from './components/Feed';
import { TrendingPage } from './components/TrendingPage';
import { Groups } from './components/Groups';
import { Teams } from './components/Teams';
import { Events } from './components/Events';
import { QandA } from './components/QandA';
import { TrainingPlans } from './components/TrainingPlans';
import { ProfilePage } from './components/profile/ProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import { MessagesPage } from './components/messaging/MessagesPage';
import { LandingPage } from './pages/LandingPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { VerifyEmail } from './components/auth/VerifyEmail';
import { VerifySuccess } from './components/auth/VerifySuccess';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { GarminCallback } from './components/garmin/GarminCallback';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/garmin/callback" element={<GarminCallback />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <VerifyEmail />
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
          <main className="flex-1 min-w-0">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/events" element={<Events />} />
              <Route path="/qanda" element={<QandA />} />
              <Route path="/training" element={<TrainingPlans />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/verify-success" element={<VerifySuccess />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/garmin/callback" element={<GarminCallback />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}