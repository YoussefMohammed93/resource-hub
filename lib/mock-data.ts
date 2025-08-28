// Mock data for development and testing
import {
  UserData,
  DownloadHistoryEntry,
  ApiResponse,
  LoginResponse,
  RegisterResponse,
  DownloadHistoryResponse,
  CreditStatistics,
  CreditAnalyticsResponse,
  CreditHistoryEntry,
  CreditHistoryResponse,
  UsersStatisticsResponse,
  SitesResponse,
  Site,
  GetPricingPlansResponse,
  PricingPlan,
  PricingPlanResponse,
  PricingPlanInput,
} from "./api";

// Mock user data - Regular user
export const mockUser: UserData = {
  account: {
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    picture: "/placeholder.svg",
  },
  subscription: {
    plan: "Premium",
    active: true,
    until: "2024-12-31",
    credits: {
      plan: 1000,
      remaining: 750,
    },
    allowed_sites: ["shutterstock", "freepik", "unsplash", "pexels"],
  },
  role: "user",
};

// Mock admin user data
export const mockAdminUser: UserData = {
  account: {
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    picture: "/placeholder.svg",
  },
  subscription: {
    plan: "Enterprise",
    active: true,
    until: "2025-12-31",
    credits: {
      plan: 10000,
      remaining: 9500,
    },
    allowed_sites: [
      "shutterstock",
      "freepik",
      "unsplash",
      "pexels",
      "adobe",
      "getty",
    ],
  },
  role: "admin",
};

// Mock download history
export const mockDownloadHistory: DownloadHistoryEntry[] = [
  {
    type: "download",
    data: {
      id: "b71fb71fb0f44dd0a0a5191858392b00",
      downloadUrl: "https://www.freepik.com/free-photo/tree-with-white-background_977959.htm",
      from: "Freepik",
      price: 1,
    },
  },
  {
    type: "download",
    data: {
      id: "473bedc3571c43a2971423049ce18820",
      downloadUrl: "https://www.freepik.com/free-photo/woman-blowing-kiss-instagram-icon_3469717.htm#fromView=search&page=1&position=1&uuid=2541cfcb-b9e2-4c50-bfeb-ac6b87fbbb9c&query=Instagram+logo",
      from: "Freepik",
      price: 1,
    },
  },
  {
    type: "download",
    data: {
      id: "a8c9f2e1d5b7a3c4e6f8d9b2c5e7f1a3",
      downloadUrl: "https://www.freepik.com/free-video/close-up-cat-s-face-eyes_171159",
      from: "Freepik",
      price: 5,
    },
  },
  {
    type: "download",
    data: {
      id: "f3e7d9c1b5a8f2e4c6d8b9a2c5e7f1d3",
      downloadUrl: "https://www.freepik.com/free-vector/flat-design-spring-landscape-concept_6718313.htm",
      from: "Freepik",
      price: 3,
    },
  },
  {
    type: "download",
    data: {
      id: "d2c5e8f1a4b7d9c2e5f8a1b4c7e9f2d5",
      downloadUrl: "https://www.freepik.com/free-photo/modern-office-space_12345678.htm",
      from: "Freepik",
      price: 2,
    },
  },
];

// Mock credit analytics data
export const mockCreditAnalytics: CreditStatistics = {
  total_credits_issued: 50000,
  total_credits_used: 32500,
  total_remaining_credits: 17500,
  average_daily_usage: 125,
  credits_by_plan: {
    "Basic Plan": 5000,
    "Premium Plan": 15000,
    "Enterprise Plan": 30000,
  },
  last_updated: new Date().toISOString(),
};

// Mock credit history data
export const mockCreditHistory: CreditHistoryEntry[] = [
  {
    id: 1,
    user_email: "user1@example.com",
    action: "subscription_added",
    credits_changed: 1000,
    credits_before: 0,
    credits_after: 1000,
    plan_name: "Premium Plan",
    timestamp: "2024-01-15T10:30:00Z",
    description: "New subscription added",
  },
  {
    id: 2,
    user_email: "user2@example.com",
    action: "download",
    credits_changed: -5,
    credits_before: 500,
    credits_after: 495,
    timestamp: "2024-01-15T11:45:00Z",
    description: "Downloaded image from Freepik",
  },
  {
    id: 3,
    user_email: "user1@example.com",
    action: "subscription_upgraded",
    credits_changed: 2000,
    credits_before: 800,
    credits_after: 2800,
    plan_name: "Enterprise Plan",
    timestamp: "2024-01-14T14:20:00Z",
    description: "Upgraded to Enterprise Plan",
  },
];

// Mock sites data
export const mockSites: Site[] = [
  {
    name: "Freepik",
    url: "https://freepik.com",
    icon: "https://freepik.com/favicon.ico",
    total_downloads: 15420,
    today_downloads: 89,
    price: 2,
    external: false,
    last_reset: "2024-01-15",
  },
  {
    name: "Shutterstock",
    url: "https://shutterstock.com",
    icon: "https://shutterstock.com/favicon.ico",
    total_downloads: 8750,
    today_downloads: 45,
    price: 3,
    external: true,
    last_reset: "2024-01-15",
  },
  {
    name: "Unsplash",
    url: "https://unsplash.com",
    icon: "https://unsplash.com/favicon.ico",
    total_downloads: 12300,
    today_downloads: 67,
    price: 1,
    external: false,
    last_reset: "2024-01-15",
  },
  {
    name: "Adobe",
    url: "https://adobe.com",
    icon: "https://adobe.com/favicon.ico",
    total_downloads: 9500,
    today_downloads: 52,
    price: 4,
    external: true,
    last_reset: "2024-01-15",
  },
];

// Mock pricing plans data
export const mockPricingPlans: PricingPlan[] = [
  {
    id: 1,
    name: "Basic Plan",
    description: "Perfect for individuals getting started",
    price: "9.99",
    credits: 100,
    daysValidity: 30,
    contactUsUrl: "https://example.com/contact",
    supportedSites: ["Freepik", "Unsplash"],
    features: ["Access to basic sites", "Email support", "Monthly credits"],
  },
  {
    id: 2,
    name: "Premium Plan",
    description: "Great for professionals and small teams",
    price: "29.99",
    credits: 500,
    daysValidity: 30,
    contactUsUrl: "https://example.com/contact",
    supportedSites: ["Freepik", "Shutterstock", "Unsplash"],
    features: [
      "Access to all sites",
      "Priority support",
      "Monthly credits",
      "Download history",
    ],
  },
  {
    id: 3,
    name: "Enterprise Plan",
    description: "For large teams and organizations",
    credits: 2000,
    daysValidity: 30,
    contactUsUrl: "https://example.com/contact",
    supportedSites: ["Freepik", "Shutterstock", "Unsplash", "Adobe Stock"],
    features: [
      "Access to all sites",
      "24/7 support",
      "Monthly credits",
      "Team management",
      "Analytics",
    ],
  },
];

// Mock API responses
// Test credentials:
// Regular user: test@example.com / password
// Admin user: admin@example.com / admin
export const mockApiResponses = {
  // Login response
  login: (
    email: string,
    password: string
  ): Promise<ApiResponse<LoginResponse>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (
          (email === "test@example.com" && password === "password") ||
          (email === "admin@example.com" && password === "admin")
        ) {
          // Store the current user email for mock data
          setCurrentMockUserEmail(email);

          resolve({
            success: true,
            data: {
              access_token: "mock_access_token_12345",
              email: email,
              message: "Login successful",
            },
          });
        } else {
          resolve({
            success: false,
            error: {
              id: "invalid_credentials",
              message: "Invalid email or password",
            },
          });
        }
      }, 1000); // Simulate network delay
    });
  },

  // Register response
  register: (userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    otp?: string;
  }): Promise<ApiResponse<RegisterResponse>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            access_token: "mock_access_token_12345",
            email: userData.email,
            message: "Registration successful",
          },
        });
      }, 1500);
    });
  },

  // Get user data response
  getUserData: (): Promise<ApiResponse<UserData>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check which user is currently logged in based on stored email
        const currentUserEmail = getCurrentMockUserEmail();
        const userData =
          currentUserEmail === "admin@example.com" ? mockAdminUser : mockUser;

        resolve({
          success: true,
          data: userData,
        });
      }, 500);
    });
  },

  // Get download history response
  getDownloadHistory: (): Promise<ApiResponse<DownloadHistoryResponse>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            success: true,
            history: mockDownloadHistory,
          },
        });
      }, 800);
    });
  },

  // Logout response
  logout: (): Promise<
    ApiResponse<{ access_token: string; message: string }>
  > => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Clear the current user email for mock data
        clearCurrentMockUserEmail();

        resolve({
          success: true,
          data: {
            access_token: "",
            message: "Logout successful",
          },
        });
      }, 300);
    });
  },

  // Get credit analytics response
  getCreditAnalytics: (): Promise<ApiResponse<CreditAnalyticsResponse>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            success: true,
            statistics: mockCreditAnalytics,
          },
        });
      }, 800);
    });
  },

  // Get credit history response
  getCreditHistory: (): Promise<ApiResponse<CreditHistoryResponse>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            success: true,
            history: mockCreditHistory,
          },
        });
      }, 600);
    });
  },

  // Get users statistics response
  getUsersStatistics: (): Promise<ApiResponse<UsersStatisticsResponse>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            success: true,
            total_users: 1250,
            online_users: 89,
            users: [
              {
                email: "user1@example.com",
                firstName: "John",
                lastName: "Doe",
                picture: "/placeholder.svg",
              },
              {
                email: "user2@example.com",
                firstName: "Jane",
                lastName: "Smith",
                picture: "/placeholder.svg",
              },
              {
                email: "user3@example.com",
                firstName: "Mike",
                lastName: "Johnson",
                picture: "/placeholder.svg",
              },
            ],
          },
        });
      }, 700);
    });
  },

  // Get sites response
  getSites: (): Promise<ApiResponse<SitesResponse>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            success: true,
            data: {
              sites: mockSites,
            },
          },
        });
      }, 500);
    });
  },

  // Get pricing plans response
  getPricingPlans: (): Promise<ApiResponse<GetPricingPlansResponse>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            success: true,
            data: mockPricingPlans,
          },
        });
      }, 600);
    });
  },

  // Add pricing plan response
  addPricingPlan: (
    data: PricingPlanInput
  ): Promise<ApiResponse<PricingPlanResponse>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Add the new plan to mock data
        const newPlan: PricingPlan = {
          id: mockPricingPlans.length + 1,
          name: data.PlanName,
          description: data.PlanDescription,
          price: data.PlanPrice,
          credits: parseInt(data.credits),
          daysValidity: parseInt(data.DaysValidity),
          contactUsUrl: data.ContactUsUrl,
          supportedSites: data.Sites, // Sites is already an array
          features: [
            "Access to supported sites",
            "24/7 Support",
            "Admin Management",
          ],
        };
        mockPricingPlans.push(newPlan);

        resolve({
          success: true,
          data: {
            success: true,
            message: "Pricing plan added successfully.",
          },
        });
      }, 800);
    });
  },

  // Edit pricing plan response
  editPricingPlan: (
    data: PricingPlanInput
  ): Promise<ApiResponse<PricingPlanResponse>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find and update the plan in mock data
        const planIndex = mockPricingPlans.findIndex(
          (plan) => plan.name === data.PlanName
        );
        if (planIndex !== -1) {
          mockPricingPlans[planIndex] = {
            ...mockPricingPlans[planIndex],
            name: data.PlanName,
            description: data.PlanDescription,
            price: data.PlanPrice,
            credits: parseInt(data.credits),
            daysValidity: parseInt(data.DaysValidity),
            contactUsUrl: data.ContactUsUrl,
            supportedSites: data.Sites, // Sites is already an array
          };
        }

        resolve({
          success: true,
          data: {
            success: true,
            message: "Pricing plan updated successfully.",
          },
        });
      }, 800);
    });
  },

  // Delete pricing plan response
  deletePricingPlan: (
    planName: string
  ): Promise<ApiResponse<PricingPlanResponse>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Remove the plan from mock data
        const planIndex = mockPricingPlans.findIndex(
          (plan) => plan.name === planName
        );
        if (planIndex !== -1) {
          mockPricingPlans.splice(planIndex, 1);
        }

        resolve({
          success: true,
          data: {
            success: true,
            message: "Pricing plan deleted successfully.",
          },
        });
      }, 800);
    });
  },
};

// Helper function to check if mock data should be used
export function shouldUseMockData(): boolean {
  // In production, never use mock data unless explicitly enabled
  if (process.env.NODE_ENV === "production") {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
    console.log("[Mock Data] Production mode - using mock data:", useMock);
    return useMock;
  }

  // In development, use mock data based on environment variable
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";
  console.log("[Mock Data] Development mode - using mock data:", useMock);
  return useMock;
}

// Helper function to simulate network delay
export function simulateNetworkDelay(ms: number = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper functions to track current mock user
export function setCurrentMockUserEmail(email: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("mock_current_user_email", email);
  }
}

export function getCurrentMockUserEmail(): string {
  if (typeof window !== "undefined") {
    return (
      sessionStorage.getItem("mock_current_user_email") || "test@example.com"
    );
  }
  return "test@example.com";
}

export function clearCurrentMockUserEmail(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("mock_current_user_email");
  }
}
