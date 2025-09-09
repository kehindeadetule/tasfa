import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/api";

interface User {
  id: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  isActive?: boolean;
  lastLoginAt?: string;
  securityFlags?: {
    isFakeEmail: boolean;
    isBotEmail: boolean;
    riskScore: number;
    flaggedReasons: string[];
  };
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
  const router = useRouter();
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
        const token = localStorage.getItem("tasfa_a_t");
        const userData = localStorage.getItem("emailUserData");

        if (token && userData) {
          const user = JSON.parse(userData);

          // Check if user is not verified and logout immediately
          if (!user.isVerified) {
            console.warn("User is not verified, logging out automatically");
            // Clear localStorage
            localStorage.removeItem("tasfa_a_t");
            localStorage.removeItem("emailUserData");
            setAuthState({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return;
          }

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
    async (userData: User, token: string): Promise<LoginResponse> => {
      try {
        // Clear any existing voting data to prevent cross-account contamination
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (
            key.startsWith("tasfa_vote_") ||
            key.startsWith("tasfa_voted_") ||
            key.startsWith("voting_state_") ||
            key.startsWith("tasfa_voting_")
          ) {
            localStorage.removeItem(key);
          }
        });

        // Store auth data in localStorage
        localStorage.setItem("tasfa_a_t", token);
        localStorage.setItem("emailUserData", JSON.stringify(userData));

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
    localStorage.removeItem("tasfa_a_t");
    localStorage.removeItem("emailUserData");

    // Clear ALL voting-related data to prevent cross-account contamination
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (
        key.startsWith("tasfa_vote_") ||
        key.startsWith("tasfa_voted_") ||
        key.startsWith("voting_state_") ||
        key.startsWith("tasfa_voting_")
      ) {
        localStorage.removeItem(key);
      }
    });

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // Use Next.js router for safer client-side navigation
    router.push("/");
  }, [router]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("tasfa_a_t");
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/api/email-auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem("tasfa_a_t", data.token);
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
    const token = authState.token || localStorage.getItem("tasfa_a_t");
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

  // Check token validity and user verification on mount and periodically
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("tasfa_a_t");
      if (token && isTokenExpired(token)) {
        refreshToken();
      }
    };

    const checkUserVerification = () => {
      // Check if user is authenticated but not verified
      if (
        authState.isAuthenticated &&
        authState.user &&
        !authState.user.isVerified
      ) {
        console.warn("User is not verified, logging out automatically");
        logout();
      }
    };

    // Check immediately
    checkTokenValidity();
    checkUserVerification();

    // Check every 5 minutes
    const interval = setInterval(() => {
      checkTokenValidity();
      checkUserVerification();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [
    isTokenExpired,
    refreshToken,
    authState.isAuthenticated,
    authState.user,
    logout,
  ]);

  return {
    ...authState,
    login,
    logout,
    refreshToken,
    getAuthHeaders,
  };
};
