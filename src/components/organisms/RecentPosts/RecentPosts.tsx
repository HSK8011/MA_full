import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import dashboardService from '../../../services/dashboardService';
import type { RecentPost } from '../../../services/dashboardService';
import { toast } from 'react-hot-toast';

interface RecentPostsProps {
  className?: string;
}

export const RecentPosts: React.FC<RecentPostsProps> = ({ className }) => {
  const [posts, setPosts] = useState<RecentPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRecentPosts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const dashboardData = await dashboardService.getDashboardData();
        setPosts(dashboardData.recentPosts);
      } catch (err) {
        console.error('Failed to fetch recent posts:', err);
        setError('Failed to load recent posts');
        toast.error('Failed to load recent posts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentPosts();
  }, []);

  return (
    <div className={cn("bg-white rounded-lg shadow-sm p-6 flex flex-col h-full", className)}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-medium text-gray-800">Recent Posts</h2>
          <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-medium leading-none text-green-600 bg-green-100 rounded-full">
            Published
          </span>
        </div>
      </div>
      
      {/* Scrollable content area */}
      <div className="overflow-y-auto flex-1 mb-4 pr-1 -mr-1" style={{ maxHeight: "calc(100% - 90px)" }}>
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
            <p>No recent posts found</p>
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
                  <span className="text-xs text-gray-500">{post.date}</span>
                </div>
                
                <div className="py-2">
                  <p className="text-sm text-gray-700">{post.content}</p>
                </div>
                
                <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      {post.stats.retweets}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {post.stats.likes}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {post.stats.comments}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {post.stats.views}
                    </div>
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium leading-none text-green-600 bg-green-100 rounded-full">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Published
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Fixed footer with View More button */}
      <div className="mt-auto pt-2 border-t border-gray-100">
        <button 
          className="text-blue-600 text-sm font-medium flex items-center justify-center mx-auto hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
          onClick={() => {/* TODO: Implement view more functionality */}}
          aria-label="View more recent posts"
        >
          View More
          <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RecentPosts; 