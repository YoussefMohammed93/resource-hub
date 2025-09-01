import { NextRequest, NextResponse } from "next/server";

// Fetch HTML and extract OpenGraph/Twitter preview image
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const urlObj = new URL(url);
    // Allow all domains, but only for http/https URLs
    if (!/^https?:$/.test(urlObj.protocol)) {
      return NextResponse.json(
        { error: "Only http/https URLs are supported" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to load page: ${res.status}` },
        { status: 502, headers: corsHeaders() }
      );
    }

    const html = await res.text();

    // Extract common preview meta tags
    const candidates: string[] = [];

    const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["'][^>]*>/i);
    if (ogImage?.[1]) candidates.push(ogImage[1]);

    const ogImageSecure = html.match(/<meta\s+property=["']og:image:secure_url["']\s+content=["']([^"']+)["'][^>]*>/i);
    if (ogImageSecure?.[1]) candidates.push(ogImageSecure[1]);

    const twitterImage = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["'][^>]*>/i);
    if (twitterImage?.[1]) candidates.push(twitterImage[1]);

    // Provider tweaks (optional improvements)
    // Shutterstock sometimes uses og:image, but if relative, resolve it
    const previewUrl = resolveFirstValidUrl(candidates, urlObj);

    if (!previewUrl) {
      return NextResponse.json(
        { previewUrl: null },
        { status: 200, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { previewUrl },
      { status: 200, headers: corsHeaders({ cache: true }) }
    );
  } catch (error: unknown) {
    const isAbortError =
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as { name?: string }).name === "AbortError";
    const message = isAbortError ? "Timeout fetching page" : "Preview extraction failed";
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

function resolveFirstValidUrl(candidates: string[], base: URL): string | null {
  for (const c of candidates) {
    try {
      const u = new URL(c, base.origin);
      if (["http:", "https:"].includes(u.protocol)) return u.toString();
    } catch {
      // ignore
    }
  }
  return null;
}

function corsHeaders(opts?: { cache?: boolean }) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    ...(opts?.cache ? { "Cache-Control": "public, max-age=900" } : {}),
  } as Record<string, string>;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}
