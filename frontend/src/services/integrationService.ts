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

const scopes = [
  "tweet.read",
  "tweet.write",
  "users.read",
  "follows.read",
  "follows.write",
  "like.read",
  "like.write",
  "bookmark.read",
  "bookmark.write",
  "offline.access" // for refresh token support
];

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

const TWITTER_CLIENT_ID = 'OFNPTFowLVNuNXF1dzcwUmVOVHo6MTpjaQ';

// function generateCodeVerifier(length: number = 64): string {
//   const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
//   let result = "";
//   const values = new Uint32Array(length);
//   crypto.getRandomValues(values);
//   for (let i = 0; i < length; i++) {
//     result += charset[values[i] % charset.length];
//   }
//   return result;
// }

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}


async function getTwitterOauthUrl(): Promise<string> {
  const verifier = 'qY2N8cEjKhUapZVdG5m0sRzFJX-wt4iBLTcvMyUxe7g'
  console.log("Getting twitter oauth url");
  const challenge = await generateCodeChallenge(verifier);

  // You must store the verifier somewhere (for use when exchanging the code for the access token)
  sessionStorage.setItem("twitter_code_verifier", verifier);

  const rootUrl = "https://twitter.com/i/oauth2/authorize";
  const options = {
    redirect_uri: "http://localhost:5000/api/twitter/callback",
    client_id: TWITTER_CLIENT_ID,
    state: "state",
    response_type: "code",
    code_challenge: challenge,
    code_challenge_method: "S256",
    scope: scopes.join(" "),
    
  };
  const qs = new URLSearchParams(options).toString();
  console.log("Generated Twitter OAuth Url:", `${rootUrl}?${qs}`);
  return `${rootUrl}?${qs}`;
}

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
      // const response = await api.post(`/accounts/${platform}/connect`);
      
      if (platform === 'twitter') {
        const twitterAuthUrl = await getTwitterOauthUrl();
        console.log('🔗 [Integration] Redirecting to Twitter OAuth URL:', twitterAuthUrl);
        
        window.location.href = twitterAuthUrl;
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