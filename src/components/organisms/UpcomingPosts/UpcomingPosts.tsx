import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import dashboardService from '../../../services/dashboardService';
import type { UpcomingPost } from '../../../services/dashboardService';
import { toast } from 'react-hot-toast';

interface UpcomingPostsProps {
  className?: string;
}

export const UpcomingPosts: React.FC<UpcomingPostsProps> = ({ className }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [posts, setPosts] = useState<UpcomingPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingPosts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const dashboardData = await dashboardService.getDashboardData();
        console.log('Dashboard data received:', dashboardData);
        console.log('Upcoming posts received:', dashboardData.upcomingPosts);
        setPosts(dashboardData.upcomingPosts);
      } catch (err) {
        console.error('Failed to fetch upcoming posts:', err);
        setError('Failed to load upcoming posts');
        toast.error('Failed to load upcoming posts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUpcomingPosts();
  }, []);

  const toggleDropdown = (postId: string, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent closing from document click
    }
    setActiveDropdown(activeDropdown === postId ? null : postId);
  };

  // Close dropdown when clicking outside
  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  // Handle edit post
  const handleEditPost = (postId: string) => {
    // Implementation for editing a post
    console.log(`Editing post with ID: ${postId}`);
    closeDropdown();
  };

  // Handle view post
  const handleViewPost = (postId: string) => {
    // Implementation for viewing a post
    console.log(`Viewing post with ID: ${postId}`);
    closeDropdown();
  };

  // Handle delete post
  const handleDeletePost = (postId: string) => {
    // Implementation for deleting a post
    console.log(`Deleting post with ID: ${postId}`);
    setPosts(posts.filter(post => post.id !== postId));
    closeDropdown();
  };

  // Handle view more posts
  const handleViewMore = () => {
    // Implementation for viewing more posts
    console.log('Loading more posts...');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, postId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleDropdown(postId, e);
    } else if (e.key === 'Escape' && activeDropdown === postId) {
      closeDropdown();
    }
  };

  React.useEffect(() => {
    const handleClickOutside = () => {
      if (activeDropdown !== null) {
        closeDropdown();
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeDropdown]);

  return (
    <div className={cn("bg-white rounded-lg shadow-sm p-6 flex flex-col h-full", className)}>
      <div className="flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h2 className="text-lg font-medium text-gray-800">Upcoming Posts</h2>
            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-medium leading-none text-blue-600 bg-blue-100 rounded-full">
              Scheduled
            </span>
          </div>
        </div>
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto pr-1 -mr-1" style={{ minHeight: '200px' }}>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-blue-500 underline text-sm"
            >
              Try again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No upcoming posts found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="flex items-center flex-1">
                    <div className="relative mr-3">
                      <img 
                        src={post.companyIcon} 
                        alt={post.company} 
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.company)}&background=random`;
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                        <img 
                          src={post.platformIcon}
                          alt={post.platform}
                          className="w-3 h-3"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzFEQTFGMiIgZD0iTTIzLjk1MyA0LjU3YTEwIDEwIDAgMDEtMi44MjUuNzc1IDQuOTU4IDQuOTU4IDAgMDAyLjE2My0yLjcyM2MtLjk1MS41NTUtMi4wMDUuOTU5LTMuMTI3IDEuMTg0YTQuOTIgNC45MiAwIDAwLTguMzg0IDQuNDgyQzcuNjkgOC4wOTUgNC4wNjcgNi4xMyAxLjY0IDMuMTYyYTQuODIyIDQuODIyIDAgMDAtLjY2NiAyLjQ3NWMwIDEuNzEuODcgMy4yMTMgMi4xODggNC4wOTZhNC45MDQgNC45MDQgMCAwMS0yLjIyOC0uNjE2di4wNmE0LjkyMyA0LjkyMyAwIDAwMy45NDYgNC44MjcgNC45OTYgNC45OTYgMCAwMS0yLjIxMi4wODUgNC45MzYgNC45MzYgMCAwMDQuNjA0IDMuNDE3IDkuODY3IDkuODY3IDAgMDEtNi4xMDIgMi4xMDVjLS4zOSAwLS43NzktLjAyMy0xLjE3LS4wNjdhMTMuOTk1IDEzLjk5NSAwIDAwNy41NTcgMi4yMDljOS4wNTMgMCAxMy45OTgtNy40OTYgMTMuOTk4LTEzLjk4NSAwLS4yMSAwLS40Mi0uMDE1LS42M0E5LjkzNSA5LjkzNSAwIDAwMjQgNC41OXoiLz48L3N2Zz4=`;
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{post.company}</p>
                      <p className="text-xs text-gray-500">{post.companyHandle}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      onClick={(e) => toggleDropdown(post.id, e)}
                      onKeyDown={(e) => handleKeyDown(e, post.id)}
                      aria-haspopup="true"
                      aria-expanded={activeDropdown === post.id}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    
                    {activeDropdown === post.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleEditPost(post.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleViewPost(post.id)}
                        >
                          View
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="py-2">
                  <p className="text-sm text-gray-700">{post.content}</p>
                </div>
                
                <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{post.date}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium leading-none text-blue-600 bg-blue-100 rounded-full">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Scheduled
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Fixed footer with View More button */}
      <div className="flex-shrink-0 pt-4 border-t border-gray-100">
        <button 
          className="text-blue-600 text-sm font-medium flex items-center justify-center mx-auto hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
          onClick={handleViewMore}
          aria-label="View more upcoming posts"
        >
          View More
          <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UpcomingPosts; 