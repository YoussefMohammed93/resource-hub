import { NextRequest, NextResponse } from "next/server";

// API proxy to handle CORS issues in development
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxyRequest(request, resolvedParams.path, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxyRequest(request, resolvedParams.path, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxyRequest(request, resolvedParams.path, "PUT");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxyRequest(request, resolvedParams.path, "DELETE");
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Access-Token",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

async function handleProxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    // Construct the target URL
    const targetPath = pathSegments.join("/");
    const targetUrl = `https://stockaty.virs.tech/${targetPath}`;

    // Get query parameters
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const fullTargetUrl = searchParams
      ? `${targetUrl}?${searchParams}`
      : targetUrl;

    console.log(`[API Proxy] ${method} ${fullTargetUrl}`);

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward authorization headers
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const accessToken = request.headers.get("x-access-token");
    if (accessToken) {
      headers["X-Access-Token"] = accessToken;
    }

    // Prepare request body for POST/PUT requests
    let body: string | undefined;
    if (method === "POST" || method === "PUT") {
      try {
        const requestBody = await request.text();
        if (requestBody) {
          body = requestBody;
        }
      } catch (error) {
        console.error("[API Proxy] Error reading request body:", error);
      }
    }

    // Make the request to the target API
    const response = await fetch(fullTargetUrl, {
      method,
      headers,
      body,
      credentials: "include",
    });

    console.log(`[API Proxy] Response status: ${response.status}`);

    // Get response data
    const responseData = await response.text();

    // Parse JSON if possible
    let jsonData;
    try {
      jsonData = JSON.parse(responseData);
    } catch {
      jsonData = responseData;
    }

    console.log(`[API Proxy] Response data:`, jsonData);

    // Return the response with CORS headers
    return NextResponse.json(jsonData, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Access-Token",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  } catch (error) {
    console.error("[API Proxy] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          id: "proxy_error",
          message: "Proxy request failed",
        },
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, X-Access-Token",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  }
}
