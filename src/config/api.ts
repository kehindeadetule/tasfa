// API Configuration
const API_CONFIG = {
  // Development: Local backend
  development: 'https://tasfa.onrender.com',
  // Production: AWS Lambda API Gateway
  production: 'https://tasfa.onrender.com',
  // Staging: AWS Lambda API Gateway (same as production for now)
  staging: 'https://tasfa.onrender.com'
};

// Get the current environment
const getEnvironment = (): 'development' | 'production' | 'staging' => {
  // Force use of Lambda API Gateway for testing
  // Change this to 'development' when you want to use local backend
  return 'development';
  
  // Original logic (commented out for now):
  /*
  if (typeof window !== 'undefined') {
    // Client-side: check if we're on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'development';
    }
  }
  
  // Server-side or production: use environment variable or default to production
  return (process.env.NEXT_PUBLIC_ENV as 'development' | 'production' | 'staging') || 'production';
  */
};

// Export the base API URL
export const API_BASE_URL = API_CONFIG[getEnvironment()];

// Export individual endpoint URLs
export const API_ENDPOINTS = {
  votes: `${API_BASE_URL}/api/votes`,
  voteCounts: `${API_BASE_URL}/api/votes/counts`,
  votingStatus: `${API_BASE_URL}/api/votes/voting-status`,
  votingHistory: `${API_BASE_URL}/api/votes/voting-history`,
  category: (category: string) => `${API_BASE_URL}/api/votes/category/${category}`,
  health: `${API_BASE_URL}/health`,
  corsTest: `${API_BASE_URL}/cors-test`
};

// Export the environment for debugging
export const CURRENT_ENV = getEnvironment();

console.log('API Configuration:', {
  environment: CURRENT_ENV,
  baseUrl: API_BASE_URL,
  endpoints: API_ENDPOINTS
}); 