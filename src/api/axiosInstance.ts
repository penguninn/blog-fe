import axios, { AxiosError } from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, removeTokens } from '../utils/tokenStorage';
import { AuthTokens } from '../types/auth.types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Biến để kiểm soát refresh token đang xử lý
let isRefreshing = false;
// Hàng đợi các requests đang chờ refresh token
let failedQueue: Array<{
  resolve: (value: string | PromiseLike<string>) => void;
  reject: (reason?: any) => void;
}> = [];

// Xử lý queue khi refresh token thành công hoặc thất bại
const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, thêm request vào hàng đợi
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        // Nếu không có refresh token, logout
        removeTokens();
        // Chuyển hướng về trang login
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Gọi API refresh token
        const response = await axios.post<AuthTokens>(
          `${BASE_URL}/auth/login`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Lưu tokens mới
        saveTokens({ accessToken, refreshToken: newRefreshToken });
        
        // Cập nhật header cho request hiện tại
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        // Xử lý hàng đợi các requests đang chờ
        processQueue(null, accessToken);
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token thất bại, logout
        processQueue(refreshError as AxiosError, null);
        removeTokens();
        // Chuyển hướng về trang login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 