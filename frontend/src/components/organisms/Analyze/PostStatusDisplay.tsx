import React from 'react';
import type { TopPost } from '../../../services/analyticsService';

interface PostStatusDisplayProps {
  post: TopPost;
}

/**
 * Component to display post status badges and appropriate metrics based on post status
 */
export const PostStatusDisplay: React.FC<PostStatusDisplayProps> = ({ post }) => {
  // Get status badge styling
  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-50 text-green-700';
      case 'scheduled':
        return 'bg-blue-50 text-blue-700';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Status badge */}
      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(post.status)}`}>
        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
      </span>
      
      {/* Show metrics only for published posts */}
      {post.status === 'published' ? (
        <div className="flex space-x-4 text-sm text-gray-500 mt-2">
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
      ) : (
        <div className="text-sm text-gray-500 italic mt-2">
          {post.status === 'scheduled' ? 
            'Metrics will be available after publishing' : 
            'Draft post - no metrics available'}
        </div>
      )}
    </>
  );
};

export default PostStatusDisplay;
