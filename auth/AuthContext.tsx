import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { User } from "../types/ui/User";
import { logout as authLogout, getToken, getUserProfile } from "./authService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  refreshAuth: () => Promise<void>; // refresh after login
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check AsyncStorage after login
  const refreshAuth = useCallback(async () => {
    try {
      const token = await getToken();
      if (token) {
        const profile = await getUserProfile();
        setUser(profile);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. On mounted check if user is connected
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // Logout : clean Async storage and update UI
  const signOut = useCallback(async () => {
    await authLogout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, isLoading, refreshAuth, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
