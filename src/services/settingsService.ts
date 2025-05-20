import { api } from '../utils/api';
import type { 
  Settings, 
  ProfileData, 
  SecurityData, 
  NotificationPreference,
  NotificationPreferenceUpdate,
  Integration,
  User,
  QueueTime
} from '../types/settings';

class SettingsService {
  private baseUrl = '/api/settings';

  async getSettings(): Promise<{
    user: User;
    notificationPreferences: NotificationPreference[];
    integrations: Integration[];
  }> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  }

  async updateProfile(profileData: ProfileData): Promise<{ user: User }> {
    try {
      const response = await api.put(`${this.baseUrl}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async getSecuritySettings(): Promise<SecurityData> {
    try {
      const response = await api.get(`${this.baseUrl}/security`);
      return response.data;
    } catch (error) {
      console.error('Error fetching security settings:', error);
      throw error;
    }
  }

  async toggleTwoFactorAuth(enabled: boolean): Promise<{ twoFactorEnabled: boolean }> {
    try {
      const response = await api.put(`${this.baseUrl}/security/2fa`, { enabled });
      return response.data;
    } catch (error) {
      console.error('Error toggling two-factor authentication:', error);
      throw error;
    }
  }

  async toggleActivityLogs(enabled: boolean): Promise<{ activityLogsEnabled: boolean }> {
    try {
      const response = await api.put(`${this.baseUrl}/security/activity-logs`, { enabled });
      return response.data;
    } catch (error) {
      console.error('Error toggling activity logs:', error);
      throw error;
    }
  }

  async updateNotifications(preferences: NotificationPreferenceUpdate[]): Promise<{ 
    preferences: NotificationPreference[] 
  }> {
    try {
      const response = await api.put(`${this.baseUrl}/notifications`, { preferences });
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  async getQueueSettings(accountId: string): Promise<{ queueTimes: QueueTime[] }> {
    try {
      const response = await api.get(`${this.baseUrl}/queue`, {
        params: { accountId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching queue settings:', error);
      throw error;
    }
  }

  async updateQueueSettings(accountId: string, queueTimes: QueueTime[]): Promise<{ queueTimes: QueueTime[] }> {
    try {
      const response = await api.put(`${this.baseUrl}/queue`, {
        accountId,
        queueTimes
      });
      return response.data;
    } catch (error) {
      console.error('Error updating queue settings:', error);
      throw error;
    }
  }

  async connectIntegration(integrationType: string): Promise<{ integration: Integration }> {
    try {
      const response = await api.post(`${this.baseUrl}/integrations/connect`, { type: integrationType });
      return response.data;
    } catch (error) {
      console.error('Error connecting integration:', error);
      throw error;
    }
  }

  async disconnectIntegration(integrationType: string): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/integrations/disconnect`, { type: integrationType });
    } catch (error) {
      console.error('Error disconnecting integration:', error);
      throw error;
    }
  }
}

export const settingsService = new SettingsService(); 