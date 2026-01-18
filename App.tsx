
import React, { useState } from 'react';
import { VaultPage } from './pages/VaultPage';
import { ForensicDashboard } from './pages/ForensicDashboard';
import { authService, UserSession } from './services/authService';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(authService.getSession());

  const handleLogout = () => {
    if (window.confirm("Terminating session. All temporary forensic data will be cleared. Continue?")) {
      authService.terminate();
      setSession(null);
    }
  };

  return (
    <>
      {!session || !session.isAuthenticated ? (
        <VaultPage onAuthSuccess={setSession} />
      ) : (
        <ForensicDashboard session={session} onLogout={handleLogout} />
      )}
    </>
  );
};

export default App;
