
import React, { useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  // State to manage user authentication.
  // In a real app, this would be initialized from localStorage or an auth context.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // In a real app, you would clear the JWT from localStorage here.
    // localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <div className="bg-background-grey min-h-screen font-sans text-text-dark">
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Auth onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;
