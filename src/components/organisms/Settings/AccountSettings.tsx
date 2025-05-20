import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';
import GeneralSettings from './GeneralSettings';
import { toast } from 'react-hot-toast';

import { api } from "../../../utils/api";
import type { Settings, ProfileData, SecurityData, NotificationPreference, User } from '../../../types/settings';


interface UserData {
  id: string;
  name: string;
  email: string;
  timezone: string;
  profileImage?: string;
  phone: string | null;
}

interface TimeSlot {
  id: string;
  time: string; // 24-hour format "HH:MM"
}

interface WeekdaySetting {
  day: string;
  enabled: boolean;
  timeSlots: TimeSlot[];
}

interface QueueSettings {
  accountId: string;
  weekdaySettings: WeekdaySetting[];
}

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  status: 'active' | 'inactive';
}

interface AccountSettingsProps {
  className?: string;
  initialActiveTab?: 'profile' | 'notifications' | 'security' | 'general';

  settings: Settings | null;
  onUpdateProfile: (data: ProfileData) => Promise<void>;
  onUpdateNotifications: (preferences: NotificationPreference[]) => Promise<void>;
  onUpdateSecurity: (data: SecurityData) => Promise<void>;
  setSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
}

const settingsNavItems = [
  { id: 'profile', label: 'Profile Settings' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
  { id: 'general', label: 'General' }
];

const timezoneOptions = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' }
];

export const AccountSettings: React.FC<AccountSettingsProps> = ({
  className = '',
  initialActiveTab = 'profile',
  settings,
  onUpdateProfile,
  onUpdateNotifications,
  onUpdateSecurity,
  setSettings
}) => {
  // Navigation state
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>(initialActiveTab);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  
  // User data state
  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: '',
    email: '',
    timezone: 'UTC',
    phone: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Social accounts state
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);

  // Queue settings state
  const [queueSettings, setQueueSettings] = useState<QueueSettings>({
    accountId: 'twitter-account-123',
    weekdaySettings: [
      { day: 'monday', enabled: true, timeSlots: [
        { id: 'mon-1', time: '09:00' },
        { id: 'mon-2', time: '12:30' },
        { id: 'mon-3', time: '17:00' }
      ]},
      { day: 'tuesday', enabled: true, timeSlots: [
        { id: 'tue-1', time: '10:00' },
        { id: 'tue-2', time: '14:00' }
      ]},
      { day: 'wednesday', enabled: true, timeSlots: [
        { id: 'wed-1', time: '09:30' },
        { id: 'wed-2', time: '13:00' },
        { id: 'wed-3', time: '16:30' }
      ]},
      { day: 'thursday', enabled: true, timeSlots: [
        { id: 'thu-1', time: '09:00' },
        { id: 'thu-2', time: '12:00' },
        { id: 'thu-3', time: '15:00' },
        { id: 'thu-4', time: '18:00' }
      ]},
      { day: 'friday', enabled: true, timeSlots: [
        { id: 'fri-1', time: '10:00' },
        { id: 'fri-2', time: '13:00' },
        { id: 'fri-3', time: '16:00' }
      ]},
      { day: 'saturday', enabled: false, timeSlots: [] },
      { day: 'sunday', enabled: false, timeSlots: [] }
    ]
  });
  const [isLoadingQueueSettings, setIsLoadingQueueSettings] = useState(false);
  const [isSavingQueueSettings, setIsSavingQueueSettings] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    if (settings) {
      console.log('Settings changed in AccountSettings:', settings);
      setUserData({
        id: settings.user._id,
        name: settings.user.name,
        email: settings.user.email,
        timezone: settings.user.timezone,
        phone: settings.user.phone
      });
      console.log('Updated userData state:', {
        id: settings.user._id,
        name: settings.user.name,
        email: settings.user.email,
        timezone: settings.user.timezone,
        phone: settings.user.phone
      });
      setIsLoading(false);
    }
  }, [settings]);

  // Load queue settings when account changes
  useEffect(() => {
    if (activeSettingsTab === 'queue-times' && selectedAccountId) {
      fetchQueueSettings(selectedAccountId);
    }
  }, [selectedAccountId, activeSettingsTab]);

  // Fetch user data from API
  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be fetched from an API
      // const response = await fetch('/api/user/profile', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   }
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to fetch user data');
      // }
      
      // const data = await response.json();

      // Simulating API response for demo
      const data = {
        id: 'usr_123456789',
        name: 'AIMDek Technologies',
        email: 'marketing@aimdek.com',
        timezone: 'Culcutta (+05:30)',
        phone: '+1-202-555-0123'
      };
      
      setUserData(data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch queue settings for an account
  const fetchQueueSettings = async (accountId: string) => {
    setIsLoadingQueueSettings(true);
    
    try {
      const response = await api.get(`/api/users/queue-settings?accountId=${accountId}`);
      
      if (response.data) {
        setQueueSettings(response.data);
      } else {
        // If no settings exist, use default state
        setQueueSettings({
          accountId,
          weekdaySettings: queueSettings.weekdaySettings
        });
      }
      // In a real app, this would be fetched from an API
      // const response = await fetch(`/api/queue-settings?accountId=${accountId}`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   }
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to fetch queue settings');
      // }
      
      // const data = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo, we'll just use our initial state data
      // In a real app, you would set the data from the API response
      setQueueSettings({
        ...queueSettings,
        accountId
      });
    } catch (err) {
      console.error('Error fetching queue settings:', err);
      setError('Failed to load queue settings. Please try again.');
    } finally {
      setIsLoadingQueueSettings(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear success message when user starts editing
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      console.log('Submitting profile update with data:', userData);
      const profileData: ProfileData = {
        name: userData.name,
        timezone: userData.timezone,
        phone: userData.phone
      };
      await onUpdateProfile(profileData);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
      // In a real app, this would call an API endpoint
      // POST /api/user/delete
      alert('Your account deletion has been requested. The account will be fully deleted after 30 days.');
    }
  };

  // Queue time settings handlers
  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccountId(e.target.value);
  };

  const toggleDayEnabled = (day: string) => {
    const updatedSettings = {
      ...queueSettings,
      weekdaySettings: queueSettings.weekdaySettings.map(setting => 
        setting.day === day ? { ...setting, enabled: !setting.enabled } : setting
      )
    };
    setQueueSettings(updatedSettings);
  };

  const addTimeSlot = (day: string) => {
    const daySettings = queueSettings.weekdaySettings.find(setting => setting.day === day);
    if (!daySettings) return;
    
    const newTimeSlot = {
      id: `${day}-${Date.now()}`,
      time: '12:00' // Default time
    };
    
    const updatedSettings = {
      ...queueSettings,
      weekdaySettings: queueSettings.weekdaySettings.map(setting => 
        setting.day === day 
          ? { ...setting, timeSlots: [...setting.timeSlots, newTimeSlot] } 
          : setting
      )
    };
    
    setQueueSettings(updatedSettings);
  };
  
  const removeTimeSlot = (day: string, slotId: string) => {
    const updatedSettings = {
      ...queueSettings,
      weekdaySettings: queueSettings.weekdaySettings.map(setting => 
        setting.day === day 
          ? { 
              ...setting, 
              timeSlots: setting.timeSlots.filter(slot => slot.id !== slotId) 
            } 
          : setting
      )
    };
    
    setQueueSettings(updatedSettings);
  };
  
  const updateTimeSlot = (day: string, slotId: string, newTime: string) => {
    const updatedSettings = {
      ...queueSettings,
      weekdaySettings: queueSettings.weekdaySettings.map(setting => 
        setting.day === day 
          ? { 
              ...setting, 
              timeSlots: setting.timeSlots.map(slot => 
                slot.id === slotId ? { ...slot, time: newTime } : slot
              ) 
            } 
          : setting
      )
    };
    
    setQueueSettings(updatedSettings);
  };
  
  const handleSaveQueueSettings = async () => {
    setIsSavingQueueSettings(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await api.put('/api/users/queue-settings', queueSettings);
      
      if (response.data) {
        setQueueSettings(response.data.queueSettings);
        setSuccessMessage('Queue time settings updated successfully!');
      }
      // In a real app, this would send data to an API
      // const response = await fetch('/api/queue-settings', {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(queueSettings)
      // });
      

      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Show success notification
      setSuccessMessage('Queue time settings updated successfully!');
    } catch (err) {
      console.error('Error updating queue settings:', err);
      setError('Failed to update queue settings. Please try again.');
    } finally {
      setIsSavingQueueSettings(false);
    }
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-sm p-6", className)}>
      {/* Navigation */}
      <div className="flex space-x-4 mb-6">
        {settingsNavItems.map(item => (
          <button
            key={item.id}
            className={cn(
              "px-4 py-2 rounded-md",
              activeSettingsTab === item.id 
                ? "bg-blue-500 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            onClick={() => setActiveSettingsTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeSettingsTab === 'profile' && (
          <GeneralSettings 
            className="mt-4"
          />
        )}
        
        {activeSettingsTab === 'notifications' && (
          <NotificationSettings 
            preferences={settings?.notificationPreferences || []}
            onUpdatePreferences={onUpdateNotifications}
          />
        )}
        
        {activeSettingsTab === 'security' && (
          <SecuritySettings 
            securityData={{
              isTwoFactorEnabled: settings?.user.isTwoFactorEnabled || false,
              isActivityLoggingEnabled: settings?.user.isActivityLoggingEnabled || false,
              lastPasswordChange: settings?.user.lastPasswordChange.toISOString() ?? new Date().toISOString()
            }}
            onUpdateSecurity={onUpdateSecurity}
          />
        )}
      </div>
    </div>
  );
};

export default AccountSettings; 