import { AuthTokens, User } from '../types/auth.types';

export const saveTokens = (tokens: AuthTokens): void => {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const saveUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

export const removeTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}; 