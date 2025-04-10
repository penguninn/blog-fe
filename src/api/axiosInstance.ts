import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, removeTokens } from '../utils/tokenStorage';
import { AuthTokens } from '../types/auth.types';

// Get API URL from environment variables
const BASE_URL = import.meta.env.VITE_API_URL;

// Debug log to check loaded environment variables
console.log('Environment API URL:', import.meta.env.VITE_API_URL);
console.log('Using API URL:', BASE_URL);

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
 * Perform token refresh
 */
const refreshAuthToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const response = await axios.post<AuthTokens>(
    `${BASE_URL}/auth/login`,
    { refreshToken },
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  const { accessToken, refreshToken: newRefreshToken } = response.data;
  
  // Save new tokens
  saveTokens({ accessToken, refreshToken: newRefreshToken });
  
  return accessToken;
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
    
    // Redirect to login (with environment check)
    if (typeof window !== 'undefined') {
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
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log the request URL for debugging
    console.log(`Request to: ${config.baseURL}${config.url}`);
    
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Only handle 401 errors and not already retried requests
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleUnauthorized(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 