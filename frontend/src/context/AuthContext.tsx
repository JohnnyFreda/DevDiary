import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  guestLogin: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session: refresh token (cookie) → access token → getMe
    const checkAuth = async () => {
      try {
        await authApi.refresh();
        const userData = await authApi.getMe();
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    await authApi.login({ email, password });
    const userData = await authApi.getMe();
    setUser(userData);
  };

  const register = async (email: string, password: string) => {
    await authApi.register({ email, password });
    await login(email, password);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const guestLogin = async () => {
    const guestEmail = 'guest@example.com';
    const guestPassword = 'guest123';

    try {
      try {
        await authApi.register({ email: guestEmail, password: guestPassword });
      } catch (e: unknown) {
        const err = e as { response?: { data?: { detail?: string } } };
        if (err.response?.data?.detail !== 'Email already registered') {
          throw e;
        }
      }
      await login(guestEmail, guestPassword);
    } catch (error: unknown) {
      console.error('Guest login error:', error);
      const msg = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Guest login failed: ${msg}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        guestLogin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
