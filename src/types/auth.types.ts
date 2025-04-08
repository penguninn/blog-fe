export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  username: string;
  [key: string]: any; 
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthResponse {
  status: number;
  message: string;
  data: AuthTokens;
} 