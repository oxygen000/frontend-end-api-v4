import axios from 'axios';

// Configure axios with defaults
export const API_URL = 'https://backend-fast-api-ai.fly.dev/api';

// Create axios instance with optimized common configuration
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Keep reasonable timeout that won't cause premature failures
  headers: {
    'Content-Type': 'application/json',
  },
  // Add retry mechanism to make connections more resilient
  // This requires axios-retry package, which should be added as a dependency
  // But we'll implement it manually with interceptors if not available
});

// Add request interceptor for authentication
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add timestamp to GET requests to bypass cache when needed
  if (config.method?.toLowerCase() === 'get' && config.params?.bypassCache) {
    const timestamp = new Date().getTime();
    config.params = { ...config.params, _t: timestamp };
    delete config.params.bypassCache;
  }

  return config;
});

// Implement a simple retry mechanism for failed requests
let retryCount = 0;
const MAX_RETRIES = 2;

// Add response interceptor for error handling with retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Don't retry for certain status codes
    const skipRetry =
      error.response?.status === 400 || // Bad request
      error.response?.status === 401 || // Unauthorized
      error.response?.status === 403 || // Forbidden
      error.response?.status === 404; // Not found

    // Original request config
    const originalRequest = error.config;

    // Only retry if we haven't already retried too many times and it's not a status code we want to skip
    if (retryCount < MAX_RETRIES && !skipRetry && !originalRequest._retry) {
      retryCount++;
      originalRequest._retry = true;

      console.log(
        `API request failed, retrying (${retryCount}/${MAX_RETRIES})...`,
        error.message
      );

      // Wait a bit before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));

      // Retry the request
      return apiClient(originalRequest);
    }

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('API Error:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data,
      });
    }

    // Reset retry count for next sequence of requests
    retryCount = 0;

    return Promise.reject(error);
  }
);

export default apiClient;
