import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const audioUrl = searchParams.get("url");

    if (!audioUrl) {
      return NextResponse.json(
        { error: "Audio URL is required" },
        { status: 400 }
      );
    }

    // Validate that it's an audio URL from allowed domains
    const allowedDomains = [
      "audio-previews.elements.envatousercontent.com",
      "elements.envatousercontent.com",
      "previews.customer.envatousercontent.com",
    ];

    const urlObj = new URL(audioUrl);
    const isAllowedDomain = allowedDomains.some(
      (domain) =>
        urlObj.hostname === domain || urlObj.hostname.endsWith("." + domain)
    );

    if (!isAllowedDomain) {
      return NextResponse.json(
        { error: "Audio URL from this domain is not allowed" },
        { status: 403 }
      );
    }

    // Get Range header from the original request for streaming support
    const rangeHeader = request.headers.get("range");
    const requestHeaders: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "audio/*,*/*;q=0.9",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "identity",
      DNT: "1",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      Referer: "https://elements.envato.com/",
    };

    // Add Range header if present for streaming
    if (rangeHeader) {
      requestHeaders["Range"] = rangeHeader;
    }

    // Fetch the audio file
    const response = await fetch(audioUrl, {
      headers: requestHeaders,
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch audio: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    // Get the audio data
    const audioBuffer = await response.arrayBuffer();
    let contentType = response.headers.get("content-type") || "audio/mpeg";

    // Ensure we have a proper audio MIME type
    if (!contentType.startsWith("audio/")) {
      // Detect MIME type from URL if the server doesn't provide it correctly
      if (audioUrl.toLowerCase().includes(".mp3")) {
        contentType = "audio/mpeg";
      } else if (audioUrl.toLowerCase().includes(".wav")) {
        contentType = "audio/wav";
      } else if (audioUrl.toLowerCase().includes(".ogg")) {
        contentType = "audio/ogg";
      } else {
        contentType = "audio/mpeg"; // Default fallback
      }
    }
    const contentLength =
      response.headers.get("content-length") ||
      audioBuffer.byteLength.toString();
    const contentRange = response.headers.get("content-range");
    const acceptRanges = response.headers.get("accept-ranges") || "bytes";

    // Prepare response headers
    const responseHeaders: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Length": contentLength,
      "Accept-Ranges": acceptRanges,
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers":
        "Range, Content-Range, Content-Length, Content-Type",
    };

    // Add Content-Range header if present (for partial content)
    if (contentRange) {
      responseHeaders["Content-Range"] = contentRange;
    }

    // Return the audio with proper headers and status
    return new NextResponse(audioBuffer, {
      status: response.status, // Preserve original status (200 or 206 for partial content)
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error while proxying audio" },
      { status: 500 }
    );
  }
}

export async function HEAD(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const audioUrl = searchParams.get("url");

    if (!audioUrl) {
      return new NextResponse(null, { status: 400 });
    }

    // Validate domain
    const allowedDomains = [
      "audio-previews.elements.envatousercontent.com",
      "elements.envatousercontent.com",
      "previews.customer.envatousercontent.com",
    ];

    const urlObj = new URL(audioUrl);
    const isAllowedDomain = allowedDomains.some(
      (domain) =>
        urlObj.hostname === domain || urlObj.hostname.endsWith("." + domain)
    );

    if (!isAllowedDomain) {
      return new NextResponse(null, { status: 403 });
    }

    // Make HEAD request to get headers
    const response = await fetch(audioUrl, {
      method: "HEAD",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const contentType = response.headers.get("content-type") || "audio/mpeg";
    const contentLength = response.headers.get("content-length") || "0";

    return new NextResponse(null, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        "Content-Length": contentLength,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers":
          "Range, Content-Range, Content-Length, Content-Type",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(null, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers":
        "Range, Content-Range, Content-Length, Content-Type",
    },
  });
}
