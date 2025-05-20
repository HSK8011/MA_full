import React, { useEffect, useState } from 'react';
import DashboardTemplate from '../components/templates/Dashboard/DashboardTemplate';
import ManageUsersContent from '../components/organisms/ManageUsers/ManageUsersContent';

const ManageUsers: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated (additional protection)
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    // If not authenticated, redirect to home
    if (!isAuthenticated) {
      window.location.href = '/';
      return;
    }

    // Set page title
    document.title = 'Manage Users - Marketing Automation Tools';
    setIsLoading(false);
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <DashboardTemplate activePage="settings" hideDefaultDashboard>
      <ManageUsersContent className="mt-4" />
    </DashboardTemplate>
  );
};

export default ManageUsers; 