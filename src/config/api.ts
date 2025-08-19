// API Configuration
const API_CONFIG = {
  // Development: Local backend
  development: "https://tasfa-be.onrender.com",
  // Production: AWS Lambda API Gateway
  production: "https://tasfa-be.onrender.com",
  // Staging: AWS Lambda API Gateway (same as production for now)
  staging: "https://tasfa-be.onrender.com",
};

// Get the current environment
const getEnvironment = (): "development" | "production" | "staging" => {
  // Use environment variable first, then fallback to hostname detection
  const envFromConfig = process.env.NEXT_PUBLIC_ENV as
    | "development"
    | "production"
    | "staging";
  if (envFromConfig) {
    return envFromConfig;
  }

  // Client-side: check if we're on localhost
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.includes("localhost")
    ) {
      return "development";
    }
    // Add your staging domain here
    if (hostname.includes("staging") || hostname.includes("dev")) {
      return "staging";
    }
  }

  // Default to production for safety
  return "production";
};

// Export the base API URL
export const API_BASE_URL = API_CONFIG[getEnvironment()];

// Export individual endpoint URLs
export const API_ENDPOINTS = {
  votes: `${API_BASE_URL}/api/votes`,
  voteCounts: `${API_BASE_URL}/api/votes/counts`,
  votingStatus: `${API_BASE_URL}/api/votes/voting-status`,
  votingHistory: `${API_BASE_URL}/api/votes/voting-history`,
  category: (category: string) =>
    `${API_BASE_URL}/api/votes/category/${category}`,
  queueStatus: `${API_BASE_URL}/api/votes/queue-status`,
  sessionDebug: `${API_BASE_URL}/api/votes/session-debug`,
  health: `${API_BASE_URL}/health`,
};

// Export the environment for debugging
export const CURRENT_ENV = getEnvironment();
