
import React, { useState } from 'react';
import { AuthPage } from './pages/auth/AuthPage';
import { ForensicDashboard } from './pages/dashboard/ForensicDashboard';
import { authService, UserSession } from './services/auth/auth.service';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(authService.getSession());

  const handleLogout = () => {
    if (window.confirm("Terminating session. Data will be cleared. Continue?")) {
      authService.terminate();
      setSession(null);
    }
  };

  return (
    <>
      {!session || !session.isAuthenticated ? (
        <AuthPage onAuthSuccess={setSession} />
      ) : (
        <ForensicDashboard session={session} onLogout={handleLogout} />
      )}
    </>
  );
};

export default App;
