import { NextRequest, NextResponse } from "next/server";

// Cache for proxied images
const imageCache = new Map<
  string,
  { data: ArrayBuffer; contentType: string; expiresAt: number }
>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Missing url parameter" },
        { status: 400 }
      );
    }

    // Basic validation
    if (!/^https?:\/\//i.test(imageUrl)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Check cache first
    const cached = imageCache.get(imageUrl);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
      return new NextResponse(cached.data, {
        status: 200,
        headers: {
          "Content-Type": cached.contentType,
          "Cache-Control": "public, max-age=21600", // 6h
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Fetch the image with proper headers to avoid CORS/blocking
    const response = await fetch(imageUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://elements.envato.com/",
        "Sec-Fetch-Dest": "image",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "cross-site",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
      // Return placeholder instead of error
      return NextResponse.redirect("/placeholder.png", {
        status: 302,
        headers: {
          "Cache-Control": "public, max-age=300",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();

    // Cache the image
    imageCache.set(imageUrl, {
      data: arrayBuffer,
      contentType,
      expiresAt: now + CACHE_TTL_MS,
    });

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=21600", // 6h
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.redirect("/placeholder.png", {
      status: 302,
      headers: {
        "Cache-Control": "public, max-age=300",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
