import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import AnalystDashboard from '../components/dashboards/AnalystDashboard';
import ViewerDashboard from '../components/dashboards/ViewerDashboard';

export const DashboardPage = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'ANALYST':
        return <AnalystDashboard />;
      case 'VIEWER':
      default:
        return <ViewerDashboard />;
    }
  };

  return <>{renderDashboard()}</>;
};

export default DashboardPage;
