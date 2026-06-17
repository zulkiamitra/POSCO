import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { defaultCredentials } from "../data/dummyData";

const AuthContext = createContext(null);

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

const readStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    localStorage.removeItem("user");
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const loading = false;

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  // Session timeout: 30 minutes
  useEffect(() => {
    if (!user) return;

    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    
    let timeoutId;

    const resetTimeout = () => {
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
  }, [user, logout]);

  // Verify token on mount/startup
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${apiBaseUrl}/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.status === 401 || response.status === 404) {
          console.warn("🔐 Session is invalid or expired. Logging out...");
          logout();
        } else {
          const data = await response.json();
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          }
        }
      } catch (error) {
        console.error("Error verifying session token:", error);
      }
    };

    verifySession();
  }, [logout]);

  const login = useCallback(async (role, email, password) => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Kredensial tidak valid.");
      }

      if (data?.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        return data.user;
      }
      return null;
    } catch (error) {
      console.error("Backend login error:", error);
      throw error;
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role || "orangtua",
          nik: userData.nik,
          phone: userData.phone,
          wilayah: userData.wilayah,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || "Pendaftaran gagal.");
      }

      if (data?.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      return data?.user ?? null;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }, []);

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
