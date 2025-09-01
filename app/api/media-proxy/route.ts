import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    console.log("[Media Proxy] Received request for URL:", url);

    if (!url) {
      console.log("[Media Proxy] Error: No URL parameter provided");
      return NextResponse.json(
        { error: "URL parameter is required" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // Use the same backend proxy logic as localhost
    // Forward the media request to the backend API
    const backendUrl = `https://stockaty.virs.tech/v1/media/proxy?url=${encodeURIComponent(url)}`;
    
    console.log("[Media Proxy] Forwarding to backend:", backendUrl);

    // Forward authorization headers if present
    const headers: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    };

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const accessToken = request.headers.get("x-access-token");
    if (accessToken) {
      headers["X-Access-Token"] = accessToken;
    }

    // Create timeout controller for compatibility
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log(`[Media Proxy] Backend response status: ${response.status}`);

    if (response.ok) {
      const contentType = response.headers.get("Content-Type");
      
      // If it's an image/video, return the binary data
      if (contentType && (contentType.startsWith("image/") || contentType.startsWith("video/"))) {
        const mediaBuffer = await response.arrayBuffer();
        
        console.log(`[Media Proxy] Successfully fetched media, content-type: ${contentType}`);
        
        return new NextResponse(mediaBuffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=3600",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        });
      } else {
        // If it's JSON or other data, parse and return
        const responseData = await response.text();
        let jsonData;
        try {
          jsonData = JSON.parse(responseData);
        } catch {
          jsonData = responseData;
        }

        return NextResponse.json(jsonData, {
          status: response.status,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        });
      }
    } else {
      const errorData = await response.text();
      console.log("[Media Proxy] Backend error:", errorData);
      
      return NextResponse.json(
        { error: "Backend request failed", message: errorData },
        {
          status: response.status,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }
  } catch (error) {
    console.error("[Media Proxy] Error:", error);

    return NextResponse.json(
      { error: "Media proxy error", message: "Failed to load media content" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}

// Handle preflight OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
