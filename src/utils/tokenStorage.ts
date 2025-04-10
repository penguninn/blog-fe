import { AuthTokens, User } from '../types/auth.types';

const TOKEN_STORAGE_PREFIX = 'pengunin_';
const ACCESS_TOKEN_KEY = `${TOKEN_STORAGE_PREFIX}accessToken`;
const REFRESH_TOKEN_KEY = `${TOKEN_STORAGE_PREFIX}refreshToken`;
const USER_KEY = `${TOKEN_STORAGE_PREFIX}user`;

/**
 * Save tokens to localStorage with safety checks
 */
export const saveTokens = (tokens: AuthTokens): void => {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  } catch (error) {
    console.error('Failed to save tokens to localStorage:', error);
  }
};

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get access token from localStorage:', error);
    return null;
  }
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get refresh token from localStorage:', error);
    return null;
  }
};

/**
 * Save user info to localStorage
 */
export const saveUser = (user: User): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user to localStorage:', error);
  }
};

/**
 * Get user info from localStorage
 */
export const getUser = (): User | null => {
  try {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Failed to get user from localStorage:', error);
    return null;
  }
};

/**
 * Remove all authentication data from localStorage
 */
export const removeTokens = (): void => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Failed to remove tokens from localStorage:', error);
  }
}; 