import React from 'react';
import { cn } from '../../../lib/utils';

interface RecentPostsProps {
  className?: string;
}

export const RecentPosts: React.FC<RecentPostsProps> = ({ className }) => {
  const posts = [
    {
      id: 1,
      company: 'AIMDek Technologies',
      companyHandle: '@aimdektech',
      companyIcon: '/images/page2/user.png',
      date: 'Mon, Sep 27 2021 3:53 pm',
      platform: 'twitter',
      platformIcon: '/images/page3/twitter@3x.png',
      content: 'Data and Creativity 💡 The dynamic duo that your marketing strategy. Discover how they go hand-in-hand when it comes to campaign. Go hand-in-hand when it comes to campaign.',
      stats: {
        retweets: 300,
        likes: 100,
        comments: 200,
        views: 125,
        shares: 400
      }
    },
    {
      id: 2,
      company: 'Claris Technologies',
      companyHandle: '@claristech',
      companyIcon: '/images/page2/company.png',
      date: 'Mon, Sep 27 2021 3:53 pm',
      platform: 'facebook',
      platformIcon: '/images/page3/facebook@3x.png',
      content: 'Data and Creativity 💡 The dynamic duo that your marketing strategy. Discover how they go hand-in-hand when it comes to campaign. Go hand-in-hand when it comes to campaign.',
      stats: {
        retweets: 100,
        likes: 200,
        comments: 200,
        views: 125,
        shares: 400
      }
    },
  ];

  return (
    <div className={cn("bg-white rounded-lg shadow-sm p-6 flex flex-col h-full", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800">Recent Posts</h2>
      </div>
      
      {/* Scrollable content area */}
      <div className="overflow-y-auto flex-1 mb-4 pr-1 -mr-1" style={{ maxHeight: "calc(100% - 90px)" }}>
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
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {post.stats.views}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {post.stats.shares}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
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