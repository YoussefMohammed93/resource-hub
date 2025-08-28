import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const API_BASE_URL = "https://stockaty.virs.tech/v1";

// Simple in-memory cache for search responses to speed up repeat queries during a session
const searchCache = new Map<string, { data: unknown; expiresAt: number }>();
const SEARCH_CACHE_TTL_MS = 1000 * 60 * 2; // 2 minutes - shorter cache for fresher results

// Request deduplication - track ongoing requests to prevent duplicates
const ongoingRequests = new Map<string, Promise<unknown>>();

// Rate limiting - track requests per IP
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 1000 * 60; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute per IP

// Define a type for the fallback data structure
interface FallbackData {
  data?: {
    query?: string;
    page?: string;
  };
  [key: string]: unknown;
}

// Load search.json as fallback data
let fallbackData: FallbackData | null = null;
try {
  const fallbackPath = join(process.cwd(), "search.json");
  fallbackData = JSON.parse(readFileSync(fallbackPath, "utf8")) as FallbackData;
} catch (error) {
  console.warn("Could not load search.json fallback data:", error);
}

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const clientIP = forwarded?.split(",")[0] || realIP || "unknown";
  return clientIP;
}

// Helper function to check rate limit
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(ip);

  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize counter
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }

  clientData.count++;
  return true;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const page = searchParams.get("page") || "1";
  const clientIP = getClientIP(request);

  // Cache key
  const cacheKey = `${query}::${page}`;

  try {
    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { error: "Too many requests. Please wait before trying again." },
        { status: 429 }
      );
    }
    const now = Date.now();
    const cached = searchCache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      console.log(`Cache hit for: ${cacheKey}`);
      return NextResponse.json(cached.data, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=120", // 2 minutes cache
          "X-Cache": "HIT",
        },
      });
    }

    // Check if there's already an ongoing request for the same query+page
    const requestKey = cacheKey;
    if (ongoingRequests.has(requestKey)) {
      console.log(`Deduplicating request for: ${requestKey}`);
      const ongoingRequest = ongoingRequests.get(requestKey);
      const result = await ongoingRequest;
      return NextResponse.json(result, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=120",
          "X-Cache": "DEDUPLICATED",
        },
      });
    }

    // Create a promise for the API request and store it to prevent duplicates
    const apiRequestPromise = (async () => {
      console.log(`Making API request for: ${requestKey}`);

      // Make the request to the external API with shorter timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout (reduced from 30)

      try {
        // Updated to use new providers/search endpoint
        const response = await fetch(
          `${API_BASE_URL}/providers/search?query=${encodeURIComponent(query)}&page=${page}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "ResourceHub-Search/1.0",
              Accept: "application/json",
              "Cache-Control": "no-cache",
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Save in cache
        searchCache.set(cacheKey, {
          data,
          expiresAt: now + SEARCH_CACHE_TTL_MS,
        });

        console.log(`API request completed for: ${requestKey}`);
        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      } finally {
        // Remove from ongoing requests
        ongoingRequests.delete(requestKey);
      }
    })();

    // Store the promise to prevent duplicate requests
    ongoingRequests.set(requestKey, apiRequestPromise);

    // Wait for the API request to complete
    const data = await apiRequestPromise;

    // Return the data with proper CORS headers
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Search API proxy error:", error);

    // Clean up ongoing request on error
    ongoingRequests.delete(cacheKey);

    // Try to use fallback data if available
    if (fallbackData) {
      console.log("Using fallback search.json data due to API error");

      // Modify fallback data to match the query and page
      const modifiedFallback = {
        ...fallbackData,
        data: {
          query: query || fallbackData.data?.query || "fallback",
          page: page || "1",
        },
      };

      return NextResponse.json(modifiedFallback, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Handle different types of errors
    let errorMessage = "Failed to fetch search results";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "Search request timed out. Please try again.";
        statusCode = 408; // Request Timeout
      } else if (error.message.includes("fetch")) {
        errorMessage =
          "Unable to connect to search service. Please check your connection.";
        statusCode = 503; // Service Unavailable
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: statusCode }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
