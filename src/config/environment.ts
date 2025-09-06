// Environment configuration for API endpoints
export const API_CONFIG = {
  // Backend API base URL - change this to match your backend server
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",

  // Development fallback
  DEV_BASE_URL: "http://localhost:3001",

  // Production fallback (update this for production deployment)
  PROD_BASE_URL: "https://your-backend-domain.com",
};

// Get the appropriate API base URL based on environment
export const getApiBaseUrl = (): string => {
  if (process.env.NODE_ENV === "production") {
    return API_CONFIG.PROD_BASE_URL;
  }

  return API_CONFIG.BASE_URL;
};

// Export the current API base URL
export const API_BASE_URL = getApiBaseUrl();
