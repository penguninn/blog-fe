import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, removeTokens } from '../utils/tokenStorage';
import { AuthTokens } from '../types/auth.types';
import { jwtDecode } from 'jwt-decode';

declare module 'axios' {
  export interface AxiosRequestConfig {
    requiresAuth?: boolean;
  }
}

// Get API URL from environment variables
const BASE_URL = import.meta.env.VITE_API_URL;

// Flag to control refresh token processing
let isRefreshing = false;

// Type definition for queue
type QueueItem = {
  resolve: (value: string | PromiseLike<string>) => void;
  reject: (reason?: unknown) => void;
};

// Queue for requests waiting for token refresh
let failedQueue: QueueItem[] = [];

/**
 * Process queue when token refresh succeeds or fails
 */
const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  
  // Reset queue
  failedQueue = [];
};

/**
 * Check if token is expired or will expire soon (within 1 minute)
 */
const isTokenExpiredOrExpiringSoon = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000;
    const oneMinuteInSeconds = 60;
    return decoded.exp - currentTime < oneMinuteInSeconds;
  } catch {
    return true;
  }
};

/**
 * Perform token refresh
 */
const refreshAuthToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post<AuthTokens>(
      `${BASE_URL}/auth/refresh-token`,
      
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        } 
      }
    );
    
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    // Save new tokens
    saveTokens({ accessToken, refreshToken: newRefreshToken });
    
    return accessToken;
  } catch (error) {
    removeTokens();
    throw error;
  }
};

/**
 * Handle 401 Unauthorized error
 */
const handleUnauthorized = async (originalRequest: AxiosRequestConfig) => {
  if (isRefreshing) {
    // If already refreshing, add request to queue
    return new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
        }
        return axiosInstance(originalRequest);
      })
      .catch((err) => Promise.reject(err));
  }
  
  isRefreshing = true;
  
  try {
    const newToken = await refreshAuthToken();
    
    // Process queued requests
    processQueue(null, newToken);
    
    if (originalRequest.headers) {
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
    }
    
    return axiosInstance(originalRequest);
  } catch (refreshError) {
    // If refresh token fails, logout
    processQueue(refreshError as AxiosError, null);
    removeTokens();
    
    // Redirect to login only if refresh token is expired or invalid
    if (typeof window !== 'undefined' && 
        (refreshError instanceof AxiosError && 
         (refreshError.response?.status === 401 || refreshError.response?.status === 403))) {
      window.location.href = '/login';
    }
    
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
};

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Đảm bảo config.headers tồn tại
    config.headers = config.headers || {};
    
    // Luôn thêm token vào header nếu có
    const token = getAccessToken();
    if (token) {
      // Kiểm tra nếu token sắp hết hạn (trong vòng 1 phút)
      if (isTokenExpiredOrExpiringSoon(token)) {
        try {
          const newToken = await refreshAuthToken();
          config.headers['Authorization'] = `Bearer ${newToken}`;
        } catch (error) {
          console.error('Failed to refresh token:', error);
          // Không reject ở đây, để response interceptor xử lý
        }
      } else {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    // Log request để debug
    console.log('Request:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response để debug
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    // Log error để debug
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        headers: error.config?.headers
      }
    });

    const originalRequest = error.config;
    
    // Xử lý lỗi 401 (Unauthorized) - token hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleUnauthorized(originalRequest);
    }
    
    // Xử lý lỗi 403 (Forbidden) - không có quyền truy cập
    if (error.response?.status === 403) {
      console.error('Access denied: User does not have permission to access this resource');
      // Có thể thêm xử lý riêng cho lỗi 403 ở đây
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 