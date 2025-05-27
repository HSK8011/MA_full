import React, { useState } from 'react';
import { cn } from '../../../lib/utils';

export interface Comment {
  id: string;
  author: {
    name: string;
    profileImage?: string;
  };
  content: string;
  timeAgo: string;
}

export interface StoryPostProps {
  content: string;
  date: string;
  account: {
    name: string;
    profileImage: string;
    handle?: string;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  comments?: Comment[];
  className?: string;
  isExternal?: boolean;
  externalAccountName?: string;
  externalAccountImage?: string;
}

export const StoryPost: React.FC<StoryPostProps> = ({
  content,
  date,
  comments = [],
  className,
  isExternal = false,
  externalAccountName = '',
}) => {
  const [isComplete, setIsComplete] = useState(false);

  // Social media platforms for the post icons
  const socialPlatformIcons = [
    { name: 'facebook', color: 'bg-blue-600', textColor: 'text-white', id: 'fb' },
    { name: 'twitter', color: 'bg-blue-400', textColor: 'text-white', id: 'tw' },
    { name: 'instagram', color: 'bg-pink-500', textColor: 'text-white', id: 'ig' },
    { name: 'linkedin', color: 'bg-blue-700', textColor: 'text-white', id: 'ln' },
    { name: 'youtube', color: 'bg-red-600', textColor: 'text-white', id: 'yt' },
    { name: 'pinterest', color: 'bg-red-500', textColor: 'text-white', id: 'pin' },
    { name: 'tiktok', color: 'bg-black', textColor: 'text-white', id: 'tt' },
    { name: 'snapchat', color: 'bg-yellow-400', textColor: 'text-black', id: 'sc' }
  ];

  // Helper function to render the author avatar
  const renderAuthorAvatar = (comment: Comment) => {
    if (isExternal) {
      return (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
          <span className="text-gray-600 font-medium">C</span>
        </div>
      );
    }
    
    if (comment.author.profileImage) {
      return (
        <img 
          src={comment.author.profileImage} 
          alt={comment.author.name}
          className="w-10 h-10 rounded-full"
        />
      );
    }
    
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
        <span className="text-gray-600 font-medium">
          {comment.author.name[0]}
        </span>
      </div>
    );
  };

  return (
    <div className={cn("border border-gray-200 rounded-lg overflow-hidden bg-white", className)}>
      {/* Post Header */}
      <div className="p-4 bg-blue-50">
        <div className="flex items-start space-x-3">
          {!isExternal ? (
            <img
              src="/images/page2/person.png"
              alt="Person"
              className="w-12 h-12 rounded-md object-cover"
            />
          ) : (
            <div className="flex-shrink-0 grid grid-cols-4 gap-0.5 w-10 h-10">
              {socialPlatformIcons.slice(0, 16).map((platform) => (
                <div
                  key={platform.id}
                  className={cn("flex items-center justify-center", platform.color, platform.textColor, "text-[6px]")}
                >
                  {platform.name[0].toUpperCase()}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex-1">
            <div className="text-lg font-medium text-gray-900 mb-1">{content}</div>
            <div className="text-sm text-gray-500 mb-3">{date}</div>
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="">
        {comments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {comments.map((comment) => (
              <div key={comment.id} className="p-5 bg-gray-50">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    {renderAuthorAvatar(comment)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{isExternal ? externalAccountName : comment.author.name}</h4>
                      <p className="text-xs text-gray-500">{comment.timeAgo}</p>
                    </div>
                    <p className="text-sm text-gray-800 mb-3">{comment.content}</p>
                    
                    {/* Comment Actions */}
                    <div className="flex flex-wrap space-x-4 text-sm text-gray-500">
                      <button className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        <span>Reply</span>
                      </button>
                      
                      <button className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>Like</span>
                      </button>
                      
                      <button className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Message</span>
                      </button>
                      
                      <button className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>Tag</span>
                      </button>
                      
                      <button className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                      
                      <button className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Assign</span>
                      </button>
                    </div>
                    
                    {/* Reply input field for this comment */}
                    <div className="mt-4">
                      <div className="flex items-center border rounded-md overflow-hidden bg-white">
                        <input
                          type="text"
                          placeholder={`@${isExternal ? externalAccountName : comment.author.name}`}
                          className="flex-grow border-none p-2 focus:outline-none text-sm"
                        />
                        <button className="px-4 py-2 bg-blue-50 text-blue-500 font-medium text-sm whitespace-nowrap">
                          Send
                        </button>
                      </div>
                      
                      {/* Additional Reply Controls - Emoji, Location, Media, Hashtag */}
                      <div className="flex mt-2 px-2 text-gray-400">
                        <button className="p-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="p-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="p-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="p-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm bg-gray-50">
            <p>There are no comments on this post yet</p>
            <p className="mt-1 text-blue-500 hover:text-blue-600 cursor-pointer">
              Check with next post ▶
            </p>
          </div>
        )}
        
        {/* Mark as complete checkbox */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isComplete}
              onChange={() => setIsComplete(!isComplete)}
              className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Mark is complete</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default StoryPost; 