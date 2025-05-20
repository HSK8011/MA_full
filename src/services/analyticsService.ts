import axios from 'axios';
import { API_URL } from '../config';
import { authService } from './authService';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/analytics`,
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
    console.error('❌ [Analytics] Request interceptor error:', error);
    return Promise.reject(new Error('Request configuration failed'));
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ [Analytics] API error:', error);
    return Promise.reject(new Error(error.response?.data?.message ?? 'API request failed'));
  }
);

export interface AnalyticsMetrics {
  posts: number;
  likes: number;
  followers: number;
  engagements: number;
  audienceGrowth: number;
  audienceGrowthPercentage: number;
  impressions: number;
  reach: number;
  shares: number;
  comments: number;
  clicks: number;
  profileViews: number;
}

export interface TopPost {
  id: string;
  platform: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  mediaUrls?: string[];
  accountId?: string;
  accountName?: string;
  status: 'published' | 'scheduled' | 'draft' | 'failed';
  scheduledAt?: string;
}

export interface Account {
  id: string;
  name: string;
  platform: string;
  profileImage: string;
}

export interface AnalyticsOverview {
  timeRange: string;
  metrics: AnalyticsMetrics;
  accounts: Account[];
  topPosts: TopPost[];
}

export interface AccountAnalytics {
  accountId: string;
  accountName: string;
  platform: string;
  timeRange: string;
  metrics: AnalyticsMetrics;
  topPosts: TopPost[];
}

export const analyticsService = {
  // Get analytics overview for all accounts
  getAnalyticsOverview: async (timeRange: string = '30d'): Promise<AnalyticsOverview> => {
    try {
      console.log('🔍 [Analytics] Fetching overview with timeRange:', timeRange);
      const response = await api.get('/', {
        params: { timeRange }
      });
      console.log('✅ [Analytics] Fetched overview:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [Analytics] Failed to fetch overview:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch analytics overview');
    }
  },

  // Get analytics for a specific account
  getAccountAnalytics: async (accountId: string, timeRange: string = '30d'): Promise<AccountAnalytics> => {
    try {
      console.log(`🔍 [Analytics] Fetching for account: ${accountId}, timeRange: ${timeRange}`);
      const response = await api.get(`/${accountId}/${timeRange}`);
      console.log('✅ [Analytics] Fetched account analytics:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [Analytics] Failed to fetch account analytics:', error);
      throw error instanceof Error ? error : new Error(`Failed to fetch analytics for account ${accountId}`);
    }
  }
};
