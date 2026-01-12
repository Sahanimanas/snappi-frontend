import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authAPI, getToken, getStoredUser, removeToken, User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  const loadUser = async () => {
    const token = getToken();
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Try to get user from storage first (for quick UI)
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }

    // Then verify with server
    try {
      const result = await authAPI.getMe();
      if (result.success && result.data) {
        setUser(result.data);
      } else {
        // Token is invalid, clear it
        removeToken();
        setUser(null);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const signOut = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      removeToken();
      setUser(null);
      window.location.href = "/signin";
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
