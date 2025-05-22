import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { Modal } from '../../atoms/ui/modal';
import { Link, useNavigate } from 'react-router-dom';
import { integrationService } from '../../../services/integrationService';
import { toast } from 'react-hot-toast';
import { SUPPORTED_PLATFORMS } from '../../../config';

interface ConnectContentProps {
  className?: string;
}

type Platform = typeof SUPPORTED_PLATFORMS[keyof typeof SUPPORTED_PLATFORMS];

interface SocialAccount {
  id: string;
  name: string;
  username: string;
  type: string;
  platform: Platform;
  status: 'connected' | 'disconnected' | 'error';
  icon: string;
  profileImageUrl?: string;
  accountType?: 'personal' | 'business' | 'page' | 'group' | 'creator';
}

// Helper function to get account type display text
const getAccountType = (platform: Platform, accountType: string): string => {
  const platformNames: Record<Platform, string> = {
    [SUPPORTED_PLATFORMS.TWITTER]: 'Twitter',
    [SUPPORTED_PLATFORMS.LINKEDIN]: 'LinkedIn',
    [SUPPORTED_PLATFORMS.FACEBOOK]: 'Facebook',
    [SUPPORTED_PLATFORMS.INSTAGRAM]: 'Instagram',
    [SUPPORTED_PLATFORMS.PINTEREST]: 'Pinterest'
  };
  
  const typeNames: Record<string, string> = {
    personal: 'Profile',
    business: 'Business Account',
    page: 'Page',
    group: 'Group',
    creator: 'Creator Account'
  };
  
  return `${platformNames[platform]} ${typeNames[accountType] ?? 'Profile'}`;
};

// Get platform icon URL
const getPlatformIconUrl = (platform: Platform): string => {
  const icons: Record<Platform, string> = {
    [SUPPORTED_PLATFORMS.TWITTER]: '/images/page2/twitter-icon.png',
    [SUPPORTED_PLATFORMS.LINKEDIN]: '/images/page2/linkedin-icon.png',
    [SUPPORTED_PLATFORMS.FACEBOOK]: '/images/page2/facebook-icon.png',
    [SUPPORTED_PLATFORMS.INSTAGRAM]: '/images/page2/instagram-icon.png',
    [SUPPORTED_PLATFORMS.PINTEREST]: '/images/page2/pinterest-icon.png'
  };
  
  return icons[platform] ?? '/images/page2/default-icon.png';
};

// Get platform color
const getPlatformColor = (platform: Platform): string => {
  const colors: Record<Platform, string> = {
    [SUPPORTED_PLATFORMS.TWITTER]: 'bg-blue-400',
    [SUPPORTED_PLATFORMS.LINKEDIN]: 'bg-blue-700',
    [SUPPORTED_PLATFORMS.FACEBOOK]: 'bg-blue-600',
    [SUPPORTED_PLATFORMS.PINTEREST]: 'bg-red-600',
    [SUPPORTED_PLATFORMS.INSTAGRAM]: 'bg-pink-600'
  };
  
  return colors[platform] ?? 'bg-gray-500';
};

// Get platform icon text for fallback avatars
const getPlatformIconText = (platform: Platform): string => {
  const iconText: Record<Platform, string> = {
    [SUPPORTED_PLATFORMS.TWITTER]: 'T',
    [SUPPORTED_PLATFORMS.LINKEDIN]: 'in',
    [SUPPORTED_PLATFORMS.FACEBOOK]: 'f',
    [SUPPORTED_PLATFORMS.PINTEREST]: 'P',
    [SUPPORTED_PLATFORMS.INSTAGRAM]: 'IG'
  };
  
  return iconText[platform] ?? platform.charAt(0).toUpperCase();
};

const AccountsList: React.FC<{
  isLoading: boolean;
  accounts: SocialAccount[];
  onDisconnect: (id: string) => void;
  onReconnect: (id: string) => void;
  onRemove: (account: SocialAccount) => void;
  onManageQueueTime: () => void;
}> = ({ isLoading, accounts, onDisconnect, onReconnect, onRemove, onManageQueueTime }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No accounts found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <div key={account.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
          {/* Left: Status and Account Info */}
          <div className="flex items-center space-x-4">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${account.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}>
              {account.status === 'connected' ? (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full ${getPlatformColor(account.platform)} text-white flex items-center justify-center font-medium text-sm`}>
                {getPlatformIconText(account.platform)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{account.name}</h3>
                <p className="text-sm text-gray-500">{account.type}</p>
              </div>
            </div>
          </div>
          
          {/* Right: Action Buttons */}
          <div className="flex items-center space-x-2">
            {account.status === 'connected' ? (
              <React.Fragment>
                <button 
                  className="flex items-center space-x-1 bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100 transition-colors"
                  onClick={() => onDisconnect(account.id)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Disconnect</span>
                </button>
                <button 
                  className="flex items-center space-x-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors"
                  onClick={onManageQueueTime}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Manage Queue Time</span>
                </button>
              </React.Fragment>
            ) : (
              <button 
                className="flex items-center space-x-1 bg-green-50 text-green-600 px-3 py-2 rounded-md hover:bg-green-100 transition-colors"
                onClick={() => onReconnect(account.id)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Reconnect</span>
              </button>
            )}
            <button 
              className="flex items-center space-x-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => onRemove(account)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Remove Channel</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ConnectContent: React.FC<ConnectContentProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [accountToRemove, setAccountToRemove] = useState<SocialAccount | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const navigate = useNavigate();
  
  // Fetch connected accounts from the backend
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        const integrations = await integrationService.getSocialMediaIntegrations();
        
        // Map API response to our frontend model
        const mappedAccounts: SocialAccount[] = integrations.map(integration => {
          // Cast the integration to match the API response format
          const apiIntegration = integration as unknown as {
            _id: string;
            platform: string;
            status: 'active' | 'inactive' | 'error';
            username: string;
            lastConnected?: Date;
          };
          
          const status = apiIntegration.status === 'active' ? 'connected' as const : 'disconnected' as const;
          const platform = apiIntegration.platform as Platform;
          
          return {
            id: apiIntegration._id,
            name: apiIntegration.username,
            username: apiIntegration.username,
            type: getAccountType(platform, 'personal'),
            platform,
            status: apiIntegration.status === 'error' ? 'error' : status,
            icon: getPlatformIconUrl(platform),
            profileImageUrl: undefined,
            accountType: 'personal'
          };
        });
        
        setAccounts(mappedAccounts);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
        toast.error('Failed to load connected accounts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAccounts();
  }, []);

  // Handle disconnect account
  const handleDisconnect = async (accountId: string) => {
    try {
      await integrationService.disconnectSocialMedia(accountId);
      
      // Update local state to reflect disconnection
      setAccounts(accounts.map(account => 
        account.id === accountId 
          ? { ...account, status: 'disconnected' } 
          : account
      ));
      
      toast.success('Account disconnected successfully');
    } catch (error) {
      console.error('Failed to disconnect account:', error);
      toast.error('Failed to disconnect account');
    }
  };

  // Handle reconnect account
  const handleReconnect = async (accountId: string) => {
    try {
      await integrationService.reconnectSocialMedia(accountId);
      // The page will reload after successful OAuth flow
    } catch (error) {
      console.error('Failed to reconnect account:', error);
      toast.error('Failed to reconnect account');
    }
  };

  // Handle remove account - opens confirmation modal
  const handleRemove = (account: SocialAccount) => {
    setAccountToRemove(account);
    setIsRemoveModalOpen(true);
  };

  const confirmRemove = async () => {
    if (!accountToRemove) return;
    
    try {
      // Call the API to remove the integration
      await integrationService.removeSocialMedia(accountToRemove.id);
      
      // Remove account from the list
      setAccounts(accounts.filter(account => account.id !== accountToRemove.id));
      
      toast.success('Account removed successfully');
    } catch (error) {
      console.error('Failed to remove account:', error);
      toast.error('Failed to remove account');
    } finally {
      // Close modal
      setIsRemoveModalOpen(false);
      setAccountToRemove(null);
    }
  };

  // Handle navigation to queue times
  const handleManageQueueTime = () => {
    navigate('/publish/queue-times');
  };

  // Filter accounts based on search query
  const filteredAccounts = accounts.filter(account => 
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn("bg-white rounded-lg shadow-sm", className)}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Connect to Social Network</h1>
          <Link to="/connect/new" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
            Connect New Channel
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search social account"
            className="w-full border border-gray-300 rounded-md py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Accounts List */}
        <AccountsList
          isLoading={isLoading}
          accounts={filteredAccounts}
          onDisconnect={handleDisconnect}
          onReconnect={handleReconnect}
          onRemove={handleRemove}
          onManageQueueTime={handleManageQueueTime}
        />

        {/* No duplicate account rendering here */}
      </div>

      {/* Remove Channel Confirmation Modal */}
      {accountToRemove && (
        <Modal
          isOpen={isRemoveModalOpen}
          onClose={() => setIsRemoveModalOpen(false)}
          title="Remove Account"
        >
          <div className="mb-6">
            <p className="text-gray-700">
              Are you sure you want to completely remove {accountToRemove.name} ({accountToRemove.type})? 
              This action cannot be undone, and you'll need to reconnect the account from scratch if needed later.
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors"
              onClick={() => setIsRemoveModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              onClick={confirmRemove}
            >
              Remove
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ConnectContent; 
