import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthTokens, User, AuthState } from '@/types/auth.types';
import { getAccessToken, getRefreshToken, getUser, removeTokens, saveTokens, saveUser } from '@/utils/tokenStorage';
import { extractUserFromToken, logout as apiLogout } from '@/api/authService';
import { startTokenLifecycle, stopTokenLifecycle } from '@/utils/tokenLifecycle';

interface AuthContextType extends AuthState {
  login: (authResponse: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Load user session from localStorage
    const loadUserSession = () => {
      try {
        const storedToken = getAccessToken();
        const storedRefreshToken = getRefreshToken();
        const storedUser = getUser();
        
        if (storedToken && storedRefreshToken && storedUser) {
          // Check token expiration
          try {
            const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            if (tokenPayload.exp && tokenPayload.exp > currentTime) {
              setAccessToken(storedToken);
              setRefreshToken(storedRefreshToken);
              setUser(storedUser);
              setIsAuthenticated(true);
              
              // Bắt đầu kiểm tra vòng đời token
              startTokenLifecycle();
            } else {
              // Token expired, will be refreshed automatically by Axios Interceptor when calling API
              setUser(storedUser);
              setAccessToken(storedToken);
              setRefreshToken(storedRefreshToken);
              setIsAuthenticated(true);
              
              // Bắt đầu kiểm tra vòng đời token ngay lập tức
              startTokenLifecycle();
            }
          } catch (error) {
            console.error('Error parsing token:', error);
            removeTokens();
          }
        }
      } catch (error) {
        console.error('Error restoring auth state:', error);
        removeTokens();
      } finally {
        setIsInitialized(true);
      }
    };

    loadUserSession();
    
    // Cleanup function để dừng kiểm tra khi unmount
    return () => {
      stopTokenLifecycle();
    };
  }, []);

  const login = (authResponse: AuthTokens) => {
    try {
      setAccessToken(authResponse.accessToken);
      setRefreshToken(authResponse.refreshToken);
      
      // Decode token to get user information
      const userData = extractUserFromToken(authResponse.accessToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Save tokens and user to localStorage
      saveTokens(authResponse);
      saveUser(userData);
      
      // Bắt đầu kiểm tra vòng đời token
      startTokenLifecycle();
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      // Call logout API (if needed)
      if (isAuthenticated) {
        await apiLogout();
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Dừng kiểm tra token khi đăng xuất
      stopTokenLifecycle();
      
      // Always delete data whether API succeeds or fails
      setIsAuthenticated(false);
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      removeTokens();
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    accessToken,
    refreshToken,
    login,
    logout,
  };

  if (!isInitialized) {
      // Can display loading if needed
    return null;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 