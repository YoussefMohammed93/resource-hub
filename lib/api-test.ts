// API testing utilities for debugging production issues
import { authApi, userApi, creditApi, siteApi, pricingApi } from "./api";

export interface ApiTestResult {
  endpoint: string;
  success: boolean;
  status?: number;
  data?: unknown;
  error?: string;
  timing: number;
}

export interface ApiTestSummary {
  total: number;
  successful: number;
  failed: number;
  successRate: number;
  averageResponseTime: number;
  results: ApiTestResult[];
}

export class ApiTester {
  private results: ApiTestResult[] = [];

  async testEndpoint(
    name: string,
    testFunction: () => Promise<unknown>
  ): Promise<ApiTestResult> {
    const startTime = Date.now();

    try {
      console.log(`[API Test] Testing ${name}...`);
      const result = await testFunction();
      const timing = Date.now() - startTime;

      const resultObj = result as Record<string, unknown>;
      const testResult: ApiTestResult = {
        endpoint: name,
        success: Boolean(resultObj.success),
        data: resultObj.data,
        error:
          typeof resultObj.error === "object" &&
          resultObj.error &&
          "message" in resultObj.error
            ? String((resultObj.error as { message: unknown }).message)
            : undefined,
        timing,
      };

      this.results.push(testResult);
      console.log(`[API Test] ${name} completed in ${timing}ms:`, testResult);
      return testResult;
    } catch (error: unknown) {
      const timing = Date.now() - startTime;
      const testResult: ApiTestResult = {
        endpoint: name,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timing,
      };

      this.results.push(testResult);
      console.error(`[API Test] ${name} failed in ${timing}ms:`, error);
      return testResult;
    }
  }

  async runBasicTests(): Promise<ApiTestResult[]> {
    console.log("[API Test] Starting basic API tests...");
    this.results = [];

    // Test public endpoints first
    await this.testEndpoint("Get Pricing Plans", () =>
      pricingApi.getPricingPlans()
    );

    // Test endpoints that require authentication (these might fail without login)
    await this.testEndpoint("Get Sites", () => siteApi.getSites());
    await this.testEndpoint("Get User Data", () => userApi.getUserData());
    await this.testEndpoint("Get Users Statistics", () =>
      userApi.getUsersStatistics()
    );
    await this.testEndpoint("Get Credit Analytics", () =>
      creditApi.getCreditAnalytics()
    );
    await this.testEndpoint("Get Credit History", () =>
      creditApi.getCreditHistory()
    );

    console.log("[API Test] All tests completed. Results:", this.results);
    return this.results;
  }

  async testLogin(email: string, password: string): Promise<ApiTestResult> {
    return this.testEndpoint("Login", () =>
      authApi.login({ email, password, remember_me: false })
    );
  }

  getResults(): ApiTestResult[] {
    return this.results;
  }

  getSummary(): ApiTestSummary {
    const total = this.results.length;
    const successful = this.results.filter((r) => r.success).length;
    const failed = total - successful;
    const avgTiming =
      this.results.reduce((sum, r) => sum + r.timing, 0) / total;

    return {
      total,
      successful,
      failed,
      successRate: (successful / total) * 100,
      averageResponseTime: Math.round(avgTiming),
      results: this.results,
    };
  }

  printSummary() {
    const summary = this.getSummary();
    console.log("\n=== API Test Summary ===");
    console.log(`Total Tests: ${summary.total}`);
    console.log(`Successful: ${summary.successful}`);
    console.log(`Failed: ${summary.failed}`);
    console.log(`Success Rate: ${summary.successRate.toFixed(1)}%`);
    console.log(`Average Response Time: ${summary.averageResponseTime}ms`);
    console.log("\n=== Detailed Results ===");

    summary.results.forEach((result) => {
      const status = result.success ? "✅" : "❌";
      console.log(`${status} ${result.endpoint} (${result.timing}ms)`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
  }
}

// Global instance for easy access
export const apiTester = new ApiTester();

// Helper function to run tests from browser console
export async function runApiTests() {
  const results = await apiTester.runBasicTests();
  apiTester.printSummary();
  return results;
}

// Helper function to test login from browser console
export async function testLogin(
  email: string = "admin@example.com",
  password: string = "admin"
) {
  const result = await apiTester.testLogin(email, password);
  console.log("Login test result:", result);
  return result;
}
