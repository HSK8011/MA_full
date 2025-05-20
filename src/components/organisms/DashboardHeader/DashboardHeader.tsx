import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { authService } from '../../../services/authService';

interface DashboardHeaderProps {
  className?: string;
  onToggleSidebar?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  className,
  onToggleSidebar
}) => {
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Handle dropdown toggle
  const toggleCompanyDropdown = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setShowCompanyDropdown(!showCompanyDropdown);
  };

  // Handle keyboard events for dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleCompanyDropdown(e);
    } else if (e.key === 'Escape' && showCompanyDropdown) {
      setShowCompanyDropdown(false);
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setShowCompanyDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [companyDropdownRef]);
  
  const handleLogout = () => {
    // Use authService to handle logout
    authService.logout();
    // Redirect to home page
    navigate('/');
  };

  const handleAccountSettings = () => {
    navigate('/settings/general');
    setShowCompanyDropdown(false);
  };

  const handleManageUsers = () => {
    navigate('/manage-users');
    setShowCompanyDropdown(false);
  };

  const handleContactUs = () => {
    console.log('Navigate to Contact Us');
    // Implementation for navigating to contact us
    setShowCompanyDropdown(false);
  };

  return (
    <header className={cn("bg-white h-16 border-b border-gray-100 flex items-center justify-between px-4 md:px-8", className)}>
      <div className="flex items-center">
        <button 
          className="mr-3 md:mr-5 text-gray-500 hover:text-gray-800 md:hidden"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        </button>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <img src="/images/page2/search.png" alt="" className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="search"
            className="block w-full md:w-64 lg:w-96 rounded-md border-0 py-2 pl-10 pr-4 text-gray-700 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            placeholder="Search..."
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <button className="text-gray-500 hover:text-gray-800 relative">
          <img src="/images/page2/bell.png" alt="Notifications" className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </button>
        
        <div className="flex items-center relative" ref={companyDropdownRef}>
          <button 
            className="hidden sm:flex flex-col text-right mr-3 cursor-pointer bg-transparent border-0"
            onClick={(e) => toggleCompanyDropdown(e)}
            onKeyDown={handleKeyDown}
            aria-haspopup="true"
            aria-expanded={showCompanyDropdown}
            aria-label="Toggle company menu"
          >
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-800">AIMDek Technologies</span>
              <svg 
                className={cn(
                  "ml-1 h-4 w-4 text-gray-400 transition-transform duration-200",
                  showCompanyDropdown && "transform rotate-180"
                )} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-gray-500">marketing@aimdek.com</span>
          </button>
          
          <div className="relative">
            <button
              className="bg-transparent border-0 p-0"
              onClick={(e) => toggleCompanyDropdown(e)}
              onKeyDown={handleKeyDown}
              aria-haspopup="true"
              aria-expanded={showCompanyDropdown}
              aria-label="User profile menu"
            >
              <img
                src="/images/page2/user.png"
                alt="User Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </button>
            
            {/* Company dropdown menu */}
            {showCompanyDropdown && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <img
                      src="/images/page2/user.png"
                      alt="User Profile"
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">AIMDek Technologies</p>
                      <p className="text-xs text-gray-500">marketing@aimdek.com</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={handleAccountSettings}
                  role="menuitem"
                  tabIndex={0}
                >
                  <img src="/images/page2/setting.png" alt="Settings" className="h-5 w-5 mr-3" />
                  Account & Settings
                </button>
                
                <button 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={handleManageUsers}
                  role="menuitem"
                  tabIndex={0}
                >
                  <img src="/images/page2/users.png" alt="Users" className="h-5 w-5 mr-3" />
                  Manage Users
                </button>
                
                <button 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={handleContactUs}
                  role="menuitem"
                  tabIndex={0}
                >
                  <img src="/images/page2/contact.png" alt="Contact" className="h-5 w-5 mr-3" />
                  Contact Us
                </button>
                
                <div className="border-t border-gray-100 mt-1">
                  <button 
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    onClick={handleLogout}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <img src="/images/page2/logout.png" alt="Logout" className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 