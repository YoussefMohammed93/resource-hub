import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache for mapping provider page URL -> og:image URL
const thumbCache = new Map<string, { imageUrl: string; expiresAt: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

// Clean HTML entities from URLs
function cleanUrl(url: string): string {
  if (!url) return "";

  // Clean common HTML entities that can break URLs
  let cleanedUrl = url
    .replace(/&amp;/g, "&") // &amp; -> &
    .replace(/&lt;/g, "<") // &lt; -> <
    .replace(/&gt;/g, ">") // &gt; -> >
    .replace(/&quot;/g, '"') // &quot; -> "
    .replace(/&#39;/g, "'") // &#39; -> '
    .replace(/&nbsp;/g, " ") // &nbsp; -> space
    .trim(); // Remove leading/trailing whitespace

  // Additional cleaning for malformed URLs
  cleanedUrl = cleanedUrl
    .replace(/\s+/g, "") // Remove any remaining spaces
    .replace(/([^:]\/)\/+/g, "$1"); // Remove duplicate slashes (except after protocol)

  return cleanedUrl;
}

function extractThumbnailFromHtml(html: string, url: string): string | null {
  // Try common og:image patterns
  const ogMatch =
    html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i
    ) ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i
    );
  if (ogMatch && ogMatch[1]) return cleanUrl(ogMatch[1]);

  // Twitter card fallback
  const twMatch =
    html.match(
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i
    ) ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["'][^>]*>/i
    );
  if (twMatch && twMatch[1]) return cleanUrl(twMatch[1]);

  // For Envato Elements, try to extract preview images from various patterns
  if (url.includes("elements.envato.com")) {
    console.log("Processing Envato Elements URL:", url);

    // Enhanced patterns for Envato Elements
    const previewMatches = [
      // Look for preview URLs in JSON data (most common)
      /"preview_url":\s*"([^"]+)"/i,
      /"thumbnail":\s*"([^"]+)"/i,
      /"preview":\s*"([^"]+)"/i,
      /"cover_image":\s*"([^"]+)"/i,
      /"poster":\s*"([^"]+)"/i,

      // Look for meta tags
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i,

      // Look for image URLs in data attributes and JSON
      /data-preview=["']([^"']+)["']/i,
      /data-thumbnail=["']([^"']+)["']/i,
      /data-cover=["']([^"']+)["']/i,

      // Look for Envato CDN patterns (updated for current structure)
      /https:\/\/elements-resized\.envatousercontent\.com\/[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      /https:\/\/elements-video-cover-images\.envatousercontent\.com\/[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      /https:\/\/elements-preview-images\.envatousercontent\.com\/[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      /https:\/\/elements\.envatousercontent\.com\/[^"'\s]*\.(jpg|jpeg|png|webp)/gi,

      // Legacy patterns
      /https:\/\/elements-preview-images-[^"'\s]+\.jpg/gi,
      /https:\/\/elements-video-cover-[^"'\s]+\.jpg/gi,
      /https:\/\/[^"'\s]*\.elements\.envato\.com\/[^"'\s]*\.(jpg|jpeg|png|webp)/gi,

      // Look for any envatousercontent.com images
      /https:\/\/[^"'\s]*envatousercontent\.com[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
    ];

    for (const pattern of previewMatches) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const cleanedUrl = cleanUrl(match[1]);
        console.log("Found Envato thumbnail with capture group:", {
          original: match[1],
          cleaned: cleanedUrl,
        });
        return cleanedUrl;
      } else if (match && match[0] && !match[1]) {
        // For global matches without capture groups
        const cleanedUrl = cleanUrl(match[0]);
        console.log("Found Envato thumbnail without capture group:", {
          original: match[0],
          cleaned: cleanedUrl,
        });
        return cleanedUrl;
      }
    }

    // Enhanced image search for Envato
    const imageMatches = html.match(
      /https:\/\/[^"'\s]*\.(jpg|jpeg|png|webp)/gi
    );
    if (imageMatches) {
      console.log("Found images in Envato page:", imageMatches.length);

      // Prioritize envatousercontent.com images
      for (const imageUrl of imageMatches) {
        if (imageUrl.includes("envatousercontent.com")) {
          const cleanedUrl = cleanUrl(imageUrl);
          console.log("Using envatousercontent.com image:", {
            original: imageUrl,
            cleaned: cleanedUrl,
          });
          return cleanedUrl;
        }
      }

      // Then look for preview/thumbnail/cover keywords
      for (const imageUrl of imageMatches) {
        if (
          imageUrl.includes("preview") ||
          imageUrl.includes("thumbnail") ||
          imageUrl.includes("cover")
        ) {
          const cleanedUrl = cleanUrl(imageUrl);
          console.log("Using preview/thumbnail/cover image:", {
            original: imageUrl,
            cleaned: cleanedUrl,
          });
          return cleanedUrl;
        }
      }

      // If no specific patterns found, use the first image
      const cleanedUrl = cleanUrl(imageMatches[0]);
      console.log("Using first available image:", {
        original: imageMatches[0],
        cleaned: cleanedUrl,
      });
      return cleanedUrl;
    }

    console.warn("No images found in Envato Elements page");
  }

  // For MotionElements, try to extract preview images from various patterns
  if (url.includes("motionelements.com")) {
    console.log("Processing MotionElements URL:", url);

    // Enhanced patterns for MotionElements
    const previewMatches = [
      // Look for preview URLs in JSON data (most common)
      /"preview_url":\s*"([^"]+)"/i,
      /"thumbnail":\s*"([^"]+)"/i,
      /"preview":\s*"([^"]+)"/i,
      /"cover_image":\s*"([^"]+)"/i,
      /"poster":\s*"([^"]+)"/i,
      /"image":\s*"([^"]+)"/i,

      // Look for meta tags
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i,

      // Look for image URLs in data attributes and JSON
      /data-preview=["']([^"']+)["']/i,
      /data-thumbnail=["']([^"']+)["']/i,
      /data-cover=["']([^"']+)["']/i,
      /data-image=["']([^"']+)["']/i,

      // Look for MotionElements CDN patterns
      /https:\/\/media-[^"'\s]*\.motionelements\.com\/[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      /https:\/\/[^"'\s]*\.motionelements\.com\/[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      /https:\/\/cdn\.motionelements\.com\/[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      /https:\/\/static\.motionelements\.com\/[^"'\s]*\.(jpg|jpeg|png|webp)/gi,

      // Look for AWS S3 MotionElements images
      /https:\/\/[^"'\s]*motionelements[^"'\s]*\.s3[^"'\s]*\.amazonaws\.com\/[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
      /https:\/\/media-us-west-motionelements\.s3\.amazonaws\.com\/[^"'\s]*\.(jpg|jpeg|png|webp)/gi,

      // Look for any motionelements.com images
      /https:\/\/[^"'\s]*motionelements\.com[^"'\s]*\.(jpg|jpeg|png|webp)/gi,
    ];

    for (const pattern of previewMatches) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const cleanedUrl = cleanUrl(match[1]);
        console.log("Found MotionElements thumbnail with capture group:", {
          original: match[1],
          cleaned: cleanedUrl,
        });
        return cleanedUrl;
      } else if (match && match[0] && !match[1]) {
        // For global matches without capture groups
        const cleanedUrl = cleanUrl(match[0]);
        console.log("Found MotionElements thumbnail without capture group:", {
          original: match[0],
          cleaned: cleanedUrl,
        });
        return cleanedUrl;
      }
    }

    // Enhanced image search for MotionElements
    const imageMatches = html.match(
      /https:\/\/[^"'\s]*\.(jpg|jpeg|png|webp)/gi
    );
    if (imageMatches) {
      console.log("Found images in MotionElements page:", imageMatches.length);

      // Prioritize motionelements.com and AWS S3 images
      for (const imageUrl of imageMatches) {
        if (
          imageUrl.includes("motionelements.com") ||
          (imageUrl.includes("motionelements") &&
            imageUrl.includes("amazonaws.com"))
        ) {
          const cleanedUrl = cleanUrl(imageUrl);
          console.log("Using MotionElements CDN image:", {
            original: imageUrl,
            cleaned: cleanedUrl,
          });
          return cleanedUrl;
        }
      }

      // Then look for preview/thumbnail/cover keywords
      for (const imageUrl of imageMatches) {
        if (
          imageUrl.includes("preview") ||
          imageUrl.includes("thumbnail") ||
          imageUrl.includes("cover")
        ) {
          const cleanedUrl = cleanUrl(imageUrl);
          console.log("Using preview/thumbnail/cover image:", {
            original: imageUrl,
            cleaned: cleanedUrl,
          });
          return cleanedUrl;
        }
      }

      // If no specific patterns found, use the first image
      const cleanedUrl = cleanUrl(imageMatches[0]);
      console.log("Using first available image:", {
        original: imageMatches[0],
        cleaned: cleanedUrl,
      });
      return cleanedUrl;
    }

    console.warn("No images found in MotionElements page");
  }

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

    // Fetch the provider page with better headers for Envato
    const resp = await fetch(providerUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      // No need for a long timeout here; rely on platform timeout
      // You can add AbortController if needed
    });

    if (!resp.ok) {
      console.error(
        `Failed to fetch provider page: ${resp.status} ${resp.statusText} for URL: ${providerUrl}`
      );

      // For debugging Envato issues
      if (providerUrl.includes("elements.envato.com")) {
        console.error("Envato Elements fetch failed:", {
          url: providerUrl,
          status: resp.status,
          statusText: resp.statusText,
          headers: Object.fromEntries(resp.headers.entries()),
        });
      }

      // For debugging MotionElements issues
      if (providerUrl.includes("motionelements.com")) {
        console.error("MotionElements fetch failed:", {
          url: providerUrl,
          status: resp.status,
          statusText: resp.statusText,
          headers: Object.fromEntries(resp.headers.entries()),
        });
      }

      return NextResponse.json(
        { error: `Upstream responded ${resp.status}` },
        { status: 502 }
      );
    }

    const html = await resp.text();

    // Debug logging for Envato Elements
    if (providerUrl.includes("elements.envato.com")) {
      console.log("Envato Elements HTML length:", html.length);
      console.log("Envato Elements HTML preview:", html.substring(0, 500));
    }

    // Debug logging for MotionElements
    if (providerUrl.includes("motionelements.com")) {
      console.log("MotionElements HTML length:", html.length);
      console.log("MotionElements HTML preview:", html.substring(0, 500));
    }

    const imageUrl = extractThumbnailFromHtml(html, providerUrl);

    if (!imageUrl) {
      console.warn(`No thumbnail found for URL: ${providerUrl}`);

      // Enhanced debugging for Envato Elements
      if (providerUrl.includes("elements.envato.com")) {
        console.error("Envato Elements thumbnail extraction failed:", {
          url: providerUrl,
          htmlLength: html.length,
          containsImages:
            html.includes(".jpg") ||
            html.includes(".png") ||
            html.includes(".webp"),
          containsEnvatousercontent: html.includes("envatousercontent.com"),
          containsOgImage: html.includes("og:image"),
        });
      }

      // Enhanced debugging for MotionElements
      if (providerUrl.includes("motionelements.com")) {
        console.error("MotionElements thumbnail extraction failed:", {
          url: providerUrl,
          htmlLength: html.length,
          containsImages:
            html.includes(".jpg") ||
            html.includes(".png") ||
            html.includes(".webp"),
          containsMotionElements: html.includes("motionelements.com"),
          containsAmazonaws: html.includes("amazonaws.com"),
          containsOgImage: html.includes("og:image"),
        });
      }

      // Fallback to placeholder
      return NextResponse.redirect("/placeholder.png", {
        status: 302,
        headers: {
          "Cache-Control": "public, max-age=600",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    console.log(`Found thumbnail for ${providerUrl}: ${imageUrl}`);

    // For Envato, MotionElements and other providers that might have CORS issues, use backend proxy
    let finalImageUrl = imageUrl;
    if (
      providerUrl.includes("elements.envato.com") ||
      imageUrl.includes("elements.envato.com") ||
      imageUrl.includes("elements.envatousercontent.com") ||
      providerUrl.includes("motionelements.com") ||
      imageUrl.includes("motionelements.com") ||
      imageUrl.includes("amazonaws.com")
    ) {
      finalImageUrl = `https://stockaty.virus.best/v1/proxy?request_to=${encodeURIComponent(imageUrl)}`;
      console.log("Using backend proxy for image:", {
        original: imageUrl,
        proxied: finalImageUrl,
      });
    }

    // Cache it (cache the original URL, not the proxy URL)
    thumbCache.set(providerUrl, {
      imageUrl: finalImageUrl,
      expiresAt: now + CACHE_TTL_MS,
    });

    // Redirect browser to final image URL (proxy handles CORS)
    return NextResponse.redirect(finalImageUrl, {
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
