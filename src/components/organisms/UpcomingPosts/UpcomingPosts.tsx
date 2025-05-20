import React, { useState } from 'react';
import { cn } from '../../../lib/utils';

interface UpcomingPostsProps {
  className?: string;
}

// Post data interface
interface Post {
  id: number;
  company: string;
  companyHandle: string;
  companyIcon: string;
  date: string;
  platform: string;
  platformIcon: string;
  content: string;
}

export const UpcomingPosts: React.FC<UpcomingPostsProps> = ({ className }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      company: 'AIMDek Technologies',
      companyHandle: '@aimdektech',
      companyIcon: '/images/page2/user.png',
      date: 'Mon, Sep 27 2021 3:53 pm',
      platform: 'twitter',
      platformIcon: '/images/page3/twitter@3x.png',
      content: 'Data and Creativity 💡 The dynamic duo that your marketing strategy. Discover how they go hand-in-hand when it comes to campaign. Go hand-in-hand when it comes to campaign.',
    },
    {
      id: 2,
      company: 'Claris Technologies',
      companyHandle: '@claristech',
      companyIcon: '/images/page2/company.png',
      date: 'Mon, Sep 27 2021 3:53 pm',
      platform: 'twitter',
      platformIcon: '/images/page3/twitter@3x.png',
      content: 'Data and Creativity 💡 The dynamic duo that your marketing strategy. Discover how they go hand-in-hand when it comes to campaign. Go hand-in-hand when it comes to campaign.',
    },
    {
      id: 3,
      company: 'TUDU',
      companyHandle: '@tudu',
      companyIcon: '/images/page2/company.png',
      date: 'Mon, Sep 27 2021 3:53 pm',
      platform: 'twitter',
      platformIcon: '/images/page3/twitter@3x.png',
      content: 'Data and Creativity 💡 The dynamic duo that your marketing strategy. Discover how they go hand-in-hand when it comes to campaign. Go hand-in-hand when it comes to campaign.',
    },
    {
      id: 4,
      company: 'CloudCRM24x7',
      companyHandle: '@cloudcrm247',
      companyIcon: '/images/page2/company.png',
      date: 'Mon, Sep 27 2021 3:53 pm',
      platform: 'twitter',
      platformIcon: '/images/page3/twitter@3x.png',
      content: 'Data and Creativity 💡 The dynamic duo that your marketing strategy. Discover how they go hand-in-hand when it comes to campaign. Go hand-in-hand when it comes to campaign.',
    }
  ]);

  const toggleDropdown = (postId: number, e?: React.MouseEvent | React.KeyboardEvent) => {
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
  const handleEditPost = (postId: number) => {
    // Implementation for editing a post
    console.log(`Editing post with ID: ${postId}`);
    closeDropdown();
  };

  // Handle view post
  const handleViewPost = (postId: number) => {
    // Implementation for viewing a post
    console.log(`Viewing post with ID: ${postId}`);
    closeDropdown();
  };

  // Handle delete post
  const handleDeletePost = (postId: number) => {
    // Implementation for deleting a post
    console.log(`Deleting post with ID: ${postId}`);
    setPosts(posts.filter(post => post.id !== postId));
    closeDropdown();
  };

  // Handle view more posts
  const handleViewMore = () => {
    // Implementation for viewing more posts
    console.log('Loading more posts...');
    // This would typically fetch more posts from an API
  };

  // Handle keyboard navigation for dropdown
  const handleKeyDown = (e: React.KeyboardEvent, postId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleDropdown(postId, e);
    } else if (e.key === 'Escape' && activeDropdown === postId) {
      closeDropdown();
    }
  };

  React.useEffect(() => {
    // Add global click event to close dropdown when clicking outside
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  return (
    <div className={cn("bg-white rounded-lg shadow-sm p-6 flex flex-col h-full", className)}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img
            src="/images/page2/queue.png"
            alt=""
            className="w-5 h-5 mr-2 text-blue-600"
          />
          <h2 className="text-lg font-medium text-gray-800">Upcoming Posts</h2>
        </div>
      </div>
      
      {/* Scrollable content area */}
      <div className="overflow-y-auto flex-1 mb-4 pr-1 -mr-1" style={{ maxHeight: "calc(100% - 90px)" }}>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="relative border border-gray-200 rounded-lg p-4">
              {/* Three-dot menu button */}
              <div className="absolute right-4 top-4">
                <button 
                  className="p-1 hover:bg-gray-100 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent closing from document click
                    toggleDropdown(post.id);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, post.id)}
                  aria-label="Post options"
                  aria-expanded={activeDropdown === post.id}
                  aria-haspopup="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {activeDropdown === post.id && (
                  <div 
                    className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg py-1 z-10"
                    onClick={(e) => e.stopPropagation()} // Prevent closing from document click
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="post-options-menu"
                    tabIndex={0} // Make the menu focusable
                    onKeyDown={(e) => { // Add keyboard listener
                      if (e.key === 'Escape') {
                        closeDropdown();
                      }
                    }}
                  >
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleEditPost(post.id)}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <img 
                        src="/images/page2/edit.png" 
                        alt="Edit" 
                        className="w-4 h-4 mr-3" 
                      />
                      Edit
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleViewPost(post.id)}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <img 
                        src="/images/page2/view.png" 
                        alt="View" 
                        className="w-4 h-4 mr-3" 
                      />
                      View
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      onClick={() => handleDeletePost(post.id)}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <img 
                        src="/images/page2/delete.png" 
                        alt="Delete" 
                        className="w-4 h-4 mr-3" 
                      />
                      Delete
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center mb-3">
                <div className="flex items-center flex-1">
                  <div className="relative mr-3">
                    <img 
                      src={post.companyIcon} 
                      alt={post.company} 
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <img 
                        src={post.platformIcon}
                        alt={post.platform}
                        className="w-3 h-3"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{post.company}</p>
                    <p className="text-xs text-gray-500">{post.companyHandle}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 mr-8">{post.date}</span>
              </div>
              
              <div className="py-2">
                <p className="text-sm text-gray-700">{post.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Fixed footer with View More button */}
      <div className="mt-auto pt-2 border-t border-gray-100">
        <button 
          className="text-blue-600 text-sm font-medium flex items-center justify-center mx-auto hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
          onClick={handleViewMore}
          aria-label="View more upcoming posts"
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

export default UpcomingPosts; 