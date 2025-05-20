import React, { useEffect, useState } from 'react';
import DashboardTemplate from '../components/templates/Dashboard/DashboardTemplate';
import { toast } from 'react-hot-toast';
import type { Settings as SettingsType, ProfileData, SecurityData, NotificationPreference, Integration } from '../types/settings';
import { authService } from '../services/authService';
import { settingsService } from '../services/settingsService';
import { integrationService } from '../services/integrationService';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import ProfileSettings from '../components/organisms/Settings/ProfileSettings';
import NotificationSettings from '../components/organisms/Settings/NotificationSettings';
import SecuritySettings from '../components/organisms/Settings/SecuritySettings';
import QueueTimes from '../components/organisms/Settings/QueueTimes';
import GeneralSettings from '../components/organisms/Settings/GeneralSettings';

interface SocialMediaIntegration {
  _id: string;
  platform: string;
  username: string;
  status: string;
}

const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [accounts, setAccounts] = useState<Array<{
    id: string;
    platform: string;
    username: string;
    status: string;
  }>>([]);
  const location = useLocation();

  // Determine active section from URL
  const getActiveSection = () => {
    const path = location.pathname;
    if (path.includes('/settings/notifications')) return 'notifications';
    if (path.includes('/settings/security')) return 'security';
    if (path.includes('/settings/general')) return 'general';
    if (path.includes('/settings/queue-times')) return 'queue-times';
    return 'profile';
  };

  const activeSection = getActiveSection();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = authService.isAuthenticated();
    
    if (!isAuthenticated) {
      window.location.href = '/';
      return;
    }
    
    // Fetch user settings and accounts
    Promise.all([fetchSettings(), fetchAccounts()]).then(() => {
      setIsLoading(false);
    });
    
    // Set page title
    document.title = 'Account Settings - Marketing Automation Tools';
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('🔍 Fetching settings...');
      const token = localStorage.getItem('token');
      console.log('🔑 Auth token present:', !!token);
      
      const settings = await settingsService.getSettings();
      console.log('✅ Settings fetched:', settings);
      
      setSettings({
        ...settings,
        queueTimes: [] // Add default empty queueTimes array
      });
      
    } catch (error: any) {
      console.error('❌ Error fetching settings:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      if (error.response?.status === 401) {
        console.log('🚫 Unauthorized - logging out');
        authService.logout();
        window.location.href = '/';
      } else {
        toast.error('Failed to load settings. Please try again.');
      }
    }
  };

  const fetchAccounts = async () => {
    try {
      const integrations = (await integrationService.getSocialMediaIntegrations() as unknown) as SocialMediaIntegration[];
      const activeAccounts = integrations
        .filter(integration => integration.status === 'active')
        .map(integration => ({
          id: integration._id,
          platform: integration.platform,
          username: integration.username,
          status: integration.status
        }));
      setAccounts(activeAccounts);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      toast.error('Failed to load connected accounts');
    }
  };

  const handleUpdateProfile = async (profileData: ProfileData) => {
    try {
      const response = await settingsService.updateProfile(profileData);
      setSettings(prev => prev ? { ...prev, user: response.user } : null);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleUpdateNotifications = async (preferences: NotificationPreference[]) => {
    try {
      const response = await settingsService.updateNotifications(preferences);
      setSettings(prev => prev ? { ...prev, notificationPreferences: response.notificationPreferences } : null);
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error('Failed to update notification preferences');
    }
  };

  const handleUpdateSecurity = async (securityData: SecurityData) => {
    try {
      if ('isTwoFactorEnabled' in securityData) {
        await settingsService.toggleTwoFactorAuth(securityData.isTwoFactorEnabled);
      }
      if ('isActivityLoggingEnabled' in securityData) {
        await settingsService.toggleActivityLogs(securityData.isActivityLoggingEnabled);
      }
      
      // Refresh settings after update
      await fetchSettings();
      toast.success('Security settings updated');
    } catch (error) {
      console.error('Error updating security settings:', error);
      toast.error('Failed to update security settings');
      throw error;
    }
  };

  // Navigation items
  const navigationItems = [
    {
      id: 'profile',
      name: 'Profile Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      path: '/settings/profile'
    },
    {
      id: 'notifications',
      name: 'Notification Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      path: '/settings/notifications'
    },
    {
      id: 'security',
      name: 'Security Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      path: '/settings/security'
    },
    {
      id: 'general',
      name: 'General Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/settings/general'
    },
    {
      id: 'queue-times',
      name: 'Set Queue Times',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      path: '/settings/queue-times'
    }
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <DashboardTemplate activePage="settings" hideDefaultDashboard>
      <div className="flex min-h-screen bg-gray-50">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg",
                    activeSection === item.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {activeSection === 'profile' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>
                <ProfileSettings
                  profileData={settings?.user}
                  onUpdate={handleUpdateProfile}
                />
              </div>
            )}
            {activeSection === 'notifications' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Notification Settings</h1>
                <NotificationSettings />
              </div>
            )}
            {activeSection === 'security' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h1>
                <SecuritySettings
                  securityData={{
                    isTwoFactorEnabled: settings?.user?.isTwoFactorEnabled || false,
                    isActivityLoggingEnabled: settings?.user?.isActivityLoggingEnabled || false,
                    lastPasswordChange: settings?.user?.lastPasswordChange ?? ''
                  }}
                  onUpdate={handleUpdateSecurity}
                />
              </div>
            )}
            {activeSection === 'general' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">General Settings</h1>
                <GeneralSettings />
              </div>
            )}
            {activeSection === 'queue-times' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Queue Times</h1>
                <QueueTimes accounts={accounts} />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default Settings; 