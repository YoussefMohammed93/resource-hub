import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get("url");

    if (!videoUrl) {
      return NextResponse.json(
        { error: "Missing url parameter" },
        { status: 400 }
      );
    }

    // Basic validation
    if (!/^https?:\/\//i.test(videoUrl)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Get range header from client request
    const range = request.headers.get("range");

    // Prepare headers for the upstream request
    const upstreamHeaders: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://elements.envato.com/",
      Origin: "https://elements.envato.com",
      "Sec-Fetch-Dest": "video",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
    };

    // Forward range header if present (for video seeking)
    if (range) {
      upstreamHeaders["Range"] = range;
    }

    // Fetch the video from upstream
    const response = await fetch(videoUrl, {
      method: "GET",
      headers: upstreamHeaders,
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch video: ${response.status} ${response.statusText} for URL: ${videoUrl}`
      );
      return NextResponse.json(
        { error: `Upstream responded ${response.status}` },
        { status: response.status }
      );
    }

    // Get the response body
    const body = response.body;
    if (!body) {
      return NextResponse.json({ error: "No response body" }, { status: 502 });
    }

    // Prepare response headers
    const responseHeaders: Record<string, string> = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers":
        "Range, Content-Range, Content-Length, Content-Type",
      "Access-Control-Expose-Headers":
        "Content-Range, Content-Length, Accept-Ranges",
    };

    // Forward important headers from upstream
    const headersToForward = [
      "content-type",
      "content-length",
      "content-range",
      "accept-ranges",
      "cache-control",
      "etag",
      "last-modified",
    ];

    headersToForward.forEach((headerName) => {
      const headerValue = response.headers.get(headerName);
      if (headerValue) {
        responseHeaders[headerName] = headerValue;
      }
    });

    // Set default content-type if not present
    if (!responseHeaders["content-type"]) {
      responseHeaders["content-type"] = "video/mp4";
    }

    // Return the proxied video response
    return new NextResponse(body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Video proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function HEAD(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get("url");

    if (!videoUrl) {
      return NextResponse.json(
        { error: "Missing url parameter" },
        { status: 400 }
      );
    }

    // HEAD request for video metadata
    const response = await fetch(videoUrl, {
      method: "HEAD",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "*/*",
        Referer: "https://elements.envato.com/",
      },
    });

    const responseHeaders: Record<string, string> = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers":
        "Range, Content-Range, Content-Length, Content-Type",
      "Access-Control-Expose-Headers":
        "Content-Range, Content-Length, Accept-Ranges",
    };

    // Forward headers
    const headersToForward = [
      "content-type",
      "content-length",
      "accept-ranges",
      "cache-control",
      "etag",
      "last-modified",
    ];

    headersToForward.forEach((headerName) => {
      const headerValue = response.headers.get(headerName);
      if (headerValue) {
        responseHeaders[headerName] = headerValue;
      }
    });

    return new NextResponse(null, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Video proxy HEAD error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers":
        "Range, Content-Range, Content-Length, Content-Type, Authorization",
      "Access-Control-Expose-Headers":
        "Content-Range, Content-Length, Accept-Ranges",
    },
  });
}
