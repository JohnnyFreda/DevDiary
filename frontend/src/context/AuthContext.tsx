import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../api/auth';
import { mockAuth } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  devBypass: () => Promise<void>;
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
    // Check if user is already authenticated on mount
    const checkAuth = async () => {
      try {
        const userData = await mockAuth.getMe();
        setUser(userData);
      } catch (error) {
        // Not authenticated - this is normal
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    await mockAuth.login({ email, password });
    const userData = await mockAuth.getMe();
    setUser(userData);
  };

  const register = async (email: string, password: string) => {
    await mockAuth.register({ email, password });
    await login(email, password);
  };

  const logout = async () => {
    await mockAuth.logout();
    setUser(null);
  };

  const devBypass = async () => {
    if (import.meta.env.DEV) {
      const devEmail = 'dev@example.com';
      const devPassword = 'dev123';

      try {
        // Try to register (will fail if exists, that's ok)
        try {
          await mockAuth.register({ email: devEmail, password: devPassword });
        } catch (e: any) {
          // User might already exist, that's fine
          if (e.message.includes('already registered')) {
            // Continue to login
          } else {
            throw e;
          }
        }

        // Login with dev credentials
        await login(devEmail, devPassword);
      } catch (error: any) {
        console.error('Dev bypass error:', error);
        throw new Error(`Dev bypass failed: ${error.message || 'Unknown error'}`);
      }
    } else {
      throw new Error('Dev bypass is only available in development mode');
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
        devBypass,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
