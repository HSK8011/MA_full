import axios from 'axios';
import { API_URL } from '../config';
import { authService } from './authService';

interface Integration {
  _id: string;
  userId: string;
  platform: string;
  status: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/connect`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ [Integration] Request interceptor error:', error);
    return Promise.reject(new Error('Request configuration failed'));
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ [Integration] API error:', error);
    return Promise.reject(new Error(error.response?.data?.message ?? 'API request failed'));
  }
);

export const integrationService = {
  getSocialMediaIntegrations: async (): Promise<Integration[]> => {
    try {
      console.log('🔍 [Integration] Fetching social media integrations');
      const response = await api.get('/accounts', {
        params: {
          serviceType: 'socialMedia'
        }
      });
      console.log('✅ [Integration] Fetched integrations:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [Integration] Failed to fetch integrations:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch integrations');
    }
  },

  connectSocialMedia: async (platform: string): Promise<void> => {
    try {
      console.log('🔄 [Integration] Initiating OAuth flow for:', platform);
      const response = await api.post(`/accounts/${platform}/connect`);
      
      // Redirect to OAuth URL
      if (response.data.authUrl) {
        window.location.href = response.data.authUrl;
      } else {
        throw new Error('No OAuth URL received');
      }
    } catch (error) {
      console.error('❌ [Integration] Failed to initiate OAuth flow:', error);
      throw error instanceof Error ? error : new Error(`Failed to connect to ${platform}`);
    }
  },

  disconnectSocialMedia: async (integrationId: string): Promise<void> => {
    try {
      console.log('🔌 [Integration] Disconnecting account:', integrationId);
      await api.post(`/accounts/${integrationId}/disconnect`);
      console.log('✅ [Integration] Account disconnected successfully');
    } catch (error) {
      console.error('❌ [Integration] Failed to disconnect account:', error);
      throw error instanceof Error ? error : new Error('Failed to disconnect account');
    }
  },

  reconnectSocialMedia: async (integrationId: string): Promise<void> => {
    try {
      console.log('🔄 [Integration] Reconnecting account:', integrationId);
      const response = await api.post(`/accounts/${integrationId}/reconnect`);
      
      // Redirect to OAuth URL if provided
      if (response.data.authUrl) {
        window.location.href = response.data.authUrl;
      } else {
        throw new Error('No OAuth URL received for reconnection');
      }
    } catch (error) {
      console.error('❌ [Integration] Failed to reconnect account:', error);
      throw error instanceof Error ? error : new Error('Failed to reconnect account');
    }
  },

  removeSocialMedia: async (integrationId: string): Promise<void> => {
    try {
      console.log('🗑️ [Integration] Removing account:', integrationId);
      await api.delete(`/accounts/${integrationId}`);
      console.log('✅ [Integration] Account removed successfully');
    } catch (error) {
      console.error('❌ [Integration] Failed to remove account:', error);
      throw error instanceof Error ? error : new Error('Failed to remove account');
    }
  },

  addIntegration: async (platform: string, authCode: string): Promise<Integration> => {
    try {
      console.log('➕ [Integration] Adding integration for platform:', platform);
      const response = await api.post('/add', {
        platform,
        authCode,
        serviceType: 'socialMedia'
      });
      console.log('✅ [Integration] Integration added successfully');
      return response.data;
    } catch (error) {
      console.error('❌ [Integration] Failed to add integration:', error);
      throw error instanceof Error ? error : new Error(`Failed to add ${platform} integration`);
    }
  },

  removeIntegration: async (integrationId: string): Promise<void> => {
    try {
      console.log('🗑️ [Integration] Removing integration:', integrationId);
      await api.delete(`/remove/${integrationId}`);
      console.log('✅ [Integration] Integration removed successfully');
    } catch (error) {
      console.error('❌ [Integration] Failed to remove integration:', error);
      throw error instanceof Error ? error : new Error(`Failed to remove integration ${integrationId}`);
    }
  },

  refreshIntegration: async (integrationId: string): Promise<Integration> => {
    try {
      console.log('🔄 [Integration] Refreshing integration:', integrationId);
      const response = await api.post(`/refresh/${integrationId}`);
      console.log('✅ [Integration] Integration refreshed successfully');
      return response.data;
    } catch (error) {
      console.error('❌ [Integration] Failed to refresh integration:', error);
      throw error instanceof Error ? error : new Error(`Failed to refresh integration ${integrationId}`);
    }
  }
}; 