import React, { useState, useMemo } from 'react';
import { AuthContext } from './context/AuthContext';
import HomeView from './views/HomeView';
import UserDashboardView from './views/UserDashboardView';
import AdminDashboardView from './views/AdminDashboardView';
import type { User, Admin, Estate } from './types';
import { View } from './types';


const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Home);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [selectedEstate, setSelectedEstate] = useState<Estate | null>(null);

  const handleLoginSuccess = (user: User, estate: Estate) => {
    setCurrentUser(user);
    setSelectedEstate(estate);
    setView(View.UserDashboard);
  };

  const handleAdminLoginSuccess = (admin: Admin) => {
    setCurrentAdmin(admin);
    setView(View.AdminDashboard);
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentAdmin(null);
    setSelectedEstate(null);
    setView(View.Home);
  };

  const authContextValue = useMemo(() => ({
    user: currentUser,
    admin: currentAdmin,
    loginUser: handleLoginSuccess,
    loginAdmin: handleAdminLoginSuccess,
    logout: handleLogout,
  }), [currentUser, currentAdmin]);


  const renderView = () => {
    switch (view) {
      case View.UserDashboard:
        return currentUser && selectedEstate && <UserDashboardView user={currentUser} estate={selectedEstate} onLogout={handleLogout} />;
      case View.AdminDashboard:
        return currentAdmin && <AdminDashboardView admin={currentAdmin} onLogout={handleLogout} />;
      case View.Home:
      default:
        return <HomeView setView={setView} setSelectedEstate={setSelectedEstate} />;
    }
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
        {renderView()}
      </div>
    </AuthContext.Provider>
  );
};

export default App;