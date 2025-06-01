// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  ENDPOINTS: {
    HEALTH: "/api/health/",
    VALIDATE_ADDRESS: "/api/validate-address/",
    UTILITIES: "/api/utilities/",
    SUBSCRIBERS: "/api/subscribers/",
  },
  TIMEOUT: 10000, // 10 seconds
} as const;

// HTTP client configuration
export const defaultHeaders = {
  "Content-Type": "application/json",
};

export const buildUrl = (endpoint: string, params?: string) => {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, ""); // Remove trailing slash
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return params ? `${baseUrl}${path}${params}` : `${baseUrl}${path}`;
};
