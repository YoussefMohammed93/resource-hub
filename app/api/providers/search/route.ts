import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://stockaty.virs.tech/v1";

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const remoteAddr = request.headers.get("remote-addr");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (remoteAddr) {
    return remoteAddr;
  }
  return "unknown";
}

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize rate limit for this client
    rateLimitMap.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  clientData.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);

  try {
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

    // Parse request body
    const body = await request.json();
    const { link, id, website } = body;

    // Validate required fields
    if (!link) {
      return NextResponse.json(
        {
          success: false,
          error: {
            id: "missing_link",
            message: "File link is required",
          },
        },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            id: "missing_id",
            message: "File ID is required",
          },
        },
        { status: 400 }
      );
    }

    if (!website) {
      return NextResponse.json(
        {
          success: false,
          error: {
            id: "missing_website",
            message: "Website name is required",
          },
        },
        { status: 400 }
      );
    }

    console.log(
      `Making provider search API request for website: ${website}, id: ${id}`
    );

    // Make the request to the external API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/providers/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "ResourceHub-ProviderSearch/1.0",
          Accept: "application/json",
        },
        body: JSON.stringify({
          link,
          id,
          website,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        return NextResponse.json(
          errorData || {
            success: false,
            error: {
              id: "api_error",
              message: `API responded with status: ${response.status}`,
            },
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log(
        `Provider search API request completed for: ${website}/${id}`
      );

      return NextResponse.json(data, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    console.error("Provider search API proxy error:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          success: false,
          error: {
            id: "timeout",
            message: "Request timed out. Please try again.",
          },
        },
        { status: 408 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          id: "server_error",
          message: "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
