import axiosInstance from './axiosInstance';
import { AuthResponse, AuthTokens, User } from '../types/auth.types';
import { jwtDecode } from 'jwt-decode';

// API login
export const login = async (username: string, password: string): Promise<{ user: User; tokens: AuthTokens }> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', { username, password });
  
  if (response.data.status === 200) {
    const tokens = response.data.data;
    const user = extractUserFromToken(tokens.accessToken);
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
  }
};

// API refresh token (backup if interceptor doesn't work)
export const refreshToken = async (refreshToken: string): Promise<AuthTokens> => {
  const response = await axiosInstance.post<{ data: AuthTokens }>('/auth/refresh-token', { refreshToken });
  return response.data.data;
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