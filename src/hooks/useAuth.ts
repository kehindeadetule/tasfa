import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "@/config/api";

interface User {
  phoneNumber: string;
  isVerified: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("tasfa_auth_token");
        const userData = localStorage.getItem("tasfa_user_data");

        if (token && userData) {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (phoneNumber: string, token: string): Promise<LoginResponse> => {
      try {
        // Store auth data in localStorage
        const userData = {
          phoneNumber,
          isVerified: true,
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem("tasfa_auth_token", token);
        localStorage.setItem("tasfa_user_data", JSON.stringify(userData));

        setAuthState({
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        return {
          success: true,
          token,
          user: userData,
        };
      } catch (error) {
        console.error("Login error:", error);
        return {
          success: false,
          message: "Failed to complete login",
        };
      }
    },
    []
  );

  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem("tasfa_auth_token");
    localStorage.removeItem("tasfa_user_data");

    // Clear voting data
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("tasfa_vote_")) {
        localStorage.removeItem(key);
      }
    });

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("tasfa_auth_token");
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem("tasfa_auth_token", data.token);
        setAuthState((prev) => ({
          ...prev,
          token: data.token,
        }));
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      return false;
    }
  }, [logout]);

  const getAuthHeaders = useCallback(() => {
    const token = authState.token || localStorage.getItem("tasfa_auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [authState.token]);

  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }, []);

  // Check token validity on mount and periodically
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("tasfa_auth_token");
      if (token && isTokenExpired(token)) {
        refreshToken();
      }
    };

    // Check immediately
    checkTokenValidity();

    // Check every 5 minutes
    const interval = setInterval(checkTokenValidity, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isTokenExpired, refreshToken]);

  return {
    ...authState,
    login,
    logout,
    refreshToken,
    getAuthHeaders,
  };
};
