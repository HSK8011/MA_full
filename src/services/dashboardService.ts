import axios from 'axios';
import { API_URL } from '../config';
import { authService } from './authService';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}`,
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
    console.error('❌ [Dashboard] Request interceptor error:', error);
    return Promise.reject(new Error('Request configuration failed'));
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ [Dashboard] API error:', error);
    return Promise.reject(new Error(error.response?.data?.message ?? 'API request failed'));
  }
);

// Types for dashboard data
export interface SocialAccount {
  id: string;
  name: string;
  handle: string;
  platform: string;
  platformIcon: string;
  profileImage: string;
}

export interface SocialMetric {
  label: string;
  value: string;
  change?: string;
  changeLabel?: string;
  isPositive?: boolean;
}

export interface PostStats {
  retweets: number;
  likes: number;
  comments: number;
  views: number;
  shares: number;
}

export interface RecentPost {
  id: string;
  company: string;
  companyHandle: string;
  companyIcon: string;
  date: string;
  platform: string;
  platformIcon: string;
  content: string;
  stats: PostStats;
}

export interface UpcomingPost {
  id: string;
  company: string;
  companyHandle: string;
  companyIcon: string;
  date: string;
  platform: string;
  platformIcon: string;
  content: string;
}

export interface DashboardData {
  accounts: SocialAccount[];
  recentPosts: RecentPost[];
  upcomingPosts: UpcomingPost[];
}

export interface ChannelAnalyticsData {
  accountId: string;
  accountName: string;
  platform: string;
  timeRange: string;
  metrics: SocialMetric[];
}

export const dashboardService = {
  // Get dashboard data (accounts, recent posts, upcoming posts)
  getDashboardData: async (timeFilter: string = 'This Month'): Promise<DashboardData> => {
    try {
      console.log('🔍 [Dashboard] Fetching dashboard data with timeFilter:', timeFilter);
      const response = await api.get('/analytics/dashboard', {
        params: { timeFilter }
      });
      console.log('✅ [Dashboard] Fetched dashboard data:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [Dashboard] Failed to fetch dashboard data:', error);
      throw error;
    }
  },

  // Get channel analytics for a specific account
  getChannelAnalytics: async (accountId: string, timeFilter: string = 'This Month'): Promise<ChannelAnalyticsData> => {
    try {
      console.log(`🔍 [Dashboard] Fetching channel analytics for account ${accountId} with timeFilter:`, timeFilter);
      const response = await api.get('/analytics/channel', {
        params: { accountId, timeFilter }
      });
      console.log('✅ [Dashboard] Fetched channel analytics:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [Dashboard] Failed to fetch channel analytics:', error);
      throw error;
    }
  }
};

export default dashboardService;
