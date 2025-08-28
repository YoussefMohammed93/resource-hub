import { NextRequest, NextResponse } from "next/server";

// Cookie Management API Route
// Implements the /v1/cookies/add endpoint from cookies.yaml

interface CookieAddRequest {
  cookies: string; // JSON stringified cookies
  platform_name: string; // Target platform name
}

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize rate limit for this IP
    rateLimitMap.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  clientData.count++;
  return true;
}

function getClientIP(request: NextRequest): string {
  // Get client IP from various headers
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const clientIP = forwarded?.split(",")[0] || realIP || "unknown";
  return clientIP;
}

function validateJSONString(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}

function validateAuthToken(request: NextRequest): {
  isValid: boolean;
  isAdmin: boolean;
} {
  const authHeader = request.headers.get("authorization");
  const token =
    authHeader?.replace("Bearer ", "") || request.headers.get("x-access-token");

  if (!token) {
    return { isValid: false, isAdmin: false };
  }

  // In a real implementation, you would validate the JWT token
  // For now, we'll do basic validation and assume admin if token exists
  // This should be replaced with proper JWT validation
  try {
    // Basic token validation - in production, use proper JWT verification
    if (token.length > 10) {
      return { isValid: true, isAdmin: true };
    }
    return { isValid: false, isAdmin: false };
  } catch {
    return { isValid: false, isAdmin: false };
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        {
          success: false,
          error: {
            id: "rate_limit",
            message: "Too many requests. Please wait before trying again.",
          },
        },
        { status: 429 }
      );
    }

    // Validate authentication and admin privileges
    const { isValid, isAdmin } = validateAuthToken(request);

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            id: "unauthorized",
            message:
              "Authentication required. Please provide a valid JWT token.",
          },
        },
        { status: 401 }
      );
    }

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: {
            id: "forbidden",
            message: "Admin privileges required for cookie management.",
          },
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body: CookieAddRequest = await request.json();
    const { cookies, platform_name } = body;

    console.log("Cookie add request received:", {
      platform_name,
      cookiesLength: cookies?.length,
    });

    // Validate required fields
    if (!cookies) {
      return NextResponse.json(
        {
          success: false,
          error: {
            id: 1,
            message: "cookies field is required.",
          },
        },
        { status: 400 }
      );
    }

    if (!platform_name) {
      return NextResponse.json(
        {
          success: false,
          error: {
            id: 1,
            message: "platform_name field is required.",
          },
        },
        { status: 400 }
      );
    }

    // Validate that cookies is a valid JSON string
    if (!validateJSONString(cookies)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            id: 2,
            message: "cookie must be json.",
          },
        },
        { status: 400 }
      );
    }

    // Forward the request to the actual backend API
    const API_BASE_URL =
      process.env.NODE_ENV === "production"
        ? "https://stockaty.virs.tech"
        : "https://stockaty.virs.tech"; // Use same URL for both environments

    const backendResponse = await fetch(`${API_BASE_URL}/v1/cookies/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("authorization") || "",
        "X-Access-Token": request.headers.get("x-access-token") || "",
      },
      body: JSON.stringify({
        cookies,
        platform_name,
      }),
    });

    const responseData = await backendResponse.json();

    // Return the backend response
    return NextResponse.json(responseData, {
      status: backendResponse.status,
    });
  } catch (error) {
    console.error("Cookie add API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          id: "except",
          message: "Unexpected error occurred",
        },
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Access-Token",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
