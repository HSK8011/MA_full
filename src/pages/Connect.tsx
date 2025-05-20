import React, { useEffect, useState } from 'react';
import DashboardTemplate from '../components/templates/Dashboard/DashboardTemplate';
import { ConnectContent } from '../components/organisms/Connect';

const Connect: React.FC = () => {
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
    document.title = 'Connect - Marketing Automation Tools';
    setIsLoading(false);
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <DashboardTemplate activePage="connect" hideDefaultDashboard>
      <ConnectContent />
    </DashboardTemplate>
  );
};

export default Connect; 