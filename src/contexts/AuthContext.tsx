import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthTokens, User, AuthState } from '@/types/auth.types';
import { getAccessToken, getRefreshToken, getUser, removeTokens, saveTokens, saveUser } from '@/utils/tokenStorage';
import { extractUserFromToken, logout as apiLogout } from '@/api/authService';

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

  // Khôi phục phiên đăng nhập từ localStorage
  useEffect(() => {
    const loadUserSession = () => {
      try {
        const storedToken = getAccessToken();
        const storedRefreshToken = getRefreshToken();
        const storedUser = getUser();
        
        if (storedToken && storedRefreshToken && storedUser) {
          // Kiểm tra thời hạn token
          try {
            const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            if (tokenPayload.exp && tokenPayload.exp > currentTime) {
              setAccessToken(storedToken);
              setRefreshToken(storedRefreshToken);
              setUser(storedUser);
              setIsAuthenticated(true);
            } else {
              // Token đã hết hạn, sẽ được refresh tự động bởi Axios Interceptor khi gọi API
              setUser(storedUser);
              setAccessToken(storedToken);
              setRefreshToken(storedRefreshToken);
              setIsAuthenticated(true);
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
  }, []);

  const login = (authResponse: AuthTokens) => {
    try {
      setAccessToken(authResponse.accessToken);
      setRefreshToken(authResponse.refreshToken);
      
      // Giải mã token để lấy thông tin user
      const userData = extractUserFromToken(authResponse.accessToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Lưu tokens và user vào localStorage
      saveTokens(authResponse);
      saveUser(userData);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      // Gọi API logout (nếu cần)
      if (isAuthenticated) {
        await apiLogout();
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Luôn xóa dữ liệu bất kể API thành công hay thất bại
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
    // Có thể hiển thị loading nếu cần
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