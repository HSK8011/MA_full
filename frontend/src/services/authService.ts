import axios from 'axios';
import { API_URL } from '../config';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ForgotPasswordResponse {
  message: string;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Define types for the queue items
interface QueueItem {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

// Track if we're currently refreshing the token
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
let failedQueue: QueueItem[] = [];

// Process the failed queue - either retry or reject all pending requests
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, add this request to the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken
        });

        if (response.data.accessToken) {
          // Update tokens in storage
          localStorage.setItem('accessToken', response.data.accessToken);
          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }
          
          // Update auth header
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
          
          // Process all queued requests
          processQueue(null, response.data.accessToken);
          
          // Retry the original request
          originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
          return axios(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        // Token refresh failed, clear auth and redirect to login
        processQueue(refreshError, null);
        authService.logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log('🔑 [Auth] Attempting login for:', email);
      const response = await api.post('/auth/login', { email, password });
      
      // Validate response data
      if (!response.data || !response.data.accessToken || !response.data.user) {
        throw new Error('Invalid response from server: Missing required data');
      }
      
      console.log('✅ [Auth] Login successful');
      
      // Store auth data
      localStorage.setItem('accessToken', response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Set auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
      
      return response.data;
    } catch (error: any) {
      console.error('❌ [Auth] Login failed:', error);
      // Clear any partial auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      throw error;
    }
  },

  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log('📝 [Auth] Attempting signup for:', email);
      const response = await api.post('/auth/register', { name, email, password });
      
      if (response.data.accessToken) {
        console.log('✅ [Auth] Signup successful');
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Set auth header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ [Auth] Signup failed:', error);
      throw error;
    }
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    try {
      console.log('📧 [Auth] Requesting password reset for:', email);
      const response = await api.post('/auth/forgot-password', { email });
      console.log('✅ [Auth] Password reset email sent');
      return response.data;
    } catch (error) {
      console.error('❌ [Auth] Password reset request failed:', error);
      throw error;
    }
  },

  logout: () => {
    console.log('🚪 [Auth] Logging out user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    
    // Remove auth header
    delete api.defaults.headers.common['Authorization'];
    
    // Redirect to home
    window.location.href = '/';
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('❌ [Auth] Error getting current user:', error);
      return null;
    }
  },

  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  isAuthenticated: () => {
    const accessToken = localStorage.getItem('accessToken');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    return isAuth && !!accessToken;
  },

  // Initialize auth state from storage
  initializeAuth: () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
  },

  // Manually refresh the token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_URL}/auth/refresh-token`, {
        refreshToken
      });

      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
        return response.data.accessToken;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('❌ [Auth] Token refresh failed:', error);
      authService.logout();
      throw error;
    }
  }
};

// Initialize auth headers on service import
authService.initializeAuth(); 