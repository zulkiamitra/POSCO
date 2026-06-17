import { createContext, useContext, useState, useEffect } from "react";
import { defaultCredentials } from "../data/dummyData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Session timeout: 30 minutes
  useEffect(() => {
    if (!user) return;

    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    
    let timeoutId;
    let lastActivityTime = Date.now();

    const resetTimeout = () => {
      lastActivityTime = Date.now();
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        console.warn("⏱️ Session expired due to inactivity");
        logout();
      }, SESSION_TIMEOUT);
    };

    // Attach activity listeners
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });

    // Initial timeout
    resetTimeout();

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout, true);
      });
    };
  }, [user]);

  const login = (role, email, password) => {
    const credentials = defaultCredentials[role];
    
    if (!credentials) {
      return false;
    }

    // Check email and password
    if (credentials.email === email && credentials.password === password) {
      // ✅ SECURITY FIX: Don't store password or email in localStorage
      const userData = {
        id: credentials.id,
        name: credentials.name,
        role: credentials.role,
        wilayah: credentials.wilayah,
        ...(credentials.posyandu && { posyandu: credentials.posyandu })
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const register = (userData) => {
    // This is a placeholder for future backend integration
    // For now, we'll just set the user as logged in
    const newUser = {
      id: Math.random(),
      ...userData,
      role: userData.role || "orangtua"
    };
    
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
