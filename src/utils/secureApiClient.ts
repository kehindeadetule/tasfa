import { API_BASE_URL } from "@/config/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export class SecureApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Add security headers
      const headers = {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        ...options.headers,
      };

      // Add timestamp for request freshness
      const url = new URL(`${this.baseUrl}${endpoint}`);
      url.searchParams.set("_t", Date.now().toString());

      const response = await fetch(url.toString(), {
        ...options,
        headers,
        // Note: credentials removed since we use JWT tokens, not sessions
        // Add timeout
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Invalid response format");
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error status codes
        if (response.status === 429) {
          throw {
            message:
              "Rate limit exceeded. Please wait a moment before trying again.",
            status: 429,
            code: "RATE_LIMIT_EXCEEDED",
          } as ApiError;
        }

        if (response.status === 403) {
          throw {
            message:
              data.message ||
              "You have already voted for this category. Please wait 24 hours before voting again.",
            status: 403,
            code: "ALREADY_VOTED",
          } as ApiError;
        }

        if (response.status === 401) {
          throw {
            message: data.message || "Authentication required",
            status: 401,
            code: "UNAUTHORIZED",
          } as ApiError;
        }

        if (response.status === 500) {
          throw {
            message: "Server error. Please try again later.",
            status: 500,
            code: "SERVER_ERROR",
          } as ApiError;
        }

        throw new Error(data.message || data.error || "Request failed");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        // Log error in development only
        if (process.env.NODE_ENV === "development") {
          console.error("API Error:", error.message);
        }

        throw {
          message: error.message,
          status: error.name === "AbortError" ? 408 : undefined,
          code: error.name,
        } as ApiError;
      }

      throw {
        message: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
      } as ApiError;
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("tasfa_a_t");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async get<T>(
    endpoint: string,
    requireAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    const headers = requireAuth ? this.getAuthHeaders() : {};
    return this.makeRequest<T>(endpoint, {
      method: "GET",
      headers,
    });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    requireAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    const headers = requireAuth ? this.getAuthHeaders() : {};
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    requireAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    const headers = requireAuth ? this.getAuthHeaders() : {};
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary
        "X-Requested-With": "XMLHttpRequest",
        ...headers,
      },
    });
  }

  // Email Authentication methods
  async requestSignupOTP(
    email: string,
    password: string
  ): Promise<ApiResponse> {
    return this.post(
      "/api/email-auth/signup/request-otp",
      {
        email,
        password,
      },
      false
    );
  }

  async verifySignupOTP(
    email: string,
    otp: string,
    password: string
  ): Promise<ApiResponse> {
    return this.post(
      "/api/email-auth/signup/verify-otp",
      {
        email,
        otp,
        password,
      },
      false
    );
  }

  async login(email: string, password: string): Promise<ApiResponse> {
    return this.post(
      "/api/email-auth/login",
      {
        email,
        password,
      },
      false
    );
  }

  async getProfile(): Promise<ApiResponse> {
    return this.get("/api/email-voting/profile");
  }

  async verifyToken(): Promise<ApiResponse> {
    return this.get("/api/email-auth/verify-token");
  }

  async logout(): Promise<ApiResponse> {
    return this.post("/api/email-auth/logout");
  }

  // Email voting methods
  async getVoteCounts(): Promise<ApiResponse> {
    return this.get("/api/email-voting/counts");
  }

  async getMyVotingStatus(): Promise<ApiResponse> {
    return this.get("/api/email-voting/voting-limits");
  }

  async getMyVotingHistory(): Promise<ApiResponse> {
    return this.get("/api/email-voting/voting-history");
  }

  async submitVote(
    participantId: string,
    awardCategory: string
  ): Promise<ApiResponse> {
    return this.post("/api/email-voting/vote", {
      participantId,
      categoryId: awardCategory,
    });
  }

  async getCategoryParticipants(category: string): Promise<ApiResponse> {
    return this.get(
      `/api/email-voting/category/${encodeURIComponent(category)}`
    );
  }

  async getRecentVotes(): Promise<ApiResponse> {
    return this.get("/api/email-voting/recent", false);
  }

  async checkVotingPermission(categoryId: string): Promise<ApiResponse> {
    return this.get(`/api/email-voting/can-vote/${categoryId}`);
  }
}

// Singleton instance
export const apiClient = new SecureApiClient();

// Utility functions with proper error handling
export const handleApiError = (error: ApiError): string => {
  switch (error.code) {
    case "AbortError":
      return "Request timed out. Please try again.";
    case "TypeError":
      return "Network error. Please check your connection.";
    case "RATE_LIMIT_EXCEEDED":
      return "You're voting too quickly. Please wait a moment before trying again.";
    case "ALREADY_VOTED":
      return "You have already voted for this category. Please wait 24 hours before voting again.";
    case "UNAUTHORIZED":
      return "Please log in to continue.";
    case "SERVER_ERROR":
      return "Server error. Please try again later.";
    case "QUEUE_ERROR":
      return "Vote processing is temporarily unavailable. Please try again in a moment.";
    case "FAKE_EMAIL_DETECTED":
      return "Temporary email addresses are not allowed";
    case "BOT_EMAIL_DETECTED":
      return "Suspicious email pattern detected";
    case "DUPLICATE_EMAIL":
      return "Email already used recently. Please use a different email or wait 24 hours.";
    case "EMAIL_NOT_VERIFIED":
      return "Please verify your email address before voting";
    case "VOTING_LIMIT_EXCEEDED":
      return `You can vote again in ${error?.remainingHours} hours`;
    case "RATE_LIMITED":
      return "Too many requests. Please try again later.";
    case "UNKNOWN_ERROR":
      return "An unexpected error occurred. Please try again.";
    default:
      return error.message || "Something went wrong. Please try again.";
  }
};

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 255); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, "");
  const nigerianPhoneRegex = /^(234|0)?[789][01]\d{8}$/;
  return nigerianPhoneRegex.test(cleanPhone);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};
