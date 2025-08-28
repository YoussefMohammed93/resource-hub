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

    // If it's a Freepik page URL, scrape the actual image URL
    if (url.includes("freepik.com") && !url.includes("img.freepik.com")) {
      try {
        console.log("[Media Proxy] Scraping Freepik page for image URL:", url);
        
        const pageResponse = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "DNT": "1",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
          },
        });

        if (pageResponse.ok) {
          const html = await pageResponse.text();
          
          // Extract image URLs from various meta tags and JSON-LD
          const imageUrls = [];
          
          // Try Open Graph image
          const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
          if (ogImageMatch) imageUrls.push(ogImageMatch[1]);
          
          // Try Twitter card image
          const twitterImageMatch = html.match(/<meta name="twitter:image" content="([^"]+)"/);
          if (twitterImageMatch) imageUrls.push(twitterImageMatch[1]);
          
          // Try to find high-res images in JSON-LD
          const jsonLdMatches = html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/g);
          if (jsonLdMatches) {
            for (const jsonLdMatch of jsonLdMatches) {
              try {
                const jsonContent = jsonLdMatch.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
                const data = JSON.parse(jsonContent);
                if (data.image) {
                  if (Array.isArray(data.image)) {
                    imageUrls.push(...data.image);
                  } else if (typeof data.image === 'string') {
                    imageUrls.push(data.image);
                  } else if (data.image.url) {
                    imageUrls.push(data.image.url);
                  }
                }
              } catch (e) {
                // Ignore JSON parse errors
                console.log("[Media Proxy] JSON parse error:", e);
              }
            }
          }
          
          // Try to find img tags with high-res sources
          const imgMatches = html.match(/<img[^>]+src="([^"]*img\.freepik\.com[^"]+)"/g);
          if (imgMatches) {
            for (const imgMatch of imgMatches) {
              const srcMatch = imgMatch.match(/src="([^"]+)"/);
              if (srcMatch) imageUrls.push(srcMatch[1]);
            }
          }
          
          // Filter and prioritize URLs
          const filteredUrls = imageUrls
            .filter(url => url && url.includes('img.freepik.com'))
            .filter(url => !url.includes('thumb') && !url.includes('small'))
            .sort((a, b) => {
              // Prioritize larger images
              if (a.includes('size2') || a.includes('large')) return -1;
              if (b.includes('size2') || b.includes('large')) return 1;
              return 0;
            });
          
          console.log("[Media Proxy] Found image URLs:", filteredUrls);
          
          if (filteredUrls.length > 0) {
            // Try the best image URL first
            for (const imageUrl of filteredUrls) {
              try {
                const imageResponse = await fetch(imageUrl, {
                  headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Referer": url,
                  },
                });
                
                if (imageResponse.ok) {
                  const mediaBuffer = await imageResponse.arrayBuffer();
                  const contentType = imageResponse.headers.get("Content-Type") || "image/jpeg";
                  
                  console.log(`[Media Proxy] Successfully fetched image from ${imageUrl}`);
                  
                  return new NextResponse(mediaBuffer, {
                    headers: {
                      "Content-Type": contentType,
                      "Cache-Control": "public, max-age=3600",
                    },
                  });
                }
              } catch (e) {
                console.log(`[Media Proxy] Failed to fetch ${imageUrl}:`, e);
                continue;
              }
            }
          }
        }
      } catch (error) {
        console.log("[Media Proxy] Failed to scrape Freepik page:", error);
      }
    }

    // Fallback: Try to fetch from the original URL
    const urlsToTry = [mediaInfo.url];

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
