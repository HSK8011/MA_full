// Note: In Vite, environment variables must be prefixed with VITE_
// Access them using import.meta.env.VITE_VARIABLE_NAME

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

// Authentication Configuration
export const AUTH_TOKEN_KEY = 'token';
export const AUTH_USER_KEY = 'user';
export const AUTH_STATUS_KEY = 'isAuthenticated';

// Error Messages
export const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred. Please try again.';
export const AUTH_ERROR_MESSAGE = 'Authentication failed. Please log in again.';
export const NETWORK_ERROR_MESSAGE = 'Network error. Please check your connection.';

// Integration Platforms
export const SUPPORTED_PLATFORMS = {
  TWITTER: 'twitter',
  FACEBOOK: 'facebook',
  LINKEDIN: 'linkedin',
  INSTAGRAM: 'instagram',
  PINTEREST: 'pinterest'
} as const;

// Integration Status
export const INTEGRATION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ERROR: 'error',
  PENDING: 'pending'
} as const;

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout'
  },
  CONNECT: {
    ACCOUNTS: '/connect/accounts',
    ADD: '/connect/add',
    REMOVE: '/connect/remove',
    REFRESH: '/connect/refresh'
  }
} as const; 