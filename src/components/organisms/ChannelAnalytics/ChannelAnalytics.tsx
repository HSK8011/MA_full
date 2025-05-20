import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';

interface ChannelAnalyticsProps {
  className?: string;
}

// Data interfaces for better type checking
interface SocialAccount {
  id: string;
  name: string;
  handle: string;
  platform: string;
  platformIcon: string;
  profileImage: string;
}

interface SocialMetric {
  label: string;
  value: string;
  change?: string;
  changeLabel?: string;
  isPositive?: boolean;
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
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for user accounts (in a real app, this would come from an API)
  const userAccounts: SocialAccount[] = [
    {
      id: '1',
      name: 'AIMDek Technologies',
      handle: '@aimdektech',
      platform: 'twitter',
      platformIcon: '/images/page3/twitter@3x.png',
      profileImage: '/images/page2/user.png'
    },
    {
      id: '2',
      name: 'AIMDek Technologies',
      handle: '@aimdektech',
      platform: 'facebook',
      platformIcon: '/images/page3/facebook@3x.png',
      profileImage: '/images/page2/user.png'
    },
    {
      id: '3',
      name: 'AIMDek Tech',
      handle: '@aimdek',
      platform: 'twitter',
      platformIcon: '/images/page3/twitter@3x.png',
      profileImage: '/images/page2/company.png'
    },
    {
      id: '4',
      name: 'AIMDek Technologies',
      handle: '@aimdek-technologies',
      platform: 'linkedin',
      platformIcon: '/images/page3/linkedin@3x.png',
      profileImage: '/images/page2/user.png'
    },
    {
      id: '5',
      name: 'AIMDek Tech',
      handle: '@aimdektech',
      platform: 'pinterest',
      platformIcon: '/images/page3/pinterest-seeklogo-com@3x.png',
      profileImage: '/images/page2/company.png'
    }
  ];
  
  // Mock metrics data - In a real app, this would come from an API call with the time range
  const getMetricsForAccount = (account: SocialAccount, timeFilter: string, customRange?: TimeRange): SocialMetric[] => {
    // Simulate different data for different time ranges
    let timeBasedData: {[key: string]: {[platform: string]: SocialMetric[]}} = {
      'Today': {
        'twitter': [
          { label: 'Total Followers', value: '12.5K', change: '+0.5%', changeLabel: 'today', isPositive: true },
          { label: 'Tweets', value: '3', change: '+3', changeLabel: 'new today', isPositive: true },
          { label: 'Queued Posts', value: '5', change: '-2', changeLabel: 'from yesterday', isPositive: false },
          { label: 'Engagements', value: '820', change: '+12%', changeLabel: 'vs yesterday', isPositive: true }
        ],
        'facebook': [
          { label: 'Total Followers', value: '35.7K', change: '+0.2%', changeLabel: 'today', isPositive: true },
          { label: 'Posts', value: '2', change: '+2', changeLabel: 'new today', isPositive: true },
          { label: 'Queued Posts', value: '4', change: '-1', changeLabel: 'from yesterday', isPositive: false },
          { label: 'Engagements', value: '560', change: '+5%', changeLabel: 'vs yesterday', isPositive: true }
        ],
        'linkedin': [
          { label: 'Connections', value: '8.3K', change: '+0.3%', changeLabel: 'today', isPositive: true },
          { label: 'Posts', value: '1', change: '+1', changeLabel: 'new today', isPositive: true },
          { label: 'Queued Posts', value: '2', change: '0', changeLabel: 'from yesterday', isPositive: true },
          { label: 'Engagements', value: '310', change: '+8%', changeLabel: 'vs yesterday', isPositive: true }
        ],
        'pinterest': [
          { label: 'Followers', value: '4.1K', change: '+0.4%', changeLabel: 'today', isPositive: true },
          { label: 'Pins', value: '5', change: '+5', changeLabel: 'new today', isPositive: true },
          { label: 'Queued Pins', value: '3', change: '-1', changeLabel: 'from yesterday', isPositive: false },
          { label: 'Engagements', value: '250', change: '+15%', changeLabel: 'vs yesterday', isPositive: true }
        ]
      },
      'This Week': {
        'twitter': [
          { label: 'Total Followers', value: '12.5K', change: '+2.5%', changeLabel: 'this week', isPositive: true },
          { label: 'Tweets', value: '15', change: '+8', changeLabel: 'from last week', isPositive: true },
          { label: 'Queued Posts', value: '12', change: '+4', changeLabel: 'from last week', isPositive: true },
          { label: 'Engagements', value: '4.2K', change: '+18%', changeLabel: 'vs last week', isPositive: true }
        ],
        'facebook': [
          { label: 'Total Followers', value: '35.7K', change: '+1.2%', changeLabel: 'this week', isPositive: true },
          { label: 'Posts', value: '10', change: '+2', changeLabel: 'from last week', isPositive: true },
          { label: 'Queued Posts', value: '8', change: '+3', changeLabel: 'from last week', isPositive: true },
          { label: 'Engagements', value: '7.8K', change: '+8%', changeLabel: 'vs last week', isPositive: true }
        ],
        'linkedin': [
          { label: 'Connections', value: '8.3K', change: '+1.8%', changeLabel: 'this week', isPositive: true },
          { label: 'Posts', value: '6', change: '+1', changeLabel: 'from last week', isPositive: true },
          { label: 'Queued Posts', value: '4', change: '+2', changeLabel: 'from last week', isPositive: true },
          { label: 'Engagements', value: '1.7K', change: '+12%', changeLabel: 'vs last week', isPositive: true }
        ],
        'pinterest': [
          { label: 'Followers', value: '4.1K', change: '+3.2%', changeLabel: 'this week', isPositive: true },
          { label: 'Pins', value: '28', change: '+10', changeLabel: 'from last week', isPositive: true },
          { label: 'Queued Pins', value: '8', change: '+2', changeLabel: 'from last week', isPositive: true },
          { label: 'Engagements', value: '1.2K', change: '+22%', changeLabel: 'vs last week', isPositive: true }
        ]
      },
      'This Month': {
        'twitter': [
          { label: 'Total Followers', value: '12.5K', change: '+10%', changeLabel: 'vs previous month', isPositive: true },
          { label: 'Tweets', value: '40', change: '+15', changeLabel: 'from last month', isPositive: true },
          { label: 'Queued Posts', value: '20', change: '+8', changeLabel: 'from last month', isPositive: true },
          { label: 'Engagements', value: '10K', change: '+25%', changeLabel: 'vs last month', isPositive: true }
        ],
        'facebook': [
          { label: 'Total Followers', value: '35.7K', change: '+5%', changeLabel: 'vs previous month', isPositive: true },
          { label: 'Posts', value: '25', change: '+7', changeLabel: 'from last month', isPositive: true },
          { label: 'Queued Posts', value: '12', change: '+4', changeLabel: 'from last month', isPositive: true },
          { label: 'Engagements', value: '21K', change: '+12%', changeLabel: 'vs last month', isPositive: true }
        ],
        'linkedin': [
          { label: 'Connections', value: '8.3K', change: '+7%', changeLabel: 'vs previous month', isPositive: true },
          { label: 'Posts', value: '18', change: '+6', changeLabel: 'from last month', isPositive: true },
          { label: 'Queued Posts', value: '8', change: '+3', changeLabel: 'from last month', isPositive: true },
          { label: 'Engagements', value: '5.2K', change: '+15%', changeLabel: 'vs last month', isPositive: true }
        ],
        'pinterest': [
          { label: 'Followers', value: '4.1K', change: '+12%', changeLabel: 'vs previous month', isPositive: true },
          { label: 'Pins', value: '120', change: '+45', changeLabel: 'from last month', isPositive: true },
          { label: 'Queued Pins', value: '15', change: '+5', changeLabel: 'from last month', isPositive: true },
          { label: 'Engagements', value: '3.5K', change: '+28%', changeLabel: 'vs last month', isPositive: true }
        ]
      },
      'Custom': {
        'twitter': [
          { label: 'Total Followers', value: '12.3K', change: '+3.7%', changeLabel: 'in selected period', isPositive: true },
          { label: 'Tweets', value: '22', change: '+22', changeLabel: 'in selected period', isPositive: true },
          { label: 'Queued Posts', value: '14', change: '+6', changeLabel: 'since period start', isPositive: true },
          { label: 'Engagements', value: '6.8K', change: '+15%', changeLabel: 'in selected period', isPositive: true }
        ],
        'facebook': [
          { label: 'Total Followers', value: '35.5K', change: '+2.3%', changeLabel: 'in selected period', isPositive: true },
          { label: 'Posts', value: '14', change: '+14', changeLabel: 'in selected period', isPositive: true },
          { label: 'Queued Posts', value: '9', change: '+3', changeLabel: 'since period start', isPositive: true },
          { label: 'Engagements', value: '12.5K', change: '+10%', changeLabel: 'in selected period', isPositive: true }
        ],
        'linkedin': [
          { label: 'Connections', value: '8.2K', change: '+4.1%', changeLabel: 'in selected period', isPositive: true },
          { label: 'Posts', value: '10', change: '+10', changeLabel: 'in selected period', isPositive: true },
          { label: 'Queued Posts', value: '6', change: '+2', changeLabel: 'since period start', isPositive: true },
          { label: 'Engagements', value: '3.2K', change: '+13%', changeLabel: 'in selected period', isPositive: true }
        ],
        'pinterest': [
          { label: 'Followers', value: '4.0K', change: '+8%', changeLabel: 'in selected period', isPositive: true },
          { label: 'Pins', value: '75', change: '+75', changeLabel: 'in selected period', isPositive: true },
          { label: 'Queued Pins', value: '12', change: '+4', changeLabel: 'since period start', isPositive: true },
          { label: 'Engagements', value: '2.8K', change: '+20%', changeLabel: 'in selected period', isPositive: true }
        ]
      }
    };
    
    // Return data based on time filter
    if (timeFilter === 'Custom' && customRange) {
      return processCustomRangeMetrics(account, customRange, timeBasedData[timeFilter][account.platform]);
    }
    
    return timeBasedData[timeFilter][account.platform] || [];
  };
  
  // Social channels tabs configuration
  const socialChannels = [
    { name: 'Twitter', value: 'twitter', icon: '/images/page3/twitter@3x.png' },
    { name: 'Facebook', value: 'facebook', icon: '/images/page3/facebook@3x.png' },
    { name: 'LinkedIn', value: 'linkedin', icon: '/images/page3/linkedin@3x.png' },
    { name: 'Pinterest', value: 'pinterest', icon: '/images/page3/pinterest-seeklogo-com@3x.png' },
  ];
  
  // Filter accounts based on active platform
  const filteredAccounts = userAccounts.filter(account => account.platform === activePlatform);
  
  // Initialize with first account of selected platform
  useEffect(() => {
    if (filteredAccounts.length > 0 && !selectedAccount) {
      setSelectedAccount(filteredAccounts[0]);
    } else if (filteredAccounts.length > 0 && selectedAccount && selectedAccount.platform !== activePlatform) {
      // If platform changed, update selected account
      setSelectedAccount(filteredAccounts[0]);
    }
  }, [activePlatform, filteredAccounts, selectedAccount]);
  
  // Handle time filter click
  const handleTimeFilterClick = (filter: string) => {
    setActiveTimeFilter(filter);
    if (filter === 'Custom') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
      fetchMetrics(filter);
    }
  };
  
  // Handle platform change
  const handlePlatformChange = (platform: string) => {
    setActivePlatform(platform);
    setSelectedAccount(null);
    setIsAccountDropdownOpen(false);
  };
  
  // Handle account selection
  const handleAccountSelect = (account: SocialAccount) => {
    setSelectedAccount(account);
    setIsAccountDropdownOpen(false);
  };
  
  // Handle date range selection for custom filter
  const handleDateRangeSelect = (startDate: Date, endDate: Date) => {
    setCustomDateRange({ startDate, endDate });
    setShowDatePicker(false);
  };
  
  // Fetch metrics based on time filter
  const fetchMetrics = (timeFilter: string, customRange?: TimeRange) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (selectedAccount) {
        const metrics = getMetricsForAccount(selectedAccount, timeFilter, customRange);
        // Update metrics state here
      }
      setIsLoading(false);
    }, 1000);
  };
  
  // Process metrics for custom date range
  const processCustomRangeMetrics = (account: SocialAccount, range: TimeRange, customData: SocialMetric[]) => {
    // In a real app, this would make an API call with the date range
    // For now, just return the mock custom data
    return customData;
  };
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle clicks outside dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Fetch initial metrics
  useEffect(() => {
    if (selectedAccount) {
      fetchMetrics(activeTimeFilter, activeTimeFilter === 'Custom' ? customDateRange : undefined);
    }
  }, [selectedAccount, activeTimeFilter, customDateRange]);
  
  // Get metrics for the currently selected account
  const metrics = selectedAccount ? getMetricsForAccount(selectedAccount, activeTimeFilter, customDateRange) : [];
  
  return (
    <div className={cn("bg-white rounded-lg shadow-sm p-4 md:p-6", className)}>
      {/* Header with time filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
        <h2 className="text-lg font-medium text-gray-800">Channel Analytics</h2>
        
        <div className="flex flex-wrap items-center gap-2 relative">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              className={cn(
                "px-2 sm:px-4 py-1 text-xs sm:text-sm rounded-md custom-date-filter",
                filter === activeTimeFilter
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
              onClick={() => handleTimeFilterClick(filter)}
            >
              {filter}
            </button>
          ))}
          
          {/* Custom date range picker */}
          {showDatePicker && (
            <div 
              ref={datePickerRef}
              className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 p-4 z-20 w-80"
            >
              <div className="mb-4">
                <label 
                  htmlFor="startDate" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date
                </label>
                <input 
                  id="startDate"
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={customDateRange.startDate.toISOString().split('T')[0]}
                  onChange={(e) => setCustomDateRange(prev => ({
                    ...prev,
                    startDate: new Date(e.target.value)
                  }))}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="mb-4">
                <label 
                  htmlFor="endDate" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date
                </label>
                <input 
                  id="endDate"
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={customDateRange.endDate.toISOString().split('T')[0]}
                  onChange={(e) => setCustomDateRange(prev => ({
                    ...prev,
                    endDate: new Date(e.target.value)
                  }))}
                  min={customDateRange.startDate.toISOString().split('T')[0]}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={() => setShowDatePicker(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  onClick={() => handleDateRangeSelect(customDateRange.startDate, customDateRange.endDate)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Display selected time period */}
      {activeTimeFilter === 'Custom' && (
        <div className="mb-4 text-sm text-gray-600">
          <span className="font-medium">Selected period: </span>
          {formatDate(customDateRange.startDate)} - {formatDate(customDateRange.endDate)}
        </div>
      )}
      
      <div className="mb-6">
        {/* Account selection dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="flex items-center w-full space-x-2 mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-md text-left"
            onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsAccountDropdownOpen(!isAccountDropdownOpen);
              }
            }}
            aria-expanded={isAccountDropdownOpen}
            aria-haspopup="true"
          >
            {selectedAccount && (
              <>
                <img
                  src={selectedAccount.profileImage}
                  alt={selectedAccount.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-base font-medium">{selectedAccount.name}</span>
                  <span className="text-xs text-gray-500">{selectedAccount.handle}</span>
                </div>
              </>
            )}
            <span className="ml-auto">
              <svg 
                className={cn(
                  "w-5 h-5 text-gray-400 transition-transform duration-200",
                  isAccountDropdownOpen && "transform rotate-180"
                )} 
                viewBox="0 0 20 20" 
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
          
          {/* Dropdown menu */}
          {isAccountDropdownOpen && (
            <div 
              className="absolute z-10 left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1"
            >
              <div className="max-h-56 overflow-y-auto">
                <select
                  className="absolute opacity-0 h-0 w-0 overflow-hidden"
                  value={selectedAccount?.id ?? ''}
                  onChange={(e) => {
                    const selected = filteredAccounts.find(acc => acc.id === e.target.value);
                    if (selected) handleAccountSelect(selected);
                  }}
                  aria-label="Select account"
                  size={Math.min(filteredAccounts.length, 5)}
                >
                  {filteredAccounts.map((account) => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
                
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((account) => (
                    <button 
                      key={account.id}
                      className={cn(
                        "flex items-center w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer",
                        selectedAccount?.id === account.id && "bg-blue-50"
                      )}
                      onClick={() => handleAccountSelect(account)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleAccountSelect(account);
                        }
                      }}
                      aria-selected={selectedAccount?.id === account.id}
                    >
                      <img 
                        src={account.profileImage} 
                        alt={account.name} 
                        className="w-6 h-6 rounded-full mr-3" 
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{account.name}</span>
                        <span className="text-xs text-gray-500">{account.handle}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No accounts found for this platform
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Social channel tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {socialChannels.map((channel) => (
            <button
              key={channel.name}
              className={cn(
                "flex-1 py-3 flex justify-center",
                channel.value === activePlatform && "border-b-2 border-blue-500"
              )}
              onClick={() => handlePlatformChange(channel.value)}
            >
              <img src={channel.icon} alt={channel.name} className="w-6 h-6" />
            </button>
          ))}
        </div>
        
        {/* Account platform and handle display */}
        {selectedAccount && (
          <div className="flex items-center mb-8">
            <img src={selectedAccount.platformIcon} alt={selectedAccount.platform} className="w-5 h-5 mr-2" />
            <span className="text-sm text-gray-600">{selectedAccount.handle}</span>
          </div>
        )}
        
        {/* Metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 relative">
          {isLoading ? (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : null}
          
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center p-2 sm:p-0">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800">{metric.value}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">{metric.label}</p>
              {metric.change && (
                <p className={cn(
                  "text-xs mt-1 flex items-center justify-center",
                  metric.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  <span className="mr-1">
                    {metric.isPositive ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  <span className="font-medium">{metric.change}</span>
                  <span className="text-gray-500 ml-1">{metric.changeLabel}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* 
        Backend implementation notes:
        1. Replace the mock userAccounts array with a fetch call to your API endpoint
        2. Implement proper APIs to fetch accounts filtered by platform
        3. Create API endpoints for fetching metrics based on:
           - selected account
           - active time filter (today, this week, this month, custom date range)
        4. For the date picker, properly sanitize and validate date inputs
        5. The loadingState should be tied to real API request status
        6. Add error handling for failed API requests
        7. Consider implementing caching for frequently accessed metrics
      */}
    </div>
  );
};

export default ChannelAnalytics; 