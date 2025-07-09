import React from 'react';

interface AdminDashboardViewProps {
  admin: any;
  onLogout: () => void;
}

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ admin, onLogout }) => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {admin?.name || 'Admin'}!</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboardView;