import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { Link } from 'react-router-dom';
import { integrationService } from '../../../services/integrationService';
import { toast } from 'react-hot-toast';

interface ConnectNewContentProps {
  className?: string;
}

interface Channel {
  id: string;
  name: string;
  icon: string;
  description: string;
  connectUrl: string;
}

export const ConnectNewContent: React.FC<ConnectNewContentProps> = ({ className }) => {
  // Social media channels available for connection
  const channels: Channel[] = [
    {
      id: 'twitter',
      name: 'Twitter Profile',
      icon: '/images/page3/twitter@3x.png',
      description: 'Connect your Twitter profile to schedule tweets and analyze engagement.',
      connectUrl: '/connect/twitter'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Page / Profile',
      icon: '/images/page3/linkedin@3x.png',
      description: 'Connect your LinkedIn page or profile to publish content and track professional engagement.',
      connectUrl: '/connect/linkedin'
    },
    {
      id: 'pinterest',
      name: 'Pinterest Business',
      icon: '/images/page3/pinterest-seeklogo-com@3x.png',
      description: 'Connect your Pinterest business account to schedule pins and analyze traffic.',
      connectUrl: '/connect/pinterest'
    },
    {
      id: 'facebook',
      name: 'Facebook Page / Group',
      icon: '/images/page3/facebook@3x.png',
      description: 'Connect your Facebook page or group to publish content and engage with your audience.',
      connectUrl: '/connect/facebook'
    },
    {
      id: 'instagram',
      name: 'Instagram Business Account',
      icon: '/images/page3/insta.png',
      description: 'Connect your Instagram business account to schedule posts and analyze engagement.',
      connectUrl: '/connect/instagram'
    },
    {
      id: 'shopify',
      name: 'Shopify Store',
      icon: '/images/page3/shopify.png',
      description: 'Connect your Shopify store to integrate product information and track conversions.',
      connectUrl: '/connect/shopify'
    }
  ];

  const [isConnecting, setIsConnecting] = useState<Record<string, boolean>>({});

  // Handle Connect button click for a channel
  const handleConnectClick = async (channel: Channel) => {
    try {
      setIsConnecting(prev => ({ ...prev, [channel.id]: true }));
      
      // Map the UI platform ID to the backend's expected platform name
      const platformMap: Record<string, 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'pinterest'> = {
        'twitter': 'twitter',
        'linkedin': 'linkedin',
        'facebook': 'facebook',
        'instagram': 'instagram',
        'pinterest': 'pinterest'
      };
      
      const platform = platformMap[channel.id];
      
      if (!platform) {
        throw new Error(`Unsupported platform: ${channel.id}`);
      }
      
      // Initiate the OAuth flow
      await integrationService.connectSocialMedia(platform);
      
      // The page will redirect to the OAuth URL, so we don't need to do anything else here
    } catch (error) {
      console.error(`Error connecting to ${channel.name}:`, error);
      toast.error(`Failed to connect to ${channel.name}. Please try again.`);
    } finally {
      setIsConnecting(prev => ({ ...prev, [channel.id]: false }));
    }
  };

  return (
    <div className={cn("", className)}>
      {/* Header outside the white sections */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Connect to Social Network</h1>
      </div>
      
      {/* Main content area with two columns */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Connect New Channel */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm lg:w-2/3">
          <div className="p-6">
            {/* Title and Back button header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Connect New Channel</h2>
              <Link 
                to="/connect" 
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back To Channels
              </Link>
            </div>
            
            {/* Instructions */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Looking for step-by-step instructions? Visit our Help Center to read our Getting Started guides and learn about supported channel types.
              </p>
            </div>

            {/* Channel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {channels.map((channel) => (
                <div key={channel.id} className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center">
                  <div className="mb-4 w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                    <img 
                      src={channel.icon} 
                      alt={channel.name} 
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{channel.name}</h3>
                  <p className="text-gray-600 text-sm mb-6 flex-grow">{channel.description}</p>
                  <button 
                    onClick={() => handleConnectClick(channel)}
                    disabled={isConnecting[channel.id]}
                    className={`w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded transition-colors ${
                      isConnecting[channel.id] ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isConnecting[channel.id] ? 'Connecting...' : 'CONNECT'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right column - Free Plan */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm lg:w-1/3">
          <div className="p-6">
            {/* Trial expiration notice */}
            <div className="mb-6 bg-red-50 border border-red-100 rounded-md p-3 flex items-center text-sm">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">Your trial will expire in 5 days</span>
              <span className="ml-2 text-blue-600 font-medium">Upgrade Now</span>
            </div>
            
            {/* Gift icon */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center mb-6">
                <img src="/images/page3/gift.png" alt="Gift" className="w-12 h-12 object-contain" />
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 text-sm uppercase font-medium">CURRENT PLAN</p>
                <h3 className="text-2xl font-bold text-blue-600 mb-4">FREE PLAN</h3>
                <p className="text-gray-800 mb-6">
                  You've hit your plan limit of<br />
                  3 connected channels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectNewContent; 