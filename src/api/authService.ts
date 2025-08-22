import axiosInstance from './axiosInstance';
import { AuthResponse, AuthTokens, User } from '../types/auth.types';
import { jwtDecode } from 'jwt-decode';
import { startTokenLifecycle, stopTokenLifecycle } from '../utils/tokenLifecycle';
import { removeTokens } from '../utils/tokenStorage';

// API login
export const login = async (username: string, password: string): Promise<{ user: User; tokens: AuthTokens }> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', { username, password });
  
  if (response.data.status === 200) {
    const tokens = response.data.data;
    const user = extractUserFromToken(tokens.accessToken);
    
    // Bắt đầu quản lý vòng đời token sau khi đăng nhập thành công
    startTokenLifecycle();
    
    return { user, tokens };
  }
  
  throw new Error(response.data.message || 'Login failed');
};

// API logout (if needed)
export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    // Dừng quản lý vòng đời token khi đăng xuất
    stopTokenLifecycle();
    removeTokens();
  }
};

// Decode JWT token to get user information
export const extractUserFromToken = (token: string): User => {
  try {
    interface DecodedToken {
      sub: string;
      roles?: string[];
      [key: string]: unknown;
    }
    
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      username: decoded.sub,
      roles: decoded.roles || [],
      ...decoded
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    throw new Error('Invalid token');
  }
};

// Kiểm tra và khởi động quản lý vòng đời token nếu người dùng đã đăng nhập
export const initializeAuth = (): void => {
  // Nếu có accessToken, bắt đầu kiểm tra vòng đời
  if (localStorage.getItem('accessToken')) {
    startTokenLifecycle();
  }
}; 