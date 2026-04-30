import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import MaintenanceBanner from './components/MaintenanceBanner';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-black animate-pulse"
          style={{ background: 'linear-gradient(135deg, #c5a95e, #a8903d)' }}
        >
          ONE
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <ProgressProvider>
      <Dashboard />
    </ProgressProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <MaintenanceBanner />
    </AuthProvider>
  );
}
