import { jwtDecode } from 'jwt-decode';
import { getAccessToken, getRefreshToken, saveTokens } from './tokenStorage';
import axios from 'axios';

// Thời gian kiểm tra token (mỗi 30 giây)
const CHECK_INTERVAL = 30 * 1000;

// Thời gian trước khi token hết hạn cần refresh (1 phút)
const REFRESH_THRESHOLD = 60; // seconds

let tokenCheckInterval: number | null = null;

/**
 * Kiểm tra thời gian còn lại của token
 * @returns Thời gian còn lại tính bằng giây, hoặc -1 nếu không có token hoặc token không hợp lệ
 */
export const getTokenRemainingTime = (token: string | null): number => {
  if (!token) return -1;
  
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp - currentTime;
  } catch {
    return -1;
  }
};

/**
 * Refresh token
 */
export const refreshToken = async (): Promise<boolean> => {
  try {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      console.warn('No refresh token available');
      return false;
    }
    
    const response = await axios.post(
      'http://localhost:8080/api/auth/refresh-token',
      {},
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        } 
      }
    );
    
    // Kiểm tra cấu trúc response
    console.log('Refresh token response:', response.data);
    
    // API trả về { status, message, data: { accessToken, refreshToken } }
    if (response.data && response.data.status === 200 && response.data.data) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      
      // Log để debug
      console.log('New tokens:', { accessToken, refreshToken: newRefreshToken });
      
      // Save new tokens
      saveTokens({ accessToken, refreshToken: newRefreshToken });
      
      console.log('Token refreshed successfully');
      return true;
    } else {
      console.error('Invalid response format:', response.data);
      return false;
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return false;
  }
};

/**
 * Kiểm tra và refresh token nếu cần
 */
export const checkAndRefreshToken = async (): Promise<void> => {
  const token = getAccessToken();
  const remainingTime = getTokenRemainingTime(token);
  
  console.log(`Token remaining time: ${remainingTime.toFixed(0)} seconds`);
  
  if (remainingTime > 0 && remainingTime < REFRESH_THRESHOLD) {
    console.log('Token is about to expire, refreshing...');
    await refreshToken();
  }
};

/**
 * Bắt đầu kiểm tra token định kỳ
 */
export const startTokenLifecycle = (): void => {
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
  }
  
  // Kiểm tra ngay lập tức
  checkAndRefreshToken();
  
  // Thiết lập interval để kiểm tra định kỳ
  tokenCheckInterval = window.setInterval(checkAndRefreshToken, CHECK_INTERVAL);
  console.log('Token lifecycle monitoring started');
};

/**
 * Dừng kiểm tra token
 */
export const stopTokenLifecycle = (): void => {
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
    tokenCheckInterval = null;
    console.log('Token lifecycle monitoring stopped');
  }
}; 