import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache for mapping provider page URL -> og:image URL
const thumbCache = new Map<string, { imageUrl: string; expiresAt: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function extractOgImage(html: string): string | null {
  // Try common og:image patterns
  const ogMatch =
    html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i
    ) ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i
    );
  if (ogMatch && ogMatch[1]) return ogMatch[1];

  // Twitter card fallback
  const twMatch =
    html.match(
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i
    ) ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["'][^>]*>/i
    );
  if (twMatch && twMatch[1]) return twMatch[1];

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerUrl = searchParams.get("url");

    if (!providerUrl) {
      return NextResponse.json(
        { error: "Missing url parameter" },
        { status: 400 }
      );
    }

    // Basic validation
    if (!/^https?:\/\//i.test(providerUrl)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Serve from cache if present
    const cached = thumbCache.get(providerUrl);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
      return NextResponse.redirect(cached.imageUrl, {
        status: 302,
        headers: {
          "Cache-Control": "public, max-age=43200", // 12h
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Fetch the provider page
    const resp = await fetch(providerUrl, {
      method: "GET",
      headers: {
        "User-Agent": "ResourceHub-ThumbnailFetcher/1.0",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      // No need for a long timeout here; rely on platform timeout
      // You can add AbortController if needed
    });

    if (!resp.ok) {
      return NextResponse.json(
        { error: `Upstream responded ${resp.status}` },
        { status: 502 }
      );
    }

    const html = await resp.text();
    const imageUrl = extractOgImage(html);

    if (!imageUrl) {
      // Fallback to placeholder
      return NextResponse.redirect("/placeholder.png", {
        status: 302,
        headers: {
          "Cache-Control": "public, max-age=600",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Cache it
    thumbCache.set(providerUrl, { imageUrl, expiresAt: now + CACHE_TTL_MS });

    // Redirect browser to actual image (no CORS issues for <img>/poster)
    return NextResponse.redirect(imageUrl, {
      status: 302,
      headers: {
        "Cache-Control": "public, max-age=43200",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("video-thumbnail route error:", error);
    return NextResponse.redirect("/placeholder.png", {
      status: 302,
      headers: {
        "Cache-Control": "public, max-age=600",
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
