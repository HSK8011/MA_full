import React, { useState, useEffect } from 'react';
import Sidebar from '../../organisms/Sidebar/Sidebar';
import DashboardHeader from '../../organisms/DashboardHeader/DashboardHeader';
import ChannelAnalytics from '../../organisms/ChannelAnalytics/ChannelAnalytics';
import RecentEngagement from '../../organisms/RecentEngagement/RecentEngagement';
import RecentPosts from '../../organisms/RecentPosts/RecentPosts';
import UpcomingPosts from '../../organisms/UpcomingPosts/UpcomingPosts';

interface DashboardTemplateProps {
  children?: React.ReactNode;
  activePage?: string;
  hideDefaultDashboard?: boolean;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ 
  children, 
  activePage = 'dashboard',
  hideDefaultDashboard = false
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Set body overflow to auto when sidebar is closed on mobile
    document.body.style.overflow = sidebarOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - connected with toggle state */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        activePage={activePage}
      />
      
      {/* Main Content - adjusted to accommodate wider sidebar */}
      <div className="flex-1 flex flex-col md:ml-[220px]">
        <DashboardHeader onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {!hideDefaultDashboard && (
            <>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
                {activePage === 'dashboard' ? 'Dashboard' : 
                 activePage === 'settings' ? 'Account Settings' : 
                 activePage.charAt(0).toUpperCase() + activePage.slice(1)}
              </h1>
              
              {/* Only show dashboard content on the dashboard page */}
              {activePage === 'dashboard' && (
                <>
                  {/* Main content grid - stacks on mobile, side-by-side on larger screens */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
                    <div className="lg:col-span-2">
                      <ChannelAnalytics />
                    </div>
                    <div className="lg:col-span-1">
                      <RecentEngagement />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div className="lg:col-span-1">
                      <RecentPosts />
                    </div>
                    <div className="lg:col-span-1">
                      <UpcomingPosts />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardTemplate; 