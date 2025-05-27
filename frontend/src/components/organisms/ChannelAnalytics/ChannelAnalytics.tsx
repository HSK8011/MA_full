import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import dashboardService from '../../../services/dashboardService';
import { toast } from 'react-hot-toast';
import type { SocialAccount, SocialMetric } from '../../../services/dashboardService';

interface ChannelAnalyticsProps {
  className?: string;
}

interface TimeRange {
  startDate: Date;
  endDate: Date;
}

export const ChannelAnalytics: React.FC<ChannelAnalyticsProps> = ({ className }) => {
  // State for time filter selection
  const timeFilters = ['Today', 'This Week', 'This Month', 'Custom'];
  const [activeTimeFilter, setActiveTimeFilter] = useState('This Month');
  
  // State for date range
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<TimeRange>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date()
  });
  
  // State for account dropdown
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  
  // State for active social platform
  const [activePlatform, setActivePlatform] = useState('twitter');
  
  // State for selected account
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null);
  
  // State for metrics loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<SocialMetric[]>([]);
  
  // State for user accounts (fetched from API)
  const [userAccounts, setUserAccounts] = useState<SocialAccount[]>([]);
  
  // Fetch metrics data from API
  const fetchMetricsForAccount = async (account: SocialAccount, timeFilter: string): Promise<void> => {
    if (!account) return;
    
    setIsLoading(true);
    try {
      const data = await dashboardService.getChannelAnalytics(account.id, timeFilter);
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Failed to fetch channel analytics:', error);
      toast.error('Failed to load channel analytics');
      // Set empty metrics if API fails
      setMetrics([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle account selection
  const handleAccountSelect = (account: SocialAccount) => {
    setSelectedAccount(account);
    setActivePlatform(account.platform);
    setIsAccountDropdownOpen(false);
    
    // Fetch metrics for the selected account
    fetchMetricsForAccount(account, activeTimeFilter);
  };
  
  // Handle time filter change
  const handleTimeFilterClick = (filter: string) => {
    setActiveTimeFilter(filter);
    
    if (filter === 'Custom') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
      if (selectedAccount) {
        // Fetch metrics with the new time filter
        fetchMetricsForAccount(selectedAccount, filter);
      }
    }
  };
  
  // Handle date range selection
  const handleDateRangeSelect = (range: TimeRange) => {
    setCustomDateRange(range);
    setActiveTimeFilter('Custom');
    setShowDatePicker(false);
    
    if (selectedAccount) {
      // Fetch metrics with the custom date range
      fetchMetricsForAccount(selectedAccount, 'Custom');
    }
  };
  
  // Toggle account dropdown
  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };
  
  // Handle platform change
  const handlePlatformChange = (platform: string) => {
    setActivePlatform(platform);
    
    // Find first account of this platform
    const platformAccount = userAccounts.find(acc => acc.platform === platform);
    if (platformAccount) {
      setSelectedAccount(platformAccount);
      fetchMetricsForAccount(platformAccount, activeTimeFilter);
    }
  };
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await dashboardService.getDashboardData();
        setUserAccounts(data.accounts);
        
        if (data.accounts.length > 0) {
          const firstAccount = data.accounts[0];
          setSelectedAccount(firstAccount);
          setActivePlatform(firstAccount.platform);
          await fetchMetricsForAccount(firstAccount, activeTimeFilter);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load accounts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Helper functions for platform colors and icons
  const getPlatformColor = (platform: string): string => {
    switch (platform) {
      case 'twitter':
        return 'bg-blue-400';
      case 'linkedin':
        return 'bg-blue-700';
      case 'facebook':
        return 'bg-blue-600';
      case 'pinterest':
        return 'bg-red-600';
      case 'instagram':
        return 'bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400';
      default:
        return 'bg-gray-500';
    }
  };

  const getPlatformIcon = (platform: string): string => {
    switch (platform) {
      case 'twitter':
        return 'T';
      case 'linkedin':
        return 'L';
      case 'facebook':
        return 'F';
      case 'pinterest':
        return 'P';
      case 'instagram':
        return 'I';
      default:
        return '?';
    }
  };
  
  // Social media channels with fallback icons
  const socialChannels = [
    { 
      name: 'Twitter', 
      value: 'twitter', 
      icon: '/images/page3/twitter@3x.png',
      fallbackIcon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzFEQTFGMiIgZD0iTTIzLjk1MyA0LjU3YTEwIDEwIDAgMDEtMi44MjUuNzc1IDQuOTU4IDQuOTU4IDAgMDAyLjE2My0yLjcyM2MtLjk1MS41NTUtMi4wMDUuOTU5LTMuMTI3IDEuMTg0YTQuOTIgNC45MiAwIDAwLTguMzg0IDQuNDgyQzcuNjkgOC4wOTUgNC4wNjcgNi4xMyAxLjY0IDMuMTYyYTQuODIyIDQuODIyIDAgMDAtLjY2NiAyLjQ3NWMwIDEuNzEuODcgMy4yMTMgMi4xODggNC4wOTZhNC45MDQgNC45MDQgMCAwMS0yLjIyOC0uNjE2di4wNmE0LjkyMyA0LjkyMyAwIDAwMy45NDYgNC44MjcgNC45OTYgNC45OTYgMCAwMS0yLjIxMi4wODUgNC45MzYgNC45MzYgMCAwMDQuNjA0IDMuNDE3IDkuODY3IDkuODY3IDAgMDEtNi4xMDIgMi4xMDVjLS4zOSAwLS43NzktLjAyMy0xLjE3LS4wNjdhMTMuOTk1IDEzLjk5NSAwIDAwNy41NTcgMi4yMDljOS4wNTMgMCAxMy45OTgtNy40OTYgMTMuOTk4LTEzLjk4NSAwLS4yMSAwLS40Mi0uMDE1LS42M0E5LjkzNSA5LjkzNSAwIDAwMjQgNC41OXoiLz48L3N2Zz4=' 
    },
    { 
      name: 'Facebook', 
      value: 'facebook', 
      icon: '/images/page3/facebook@3x.png',
      fallbackIcon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzE4NzdGMiIgZD0iTTI0IDEyLjA3M2MwLTYuNjI3LTUuMzczLTEyLTEyLTEycy0xMiA1LjM3My0xMiAxMmMwIDUuOTkgNC4zODggMTAuOTU0IDEwLjEyNSAxMS44NTR2LTguMzg1SDcuMDc4di0zLjQ3aDMuMDQ3VjkuNDNjMC0zLjAwNyAxLjc5Mi00LjY2OSA0LjUzMy00LjY2OSAxLjMxMiAwIDIuNjg2LjIzNSAyLjY4Ni4yMzV2Mi45NTNoLTEuNTEzYy0xLjQ5IDAtMS45NTUuOTI1LTEuOTU1IDEuODc0djIuMjVoMy4zMjhsLS41MzIgMy40N2gtMi43OTZ2OC4zODVDMTkuNjEyIDIzLjAyNyAyNCAxOC4wNjIgMjQgMTIuMDczeiIvPjwvc3ZnPg==' 
    },
    { 
      name: 'LinkedIn', 
      value: 'linkedin', 
      icon: '/images/page3/linkedin@3x.png',
      fallbackIcon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzAwNzdiNSIgZD0iTTIwLjQ0NyAyMC40NTJoLTMuNTU0di01LjU2OWMwLTEuMzI4LS4wMjctMy4wMzctMS44NTItMy4wMzctMS44NTMgMC0yLjEzNiAxLjQ0NS0yLjEzNiAyLjkzOXY1LjY2N0g5LjM1MVY5aDMuNDE0djEuNTYxaC4wNDZjLjQ3Ny0uOSAxLjYzNy0xLjg1IDMuMzctMS44NSAzLjYwMSAwIDQuMjY3IDIuMzcgNC4yNjcgNS40NTV2Ni4yODZ6TTUuMzM3IDcuNDMzYy0xLjE0NCAwLTIuMDYzLS45MjYtMi4wNjMtMi4wNjUgMC0xLjEzOC45Mi0yLjA2MyAyLjA2My0yLjA2MyAxLjE0IDAgMi4wNjQuOTI1IDIuMDY0IDIuMDYzIDAgMS4xMzktLjkyNSAyLjA2NS0yLjA2NCAyLjA2NXptMS43OTUgMTMuMDE5SDMuNTc5VjlINy4xMzJ2MTEuNDUyek0yMi4yMjUgMEgxLjc3MUMuNzkyIDAgMCAuNzc0IDAgMS43Mjl2MjAuNTQyQzAgMjMuMjI3Ljc5MiAyNCAxLjc3MSAyNGgyMC40NTFDMjMuMiAyNCAyNCAyMy4yMjcgMjQgMjIuMjcxVjEuNzI5QzI0IC43NzQgMjMuMiAwIDIyLjIyMiAwaC4wMDN6Ii8+PC9zdmc+' 
    },
    { 
      name: 'Pinterest', 
      value: 'pinterest', 
      icon: '/images/page3/pinterest-seeklogo-com@3x.png',
      fallbackIcon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI0UwMDAyMyIgZD0iTTEyLjAxNyAwQzUuMzk2IDAgLjAyOSA1LjM2Ny4wMjkgMTEuOTg3YzAgNS4wNzkgMy4xNTggOS40MTcgNy42MTggMTEuMTYyLS4xMDUtLjk0OS0uMTk5LTIuNDAzLjA0MS0zLjQzOS4yMTktLjkzNyAxLjQwNi01Ljk1NyAxLjQwNi01Ljk1N3MtLjM1OS0uNzItLjM1OS0xLjc4MWMwLTEuNjYzLjk2Ny0yLjkxMSAyLjE2OC0yLjkxMSAxLjAyNCAwIDEuNTE4Ljc2OSAxLjUxOCAxLjY4OCAwIDEuMDI5LS42NTMgMi41NjctLjk5MiAzLjk5Mi0uMjg1IDEuMTkzLjYgMi4xNjUgMS43NzUgMi4xNjUgMi4xMjggMCAzLjc2OC0yLjI0NSAzLjc2OC01LjQ4NyAwLTIuODYxLTIuMDYzLTQuODY5LTUuMDA4LTQuODY5LTMuNDEgMC01LjQwOSAyLjU2Mi01LjQwOSA1LjE5OSAwIC4xMDMuMDEzLjIwMy4wMjUuMzA1LS4wMTIuMTAzLS4wMjUuMjA0LS4wMjUuMzA3IDAgLjY0NC4xNzEgMS4xMzIuMzg5IDEuNDkzLjA0My4wNjMuMDQ4LjExOC4wMzcuMTg3LS4wMzcuMTYzLS4xMjIuNTYyLS4xMzcuNjI2LS4wMjUuMTEyLS4wODYuMTM3LS4xOTcuMDgyQzguNzUgMTYuNDk4IDcuNzY2IDE0LjE1NCA3Ljc2NiAxMi4yNGMwLTMuNTU2IDIuNTgtNy4xMDMgNy40NzQtNy4xMDMgMy45MzIgMCA2Ljk5OSAyLjgxMyA2Ljk5OSA2LjU2MyAwIDMuOTEyLTIuNDYgNy4wMTItNS44NjkgNy4wMTItMS4xNDIgMC0yLjIxNi0uNTk1LTIuNTg0LTEuMjkzIDAgMC0uNTY1IDIuMTY1LS43MDQgMi42OTMtLjI1Ny45NzctLjk0OSAxLjk1Ni0xLjQxMyAyLjYwOSAxLjA2Mi4zMjcgMi4xOTQuNTA0IDMuMzYuNTA0IDYuNjI3IDAgMTIuMDA4LTUuMzY5IDEyLjAwOC0xMS45ODZDMjQuMDI1IDUuMzY3IDE4LjY0MiAwIDEyLjAxNyAweiIvPjwvc3ZnPg==' 
    },
  ];
  
  // Calculate platform account counts and filtered accounts
  const accountsByPlatform = socialChannels.reduce((acc, channel) => {
    acc[channel.value] = userAccounts.filter(account => account.platform === channel.value);
    return acc;
  }, {} as Record<string, SocialAccount[]>);
  
  // Get accounts for the active platform
  const filteredAccounts = accountsByPlatform[activePlatform] || [];

  return (
    <div className={cn("bg-white rounded-lg shadow-sm p-6", className)}>
      {/* Header with time filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
        <h2 className="text-lg font-medium text-gray-800">Channel Analytics</h2>
        
        <div className="flex flex-wrap items-center gap-2 relative">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md",
                activeTimeFilter === filter
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
              onClick={() => handleTimeFilterClick(filter)}
            >
              {filter}
            </button>
          ))}
          
          {/* Custom date picker (conditionally rendered) */}
          {showDatePicker && (
            <div 
              ref={datePickerRef}
              className="absolute top-full right-0 mt-2 p-4 bg-white rounded-lg shadow-lg z-10 border border-gray-200"
            >
              <div className="flex flex-col space-y-2 mb-3">
                <label className="text-sm text-gray-600">Start Date</label>
                <input 
                  type="date" 
                  className="border border-gray-300 rounded-md p-2"
                  value={customDateRange.startDate.toISOString().split('T')[0]}
                  onChange={(e) => setCustomDateRange(prev => ({
                    ...prev,
                    startDate: new Date(e.target.value)
                  }))}
                />
              </div>
              <div className="flex flex-col space-y-2 mb-4">
                <label className="text-sm text-gray-600">End Date</label>
                <input 
                  type="date" 
                  className="border border-gray-300 rounded-md p-2"
                  value={customDateRange.endDate.toISOString().split('T')[0]}
                  onChange={(e) => setCustomDateRange(prev => ({
                    ...prev,
                    endDate: new Date(e.target.value)
                  }))}
                />
              </div>
              <div className="flex justify-end">
                <button 
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  onClick={() => handleDateRangeSelect(customDateRange)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Account selector and platform tabs */}
      <div className="mb-6">
        <div className="flex mb-4 border-b border-gray-200">
          {socialChannels.map((channel) => (
            <button
              key={channel.value}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px",
                activePlatform === channel.value
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => handlePlatformChange(channel.value)}
            >
              <img 
                src={channel.icon} 
                alt={channel.name} 
                className="w-4 h-4 inline mr-2" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = channel.fallbackIcon;
                }}
              />
              {channel.name}
              {accountsByPlatform[channel.value]?.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">
                  {accountsByPlatform[channel.value].length}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {/* Account dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div className="text-sm text-gray-600 mb-4">
            Select a social media account
          </div>
          <div 
            className="flex items-center space-x-2 border p-2 rounded-md w-full cursor-pointer hover:bg-gray-50"
            onClick={toggleAccountDropdown}
          >
            {selectedAccount ? (
              <>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white overflow-hidden ${getPlatformColor(selectedAccount.platform)}`}>
                  {selectedAccount.profileImage ? (
                    <img 
                      src={selectedAccount.profileImage} 
                      alt={selectedAccount.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAccount.name)}&background=random`;
                      }}
                    />
                  ) : (
                    getPlatformIcon(selectedAccount.platform)
                  )}
                </div>
                <div className="flex-grow">
                  <div className="font-medium">{selectedAccount.name}</div>
                  <div className="text-xs text-gray-500">{selectedAccount.handle || selectedAccount.platform}</div>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div className="flex-grow text-gray-500">Select an account</div>
              </>
            )}
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isAccountDropdownOpen ? 'transform rotate-180' : ''}><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          
          {/* Dropdown menu */}
          {isAccountDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-md shadow-lg z-20">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <div 
                    key={account.id}
                    className={`flex items-center space-x-2 p-3 hover:bg-gray-50 cursor-pointer ${account.id === selectedAccount?.id ? 'bg-blue-50' : ''}`}
                    onClick={() => handleAccountSelect(account)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white overflow-hidden ${getPlatformColor(account.platform)}`}>
                      {account.profileImage ? (
                        <img 
                          src={account.profileImage} 
                          alt={account.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=random`;
                          }}
                        />
                      ) : (
                        getPlatformIcon(account.platform)
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{account.name}</div>
                      <div className="text-xs text-gray-500">{account.handle || `${account.platform} Account`}</div>
                    </div>
                    {account.id === selectedAccount?.id && (
                      <div className="text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  No accounts found for this platform
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Metrics display */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">{metric.label}</div>
              <div className="text-2xl font-bold text-gray-800">{metric.value}</div>
              {metric.change && (
                <div className={cn(
                  "text-xs flex items-center mt-1",
                  metric.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  <span className="mr-1">
                    {metric.isPositive ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H9v9a1 1 0 01-2 0V8H6a1 1 0 01-1-1c0-.297.132-.578.358-.769l3-2.5a1 1 0 011.284 0l3 2.5A1 1 0 0112 7z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 13a1 1 0 01-1-1V3a1 1 0 112 0v9h1a1 1 0 110 2h-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  {metric.change} {metric.changeLabel && <span className="text-gray-500 ml-1">{metric.changeLabel}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChannelAnalytics;