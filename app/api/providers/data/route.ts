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
    const { platform, file_url, file_id } = body;

    // Debug logging
    console.log("Provider data request received:", {
      platform,
      file_url,
      file_id,
    });
    console.log("Full request body:", body);

    // Validate required fields
    if (!platform) {
      console.log("Platform validation failed - platform is:", platform);
      return NextResponse.json(
        {
          success: false,
          error: {
            id: 0,
            message: "Platform is required.",
          },
        },
        { status: 400 }
      );
    }

    if (!file_url) {
      return NextResponse.json(
        {
          success: false,
          error: {
            id: 1,
            message: "File URL is required.",
          },
        },
        { status: 400 }
      );
    }

    if (!file_id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            id: 2,
            message: "File ID is required.",
          },
        },
        { status: 400 }
      );
    }

    // Validate platform
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
      return NextResponse.json(
        {
          success: false,
          error: {
            id: 3,
            message: "Platform does not exist.",
          },
        },
        { status: 400 }
      );
    }

    console.log(
      `Making provider data API request for platform: ${platform}, file_id: ${file_id}`
    );

    // Make the request to the external API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/providers/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "ResourceHub-ProviderData/1.0",
          Accept: "application/json",
        },
        body: JSON.stringify({
          platform,
          file_url,
          file_id,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (response.status === 400) {
          return NextResponse.json(
            errorData || {
              success: false,
              error: {
                id: "bad_request",
                message: "Bad request",
              },
            },
            { status: 400 }
          );
        }

        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log(
        `Provider data API request completed for: ${platform}/${file_id}`
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
    console.error("Provider data API proxy error:", error);

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
          id: "except",
          message: "Internal processing error",
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
