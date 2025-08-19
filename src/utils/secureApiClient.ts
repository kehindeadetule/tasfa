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

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async postFormData<T>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary
        "X-Requested-With": "XMLHttpRequest",
      },
    });
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
