import React from 'react';
import { cn } from '../../../lib/utils';

interface RecentEngagementProps {
  className?: string;
}

export const RecentEngagement: React.FC<RecentEngagementProps> = ({ className }) => {
  const engagements = [
    {
      id: 1,
      user: 'clikitksolutions',
      action: 'commented on tweet',
      date: '23 July 2022, 12:30 PM',
      avatar: '/images/page2/user.png',
    },
    {
      id: 2,
      user: 'clikitksolutions',
      action: 'commented on tweet',
      date: '23 July 2022, 12:30 PM',
      avatar: '/images/page2/user.png',
    },
    {
      id: 3,
      user: 'clikitksolutions',
      action: 'commented on tweet',
      date: '23 July 2022, 12:30 PM',
      avatar: '/images/page2/user.png',
    },
    {
      id: 4,
      user: 'clikitksolutions',
      action: 'commented on tweet',
      date: '23 July 2022, 12:30 PM',
      avatar: '/images/page2/user.png',
    },
  ];

  return (
    <div className={cn("bg-white rounded-lg shadow-sm p-6 flex flex-col h-full", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800">Recent Engagement</h2>
      </div>
      
      {/* Scrollable content area */}
      <div className="overflow-y-auto flex-1 mb-4 pr-1 -mr-1" style={{ maxHeight: "calc(100% - 90px)" }}>
        <div className="space-y-5">
          {engagements.map((engagement) => (
            <div key={engagement.id} className="flex items-start">
              <img 
                src={engagement.avatar} 
                alt={engagement.user} 
                className="w-8 h-8 rounded-full mr-4"
              />
              <div>
                <p className="text-sm">
                  <span className="text-blue-600 font-medium">{engagement.user}</span>
                  <span className="text-gray-700"> {engagement.action}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{engagement.date}</p>
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
          aria-label="View more engagements"
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

export default RecentEngagement; 