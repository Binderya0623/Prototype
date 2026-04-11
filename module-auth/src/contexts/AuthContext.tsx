import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockLoginWithStored, mockRegister, UserRole, ROLE_REDIRECT_MAP } from '@/services/mockAuthService';

interface AuthUser {
  username: string;
  displayName: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, rememberMe: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'mauth_current_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Апп ачааллах үед хадгалагдсан хэрэглэгчийг сэргээнэ
    const saved =
      localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = async (username: string, password: string, rememberMe: boolean) => {
    const result = await mockLoginWithStored(username, password);

    if (result.success && result.user) {
      const userData: AuthUser = {
        username: result.user.username,
        displayName: result.user.displayName,
        role: result.user.role,
      };

      setUser(userData);

      // rememberMe → localStorage, эс бол sessionStorage
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEY, JSON.stringify(userData));

      // Дүрд тохирох JSF хуудас руу чиглүүлэх
      const redirectUrl = ROLE_REDIRECT_MAP[result.user.role];
      window.location.href = redirectUrl;

      return { success: true };
    }

    return { success: false, error: result.error };
  };

  const register = async (username: string, password: string, role: UserRole = 'student') => {
    const result = await mockRegister(username, password, role);

    if (result.success) {
      return { success: true };
    }

    return { success: false, error: result.error };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = '/login.xhtml';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
