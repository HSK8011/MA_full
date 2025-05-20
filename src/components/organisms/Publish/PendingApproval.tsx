import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface PendingApprovalProps {
  className?: string;
}

interface SocialAccount {
  id: string;
  name: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'pinterest' | 'instagram' | 'all';
  icon: string;
}

interface PostData {
  id: string;
  author: string;
  authorHandle: string;
  date: string;
  time: string;
  content: string;
  socialIcons: string[];
  status: 'needs_approval' | 'approved' | 'rejected';
  accountId?: string; // For filtering by account
}

export const PendingApproval: React.FC<PendingApprovalProps> = ({ className }) => {
  // Simulate current user role (in a real app, this would come from auth context)
  const [isAdmin] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Track which dropdown is open
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  
  // Available social accounts for the current user
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      id: 'all',
      name: 'All Accounts',
      platform: 'all',
      icon: '/images/page2/all-accounts-icon.png'
    },
    {
      id: 'acc_1',
      name: 'AIMDek Technologies',
      platform: 'facebook',
      icon: '/images/page2/facebook-icon.png'
    },
    {
      id: 'acc_2',
      name: 'AIMDek Tech',
      platform: 'twitter',
      icon: '/images/page2/twitter-icon.png'
    },
    {
      id: 'acc_3',
      name: 'AIMDek Marketing',
      platform: 'instagram',
      icon: '/images/page2/instagram-icon.png'
    },
    {
      id: 'acc_4',
      name: 'AIMDek Official',
      platform: 'linkedin',
      icon: '/images/page2/linkedin-icon.png'
    }
  ]);
  
  // Selected account for filtering
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount>(accounts[0]); // Default to "All Accounts"
  
  const [posts, setPosts] = useState<PostData[]>([
    {
      id: '1',
      author: 'AIMDek Technologies',
      authorHandle: '@aimdektech',
      date: 'Mon, Sep 27, 2021',
      time: '3:53 pm',
      content: 'Data and Creativity ❤️ The dynamic duo that your marketing strategy needs. Discover how they go hand-in-hand when it comes to campaign success. Discover how they go hand-in-hand when it comes to campaign success.',
      socialIcons: ['facebook', 'twitter', 'pinterest', 'tumblr', 'instagram', 'linkedin', 'youtube', 'snapchat', 'tiktok'],
      status: 'needs_approval',
      accountId: 'acc_1'
    },
    {
      id: '2',
      author: 'AIMDek Tech',
      authorHandle: '@aimdektech',
      date: 'Mon, Sep 27, 2021',
      time: '3:53 pm',
      content: 'Data and Creativity ❤️ The dynamic duo that your marketing strategy needs. Discover how they go hand-in-hand when it comes to campaign success. Discover how they go hand-in-hand when it comes to campaign success.',
      socialIcons: ['facebook', 'twitter', 'pinterest', 'tumblr', 'instagram', 'linkedin', 'youtube', 'snapchat', 'tiktok'],
      status: 'needs_approval',
      accountId: 'acc_2'
    },
    {
      id: '3',
      author: 'AIMDek Marketing',
      authorHandle: '@aimdektech',
      date: 'Mon, Sep 27, 2021',
      time: '3:53 pm',
      content: 'Data and Creativity ❤️ The dynamic duo that your marketing strategy needs. Discover how they go hand-in-hand when it comes to campaign success. Discover how they go hand-in-hand when it comes to campaign success.',
      socialIcons: ['facebook', 'twitter', 'pinterest', 'tumblr', 'instagram', 'linkedin', 'youtube', 'snapchat', 'tiktok'],
      status: 'needs_approval',
      accountId: 'acc_3'
    }
  ]);

  // Filter posts based on selected account
  const filteredPosts = selectedAccount.id === 'all' 
    ? posts 
    : posts.filter(post => post.accountId === selectedAccount.id);

  const handleApprove = (postId: string) => {
    // Update post status to approved
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, status: 'approved' } 
        : post
    ));
    
    // In a real app, you would also send an API request to update the status
    console.log(`Approved post: ${postId}`);
    
    // In a real implementation, would remove the post after a delay
    setTimeout(() => {
      setPosts(posts => posts.filter(post => post.id !== postId));
    }, 1500);
  };

  const handleReject = (postId: string) => {
    // Update post status to rejected
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, status: 'rejected' } 
        : post
    ));
    
    // In a real app, you would also send an API request to update the status
    console.log(`Rejected post: ${postId}`);
    
    // In a real implementation, would remove the post after a delay
    setTimeout(() => {
      setPosts(posts => posts.filter(post => post.id !== postId));
    }, 1500);
  };

  const handleDelete = (postId: string) => {
    // Remove post from the list immediately
    setPosts(posts.filter(post => post.id !== postId));
    console.log(`Deleted post: ${postId}`);
    // Close any open dropdown
    setOpenDropdownId(null);
  };

  const handleViewPost = (postId: string) => {
    // Navigate to queue times to view the post
    navigate('/publish/queue-times');
    console.log(`Viewing post: ${postId}`);
    setOpenDropdownId(null);
  };

  const handleEditPost = (postId: string) => {
    // Navigate to queue times to edit the post
    navigate('/publish/queue-times');
    console.log(`Editing post: ${postId}`);
    setOpenDropdownId(null);
  };

  const toggleDropdown = (postId: string) => {
    if (openDropdownId === postId) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(postId);
    }
  };

  const toggleAccountDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from closing immediately
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  const handleSelectAccount = (account: SocialAccount) => {
    setSelectedAccount(account);
    setIsAccountDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close post dropdown
      setOpenDropdownId(null);
      
      // Close account dropdown if click is outside
      if (
        accountDropdownRef.current && 
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const renderSocialIcons = (icons: string[]) => {
    return (
      <div className="flex flex-wrap gap-1 mb-2">
        {icons.map((icon, index) => {
          const bgColor = getIconBgColor(icon);
          return (
            <div 
              key={index} 
              className={`${bgColor} w-6 h-6 flex items-center justify-center rounded text-white text-xs`}
              title={icon.charAt(0).toUpperCase() + icon.slice(1)}
            >
              {icon.charAt(0).toUpperCase()}
            </div>
          );
        })}
      </div>
    );
  };

  const getIconBgColor = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return 'bg-blue-600';
      case 'twitter':
        return 'bg-sky-400';
      case 'instagram':
        return 'bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400';
      case 'linkedin':
        return 'bg-blue-700';
      case 'youtube':
        return 'bg-red-600';
      case 'pinterest':
        return 'bg-red-500';
      case 'tumblr':
        return 'bg-indigo-800';
      case 'snapchat':
        return 'bg-yellow-400';
      case 'tiktok':
        return 'bg-black';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'needs_approval':
        return (
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
            Needs Approval
          </span>
        );
      case 'approved':
        return (
          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'bg-blue-400';
      case 'linkedin':
        return 'bg-blue-700';
      case 'facebook':
        return 'bg-blue-600';
      case 'pinterest':
        return 'bg-red-600';
      case 'instagram':
        return 'bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400';
      case 'all':
        return 'bg-gray-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'T';
      case 'linkedin':
        return 'in';
      case 'facebook':
        return 'f';
      case 'pinterest':
        return 'P';
      case 'instagram':
        return 'IG';
      case 'all':
        return 'All';
      default:
        return '';
    }
  };

  // If user is not an admin, they shouldn't see this page
  if (!isAdmin) {
    return (
      <div className="w-full bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Access Restricted
        </h1>
        <p className="text-gray-600">
          You don't have permission to approve or reject posts. Only admin users can access this page.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("w-full bg-white p-6 rounded-lg shadow-sm", className)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Pending Approval
        </h1>
        <p className="text-sm text-gray-500">
          Publish - Pending Approval
        </p>
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-4">
          Select a social media account
        </div>
        <div 
          ref={accountDropdownRef}
          className="relative"
        >
          <div 
            className="flex items-center space-x-2 border p-2 rounded-md w-full md:w-80 cursor-pointer hover:bg-gray-50"
            onClick={toggleAccountDropdown}
          >
            <div className={`w-8 h-8 rounded-full ${getPlatformColor(selectedAccount.platform)} flex items-center justify-center text-white`}>
              {getPlatformIcon(selectedAccount.platform).charAt(0)}
            </div>
            <div className="flex-grow">{selectedAccount.name}</div>
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          
          {isAccountDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full md:w-80 bg-white border rounded-md shadow-lg z-20">
              {accounts.map(account => (
                <div 
                  key={account.id}
                  className={`flex items-center space-x-2 p-3 hover:bg-gray-50 cursor-pointer ${account.id === selectedAccount.id ? 'bg-blue-50' : ''}`}
                  onClick={() => handleSelectAccount(account)}
                >
                  <div className={`w-8 h-8 rounded-full ${getPlatformColor(account.platform)} flex items-center justify-center text-white`}>
                    {getPlatformIcon(account.platform).charAt(0)}
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{account.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{account.platform === 'all' ? 'All Platforms' : `${account.platform} Account`}</div>
                  </div>
                  {account.id === selectedAccount.id && (
                    <div className="text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <h2 className="text-lg font-medium text-gray-700 mb-2">No posts pending approval</h2>
          <p className="text-gray-500">
            {selectedAccount.id === 'all' 
              ? 'All team members\' posts have been reviewed.' 
              : `No posts from ${selectedAccount.name} need approval right now.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    A
                  </div>
                  <div>
                    <div className="font-medium">{post.author}</div>
                    <div className="text-sm text-gray-500">{post.authorHandle}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center space-x-2">
                    {getStatusLabel(post.status)}
                    <div className="text-sm text-gray-500">{post.date} {post.time}</div>
                  </div>
                  <div className="relative ml-2">
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(post.id);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>
                    
                    {openDropdownId === post.id && (
                      <div 
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="py-1">
                          <button 
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleViewPost(post.id)}
                          >
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                              View
                            </div>
                          </button>
                          <button 
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleEditPost(post.id)}
                          >
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                              Edit
                            </div>
                          </button>
                          <button 
                            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={() => handleDelete(post.id)}
                          >
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                              Delete
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {renderSocialIcons(post.socialIcons)}

              <div className="mb-4">{post.content}</div>

              {post.status === 'needs_approval' && (
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => handleReject(post.id)} 
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(post.id)} 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600">
        <p>Note: As an admin, you can approve or reject posts created by your team members. Your own posts are automatically approved.</p>
      </div>
    </div>
  );
};

export default PendingApproval; 