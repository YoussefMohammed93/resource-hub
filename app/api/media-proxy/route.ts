import { NextRequest, NextResponse } from "next/server";
import { extractMediaInfo } from "@/lib/media-utils";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    console.log("[Media Proxy] Received request for URL:", url);

    if (!url) {
      console.log("[Media Proxy] Error: No URL parameter provided");
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Validate that the URL is from allowed domains
    const allowedDomains = [
      "freepik.com",
      "www.freepik.com",
      "img.freepik.com",
      "cdn.freepik.com",
      "shutterstock.com",
      "www.shutterstock.com",
      "image.shutterstock.com",
      "unsplash.com",
      "images.unsplash.com",
      "pexels.com",
      "images.pexels.com",
      "stockaty.virs.tech",
    ];

    const urlObj = new URL(url);
    const isAllowedDomain = allowedDomains.some((domain) =>
      urlObj.hostname.includes(domain)
    );

    console.log("[Media Proxy] URL hostname:", urlObj.hostname);
    console.log("[Media Proxy] Is allowed domain:", isAllowedDomain);

    if (!isAllowedDomain) {
      console.log("[Media Proxy] Error: Domain not allowed:", urlObj.hostname);
      return NextResponse.json(
        { error: `Domain not allowed: ${urlObj.hostname}` },
        { status: 403 }
      );
    }

    // Extract media information using the utility
    const mediaInfo = extractMediaInfo(url);

    // Try to fetch the media from the extracted URL
    const urlsToTry = [mediaInfo.url];

    // If it's a Freepik page URL, try multiple possible URLs
    if (url.includes("freepik.com") && !url.includes("img.freepik.com")) {
      const pageId = extractFreepikId(url);
      if (pageId) {
        // Determine the content type from the URL
        let contentType = "photo";
        if (url.includes("free-video")) contentType = "video";
        else if (url.includes("free-vector")) contentType = "vector";

        // Add more possible URLs based on the media type and different formats
        const possibleUrls = [
          // Try the specific content type first with different extensions
          `https://img.freepik.com/free-${contentType}/${pageId}.jpg`,
          `https://img.freepik.com/free-${contentType}/${pageId}.jpeg`,
          `https://img.freepik.com/free-${contentType}/${pageId}.webp`,
          `https://img.freepik.com/free-${contentType}/${pageId}.png`,

          // Try CDN versions
          `https://cdn.freepik.com/free-${contentType}/${pageId}.jpg`,
          `https://cdn.freepik.com/free-${contentType}/${pageId}.jpeg`,
          `https://cdn.freepik.com/free-${contentType}/${pageId}.webp`,

          // Try all content types in case URL classification is wrong
          `https://img.freepik.com/free-photo/${pageId}.jpg`,
          `https://img.freepik.com/free-vector/${pageId}.jpg`,
          `https://img.freepik.com/free-video/${pageId}.jpg`,

          // Try with different path structures
          `https://img.freepik.com/${contentType}/${pageId}.jpg`,
          `https://img.freepik.com/photos/${pageId}.jpg`,
          `https://img.freepik.com/vectors/${pageId}.jpg`,
          `https://img.freepik.com/videos/${pageId}.jpg`,

          // Try with premium prefix (sometimes works)
          `https://img.freepik.com/premium-${contentType}/${pageId}.jpg`,

          // Try with different size variants
          `https://img.freepik.com/free-${contentType}/${pageId}_size2.jpg`,
          `https://img.freepik.com/free-${contentType}/${pageId}_size1.jpg`,

          // Try with thumbnail versions
          `https://img.freepik.com/free-${contentType}/${pageId}_thumb.jpg`,
          `https://img.freepik.com/free-${contentType}/thumb/${pageId}.jpg`,
        ];

        console.log(
          "Generated possible URLs for ID",
          pageId,
          ":",
          possibleUrls.slice(0, 5)
        );
        urlsToTry.push(...possibleUrls);
      }
    }

    // Try to fetch from each possible URL
    console.log(`Trying to fetch media from ${urlsToTry.length} possible URLs`);

    for (let i = 0; i < urlsToTry.length; i++) {
      const tryUrl = urlsToTry[i];
      console.log(`Attempt ${i + 1}/${urlsToTry.length}: ${tryUrl}`);

      try {
        const response = await fetch(tryUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Referer: urlObj.origin,
          },
        });

        console.log(
          `Response for ${tryUrl}: ${response.status} ${response.statusText}`
        );

        if (response.ok) {
          const mediaBuffer = await response.arrayBuffer();
          const contentType =
            response.headers.get("Content-Type") || "image/jpeg";

          console.log(
            `Successfully fetched media from ${tryUrl}, content-type: ${contentType}`
          );

          return new NextResponse(mediaBuffer, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=3600",
            },
          });
        }
      } catch (error) {
        console.log(`Failed to fetch ${tryUrl}:`, error);
        continue;
      }
    }

    // If all URLs fail, return a sample image as placeholder
    console.log(
      "[Media Proxy] All URLs failed, returning sample image placeholder"
    );
    return await generateSampleImageResponse(mediaInfo.type);
  } catch (error) {
    console.error("Media proxy error:", error);

    // Return a sample image on error
    return await generateSampleImageResponse("unknown");
  }
}

function extractFreepikId(url: string): string | null {
  // Extract ID from Freepik URLs - updated patterns for current URL structure
  const patterns = [
    // Pattern: /free-photo/side-view-hand-wearing-bracelet_31842933.htm
    /\/free-(?:photo|video|vector)\/[^_]+_(\d+)\.htm$/,
    // Pattern: /free-video/close-up-cat-s-face-eyes_171159 (no .htm)
    /\/free-(?:photo|video|vector)\/[^_]+_(\d+)$/,
    // Pattern: /free-photo/description-31842933.htm
    /\/free-(?:photo|video|vector)\/[^-]+-(\d+)\.htm$/,
    // Pattern: /free-video/description-171159
    /\/free-(?:photo|video|vector)\/[^-]+-(\d+)$/,
    // Pattern: /free-photo/description/31842933
    /\/free-(?:photo|video|vector)\/[^\/]+\/(\d+)$/,
    // Pattern: just the number at the end after underscore
    /_(\d+)\.htm?$/,
    // Pattern: just the number at the end
    /_(\d+)$/,
  ];

  console.log("[Media Proxy] Extracting ID from URL:", url);

  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    const match = url.match(pattern);
    if (match && match[1]) {
      console.log(
        `[Media Proxy] Found ID: ${match[1]} using pattern ${i + 1}:`,
        pattern
      );
      return match[1];
    }
  }

  console.log("[Media Proxy] No ID found for URL:", url);
  return null;
}

async function generateSampleImageResponse(
  type: "image" | "video" | "unknown" = "unknown"
): Promise<NextResponse> {
  try {
    // Choose a sample image based on the type
    let sampleImagePath = "/placeholder.png"; // default fallback

    if (type === "video") {
      // For videos, we could use a video thumbnail or a specific sample
      sampleImagePath = "/image-2.webp"; // Use a sample image for videos
    } else if (type === "image") {
      // For photos, use one of the sample images
      sampleImagePath = "/image-1.jpg";
    } else {
      // For unknown or other types, use a different sample
      sampleImagePath = "/freepik-1.jpg";
    }

    // Try to read the sample image from the public folder
    const imagePath = join(process.cwd(), "public", sampleImagePath);
    console.log("Reading sample image from:", imagePath);

    const imageBuffer = await readFile(imagePath);

    // Determine content type based on file extension
    let contentType = "image/jpeg";
    if (sampleImagePath.endsWith(".png")) contentType = "image/png";
    else if (sampleImagePath.endsWith(".webp")) contentType = "image/webp";
    else if (sampleImagePath.endsWith(".gif")) contentType = "image/gif";

    return new NextResponse(new Uint8Array(imageBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.log("Failed to fetch sample image, falling back to SVG:", error);
  }

  // Fallback to SVG if sample image fails
  const icon = type === "video" ? "🎥" : type === "image" ? "📷" : "🎨";
  const label =
    type === "video"
      ? "Video Preview"
      : type === "image"
        ? "Image Preview"
        : "Media Preview";

  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <text x="50%" y="40%" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" fill="#3b82f6">${icon}</text>
      <text x="50%" y="60%" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#475569" font-weight="600">
        ${label}
      </text>
      <text x="50%" y="75%" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#64748b">
        Click to view on Freepik
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
