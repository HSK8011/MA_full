import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { cn } from '../../../lib/utils';
import { analyticsService } from '../../../services/analyticsService';
import type { Account, AnalyticsMetrics, TopPost } from '../../../services/analyticsService';
import { toast } from 'react-hot-toast';



// Component props interface
interface AnalyzeContentProps {
  className?: string;
}

export const AnalyzeContent: FC<AnalyzeContentProps> = ({ className }) => {
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  
  // State for available accounts
  const [accounts, setAccounts] = useState<Account[]>([]);

  // State for the selected account ID
  const [selectedAccountId, setSelectedAccountId] = useState('');
  
  // Get the currently selected account object
  const selectedAccount = accounts.find(account => account.id === selectedAccountId) || accounts[0] || null;
  
  // Function to get platform icon/color
  const getPlatformColor = (platform?: string): string => {
    switch(platform?.toLowerCase()) {
      case 'twitter': return 'bg-blue-400';
      case 'facebook': return 'bg-blue-600';
      case 'instagram': return 'bg-pink-500';
      case 'linkedin': return 'bg-blue-700';
      case 'pinterest': return 'bg-red-600';
      default: return 'bg-gray-400';
    }
  };
  
  // Function to get platform initials
  const getPlatformInitial = (platform?: string): string => {
    if (!platform) return 'SM';
    return platform.charAt(0).toUpperCase();
  };

  // State for the time range
  const [timeRange, setTimeRange] = useState('30d');
  
  // State for current active tab
  const [activeTab, setActiveTab] = useState('general');
  
  // State for analytics data
  const [analyticsData, setAnalyticsData] = useState<{
    accountId: string;
    accountName: string;
    timeRange: string;
    metrics: AnalyticsMetrics;
    topPosts: TopPost[];
  } | null>(null);
  
  // State for all posts
  const [allPosts, setAllPosts] = useState<TopPost[]>([]);
  
  // State for post status filter
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'scheduled' | 'draft'>('all');
  
  // Filtered posts based on status
  const filteredPosts = allPosts.filter(post => {
    // Log each post's status for debugging
    console.log(`Post ${post.id}: status = ${post.status || 'undefined'}`);
    
    // Handle posts without status
    if (!post.status) {
      console.log(`Post ${post.id} has no status, treating as published`);
      return statusFilter === 'all' || statusFilter === 'published';
    }
    
    // Handle normal filtering
    if (statusFilter === 'all') return true;
    return post.status === statusFilter;
  });
  
  // Log filtered results
  console.log(`Filtered posts (${statusFilter}):`, filteredPosts.length);
  
  // Fetch analytics overview on component mount
  useEffect(() => {
    fetchAnalyticsOverview();
  }, []);
  
  // Fetch analytics when selected account or time range changes
  useEffect(() => {
    if (selectedAccountId) {
      fetchAccountAnalytics();
    }
  }, [selectedAccountId, timeRange]);
  
  // Fetch analytics overview
  const fetchAnalyticsOverview = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getAnalyticsOverview(timeRange);
      
      // Set accounts
      setAccounts(data.accounts);
      
      // Set selected account if not already set
      if (!selectedAccountId && data.accounts.length > 0) {
        setSelectedAccountId(data.accounts[0].id);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch analytics overview:', error);
      toast.error('Failed to load analytics data');
      setIsLoading(false);
    }
  };
  
  // Fetch analytics for selected account
  const fetchAccountAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getAccountAnalytics(selectedAccountId, timeRange);
      setAnalyticsData(data);
      
      // Store all posts for the Posts tab
      if (data.topPosts && data.topPosts.length > 0) {
        // Ensure all posts have a status
        const postsWithStatus = data.topPosts.map(post => ({
          ...post,
          status: post.status || 'published' // Default to published if no status
        }));

        // Sort posts by date (newest first) and ensure scheduled posts show future dates
        const sortedPosts = [...postsWithStatus].sort((a, b) => {
          // For scheduled posts, use scheduledAt date if available
          const dateA = a.status === 'scheduled' && a.scheduledAt ? new Date(a.scheduledAt) : new Date(a.date);
          const dateB = b.status === 'scheduled' && b.scheduledAt ? new Date(b.scheduledAt) : new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });

        console.log('Setting all posts:', sortedPosts);
        setAllPosts(sortedPosts);
      } else {
        setAllPosts([]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch account analytics:', error);
      toast.error('Failed to load account analytics');
      setIsLoading(false);
    }
  };
  
  // Handle account selection change
  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAccountId = e.target.value;
    setSelectedAccountId(newAccountId);
  };

  // Handle time range selection change
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimeRange = e.target.value;
    setTimeRange(newTimeRange);
  };

  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-sm", className)}>
      <div className="p-6">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          {/* Account selector */}
          <div className="relative min-w-[250px]">
            <div className="flex items-center p-2 border border-gray-300 rounded-md bg-blue-50">
              <div 
                className={`w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white font-bold ${getPlatformColor(selectedAccount?.platform)}`}
              >
                {getPlatformInitial(selectedAccount?.platform)}
              </div>
              <select
                className="bg-transparent border-none focus:outline-none text-sm font-medium text-gray-700 appearance-none flex-grow pr-8"
                onChange={handleAccountChange}
                value={selectedAccountId}
              >
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.platform})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Time range selector */}
          <div className="relative">
            <select
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={timeRange}
              onChange={handleTimeRangeChange}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              className={cn(
                "py-4 px-1 border-b-2 text-sm font-medium",
                activeTab === 'general'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button
              className={cn(
                "py-4 px-1 border-b-2 text-sm font-medium",
                activeTab === 'posts'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setActiveTab('posts')}
            >
              Posts
            </button>
          </nav>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : analyticsData ? (
          <>
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-8">
              {/* Posts */}
              <div className="bg-gray-50 rounded-md p-3 flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center mb-2">
                  <svg className="w-7 h-7 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-800">{formatNumber(analyticsData.metrics.posts)}</div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>

              {/* Likes */}
              <div className="bg-gray-50 rounded-md p-3 flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center mb-2">
                  <svg className="w-7 h-7 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-800">{formatNumber(analyticsData.metrics.likes)}</div>
                <div className="text-sm text-gray-500">Likes</div>
              </div>

              {/* Followers */}
              <div className="bg-gray-50 rounded-md p-3 flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center mb-2">
                  <svg className="w-7 h-7 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-800">{formatNumber(analyticsData.metrics.followers)}</div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>

              {/* Engagements */}
              <div className="bg-gray-50 rounded-md p-3 flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center mb-2">
                  <svg className="w-7 h-7 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5A1.5,1.5 0 0,1 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5Z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-800">{formatNumber(analyticsData.metrics.engagements)}</div>
                <div className="text-sm text-gray-500">Engagements</div>
              </div>

              {/* Audience Growth */}
              <div className="bg-gray-50 rounded-md p-3 flex flex-col items-center">
                <div className="w-10 h-10 flex items-center justify-center mb-2">
                  <svg className="w-7 h-7 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.5,18.49L9.5,12.48L13.5,16.48L22,6.92L20.59,5.5L13.5,13.48L9.5,9.48L2,16.99L3.5,18.49Z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-800">{formatNumber(analyticsData.metrics.audienceGrowth)}</div>
                <div className="text-sm text-gray-500">Audience Growth</div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No analytics data available. Please select an account.</p>
          </div>
        )}

        {/* Content based on active tab */}
        {!isLoading && analyticsData && (
          <>
            {activeTab === 'general' ? (
              // Most Liked Posts section
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Most Liked Posts</h2>
                <div className="border rounded-md overflow-hidden">
                  {analyticsData.topPosts.length > 0 ? (
                    analyticsData.topPosts.map(post => (
                      <div key={post.id} className="border-b last:border-b-0 p-4">
                        <div className="flex items-start space-x-3">
                          <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getPlatformColor(selectedAccount?.platform)}`}
                          >
                            {getPlatformInitial(selectedAccount?.platform)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <span className="font-medium text-gray-900">{selectedAccount?.name || 'Account'}</span>
                              <span className="mx-1 text-gray-500">•</span>
                              <span className="text-gray-500 text-sm">{post.date}</span>
                            </div>
                            <p className="text-gray-800 mb-2">{post.content}</p>
                            <div className="flex space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                                {post.likes} Likes
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                                {post.comments} Comments
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                </svg>
                                {post.shares} Shares
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      No top posts available for this account.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Posts tab - All posts
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-800">All Posts</h2>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-700 mr-2">Filter:</div>
                    <select 
                      className="text-sm border rounded-md px-2 py-1"
                      value={statusFilter}
                      onChange={(e) => {
                        const newStatus = e.target.value as 'all' | 'published' | 'scheduled' | 'draft';
                        console.log('Changing status filter to:', newStatus);
                        setStatusFilter(newStatus);
                      }}
                    >
                      <option value="all">All Posts</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="draft">Drafts</option>
                    </select>
                    <div className="text-sm text-gray-500 ml-4">
                      {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
                    </div>
                  </div>
                </div>
                
                {filteredPosts.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    {filteredPosts.map(post => (
                      <div key={post.id} className="border-b last:border-b-0 p-4">
                        <div className="flex items-start space-x-3">
                          <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getPlatformColor(selectedAccount?.platform)}`}
                          >
                            {getPlatformInitial(selectedAccount?.platform)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <span className="font-medium text-gray-900">{selectedAccount?.name || 'Account'}</span>
                              <span className="mx-1 text-gray-500">•</span>
                              <span className="text-gray-500 text-sm">{post.date}</span>
                            </div>
                            <p className="text-gray-800 mb-2">{post.content}</p>
                            <div className="flex space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                                {post.likes} Likes
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                                {post.comments} Comments
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                </svg>
                                {post.shares} Shares
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border rounded-md p-6 text-center text-gray-500">
                    No posts available for this account.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyzeContent;