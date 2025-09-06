// API Configuration
const API_CONFIG = {
  // Development: Use environment variable or fallback to localhost
  development:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://tasfa-be.onrender.com",
  // Production: Use environment variable or fallback to production URL
  production:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://tasfa-be.onrender.com",
  // Staging: Use environment variable or fallback to staging URL
  staging:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://tasfa-be.onrender.com",
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
  votes: `${API_BASE_URL}/api/secure-votes`,
  voteCounts: `${API_BASE_URL}/api/secure-votes/counts`,
  votingStatus: `${API_BASE_URL}/api/secure-votes/my-status`,
  votingHistory: `${API_BASE_URL}/api/secure-votes/my-history`,
  category: (category: string) =>
    `${API_BASE_URL}/api/secure-votes/category/${category}`,
  queueStatus: `${API_BASE_URL}/api/secure-votes/queue-status`,
  sessionDebug: `${API_BASE_URL}/api/secure-votes/session-debug`,
  health: `${API_BASE_URL}/health`,
};

// Export the environment for debugging
export const CURRENT_ENV = getEnvironment();
