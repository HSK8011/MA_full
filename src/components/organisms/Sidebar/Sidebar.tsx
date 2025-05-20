import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../../lib/utils';

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  activePage?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  pro?: boolean;
  children?: Array<{
    id: string;
    label: string;
    path: string;
    count?: number;
  }>;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  className,
  isOpen = false,
  onToggle,
  activePage = 'dashboard'
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if any child item is in the current path to expand the parent menu on load
  useEffect(() => {
    // If the active page is publish, automatically expand the publish menu
    if (activePage === 'publish') {
      setExpandedItem('publish');
    }

    // Check if the URL contains any of the publish submenu paths
    const currentPath = location.pathname;
    if (
      currentPath.includes('/publish/queued') ||
      currentPath.includes('/publish/pending-approval') ||
      currentPath.includes('/publish/drafts') ||
      currentPath.includes('/publish/delivered') ||
      currentPath.includes('/publish/queue-times')
    ) {
      setExpandedItem('publish');
    }
  }, [activePage, location.pathname]);

  // Navigation items with their icons and labels
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '/images/page2/noun-dashboard-1359727@3x.png', path: '/dashboard' },
    { id: 'connect', label: 'Connect', icon: '/images/page2/noun-chain-2988965@3x.png', path: '/connect' },
    { 
      id: 'publish', 
      label: 'Publish', 
      icon: '/images/page2/noun-paper-plane-2249333@3x.png', 
      path: '/publish',
      children: [
        { id: 'queued-posts', label: 'Queued Posts', path: '/publish/queued', count: 20 },
        { id: 'manage-queue-times', label: 'Manage Queue Times', path: '/publish/queue-times' },
        { id: 'pending-approval', label: 'Pending Approval', path: '/publish/pending-approval', count: 10 },
        { id: 'drafts', label: 'Drafts', path: '/publish/drafts', count: 5 },
        { id: 'delivered', label: 'Delivered', path: '/publish/delivered', count: 5 },
      ]
    },
    { id: 'engage', label: 'Engage', icon: '/images/page2/noun-chat-5056751@3x.png', path: '/engage' },
    { id: 'promote', label: 'Promote', icon: '/images/page2/noun-like-3323422@3x.png', path: '/promote', pro: true },
    { id: 'analyze', label: 'Analyze', icon: '/images/page2/noun-analytics-1018764@3x.png', path: '/analyze', pro: true },
  ];
  
  // Toggle submenu expand/collapse
  const toggleExpand = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  // Check if a nav item is active
  const isItemActive = (item: NavItem): boolean => {
    if (item.id === activePage) return true;
    if (location.pathname === item.path) return true;
    
    // Check if any child is active
    if (item.children && location.pathname.includes(item.path)) {
      return item.children.some(child => location.pathname.includes(child.path));
    }
    
    return false;
  };

  // Check if a child item is active
  const isChildActive = (childPath: string): boolean => {
    return location.pathname.includes(childPath);
  };

  // Handle navigation link clicks
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    // If item has children, toggle expand instead of navigating
    if (item.children && item.children.length > 0) {
      e.preventDefault();
      toggleExpand(item.id);
      return;
    }

    // If already on this page, prevent default navigation
    if (item.id === activePage || location.pathname === item.path) {
      e.preventDefault();
      return;
    }
    
    // Prevent default browser navigation
    e.preventDefault();
    
    // Navigate to the path using React Router's navigate
    navigate(item.path);
    
    // Close mobile sidebar if needed
    if (onToggle && window.innerWidth < 768) {
      onToggle();
    }
  };

  // Handle child item navigation
  const handleChildNavClick = (e: React.MouseEvent<HTMLAnchorElement>, parentItem: NavItem, childPath: string) => {
    // If already on this page, prevent default navigation
    if (location.pathname === childPath) {
      e.preventDefault();
      return;
    }

    // Prevent default browser navigation
    e.preventDefault();
    
    // Navigate to the path using React Router's navigate
    navigate(childPath);
    
    // Close mobile sidebar if needed
    if (onToggle && window.innerWidth < 768) {
      onToggle();
    }
  };

  return (
    <>
      {/* Sidebar for desktop and mobile */}
      <div 
        className={cn(
          "bg-white shadow-md z-40 flex flex-col transition-all duration-300 ease-in-out",
          "fixed h-full md:h-screen", // Full height on all screens
          "w-[220px] md:w-[220px]", // Increased width to 220px
          "top-0 bottom-0 left-0", // Full height positioning
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0", // Off-screen when closed on mobile
          className
        )}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between w-full">
            <img 
              src="/images/page1/logo.png" 
              alt="Marketing Automation Tools" 
              className="h-12" 
            />
            <button 
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100" 
              onClick={onToggle}
              aria-label="Close sidebar"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <nav className="mt-4 flex-1 overflow-y-auto pb-20">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id} className="flex flex-col">
                <a 
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item)}
                  className={cn(
                    "flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 relative",
                    isItemActive(item) && 
                      "bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-5"
                  )}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img 
                      src={item.icon} 
                      alt="" 
                      className="w-5 h-5"
                      style={{ 
                        filter: isItemActive(item) ? 
                          "invert(43%) sepia(62%) saturate(4644%) hue-rotate(208deg) brightness(103%) contrast(101%)" : 
                          "brightness(0)"
                      }} 
                    />
                  </div>
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                  {item.pro && (
                    <span className="ml-auto text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                      PRO
                    </span>
                  )}
                  {item.children && item.children.length > 0 && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={cn(
                        "h-4 w-4 ml-auto transition-transform duration-200",
                        expandedItem === item.id ? "transform rotate-180" : ""
                      )}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </a>
                
                {/* Submenu for items with children */}
                {item.children && item.children.length > 0 && expandedItem === item.id && (
                  <ul className="pl-12 bg-gray-50 space-y-1 py-1">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <a 
                          href={child.path}
                          onClick={(e) => handleChildNavClick(e, item, child.path)}
                          className={cn(
                            "flex items-center py-2 px-3 text-sm text-gray-600 hover:text-blue-600 rounded-md relative",
                            isChildActive(child.path) && "text-blue-600 font-medium"
                          )}
                        >
                          <span className="flex-1">{child.label}</span>
                          {child.count !== undefined && (
                            <span className="ml-2 text-xs bg-gray-200 text-gray-800 rounded-full px-2 py-0.5">
                              {child.count}
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar; 