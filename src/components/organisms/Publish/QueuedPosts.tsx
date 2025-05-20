import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';

type Post = {
  id: string;
  time: string;
  platform: string;
  platformIcon: string;
  content: string;
  image?: string;
  date?: string; // For weekly/monthly view
};

interface QueuedPostsProps {
  className?: string;
}

export const QueuedPosts: React.FC<QueuedPostsProps> = ({ className }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2022, 7, 8)); // August 8, 2022
  const [dateRange, setDateRange] = useState<string>('August 2022');
  
  // Set date range whenever view mode or current date changes
  useEffect(() => {
    if (viewMode === 'day') {
      setDateRange(formatDate(currentDate));
    } else if (viewMode === 'week') {
      // Calculate week range (Sunday to Saturday)
      const firstDay = new Date(currentDate);
      const day = firstDay.getDay();
      const diff = firstDay.getDate() - day;
      firstDay.setDate(diff);
      
      const lastDay = new Date(firstDay);
      lastDay.setDate(lastDay.getDate() + 6);
      
      const firstFormat = firstDay.getDate().toString().padStart(2, '0') + ' ' + 
        firstDay.toLocaleString('default', { month: 'short' }) + ' ' + 
        firstDay.getFullYear();
      
      const lastFormat = lastDay.getDate().toString().padStart(2, '0') + ' ' + 
        lastDay.toLocaleString('default', { month: 'short' }) + ' ' + 
        lastDay.getFullYear();
      
      setDateRange(`${firstFormat} - ${lastFormat}`);
    } else if (viewMode === 'month') {
      // Set month range
      const monthName = currentDate.toLocaleString('default', { month: 'long' });
      const year = currentDate.getFullYear();
      setDateRange(`${monthName} ${year}`);
    }
  }, [viewMode, currentDate]);

  // Mock data for demonstration
  const posts: Post[] = [
    {
      id: '1',
      time: '08:00 am',
      platform: 'facebook',
      platformIcon: '/images/platforms/facebook-icon.png',
      content: 'Enjoying holidays with AIMDek Family',
      image: '/images/platforms/holiday-post-1.jpg',
      date: '08' // Monday
    },
    {
      id: '2',
      time: '08:30 am',
      platform: 'twitter',
      platformIcon: '/images/platforms/twitter-icon.png',
      content: 'Enjoying holidays with AIMDek Family',
      image: '/images/platforms/holiday-post-2.jpg',
      date: '08' // Monday
    },
    {
      id: '3',
      time: '09:10 am',
      platform: 'instagram',
      platformIcon: '/images/platforms/instagram-icon.png',
      content: 'Enjoying holidays with AIMDek Family',
      image: '/images/platforms/holiday-post-3.jpg',
      date: '08' // Monday
    },
    {
      id: '4',
      time: '09:10 am',
      platform: 'instagram',
      platformIcon: '/images/platforms/instagram-icon.png',
      content: 'Enjoying holidays with AIMDek Family',
      image: '/images/platforms/holiday-post-2.jpg',
      date: '09' // Tuesday
    }
  ];

  // Format date as "Today, DD MMM YYYY"
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return `Today, ${formattedDate}`;
  };

  // Group posts by hour
  const timeSlots = [
    '08:00 am', '09:00 am', '10:00 am', '11:00 am', 
    '12:00 pm', '01:00 pm', '02:00 pm', '03:00 pm',
    '04:00 pm', '05:00 pm', '06:00 pm', '07:00 pm'
  ];

  // Weekly view days
  const weekDays = [
    { name: 'Sunday', date: '07' },
    { name: 'Monday', date: '08' },
    { name: 'Tuesday', date: '09' },
    { name: 'Wednesday', date: '10' },
    { name: 'Thursday', date: '11' },
    { name: 'Friday', date: '12' },
    { name: 'Saturday', date: '13' }
  ];

  // Navigate to previous or next day/week/month
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'day') {
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 1);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
    } else if (viewMode === 'week') {
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
    } else {
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
    }
    
    setCurrentDate(newDate);
  };

  // Group posts by exact time (not just hour)
  const getPostsForTimeSlot = (timeSlot: string) => {
    const timePrefix = timeSlot.split(':')[0];
    const amPm = timeSlot.includes('am') ? 'am' : 'pm';
    return posts.filter(post => 
      post.time.startsWith(timePrefix) && 
      post.time.includes(amPm)
    );
  };

  // Get posts for a specific day in week view
  const getPostsForDay = (date: string) => {
    return posts.filter(post => post.date === date);
  };

  // Get post sub-groups by exact time
  const getPostSubGroups = (timeSlot: string) => {
    const postsInTimeSlot = getPostsForTimeSlot(timeSlot);
    const subGroups: Record<string, Post[]> = {};
    
    postsInTimeSlot.forEach(post => {
      if (!subGroups[post.time]) {
        subGroups[post.time] = [];
      }
      subGroups[post.time].push(post);
    });
    
    return Object.entries(subGroups).sort((a, b) => {
      // Sort by time
      return a[0].localeCompare(b[0]);
    });
  };

  // Get platform color for styling
  const getPlatformColor = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return 'bg-blue-500';
      case 'twitter':
        return 'bg-sky-400';
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500';
      case 'linkedin':
        return 'bg-blue-700';
      default:
        return 'bg-gray-200';
    }
  };

  // Get platform icon as a reusable function
  const getPlatformIcon = (platform: string): React.ReactElement => {
    // For simplicity we're using letters, but you can use actual SVG icons
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">f</div>;
      case 'twitter':
        return <div className="w-5 h-5 bg-sky-400 rounded-sm flex items-center justify-center text-white text-xs font-bold">t</div>;
      case 'instagram':
        return <div className="w-5 h-5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">i</div>;
      default:
        return <div className="w-5 h-5 bg-gray-400 rounded-sm flex items-center justify-center text-white text-xs font-bold">?</div>;
    }
  };

  // Render a post card - reusable component for both weekly and monthly views
  const renderPostCard = (post: Post, isMonthView: boolean = false) => (
    <div 
      key={post.id} 
      className={cn(
        "border border-gray-200 rounded shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow",
        isMonthView ? "p-1 mb-1" : "p-2"
      )}
      onClick={() => navigate(`/publish/queue-times?postId=${post.id}`)}
    >
      <div className="flex items-center mb-1">
        {getPlatformIcon(post.platform)}
        <span className={cn("text-xs text-gray-500", isMonthView ? "ml-1" : "ml-2")}>
          {post.time}
        </span>
      </div>
      <div className="text-xs text-gray-800 truncate">
        {post.content}
      </div>
    </div>
  );

  // Custom handler for view mode change
  const handleViewModeChange = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
  };

  // Add CSS classes for custom scrollbars
  const scrollableAreaClass = "flex-grow overflow-auto custom-scrollbar";
  
  // New class for horizontal scrolling on small devices
  const horizontalScrollClass = "overflow-x-auto pb-2";

  // Render Day View
  const renderDayView = () => {
    return (
      <div className="overflow-auto">
        {timeSlots.map((timeSlot) => {
          const subGroups = getPostSubGroups(timeSlot);
          const hasContent = subGroups.length > 0;
          
          return (
            <div key={timeSlot} className="mb-6">
              <div className="text-gray-500 font-medium text-sm mb-2">
                {timeSlot}
              </div>
              
              {hasContent ? (
                <div className="ml-8 border-l-2 border-gray-200 pl-4">
                  {subGroups.map(([exactTime, timePosts]: [string, Post[]]) => (
                    <div key={exactTime} className="mb-4">
                      <div className="text-sm text-gray-600 font-medium mb-2">
                        {exactTime}
                      </div>
                      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
                        {timePosts.map((post: Post) => (
                          <div 
                            key={post.id} 
                            className="bg-white border border-gray-200 rounded-lg p-4 flex-shrink-0 w-full sm:w-80"
                          >
                            <div className="flex items-center mb-2">
                              <div className={`w-6 h-6 rounded-sm flex items-center justify-center mr-2 ${getPlatformColor(post.platform)}`}>
                                <span className="text-white text-xs font-bold">
                                  {post.platform.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-sm text-gray-600 font-medium">
                                {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                              </span>
                            </div>
                            <p className="text-gray-800 mb-2">{post.content}</p>
                            {post.image && (
                              <div className="rounded-md overflow-hidden">
                                <img 
                                  src={post.image} 
                                  alt="Post media" 
                                  className="w-full h-auto max-h-48 object-cover"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ml-8 border-l-2 border-gray-200 pl-4 h-8" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render Week View
  const renderWeekView = () => {
    return (
      <div className="w-full">
        {/* Calendar grid with horizontal scroll on small screens */}
        <div className={`border border-gray-200 rounded-lg ${horizontalScrollClass}`}>
          <div className="min-w-[768px]"> {/* Minimum width to ensure proper display */}
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {weekDays.map((day) => (
                <div key={day.name} className="p-4 border-r border-gray-200 last:border-r-0 text-center">
                  <div className="text-gray-700 font-medium">{day.name}</div>
                </div>
              ))}
            </div>
            
            {/* Days content */}
            <div className="grid grid-cols-7 min-h-[500px]">
              {weekDays.map((day) => {
                const dayPosts = getPostsForDay(day.date);
                const hasMorePosts = dayPosts.length > 4;
                const displayPosts = hasMorePosts ? dayPosts.slice(0, 4) : dayPosts;
                
                return (
                  <div key={day.name} className="border-r border-gray-200 last:border-r-0 p-0 relative flex flex-col">
                    {/* Date number */}
                    <div className="text-center p-3 text-xl font-medium border-b border-gray-200">
                      {day.date}
                    </div>
                    
                    {/* "Create a Post" button centered */}
                    <div className="flex justify-center p-3">
                      <button 
                        className="flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 rounded-full px-2 py-1 text-xs"
                        aria-label="Create a post"
                        onClick={() => navigate('/publish/queue-times')}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create a Post
                      </button>
                    </div>
                    
                    {/* Posts for this day */}
                    <div className={`p-2 space-y-2 ${scrollableAreaClass}`}>
                      {displayPosts.map((post) => renderPostCard(post))}
                      
                      {/* Show "View All" instead of "+X more" */}
                      {hasMorePosts && (
                        <div 
                          className="text-xs text-blue-600 font-medium text-center mt-1 py-1 border border-blue-200 rounded bg-blue-50 cursor-pointer hover:bg-blue-100"
                          onClick={() => navigate(`/publish/queue-times?date=${day.date}`)}
                        >
                          View all {dayPosts.length} posts
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Month View 
  const renderMonthView = () => {
    // Generate dynamic calendar data for the current month
    const generateMonthCalendar = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // First day of the month
      const firstDay = new Date(year, month, 1);
      // Last day of the month
      const lastDay = new Date(year, month + 1, 0);
      
      // Get the day of week of the first day (0 = Sunday, 6 = Saturday)
      const firstDayOfWeek = firstDay.getDay();
      
      // Calculate the previous month's days that appear in this calendar
      const prevMonthDays = [];
      if (firstDayOfWeek > 0) {
        // Get the last day of the previous month
        const prevMonthLastDay = new Date(year, month, 0);
        const prevMonthLastDate = prevMonthLastDay.getDate();
        
        // Add days from previous month to fill the first week
        for (let i = 0; i < firstDayOfWeek; i++) {
          const date = prevMonthLastDate - firstDayOfWeek + i + 1;
          const prevMonth = month - 1 < 0 ? 11 : month - 1;
          const prevYear = month - 1 < 0 ? year - 1 : year;
          const monthName = new Date(prevYear, prevMonth, 1).toLocaleString('default', { month: 'short' });
          
          prevMonthDays.push({
            date: date.toString().padStart(2, '0'),
            month: monthName,
            year: prevYear,
            isCurrentMonth: false
          });
        }
      }
      
      // Current month days
      const currentMonthDays = [];
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'short' });
        currentMonthDays.push({
          date: i.toString().padStart(2, '0'),
          month: monthName,
          year,
          isCurrentMonth: true
        });
      }
      
      // Combine previous and current month days
      const allDays = [...prevMonthDays, ...currentMonthDays];
      
      // Calculate how many days we need from the next month to complete the grid
      const remainingCells = 35 - allDays.length; // We'll show 5 weeks (35 days)
      
      // Next month days
      const nextMonthDays = [];
      if (remainingCells > 0) {
        const nextMonth = month + 1 > 11 ? 0 : month + 1;
        const nextYear = month + 1 > 11 ? year + 1 : year;
        const monthName = new Date(nextYear, nextMonth, 1).toLocaleString('default', { month: 'short' });
        
        for (let i = 1; i <= remainingCells; i++) {
          nextMonthDays.push({
            date: i.toString().padStart(2, '0'),
            month: monthName,
            year: nextYear,
            isCurrentMonth: false
          });
        }
      }
      
      // Final calendar data
      return [...allDays, ...nextMonthDays];
    };
    
    const monthDays = generateMonthCalendar();
    const weekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Function to get posts for a specific day (mapped to our mock data for demo)
    const getPostsForMonthDay = (date: string) => {
      // For demo, only return posts for specific dates
      if (date === '08' || date === '09' || date === '31') {
        return posts.filter(post => post.date === date);
      }
      return [];
    };

    return (
      <div className="w-full">
        {/* Calendar grid with horizontal scroll on small screens */}
        <div className={`border border-gray-200 rounded-lg ${horizontalScrollClass}`}>
          <div className="min-w-[768px]"> {/* Minimum width to ensure proper display */}
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {weekNames.map((day) => (
                <div key={day} className="p-4 border-r border-gray-200 last:border-r-0 text-center">
                  <div className="text-gray-700 font-medium">{day}</div>
                </div>
              ))}
            </div>
            
            {/* Month grid - organized in weeks */}
            <div className="grid grid-cols-7">
              {monthDays.map((day, index) => {
                const dayPosts = getPostsForMonthDay(day.date);
                const showAllPosts = dayPosts.length <= 3;
                const hasMorePosts = dayPosts.length > 3;
                const displayPosts = showAllPosts ? dayPosts : dayPosts.slice(0, 3);
                
                return (
                  <div 
                    key={`${day.date}-${day.month}-${index}`} 
                    className={cn(
                      "border-r border-b border-gray-200 last:border-r-0 p-2 min-h-[150px] max-h-[200px] flex flex-col",
                      !day.isCurrentMonth && "bg-gray-50"
                    )}
                  >
                    {/* Date number and month if different from current */}
                    <div className="flex justify-between items-center mb-2">
                      <div className={cn(
                        "text-sm font-medium",
                        !day.isCurrentMonth && "text-gray-400"
                      )}>
                        {day.date}
                        {!day.isCurrentMonth && (
                          <span className="text-xs text-gray-400 ml-1">{day.month}</span>
                        )}
                      </div>
                      
                      {/* Add post button */}
                      <button 
                        className="flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 rounded-full w-5 h-5 text-xs"
                        aria-label="Create a post"
                        onClick={() => navigate('/publish/queue-times')}
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Posts for this day - displayed as cards with scrollable area */}
                    <div className={scrollableAreaClass}>
                      <div className="space-y-1 h-full">
                        {displayPosts.map((post) => renderPostCard(post, true))}
                        
                        {/* Show "View All" instead of "+X more" */}
                        {hasMorePosts && (
                          <div 
                            className="text-xs text-blue-600 font-medium text-center mt-1 py-1 border border-blue-200 rounded bg-blue-50 cursor-pointer hover:bg-blue-100"
                            onClick={() => navigate(`/publish/queue-times?date=${day.date}&month=${day.month}&year=${day.year}`)}
                          >
                            View all {dayPosts.length} posts
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-sm", className)}>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
            height: 4px; /* Add height for horizontal scrollbar */
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #aaa;
          }
        `}
      </style>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
            Queued Posts
          </h1>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={() => navigate('/publish/queue-times')}
          >
            Schedule Post
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex rounded-md overflow-hidden border border-gray-200">
            <button 
              className={cn(
                "px-4 py-2 text-sm font-medium", 
                viewMode === 'day' 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              )}
              onClick={() => handleViewModeChange('day')}
            >
              Day
            </button>
            <button 
              className={cn(
                "px-4 py-2 text-sm font-medium border-l border-gray-200", 
                viewMode === 'week' 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              )}
              onClick={() => handleViewModeChange('week')}
            >
              Week
            </button>
            <button 
              className={cn(
                "px-4 py-2 text-sm font-medium border-l border-gray-200", 
                viewMode === 'month' 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              )}
              onClick={() => handleViewModeChange('month')}
            >
              Month
            </button>
          </div>
          
          <div className="flex w-full sm:w-auto justify-between sm:justify-start gap-4">
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search by Social Profile"
                className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg 
                  className="h-5 w-5 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search by Tags"
                className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg 
                  className="h-5 w-5 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-6">
          <button 
            className="p-2 text-gray-500 hover:text-gray-700"
            onClick={() => navigateDate('prev')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-gray-700 font-medium mx-2">
            {viewMode === 'day' ? formatDate(currentDate) : dateRange}
          </span>
          <button 
            className="p-2 text-gray-500 hover:text-gray-700"
            onClick={() => navigateDate('next')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
      </div>
    </div>
  );
};

export default QueuedPosts; 