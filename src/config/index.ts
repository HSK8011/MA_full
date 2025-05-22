// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ma-full.onrender.com/';

// Social Media Platforms Configuration
export const SUPPORTED_PLATFORMS = [
  'twitter',
  'facebook',
  'linkedin',
  'instagram',
  'pinterest'
] as const;

// Other Configuration
export const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.'; 
