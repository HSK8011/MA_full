import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

class ApiService {
  private api: AxiosInstance;
  private isRefreshing: boolean = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        if (!originalRequest) {
          return Promise.reject(error);
        }

        // Check if error is token expired
        if (
          error.response?.status === 401 &&
          (error.response?.data as any)?.code === 'TOKEN_EXPIRED' &&
          !originalRequest._retry
        ) {
          if (this.isRefreshing) {
            // Wait for the token to be refreshed
            try {
              const token = await new Promise<string>((resolve, reject) => {
                this.refreshSubscribers.push((token: string) => {
                  resolve(token);
                });
              });
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.api(originalRequest);
            } catch (err) {
              return Promise.reject(err);
            }
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await this.api.post<TokenPair>('/auth/refresh-token', {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;
            
            // Store new tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            // Update authorization header
            this.api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            // Notify subscribers
            this.refreshSubscribers.forEach((callback) => callback(accessToken));
            this.refreshSubscribers = [];
            
            return this.api(originalRequest);
          } catch (refreshError) {
            // Clear tokens and notify subscribers of failure
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.refreshSubscribers.forEach((callback) => callback(''));
            this.refreshSubscribers = [];
            
            // Redirect to login
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Helper methods for common API operations
  async get<T>(url: string, config = {}) {
    return this.api.get<T>(url, config);
  }

  async post<T>(url: string, data = {}, config = {}) {
    return this.api.post<T>(url, data, config);
  }

  async put<T>(url: string, data = {}, config = {}) {
    return this.api.put<T>(url, data, config);
  }

  async delete<T>(url: string, config = {}) {
    return this.api.delete<T>(url, config);
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.api.post<TokenPair>('/auth/login', {
      email,
      password,
    });

    const { accessToken, refreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    return response;
  }

  async logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete this.api.defaults.headers.common.Authorization;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

export const apiService = new ApiService(); 