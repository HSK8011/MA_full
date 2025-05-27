import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import { postService } from '../../../services/postService';
import { format } from 'date-fns';

interface DraftsPostsProps {
  className?: string;
}

interface SocialAccount {
  id: string;
  name: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'pinterest' | 'instagram' | 'all';
  icon: string;
}

interface DraftsPostsProps {
  className?: string;
}

interface LoadingState {
  isLoading: boolean;
  error: string | null;
}



interface DraftPost {
  _id: string;
  integrationId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  integration: {
    platform: string;
    name: string;
    displayName: string;
    username: string;
  };
  type: 'text' | 'image' | 'video' | 'link' | 'carousel';
  status: string;
}

export const DraftsPosts = ({ className = '' }: DraftsPostsProps): React.ReactElement => {
  const navigate = useNavigate();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const [openActionsId, setOpenActionsId] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: true, error: null });
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page] = useState(1);

  // Available social accounts for the current user
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      id: 'all',
      name: 'All Accounts',
      platform: 'all',
      icon: '/images/page2/all-accounts-icon.png'
    }
  ]);

  // Fetch social media accounts from integrations
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`${API_URL}/connect/accounts`, {
          params: { serviceType: 'socialMedia' },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        const integrations = response.data;
        
        // Map integrations to accounts format
        const accountsList: SocialAccount[] = [
          {
            id: 'all',
            name: 'All Accounts',
            platform: 'all',
            icon: '/images/page2/all-accounts-icon.png'
          },
          ...integrations.map((integration: any) => ({
            id: integration._id,
            name: integration.displayName || integration.username,
            platform: integration.platform,
            icon: `/images/page2/${integration.platform}-icon.png`,
            profileImageUrl: integration.profileImageUrl
          }))
        ];
        
        setAccounts(accountsList);
      } catch (err) {
        console.error('Failed to fetch accounts:', err);
      }
    };
    
    fetchAccounts();
  }, []);  

  // Selected account for filtering
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount>({
    id: 'all',
    platform: 'all',
    name: 'All Accounts',
    icon: 'all'
  });

  // Fetch draft posts
  const fetchDrafts = useCallback(async () => {
    setLoading({ isLoading: true, error: null });
    try {
      const response = await postService.getDraftPosts({
        platform: selectedAccount.platform === 'all' ? undefined : selectedAccount.platform,
        page,
        limit: 10
      });
      const transformedPosts = response.posts.map((post: any) => ({
        _id: post._id,
        integrationId: post.integrationId,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        integration: {
          platform: post.integration.platform,
          name: post.integration.name,
          displayName: post.integration.displayName,
          username: post.integration.username
        },
        type: post.type,
        status: post.status
      }));
      setDrafts(transformedPosts);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching draft posts:', error);
      setLoading({ isLoading: false, error: 'Failed to fetch draft posts' });
    }
    setLoading({ isLoading: false, error: null });
  }, [selectedAccount.platform, page]);

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);



  const toggleAccountDropdown = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation(); // Prevent the click from closing immediately
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  const handleSelectAccount = (account: SocialAccount) => {
    setSelectedAccount({
      id: account.id,
      platform: account.platform,
      name: account.name,
      icon: account.icon
    });
    setIsAccountDropdownOpen(false);
  };

  const toggleActions = (draftId: string, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setOpenActionsId(openActionsId === draftId ? null : draftId);
  };






  const handlePublish = async (draft: DraftPost): Promise<void> => {
    try {
      // Update the draft status to published
      await postService.updatePost(draft._id, { status: 'published' });
      
      // Remove from drafts list
      setDrafts(drafts.filter(d => d._id !== draft._id));
      setTotal(total - 1);
    } catch (error) {
      console.error('Error publishing draft:', error);
    } finally {
      setOpenActionsId(null);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        accountDropdownRef.current && 
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
      }
      setOpenActionsId(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [accountDropdownRef, setIsAccountDropdownOpen, setOpenActionsId]);

  const renderSocialIcons = (icons: string[]): React.ReactElement => {
    // Return empty div if no icons provided
    if (!icons || icons.length === 0) {
      return <div className="flex flex-wrap gap-1 mb-2"></div>;
    }
    
    return (
      <div className="flex flex-wrap gap-1 mb-2">
        {icons.map((icon, index) => {
          if (!icon) return null; // Skip undefined icons
          
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

  const getIconBgColor = (platform: string | undefined): string => {
    if (!platform) return 'bg-gray-500';
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

  const getPlatformColor = (platform: string | undefined): string => {
    if (!platform) return 'text-gray-500';
    switch (platform.toLowerCase()) {
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

  const getPlatformIcon = (platform: string | undefined): string => {
    if (!platform) return '/images/page2/all-accounts-icon.png';
    switch (platform.toLowerCase()) {
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

  return (
    <div className={cn('w-full', className)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Drafts
        </h1>
        <p className="text-sm text-gray-500">
          Publish - Drafts
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5Z"/><path d="M22 2 11 13"/></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading.isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : loading.error ? (
        <div className="flex justify-center items-center h-64 text-red-500">
          {loading.error}
        </div>
      ) : drafts.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          No draft posts found
        </div>
      ) : (
        <div className="space-y-6">
          {drafts.map((draft) => (
            <div key={draft._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    A
                  </div>
                  <div>
                    <div className="text-sm font-medium">{draft.integration.displayName}</div>
                    <div className="text-xs text-gray-500">@{draft.integration.username}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded mr-2">
                      {draft.type}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(draft.createdAt), 'EEE, MMM d, yyyy')} at {format(new Date(draft.createdAt), 'h:mm a')}
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={(e) => toggleActions(draft._id, e)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>
                    
                    {openActionsId === draft._id && (
                      <div 
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="py-1">
                          <button 
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => navigate(`/edit-post/${draft._id}`)}
                          >
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                              Edit
                            </div>
                          </button>
                          <button 
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={async () => {
                              try {
                                await postService.deletePost(draft._id);
                                setDrafts(drafts.filter(d => d._id !== draft._id));
                                setTotal(total - 1);
                                setOpenActionsId(null);
                              } catch (error) {
                                console.error('Error deleting draft:', error);
                              }
                            }}
                          >
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                              Delete
                            </div>
                          </button>
                          <button 
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => navigate(`/view-post/${draft._id}`)}
                          >
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                              View
                            </div>
                          </button>
                          <button 
                            className="w-full text-left block px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                            onClick={() => handlePublish(draft)}
                          >
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                              Publish
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {renderSocialIcons(draft.integration?.platform ? [draft.integration.platform] : [])}

              <div className="mb-4">{draft.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DraftsPosts; 