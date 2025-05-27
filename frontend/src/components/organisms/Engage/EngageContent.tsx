import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { StoryPost } from '../../molecules/StoryPost';
import type { Comment } from '../../molecules/StoryPost';

interface EngageContentProps {
  className?: string;
}

interface SocialPost {
  id: string;
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
  isExternal?: boolean;
  externalAccountName?: string;
  externalAccountImage?: string;
  timeAgo?: string;
  comments?: Comment[];
}

export const EngageContent: React.FC<EngageContentProps> = ({ className }) => {
  // Current selected account
  const [selectedAccount] = useState({
    id: 'acc_123456',
    name: 'AIMDek Technologies',
    handle: '@aimdektech',
    profileImage: '/images/page2/aimdek-logo.png'
  });

  // Demo posts data
  const [posts] = useState<SocialPost[]>([
    {
      id: 'post_1',
      content: 'Data and Creativity 🧡 The dynamic duo that your marketing strategy needs. Discover how they go hand-in-hand when it comes to campaign success.',
      date: 'Mon, Sep 27, 2021 3:53 pm',
      account: {
        name: 'AIMDek Technologies',
        profileImage: '/images/page2/aimdek-logo.png',
      },
      engagement: {
        likes: 120,
        comments: 45,
        shares: 67
      },
      comments: [
        {
          id: 'comment_1',
          author: {
            name: 'John Doe',
            profileImage: '/images/avatars/john.png'
          },
          content: 'Great post! I love how you highlighted the synergy between data and creativity.',
          timeAgo: '2d'
        },
        {
          id: 'comment_2',
          author: {
            name: 'Emily Clark',
            profileImage: '/images/avatars/emily.png'
          },
          content: 'This is exactly what our team has been focusing on lately. Would love to hear more about specific case studies.',
          timeAgo: '1d'
        }
      ]
    },
    {
      id: 'post_2',
      content: 'Discover how they go hand-in-hand when it comes to campaign success. Data and Creativity 🧡 The dynamic duo that your marketing strategy needs.',
      date: 'Mon, Sep 27, 2021 3:53 pm',
      account: {
        name: 'AIMDek Technologies',
        profileImage: '/images/page2/aimdek-logo.png',
      },
      engagement: {
        likes: 95,
        comments: 38,
        shares: 52
      },
      comments: [
        {
          id: 'comment_3',
          author: {
            name: 'Sarah Johnson',
            profileImage: '/images/avatars/sarah.png'
          },
          content: 'I appreciate how you frame this as a partnership rather than an either/or approach.',
          timeAgo: '5h'
        }
      ]
    },
    {
      id: 'post_3',
      content: 'Data and Creativity 🧡 The dynamic duo that your marketing strategy needs. Discover how they go hand-in-hand when it comes to campaign success.',
      date: 'Mon, Sep 27, 2021 3:53 pm',
      account: {
        name: 'AIMDek Technologies',
        profileImage: '/images/page2/aimdek-logo.png',
      },
      engagement: {
        likes: 82,
        comments: 33,
        shares: 41
      },
      comments: []
    },
    {
      id: 'post_4',
      isExternal: true,
      externalAccountName: 'cliniktsolutions',
      externalAccountImage: '/images/page2/account-c.png',
      timeAgo: '46w',
      content: 'Loving your posts! They\'re just our style. Check out our IG as well for more tech tips, tricks and highlights about what our superheroes are bringing to you next!',
      date: 'Mon, Sep 27, 2021 3:53 pm',
      account: {
        name: 'AIMDek Technologies',
        profileImage: '/images/page2/aimdek-logo.png',
      },
      engagement: {
        likes: 72,
        comments: 15,
        shares: 8
      },
      comments: [
        {
          id: 'comment_4',
          author: {
            name: 'Michael Stone',
            profileImage: '/images/avatars/michael.png'
          },
          content: 'Love the collaboration! Your content is always top-notch.',
          timeAgo: '3w'
        }
      ]
    },
    {
      id: 'post_5',
      content: 'Data and Creativity 🧡 The dynamic duo that your marketing strategy needs. Discover how they go hand-in-hand when it comes to campaign success.',
      date: 'Mon, Sep 27, 2021 3:53 pm',
      account: {
        name: 'AIMDek Technologies',
        profileImage: '/images/page2/aimdek-logo.png',
      },
      engagement: {
        likes: 56,
        comments: 12,
        shares: 23
      },
      comments: []
    }
  ]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<string>(posts[0].id);

  // Get the selected post
  const selectedPost = posts.find(post => post.id === selectedPostId) ?? posts[0];

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

  return (
    <div className={cn("bg-white rounded-lg shadow-sm", className)}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Engage</h1>
        
        {/* Account Selector and Filters */}
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-2">Select a social media account</div>
          
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            {/* Account Dropdown */}
            <div className="relative w-full lg:w-64">
              <div className="flex items-center border border-gray-300 rounded-md p-2 bg-white">
                <img 
                  src={selectedAccount.profileImage} 
                  alt={selectedAccount.name}
                  className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                />
                <select 
                  className="appearance-none bg-transparent w-full outline-none text-gray-800"
                  defaultValue={selectedAccount.id}
                >
                  <option value={selectedAccount.id}>{selectedAccount.name}</option>
                  <option value="acc_789012">AIMDek Marketing</option>
                </select>
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search Keyword"
                className="w-full border border-gray-300 rounded-md p-2 pl-9 pr-4"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchKeyword && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchKeyword('')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Tags Filter */}
            <div className="relative lg:w-48">
              <button className="flex items-center justify-between w-full border border-gray-300 rounded-md p-2 bg-white">
                <span className="text-gray-500">Tags</span>
                <svg className="w-5 h-5 text-gray-500 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Additional Filters */}
          <div className="flex justify-between mt-4">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 border border-gray-300 rounded-md p-2 bg-white">
                <span className="text-gray-500 text-sm">Filter By Type</span>
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>
            <button className="px-2 py-1 bg-white border border-gray-300 rounded-md">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Two-column Layout: Posts List and Selected Post */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Posts List */}
          <div className="space-y-4 lg:border-r lg:pr-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Posts</h2>
            
            {/* List of Posts */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {posts.map((post) => (
                <button 
                  key={post.id} 
                  className={cn(
                    "border border-gray-200 rounded-lg p-4 cursor-pointer transition-all w-full text-left",
                    selectedPostId === post.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-300 hover:bg-gray-50"
                  )}
                  onClick={() => setSelectedPostId(post.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedPostId(post.id);
                    }
                  }}
                  aria-label={`Select post: ${post.content.substring(0, 50)}...`}
                >
                  <div className="flex items-start space-x-3">
                    {/* If it's an external post, show external account info */}
                    {post.isExternal ? (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <div className="text-xl font-bold text-gray-600">
                          {post.externalAccountImage ? (
                            <img 
                              src={post.externalAccountImage} 
                              alt={post.externalAccountName ?? 'Profile'} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            post.externalAccountName?.[0]?.toUpperCase() ?? 'C'
                          )}
                        </div>
                      </div>
                    ) : (
                      // Regular post with platform icons grid
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
                      {post.isExternal ? (
                        // External post content in list
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium text-gray-900">{post.externalAccountName}</div>
                            <div className="text-xs text-gray-500">{post.timeAgo}</div>
                          </div>
                          <p className="text-gray-800 mb-1 line-clamp-2">{post.content}</p>
                          <div className="text-xs text-gray-500">
                            {post.comments?.length ?? 0} comments • {post.engagement.likes} likes
                          </div>
                        </div>
                      ) : (
                        // Regular post content in list
                        <div>
                          <div className="font-medium text-gray-900 mb-1 line-clamp-2">{post.content}</div>
                          <div className="text-xs text-gray-500 mb-1">{post.date}</div>
                          <div className="text-xs text-gray-500">
                            {post.comments?.length ?? 0} comments • {post.engagement.likes} likes • {post.engagement.shares} shares
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Right Column: Selected Post with Comments */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Post Details</h2>
            
            {/* Selected Post */}
            {selectedPost && (
              <StoryPost 
                content={selectedPost.content}
                date={selectedPost.date}
                account={selectedPost.account}
                engagement={selectedPost.engagement}
                comments={selectedPost.comments}
                className="mb-4"
                isExternal={selectedPost.isExternal}
                externalAccountName={selectedPost.externalAccountName}
                externalAccountImage={selectedPost.externalAccountImage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngageContent; 