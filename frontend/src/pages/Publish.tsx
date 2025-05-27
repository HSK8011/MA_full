import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardTemplate from '../components/templates/Dashboard/DashboardTemplate';
import PublishContent from '../components/organisms/Publish/PublishContent';

const Publish: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState('queued');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated (additional protection)
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    // If not authenticated, redirect to home
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Get the current path to determine the active view
    const path = location.pathname;
    
    // Set the active view based on the path
    if (path.includes('/queued')) {
      setActiveView('queued');
    } else if (path.includes('/pending-approval')) {
      setActiveView('pending-approval');
    } else if (path.includes('/drafts')) {
      setActiveView('drafts');
    } else if (path.includes('/delivered')) {
      setActiveView('delivered');
    } else if (path.includes('/queue-times')) {
      setActiveView('queue-times');
    } else {
      // Default to queued posts
      setActiveView('queued');
    }

    // Set page title
    document.title = 'Publish - Marketing Automation Tools';
    setIsLoading(false);
  }, [navigate, location]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <DashboardTemplate activePage="publish" hideDefaultDashboard>
      <PublishContent activeView={activeView} />
    </DashboardTemplate>
  );
};

export default Publish; 