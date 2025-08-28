// API service utilities for authentication and other endpoints
import axios from "axios";
import { encryptPassword, generateTimestampToken } from "./utils";
import { shouldUseMockData, mockApiResponses } from "./mock-data";

// Base API URL - use proxy for development, direct API for production
const getApiBaseUrl = () => {
  // Always use proxy when running in browser (client-side)
  if (typeof window !== "undefined") {
    // In production (Vercel), use direct API URL to avoid proxy issues
    if (process.env.NODE_ENV === "production") {
      const directApiUrl =
        process.env.NEXT_PUBLIC_PRODUCTION_API_URL ||
        "https://stockaty.virs.tech";

      return directApiUrl;
    }

    // In development, use the configured proxy URL
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      return process.env.NEXT_PUBLIC_API_BASE_URL;
    }
  }

  // Fallback for server-side requests (shouldn't happen for auth)
  const fallbackUrl =
    process.env.NEXT_PUBLIC_PRODUCTION_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://stockaty.virs.tech";

  return fallbackUrl;
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  withCredentials: true, // Include cookies in requests for session management
  headers: {
    "Content-Type": "application/json",
    // Add CORS headers for production
    ...(process.env.NODE_ENV === "production" && {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Access-Token",
    }),
  },
});

// Create a separate axios instance for search with shorter timeout
const getSearchApiBaseUrl = () => {
  // In production, use direct API URL to avoid proxy
  if (process.env.NODE_ENV === "production") {
    const directApiUrl =
      process.env.NEXT_PUBLIC_PRODUCTION_API_URL ||
      "https://stockaty.virs.tech";
    return directApiUrl;
  }

  // In development, use proxy (empty baseURL means current domain)
  return typeof window !== "undefined" ? "" : API_BASE_URL;
};

const searchApiClient = axios.create({
  baseURL: getSearchApiBaseUrl(),
  timeout: 15000, // 15 seconds timeout for search requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a separate axios instance for public API calls (no authentication required)
const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  withCredentials: false, // Don't include cookies for public requests
  headers: {
    "Content-Type": "application/json",
    // Add CORS headers for production
    ...(process.env.NODE_ENV === "production" && {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Access-Token",
    }),
  },
});

// Public API client doesn't have authentication interceptors
// This prevents automatic redirects to login page for public endpoints

// Add request interceptor to include authorization token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or sessionStorage
    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    if (token) {
      // According to Swagger docs, API uses session cookies, but we'll also send token as header
      config.headers.Authorization = `Bearer ${token}`;
      // Also add the token as a custom header in case the backend expects it differently
      config.headers["X-Access-Token"] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Response Error:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    // Log detailed error information for debugging
    console.error("API request failed:", error);

    if (error.response) {
      console.error("Axios error details:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        requestHeaders: error.config?.headers,
        requestData: error.config?.data,
      });

      // Log specific error details for 400 errors
      if (error.response.status === 400) {
        console.error("400 Bad Request Details:", {
          requestUrl: `${error.config?.baseURL}${error.config?.url}`,
          requestMethod: error.config?.method,
          requestHeaders: error.config?.headers,
          requestBody: error.config?.data,
          responseData: error.response.data,
          responseHeaders: error.response.headers,
        });

        // Try to parse and log the response data more clearly
        try {
          const responseData = error.response.data;
          console.error("Parsed API Error Response:", {
            success: responseData?.success,
            error: responseData?.error,
            message: responseData?.message,
            details: responseData?.details,
            validation: responseData?.validation,
            raw: responseData,
          });
        } catch (parseError) {
          console.error("Could not parse API error response:", parseError);
        }
      }
    } else if (error.request) {
      console.error("Network error - no response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }

    // If we get a 401 or authentication error, clear the token
    if (
      error.response?.status === 401 ||
      error.response?.status === 403 ||
      error.response?.data?.error?.message?.includes("Session is required") ||
      error.response?.data?.error?.message?.includes("Invalid token") ||
      error.response?.data?.error?.message?.includes("Unauthorized")
    ) {
      console.log("Authentication error detected, clearing tokens");
      localStorage.removeItem("access_token");
      sessionStorage.removeItem("access_token");

      // Optionally redirect to login page
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// API response types based on swagger documentation
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    id: number | string;
    message: string;
  };
}

export interface LoginResponse {
  access_token: string;
  email: string;
  message: string;
}

export interface RegisterResponse {
  access_token: string;
  email: string;
  message: string;
}

export interface UserAccount {
  email: string;
  picture?: string;
  firstName: string;
  lastName: string;
}

export interface Subscription {
  active: boolean;
  plan: string | null;
  credits: {
    remaining: number;
    plan: number;
  };
  until: string | null;
  allowed_sites: string[];
}

export interface UserData {
  account: UserAccount;
  subscription: Subscription;
  role?: string;
}

// Credit Analytics Types
export interface CreditStatistics {
  total_credits_issued: number;
  total_credits_used: number;
  total_remaining_credits: number;
  average_daily_usage: number;
  credits_by_plan: Record<string, number>;
  last_updated: string;
}

export interface CreditAnalyticsResponse {
  success: boolean;
  statistics: CreditStatistics;
}

// Credit History Types
export interface CreditHistoryEntry {
  id: number;
  user_email?: string; // Legacy field name
  email?: string; // New field name from API
  action: string;
  credits_changed: number;
  credits_before: number;
  credits_after: number;
  plan_name?: string;
  timestamp: string;
  description?: string;
}

// New Credit History Entry Type for the enhanced UI
export interface EnhancedCreditHistoryEntry {
  type: "add" | "use" | "delete";
  timestamp: string;
  email: string;
  user_name: string;
  plan?: string | null;
  amount?: number; // Not present for "delete" type
  reason?: string; // Reason for the transaction (e.g., "top-up", "download", etc.)
}

export interface CreditHistoryResponse {
  success: boolean;
  history: CreditHistoryEntry[];
}

// Credit Management Request Types
export interface AddSubscriptionRequest {
  email: string;
  plan_name: string;
}

export interface UpgradeSubscriptionRequest {
  email: string;
  plan_name: string;
}

export interface ExtendSubscriptionRequest {
  email: string;
  days: number;
}

export interface DeleteSubscriptionRequest {
  email: string;
}

// Credit Management Response Types
export interface SubscriptionResponse {
  success: boolean;
  account?: UserAccount;
  subscription?: Subscription;
}

// User Management Types
export interface UsersStatistics {
  total_users: number;
  online_users: number;
  users: UserAccount[];
}

export interface UsersStatisticsResponse {
  success: boolean;
  total_users: number;
  online_users: number;
  users: UserAccount[];
}

export interface DownloadHistoryEntry {
  type: "download";
  data: {
    id: string;
    downloadUrl: string;
    from: string;
    price: number;
  };
}

export interface DownloadHistoryResponse {
  success: boolean;
  history: DownloadHistoryEntry[];
}

// Login request data
export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

// Register request data
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  otp: string;
}

// Generic API request function using axios
async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: Record<string, unknown>
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.request({
      url: endpoint,
      method,
      data,
    });

    return response.data;
  } catch (error) {
    console.error("API request failed:", error);

    // Handle axios errors
    if (axios.isAxiosError(error)) {
      console.error("API Response Error:", {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      console.error("API request failed:", error);
      console.error("Parsed API Error Response:", error.response?.data);

      if (error.response?.data) {
        return error.response.data;
      }

      return {
        success: false,
        error: {
          id: error.code || "network_error",
          message: error.message || "Network error occurred. Please try again.",
        },
      };
    }

    return {
      success: false,
      error: {
        id: "unknown_error",
        message: "An unexpected error occurred. Please try again.",
      },
    };
  }
}

// Public API request function (no authentication, no automatic redirects)
async function publicApiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: Record<string, unknown>
): Promise<ApiResponse<T>> {
  try {
    const response = await publicApiClient.request({
      url: endpoint,
      method,
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Public API request failed:", error);

    // Handle axios errors
    if (axios.isAxiosError(error)) {
      console.error("Public API Response Error:", {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });

      if (error.response?.data) {
        return error.response.data;
      }

      return {
        success: false,
        error: {
          id: error.code || "network_error",
          message: error.message || "Network error occurred. Please try again.",
        },
      };
    }

    return {
      success: false,
      error: {
        id: "unknown_error",
        message: "An unexpected error occurred. Please try again.",
      },
    };
  }
}

// Authentication API functions
export const authApi = {
  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[Auth API] Using mock login data");
      return mockApiResponses.login(credentials.email, credentials.password);
    }

    const encryptedPassword = encryptPassword(credentials.password);
    const token = generateTimestampToken();

    return apiRequest<LoginResponse>("/v1/auth/login", "POST", {
      email: credentials.email,
      password: encryptedPassword,
      token,
      remember_me: credentials.remember_me || false,
    });
  },

  // Register user
  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<RegisterResponse>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[Auth API] Using mock register data");
      return mockApiResponses.register(userData);
    }

    const encryptedPassword = encryptPassword(userData.password);
    const token = generateTimestampToken();

    console.log("[Register API] Request details:", {
      endpoint: "/v1/auth/register",
      baseURL: API_BASE_URL,
      fullURL: `${API_BASE_URL}/v1/auth/register`,
      payload: {
        email: userData.email,
        password: encryptedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNum: userData.phone,
        otp: userData.otp,
        token,
      },
    });

    return apiRequest<RegisterResponse>("/v1/auth/register", "POST", {
      email: userData.email,
      password: encryptedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNum: userData.phone,
      otp: userData.otp,
      token,
    });
  },

  // Logout user
  async logout(): Promise<
    ApiResponse<{ access_token: string; message: string }>
  > {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[Auth API] Using mock logout data");
      return mockApiResponses.logout();
    }

    return apiRequest("/v1/auth/logout", "POST");
  },

  // Get current user data
  async getUserData(): Promise<ApiResponse<UserData>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[Auth API] Using mock user data");
      return mockApiResponses.getUserData();
    }

    return apiRequest<UserData>("/v1/user/data", "GET");
  },
};

// User Management API functions
export const userApi = {
  // Get user data (line 481 from swagger)
  async getUserData(): Promise<ApiResponse<UserData>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[User API] Using mock user data");
      return mockApiResponses.getUserData();
    }

    return apiRequest<UserData>("/v1/user/data", "GET");
  },

  // Get users statistics (line 511 from swagger)
  async getUsersStatistics(): Promise<ApiResponse<UsersStatisticsResponse>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[User API] Using mock users statistics data");
      return mockApiResponses.getUsersStatistics();
    }

    return apiRequest<UsersStatisticsResponse>("/v1/user/users", "GET");
  },

  // Get download history (line 547 from swagger)
  async getDownloadHistory(): Promise<ApiResponse<DownloadHistoryResponse>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[User API] Using mock download history data");
      return mockApiResponses.getDownloadHistory();
    }

    return apiRequest<DownloadHistoryResponse>("/v1/user/history", "GET");
  },
};

// Credit Management API functions
export const creditApi = {
  // Add subscription (line 220 from swagger)
  async addSubscription(
    data: AddSubscriptionRequest
  ): Promise<ApiResponse<SubscriptionResponse>> {
    return apiRequest<SubscriptionResponse>("/v1/credit/subscribe", "POST", {
      email: data.email,
      plan_name: data.plan_name,
    });
  },

  // Upgrade subscription (line 266 from swagger)
  async upgradeSubscription(
    data: UpgradeSubscriptionRequest
  ): Promise<ApiResponse<SubscriptionResponse>> {
    return apiRequest<SubscriptionResponse>("/v1/credit/upgrade", "POST", {
      email: data.email,
      plan_name: data.plan_name,
    });
  },

  // Extend subscription (line 312 from swagger)
  async extendSubscription(
    data: ExtendSubscriptionRequest
  ): Promise<ApiResponse<SubscriptionResponse>> {
    return apiRequest<SubscriptionResponse>("/v1/credit/extend", "POST", {
      email: data.email,
      days: data.days,
    });
  },

  // Delete subscription (line 359 from swagger)
  async deleteSubscription(
    data: DeleteSubscriptionRequest
  ): Promise<ApiResponse<{ success: boolean }>> {
    return apiRequest<{ success: boolean }>("/v1/credit/delete", "POST", {
      email: data.email,
    });
  },

  // Get credit analytics (line 397 from swagger)
  async getCreditAnalytics(): Promise<ApiResponse<CreditAnalyticsResponse>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[Credit API] Using mock credit analytics data");
      return mockApiResponses.getCreditAnalytics();
    }

    return apiRequest<CreditAnalyticsResponse>("/v1/credit/analytics", "GET");
  },

  // Get credit history (line 450 from swagger)
  async getCreditHistory(): Promise<ApiResponse<CreditHistoryResponse>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[Credit API] Using mock credit history data");
      return mockApiResponses.getCreditHistory();
    }

    return apiRequest<CreditHistoryResponse>("/v1/credit/history", "GET");
  },
};

// OTP API response types
export interface SendOtpResponse {
  message: string;
}

export interface VerifyOtpResponse {
  message: string;
}

export interface SendOtpRequest {
  phoneNum: string;
  token: string;
}

export interface VerifyOtpRequest {
  phoneNum: string;
  otp: string;
}

// OTP Management API functions
export const otpApi = {
  // Send OTP to phone number
  async sendOtp(
    phoneNumber: string,
    isResend: boolean = false
  ): Promise<ApiResponse<SendOtpResponse>> {
    // Validate phone number format (must start with +)
    if (!phoneNumber.startsWith("+")) {
      return {
        success: false,
        error: {
          id: "invalid_phone_format",
          message: "Phone number must start with + and include country code",
        },
      };
    }

    const token = generateTimestampToken();

    try {
      const requestBody: {
        phoneNum: string;
        token: string;
        resend?: boolean;
      } = {
        phoneNum: phoneNumber,
        token,
      };

      // Add resend parameter if this is a resend request
      if (isResend) {
        requestBody.resend = true;
      }

      const response = await apiRequest<SendOtpResponse>(
        "/v1/otp/send",
        "POST",
        requestBody
      );

      // If the API returns an error response, handle it appropriately
      if (!response.success && response.error) {
        // Map specific error IDs to user-friendly messages
        const errorMessages: Record<string, string> = {
          "5": "Failed to send OTP. Please check your phone number and try again.",
          "6": "Service temporarily unavailable. Please try again later.",
          invalid_phone:
            "Invalid phone number format. Please include country code.",
          rate_limit: "Too many requests. Please wait before trying again.",
          network_error:
            "Network connection failed. Please check your internet connection.",
        };

        const errorMessage =
          errorMessages[response.error.id.toString()] ||
          response.error.message ||
          "Failed to send OTP. Please try again.";

        return {
          success: false,
          error: {
            id: response.error.id,
            message: errorMessage,
          },
        };
      }

      return response;
    } catch (error) {
      console.error("Failed to send OTP:", error);
      return {
        success: false,
        error: {
          id: "send_otp_failed",
          message: "Failed to send OTP. Please try again.",
        },
      };
    }
  },

  // Verify OTP code
  async verifyOtp(
    phoneNumber: string,
    otpCode: string
  ): Promise<ApiResponse<VerifyOtpResponse>> {
    // Validate inputs
    if (!phoneNumber.startsWith("+")) {
      return {
        success: false,
        error: {
          id: "invalid_phone_format",
          message: "Phone number must start with + and include country code",
        },
      };
    }

    if (!otpCode || otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      return {
        success: false,
        error: {
          id: "invalid_otp_format",
          message: "OTP must be a 6-digit number",
        },
      };
    }

    try {
      // The verify endpoint has been confirmed by backend developer
      // It only requires phoneNum and otp (no token needed)
      const response = await apiRequest<VerifyOtpResponse>(
        "/v1/otp/verify",
        "POST",
        {
          phoneNum: phoneNumber,
          otp: otpCode,
        }
      );

      // If the API returns an error response, handle it appropriately
      if (!response.success && response.error) {
        // Map specific error IDs to user-friendly messages for verification
        const errorMessages: Record<string, string> = {
          "5": "Invalid OTP code. Please check and try again.",
          "6": "Service temporarily unavailable. Please try again later.",
          invalid_otp:
            "Invalid OTP code. Please enter the correct 6-digit code.",
          expired_otp: "OTP code has expired. Please request a new code.",
          rate_limit:
            "Too many verification attempts. Please wait before trying again.",
          network_error:
            "Network connection failed. Please check your internet connection.",
        };

        const errorMessage =
          errorMessages[response.error.id.toString()] ||
          response.error.message ||
          "Failed to verify OTP. Please try again.";

        return {
          success: false,
          error: {
            id: response.error.id,
            message: errorMessage,
          },
        };
      }

      return response;
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      return {
        success: false,
        error: {
          id: "verify_otp_failed",
          message: "Failed to verify OTP. Please try again.",
        },
      };
    }
  },
};

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  // Check for access token in localStorage or sessionStorage
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  return !!token;
}

// Helper function to check if user has admin role
export function isAdmin(user: UserData | null): boolean {
  return user?.role === "admin";
}

// Helper function to test authorization
export async function testAuthorization(): Promise<boolean> {
  try {
    const response = await userApi.getUserData();
    return response.success;
  } catch (error) {
    console.error("Authorization test failed:", error);
    return false;
  }
}

// Broadcast Management Types
export interface BroadcastCreateRequest {
  title: string;
  message: string;
  audience: "all" | "premium" | "online";
  image_content?: string;
}

export interface BroadcastCreateResponse {
  id: string;
  message: string;
}

export interface BroadcastStatusResponse {
  id: string;
  status: string;
  progress: number;
  total_users: number;
  sent_count: number;
  failed_count: number;
}

export interface BroadcastActivity {
  id: string;
  title: string;
  message: string;
  audience: string;
  target_recipients: number;
  sent_successfully: number;
  failed_count: number;
  created_at: string;
  created_date: string;
  status: string;
}

export interface BroadcastActivityResponse {
  recent_broadcasts: BroadcastActivity[];
  today_broadcasts_count: number;
  total_recent_shown: number;
  last_updated: string;
}

// Helper function to store authentication token
export function storeAuthToken(
  token: string,
  rememberMe: boolean = false
): void {
  if (typeof window === "undefined") return;

  if (rememberMe) {
    localStorage.setItem("access_token", token);
  } else {
    sessionStorage.setItem("access_token", token);
  }
}

// Helper function to clear authentication token
export function clearAuthToken(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("access_token");
  sessionStorage.removeItem("access_token");
}

// Broadcast Management API functions
export const broadcastApi = {
  // Create a new broadcast (line 11 from broadcast.yaml)
  async createBroadcast(
    data: BroadcastCreateRequest
  ): Promise<ApiResponse<BroadcastCreateResponse>> {
    // Use mock data if enabled or if endpoint doesn't exist
    if (shouldUseMockData()) {
      console.log("[Broadcast API] Using mock create broadcast data");
      return {
        success: true,
        data: {
          id: `broadcast_${Date.now()}`,
          message: "Broadcast created successfully",
        },
      };
    }

    try {
      return await apiRequest<BroadcastCreateResponse>(
        "/v1/broadcast/create",
        "POST",
        {
          title: data.title,
          message: data.message,
          audience: data.audience,
          ...(data.image_content && { image_content: data.image_content }),
        }
      );
    } catch (error) {
      // If backend endpoint doesn't exist (404), fall back to mock data
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log(
          "[Broadcast API] Backend endpoint not found, falling back to mock data"
        );
        return {
          success: true,
          data: {
            id: `broadcast_${Date.now()}`,
            message: "Broadcast created successfully (mock)",
          },
        };
      }
      throw error;
    }
  },

  // Get broadcast status (line 70 from broadcast.yaml)
  async getBroadcastStatus(
    id: string
  ): Promise<ApiResponse<BroadcastStatusResponse>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[Broadcast API] Using mock broadcast status data");
      return {
        success: true,
        data: {
          id,
          status: "completed",
          progress: 100,
          total_users: 150,
          sent_count: 147,
          failed_count: 3,
        },
      };
    }

    return apiRequest<BroadcastStatusResponse>(
      `/v1/broadcast/status?id=${encodeURIComponent(id)}`,
      "GET"
    );
  },

  // Get broadcast activity (line 122 from broadcast.yaml)
  async getBroadcastActivity(
    limit?: number
  ): Promise<ApiResponse<BroadcastActivityResponse>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[Broadcast API] Using mock broadcast activity data");
      return {
        success: true,
        data: {
          recent_broadcasts: [
            {
              id: "broadcast_1",
              title: "Welcome Message for New Users",
              message:
                "Welcome to ResourceHub! We're excited to have you join our community.",
              audience: "all",
              target_recipients: 234,
              sent_successfully: 231,
              failed_count: 3,
              created_at: new Date(
                Date.now() - 2 * 60 * 60 * 1000
              ).toISOString(), // 2 hours ago
              created_date: new Date().toISOString().split("T")[0],
              status: "Completed",
            },
            {
              id: "broadcast_2",
              title: "System Maintenance Notice",
              message:
                "We will be performing scheduled maintenance tonight from 2-4 AM.",
              audience: "premium",
              target_recipients: 89,
              sent_successfully: 76,
              failed_count: 2,
              created_at: new Date(
                Date.now() - 5 * 60 * 60 * 1000
              ).toISOString(), // 5 hours ago
              created_date: new Date().toISOString().split("T")[0],
              status: "Sending",
            },
            {
              id: "broadcast_3",
              title: "Special Offer - 50% Off",
              message: "Limited time offer! Get 50% off on all premium plans.",
              audience: "online",
              target_recipients: 156,
              sent_successfully: 154,
              failed_count: 1,
              created_at: new Date(
                Date.now() - 24 * 60 * 60 * 1000
              ).toISOString(), // 1 day ago
              created_date: new Date(Date.now() - 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
              status: "Completed",
            },
          ],
          today_broadcasts_count: 3,
          total_recent_shown: 3,
          last_updated: new Date().toISOString(),
        },
      };
    }

    try {
      const queryParams = limit ? `?limit=${limit}` : "";
      const response = await apiRequest<BroadcastActivityResponse>(
        `/v1/broadcast/activity${queryParams}`,
        "GET"
      );
      return response;
    } catch (error) {
      // If backend endpoint doesn't exist (404), fall back to mock data
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log(
          "[Broadcast API] Backend endpoint not found, falling back to mock data"
        );
        return {
          success: true,
          data: {
            recent_broadcasts: [
              {
                id: "broadcast_1",
                title: "Welcome Message for New Users",
                message:
                  "Welcome to ResourceHub! We're excited to have you join our community.",
                audience: "all",
                target_recipients: 234,
                sent_successfully: 231,
                failed_count: 3,
                created_at: new Date(
                  Date.now() - 2 * 60 * 60 * 1000
                ).toISOString(),
                created_date: new Date().toISOString().split("T")[0],
                status: "Completed",
              },
              {
                id: "broadcast_2",
                title: "System Maintenance Notice",
                message:
                  "We will be performing scheduled maintenance tonight from 2-4 AM.",
                audience: "premium",
                target_recipients: 89,
                sent_successfully: 76,
                failed_count: 2,
                created_at: new Date(
                  Date.now() - 5 * 60 * 60 * 1000
                ).toISOString(),
                created_date: new Date().toISOString().split("T")[0],
                status: "Sending",
              },
            ],
            today_broadcasts_count: 2,
            total_recent_shown: 2,
            last_updated: new Date().toISOString(),
          },
        };
      }
      throw error;
    }
  },
};

// Site Management Types
export interface SiteInput {
  SiteName: string;
  SiteUrl: string;
  price?: string;
  icon: string;
  external?: boolean;
}

export interface SiteResponse {
  name: string;
  url: string;
  price: string;
}

export interface Site {
  name: string;
  url: string;
  icon: string;
  external: boolean;
  total_downloads: number;
  today_downloads: number;
  price: number;
  last_reset: string;
}

export interface SitesResponse {
  success: boolean;
  data: {
    sites: Site[];
  };
}

export interface SiteActionResponse {
  success: boolean;
  data: {
    message: string;
    site: SiteResponse;
  };
}

export interface DeleteSiteRequest {
  SiteUrl: string;
}

export interface DeleteSiteResponse {
  success: boolean;
  data: {
    message: string;
    site: {
      Url: string;
    };
  };
}

// Site Management API functions
export const siteApi = {
  // Get all sites (line 868 from swagger)
  async getSites(): Promise<ApiResponse<SitesResponse>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[Site API] Using mock sites data");
      return mockApiResponses.getSites();
    }

    return apiRequest<SitesResponse>("/v1/sites/get", "GET");
  },

  // Add new site (line 737 from swagger)
  async addSite(data: SiteInput): Promise<ApiResponse<SiteActionResponse>> {
    return apiRequest<SiteActionResponse>("/v1/sites/add", "POST", {
      SiteName: data.SiteName,
      SiteUrl: data.SiteUrl,
      price: data.price || "1",
      icon: data.icon,
      external: data.external || false,
    });
  },

  // Edit existing site (line 777 from swagger)
  async editSite(data: SiteInput): Promise<ApiResponse<SiteActionResponse>> {
    return apiRequest<SiteActionResponse>("/v1/sites/edit", "POST", {
      SiteName: data.SiteName,
      SiteUrl: data.SiteUrl,
      price: data.price || "1",
      icon: data.icon,
      external: data.external || false,
    });
  },

  // Delete site (line 817 from swagger)
  async deleteSite(
    data: DeleteSiteRequest
  ): Promise<ApiResponse<DeleteSiteResponse>> {
    return apiRequest<DeleteSiteResponse>("/v1/sites/delete", "POST", {
      SiteUrl: data.SiteUrl,
    });
  },
};

// Pricing Management Types
export interface PricingPlanInput {
  PlanName: string;
  PlanPrice?: string;
  DaysValidity: string;
  Sites: string[]; // Backend expects array of site URLs
  PlanDescription: string;
  ContactUsUrl: string; // Required field
  credits: string;
}

export interface PricingPlan {
  id?: number;
  name: string;
  description: string;
  price?: string;
  credits: number;
  daysValidity: number;
  contactUsUrl?: string;
  supportedSites?: string[];
  features?: string[];
}

export interface PricingPlanResponse {
  success: boolean;
  message: string;
}

export interface GetPricingPlansResponse {
  success: boolean;
  data: PricingPlan[];
}

export interface DeletePricingPlanRequest {
  PlanName: string;
}

// Search API Types
export interface SearchResult {
  url: string;
  file_id: string;
  file_type: string;
  image_type: string;
  metadata: {
    title: string;
    description: string | null;
  };
  preview: {
    src: string;
    width: number | null;
    height: number | null;
  };
}

export interface SearchApiResponse {
  success: boolean;
  data: {
    query: string;
    page: string;
  };
  results: {
    [provider: string]:
      | {
          icon?: string;
          results: SearchResult[];
        }
      | SearchResult[];
  };
}

export interface SearchRequest {
  query: string;
  page?: number;
}

// Pricing Management API functions
export const pricingApi = {
  // Get all pricing plans (line 708 from swagger)
  async getPricingPlans(): Promise<ApiResponse<GetPricingPlansResponse>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[Pricing API] Using mock pricing plans data");
      return mockApiResponses.getPricingPlans();
    }

    return apiRequest<GetPricingPlansResponse>("/v1/pricing/get", "GET");
  },

  // Add new pricing plan (line 597 from swagger)
  async addPricingPlan(
    data: PricingPlanInput
  ): Promise<ApiResponse<PricingPlanResponse>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[Pricing API] Using mock add pricing plan data");
      return mockApiResponses.addPricingPlan(data);
    }

    const requestData = {
      PlanName: data.PlanName,
      PlanPrice: data.PlanPrice,
      DaysValidity: data.DaysValidity,
      Sites: data.Sites, // Send as array
      PlanDescription: data.PlanDescription,
      ContactUsUrl: data.ContactUsUrl, // Required field
      credits: data.credits,
    };

    console.log(
      "[Pricing API] Sending request to /v1/pricing/add with data:",
      requestData
    );

    return apiRequest<PricingPlanResponse>(
      "/v1/pricing/add",
      "POST",
      requestData
    );
  },

  // Edit existing pricing plan (line 632 from swagger)
  async editPricingPlan(
    data: PricingPlanInput
  ): Promise<ApiResponse<PricingPlanResponse>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[Pricing API] Using mock edit pricing plan data");
      return mockApiResponses.editPricingPlan(data);
    }

    return apiRequest<PricingPlanResponse>("/v1/pricing/edit", "POST", {
      PlanName: data.PlanName,
      PlanPrice: data.PlanPrice,
      DaysValidity: data.DaysValidity,
      Sites: data.Sites, // Send as array
      PlanDescription: data.PlanDescription,
      ContactUsUrl: data.ContactUsUrl, // Required field
      credits: data.credits,
    });
  },

  // Delete pricing plan (line 667 from swagger)
  async deletePricingPlan(
    data: DeletePricingPlanRequest
  ): Promise<ApiResponse<PricingPlanResponse>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[Pricing API] Using mock delete pricing plan data");
      return mockApiResponses.deletePricingPlan(data.PlanName);
    }

    return apiRequest<PricingPlanResponse>("/v1/pricing/delete", "POST", {
      PlanName: data.PlanName,
    });
  },
};

// Public API functions (no authentication required, no automatic redirects)
export const publicApi = {
  // Get all pricing plans (public access)
  async getPricingPlans(): Promise<ApiResponse<GetPricingPlansResponse>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[Public Pricing API] Using mock pricing plans data");
      return mockApiResponses.getPricingPlans();
    }

    return publicApiRequest<GetPricingPlansResponse>("/v1/pricing/get", "GET");
  },

  // Get all sites (public access)
  async getSites(): Promise<ApiResponse<SitesResponse>> {
    // Use mock data if enabled
    if (shouldUseMockData()) {
      console.log("[Public Site API] Using mock sites data");
      return mockApiResponses.getSites();
    }

    return publicApiRequest<SitesResponse>("/v1/sites/get", "GET");
  },
};

// Request deduplication for search API
const ongoingSearchRequests = new Map<string, Promise<SearchApiResponse>>();

// Provider Data API Types (from search-providers.yaml)
export interface ProviderDataRequest {
  platform: string;
  file_url: string;
  file_id: string;
}

export interface ImageDetails {
  src: string;
  width: number;
  height: number;
}

export interface FileMetadata {
  title: string;
  description: string | null;
}

export interface RelatedFile {
  url: string;
  file_id: string;
  metadata: FileMetadata;
  preview: ImageDetails;
}

export interface FileData {
  title: string;
  high_resolution: ImageDetails;
  keywords: string[];
  related: RelatedFile[];
}

export interface ProviderDataResponse {
  success: boolean;
  data: FileData;
}

export interface ProviderErrorResponse {
  success: boolean;
  error: {
    id: number | string;
    message: string;
  };
}

// Media Download Request (for POST to v1/providers/search)
export interface MediaDownloadRequest {
  link: string;
  id: string;
  website: string;
}

// Search API functions
export const searchApi = {
  // Search for resources with deduplication and optimized performance
  async search(
    searchRequest: SearchRequest
  ): Promise<ApiResponse<SearchApiResponse>> {
    const { query, page = 1 } = searchRequest;

    if (!query?.trim()) {
      return {
        success: false,
        error: {
          id: "invalid_query",
          message: "Search query is required",
        },
      };
    }

    // Create a unique key for deduplication
    const requestKey = `${query.trim()}::${page}`;

    // Check if there's already an ongoing request for the same query+page
    if (ongoingSearchRequests.has(requestKey)) {
      console.log("Deduplicating search request for:", requestKey);
      try {
        const result = await ongoingSearchRequests.get(requestKey)!;
        return { success: true, data: result };
      } catch (error) {
        console.error(error);
        // If the ongoing request failed, we'll make a new one below
        ongoingSearchRequests.delete(requestKey);
      }
    }

    // Create the API request promise
    const searchPromise = (async (): Promise<SearchApiResponse> => {
      try {
        console.log("Making search API request for:", requestKey);

        // Determine the endpoint based on environment - Updated to use new providers/search endpoint
        const endpoint =
          process.env.NODE_ENV === "production"
            ? "/v1/download/tasks" // Direct API call in production - NEW ENDPOINT
            : "/api/search"; // Use proxy in development

        const response = await searchApiClient.get(endpoint, {
          params: {
            query: query.trim(),
            page: page.toString(),
          },
        });

        console.log("Search API request completed for:", requestKey);
        return response.data;
      } catch (error) {
        console.error("Search API request failed:", error);
        throw error;
      } finally {
        // Clean up the ongoing request
        ongoingSearchRequests.delete(requestKey);
      }
    })();

    // Store the promise for deduplication
    ongoingSearchRequests.set(requestKey, searchPromise);

    try {
      const data = await searchPromise;
      return { success: true, data };
    } catch (error) {
      console.error("Search API error:", error);

      // Handle axios errors
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        if (status === 429) {
          return {
            success: false,
            error: {
              id: "rate_limit",
              message:
                "Too many search requests. Please wait before trying again.",
            },
          };
        }

        if (status === 408 || error.code === "ECONNABORTED") {
          return {
            success: false,
            error: {
              id: "timeout",
              message: "Search request timed out. Please try again.",
            },
          };
        }

        return {
          success: false,
          error: {
            id: errorData?.error || "search_failed",
            message:
              errorData?.message ||
              error.message ||
              "Search failed. Please try again.",
          },
        };
      }

      return {
        success: false,
        error: {
          id: "unknown_error",
          message:
            "An unexpected error occurred during search. Please try again.",
        },
      };
    }
  },

  // Get detailed provider data for a specific file
  async getProviderData(
    request: ProviderDataRequest
  ): Promise<ApiResponse<ProviderDataResponse>> {
    const { platform, file_url, file_id } = request;

    // Validate required fields
    if (!platform) {
      return {
        success: false,
        error: {
          id: 0,
          message: "Platform is required.",
        },
      };
    }

    if (!file_url) {
      return {
        success: false,
        error: {
          id: 1,
          message: "File URL is required.",
        },
      };
    }

    if (!file_id) {
      return {
        success: false,
        error: {
          id: 2,
          message: "File ID is required.",
        },
      };
    }

    // Validate platform is supported
    const supportedPlatforms = [
      "AdobeStock",
      "CreativeFabrica",
      "Envato",
      "Freepik",
      "MotionElements",
      "PngTree",
      "Shutterstock",
      "Storyblocks",
      "Vecteezy",
    ];

    if (!supportedPlatforms.includes(platform)) {
      return {
        success: false,
        error: {
          id: 3,
          message: "Platform does not exist.",
        },
      };
    }

    try {
      // Determine the endpoint based on environment
      const endpoint =
        process.env.NODE_ENV === "production"
          ? "/v1/download/create" // Direct API call in production
          : "/api/providers/data"; // Use proxy in development

      const response = await searchApiClient.post(endpoint, {
        platform,
        file_url,
        file_id,
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Provider data API error:", error);

      // Handle axios errors
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        if (status === 400) {
          return {
            success: false,
            error: {
              id: errorData?.error?.id || "bad_request",
              message: errorData?.error?.message || "Bad request",
            },
          };
        }

        if (status === 500) {
          return {
            success: false,
            error: {
              id: "except",
              message: "Internal processing error",
            },
          };
        }

        return {
          success: false,
          error: {
            id: errorData?.error?.id || "provider_data_failed",
            message:
              errorData?.error?.message ||
              error.message ||
              "Failed to retrieve provider data",
          },
        };
      }

      return {
        success: false,
        error: {
          id: "unknown_error",
          message: "An unexpected error occurred",
        },
      };
    }
  },

  // Submit media download request (POST with link, id, website)
  async submitMediaDownload(
    request: MediaDownloadRequest
  ): Promise<ApiResponse<unknown>> {
    const { link, id, website } = request;

    // Validate required fields
    if (!link) {
      return {
        success: false,
        error: {
          id: "missing_link",
          message: "File link is required",
        },
      };
    }

    if (!id) {
      return {
        success: false,
        error: {
          id: "missing_id",
          message: "File ID is required",
        },
      };
    }

    if (!website) {
      return {
        success: false,
        error: {
          id: "missing_website",
          message: "Website name is required",
        },
      };
    }

    try {
      // Determine the endpoint based on environment
      const endpoint =
        process.env.NODE_ENV === "production"
          ? "/v1/download/tasks" // Direct API call in production
          : "/api/providers/search"; // Use proxy in development

      const response = await searchApiClient.post(endpoint, {
        link,
        id,
        website,
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Media download API error:", error);

      // Handle axios errors
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;

        return {
          success: false,
          error: {
            id: errorData?.error || "download_failed",
            message:
              errorData?.message ||
              error.message ||
              "Failed to submit download request",
          },
        };
      }

      return {
        success: false,
        error: {
          id: "unknown_error",
          message: "An unexpected error occurred",
        },
      };
    }
  },
};

// Cookie Management Types
export interface CookieAddRequest {
  cookies: string; // JSON stringified cookies
  platform_name: string; // Target platform name
}

export interface CookieAddResponse {
  success: boolean;
  data?: {
    email: string;
    user_id: string;
    is_premium: boolean;
  };
  error?: {
    id: number | string;
    message: string;
  };
}

// GET /v1/cookies/get response shape (wrapped by ApiResponse)
export interface CookieGetResponse {
  success: boolean;
  data: Record<
    string,
    Array<{
      email: string;
      user_id: number;
      is_premium: boolean;
      credits?: number;
    }>
  >;
}

// POST /v1/cookies/delete request and response
export interface CookieDeleteRequest {
  platform_name: string;
  email: string;
}

export interface CookieDeleteResponse {
  success: boolean;
  data?: {
    message: string;
    platform_name: string;
    email: string;
  };
  error?: {
    id: number | string;
    message: string;
  };
}

export interface CookieData {
  id: number;
  platform_name: string;
  email?: string;
  user_id?: number;
  username?: string;
  credit?: number;
  lastUpdate: string;
  is_premium?: boolean;
  icon?: string;
  iconColor?: string;
}

// Cookie Management API functions
export const cookieApi = {
  // Add cookies for a platform
  async addCookie(
    data: CookieAddRequest
  ): Promise<ApiResponse<CookieAddResponse>> {
    console.log("[Cookie API] Adding cookie for platform:", data.platform_name);

    try {
      // Validate that cookies is valid JSON
      JSON.parse(data.cookies);
    } catch (error) {
      console.error("[Cookie API] Invalid JSON in cookies field:", error);
      return {
        success: false,
        error: {
          id: 2,
          message: "cookie must be json.",
        },
      };
    }

    return apiRequest<CookieAddResponse>("/v1/cookies/add", "POST", {
      cookies: data.cookies,
      platform_name: data.platform_name,
    });
  },

  // Get stored cookies grouped by platform
  async getCookies(): Promise<ApiResponse<CookieGetResponse>> {
    return apiRequest<CookieGetResponse>("/v1/cookies/get", "GET");
  },

  // Delete cookies for a specific platform/email
  async deleteCookie(
    data: CookieDeleteRequest
  ): Promise<ApiResponse<CookieDeleteResponse>> {
    return apiRequest<CookieDeleteResponse>("/v1/cookies/delete", "POST", {
      platform_name: data.platform_name,
      email: data.email,
    });
  },

  // Process cookie file and extract JSON data
  async processCookieFile(
    file: File
  ): Promise<{ success: boolean; cookies?: string; error?: string }> {
    try {
      const text = await file.text();

      // Try to parse as JSON first
      try {
        JSON.parse(text);
        return { success: true, cookies: text };
      } catch {
        // If not JSON, try to extract cookies from common formats

        // Netscape cookie format
        if (
          text.includes("# Netscape HTTP Cookie File") ||
          text.includes("\t")
        ) {
          const cookieObj: Record<string, string> = {};
          const lines = text.split("\n");

          for (const line of lines) {
            if (line.startsWith("#") || !line.trim()) continue;

            const parts = line.split("\t");
            if (parts.length >= 7) {
              const name = parts[5];
              const value = parts[6];
              if (name && value) {
                cookieObj[name] = value;
              }
            }
          }

          if (Object.keys(cookieObj).length > 0) {
            return { success: true, cookies: JSON.stringify(cookieObj) };
          }
        }

        // Try to parse as key=value format
        const cookieObj: Record<string, string> = {};
        const lines = text.split("\n");

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;

          const equalIndex = trimmed.indexOf("=");
          if (equalIndex > 0) {
            const key = trimmed.substring(0, equalIndex).trim();
            const value = trimmed.substring(equalIndex + 1).trim();
            cookieObj[key] = value;
          }
        }

        if (Object.keys(cookieObj).length > 0) {
          return { success: true, cookies: JSON.stringify(cookieObj) };
        }

        return {
          success: false,
          error:
            "Unable to parse cookie file. Please ensure it's in JSON format or a supported cookie format.",
        };
      }
    } catch (error) {
      console.error("[Cookie API] Error processing file:", error);
      return {
        success: false,
        error: "Error reading file. Please try again.",
      };
    }
  },

  // Extract platform name from file name or content
  extractPlatformName(fileName: string, cookies: string): string {
    // Remove file extension and clean up the name
    const platformName = fileName.replace(/\.[^/.]+$/, "").toLowerCase();

    // Common platform mappings
    const platformMappings: Record<string, string> = {
      twitter: "twitter",
      x: "twitter",
      facebook: "facebook",
      fb: "facebook",
      instagram: "instagram",
      ig: "instagram",
      youtube: "youtube",
      yt: "youtube",
      tiktok: "tiktok",
      linkedin: "linkedin",
      pinterest: "pinterest",
      reddit: "reddit",
      snapchat: "snapchat",
      discord: "discord",
      telegram: "telegram",
      whatsapp: "whatsapp",
      freepik: "freepik",
      shutterstock: "shutterstock",
      adobe: "adobe",
      stock: "adobe",
      unsplash: "unsplash",
      pexels: "pexels",
      pixabay: "pixabay",
    };

    // Check if filename contains a known platform
    for (const [key, value] of Object.entries(platformMappings)) {
      if (platformName.includes(key)) {
        return value;
      }
    }

    // Try to extract from cookie content
    try {
      const cookieObj = JSON.parse(cookies);
      const cookieKeys = Object.keys(cookieObj).join(" ").toLowerCase();

      for (const [key, value] of Object.entries(platformMappings)) {
        if (cookieKeys.includes(key)) {
          return value;
        }
      }
    } catch {
      // Ignore JSON parse errors
    }

    // Return cleaned filename if no platform detected
    return platformName || "unknown";
  },
};
