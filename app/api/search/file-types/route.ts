import { join } from "path";
import { readFileSync } from "fs";
import { NextResponse } from "next/server";

const API_BASE_URL = "https://stockaty.virs.tech/v1";

// Types
interface FileTypeStats {
  id: string;
  count: number;
}

interface SearchItem {
  file_type?: string;
  image_type?: string;
}

interface ProviderData {
  results?: SearchItem[];
}

interface SearchResults {
  results?: Record<string, SearchItem[] | ProviderData>;
}

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

interface ResponseData {
  success: boolean;
  fileTypes: FileTypeStats[];
  last_updated: string;
  fallback?: boolean;
}

interface ErrorResponse {
  success: boolean;
  error: string;
  fileTypes: FileTypeStats[];
}

// Cache for file type statistics
const fileTypeStatsCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

// Function to normalize file types (same as in search page)
function normalizeFileType(
  fileTypeRaw: string | null | undefined,
  imageTypeRaw: string | null | undefined
): string {
  const ft = (fileTypeRaw || "").toString().trim().toLowerCase();
  const it = (imageTypeRaw || "").toString().trim().toLowerCase();

  // Videos: exclude video-templates from plain videos
  if (ft === "video" || ft === "stock-video" || it === "video") return "video";

  // Images and photos (raster/illustrations/graphics)
  if (
    ft === "image" ||
    ft === "images" ||
    ft === "photo" ||
    ft === "photos" ||
    ft === "illustration" ||
    ft === "illustrations" ||
    ft === "graphics" ||
    it === "image" ||
    it === "photo" ||
    it === "illustration"
  )
    return "image";

  // Vectors
  if (ft === "vector" || ft === "vectors" || it === "vector") return "vector";

  // Templates (graphic/presentation/video templates, psd)
  if (ft.endsWith("-templates") || ft === "templates" || ft === "psd")
    return "template";

  // Icons
  if (ft === "icon" || ft === "icons" || it === "icon") return "icon";

  // Audio
  if (ft === "sound-effects" || ft === "audio" || it === "audio")
    return "audio";

  // 3D
  if (ft === "3d" || it === "3d" || ft === "3d printing") return "3d";

  // Fonts
  if (ft === "fonts" || ft === "font") return "font";

  // Fallback to fileType if present
  return ft || it || "other";
}

// Load search.json as fallback data to analyze file types
let fallbackData: SearchResults | null = null;
try {
  const fallbackPath = join(process.cwd(), "search.json");
  fallbackData = JSON.parse(
    readFileSync(fallbackPath, "utf8")
  ) as SearchResults;
} catch (error) {
  console.warn("Could not load search.json fallback data:", error);
}

// Function to analyze file type statistics from search results
function analyzeFileTypeStats(searchResults: SearchResults): FileTypeStats[] {
  const fileTypeStats: Record<string, number> = {};

  if (searchResults && searchResults.results) {
    Object.entries(searchResults.results).forEach(
      ([, data]: [string, SearchItem[] | ProviderData]) => {
        const items = Array.isArray(data) ? data : data.results || [];

        items.forEach((item: SearchItem) => {
          const normalizedType = normalizeFileType(
            item.file_type,
            item.image_type
          );
          fileTypeStats[normalizedType] =
            (fileTypeStats[normalizedType] || 0) + 1;
        });
      }
    );
  }

  // Convert to array format expected by frontend, filtering out 'other' and low counts
  return Object.entries(fileTypeStats)
    .filter(([type, count]) => type !== "other" && count > 0)
    .map(([type, count]) => ({
      id:
        type === "image"
          ? "photos"
          : type === "vector"
            ? "vectors"
            : type === "template"
              ? "templates"
              : type === "icon"
                ? "icons"
                : type,
      count,
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending
}

// Function to get file type statistics from live API
async function getLiveFileTypeStats(): Promise<FileTypeStats[]> {
  try {
    // Try to get recent search results from multiple queries to get diverse file types
    const queries = ["design", "photo", "vector", "icon", "template"];
    const allStats: Record<string, number> = {};

    for (const query of queries) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/search?query=${query}&page=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "ResourceHub-FileTypeStats/1.0",
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          const data = (await response.json()) as SearchResults;
          const queryStats = analyzeFileTypeStats(data);

          // Merge stats
          queryStats.forEach((stat) => {
            allStats[stat.id] = (allStats[stat.id] || 0) + stat.count;
          });
        }
      } catch (error) {
        console.error(`Failed to get stats for query ${query}:`, error);
      }
    }

    // Convert merged stats back to array format
    return Object.entries(allStats)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Failed to get live file type stats:", error);
  }

  // Fallback to analyzing fallback data
  if (fallbackData) {
    return analyzeFileTypeStats(fallbackData);
  }

  return [];
}

export async function GET() {
  try {
    // Check cache first
    const cacheKey = "file-type-stats";
    const now = Date.now();
    const cached = fileTypeStatsCache.get(cacheKey);

    if (cached && cached.expiresAt > now) {
      return NextResponse.json(cached.data, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=600", // 10 minutes
        },
      });
    }

    // Get file type statistics
    const fileTypes = await getLiveFileTypeStats();

    const responseData: ResponseData = {
      success: true,
      fileTypes,
      last_updated: new Date().toISOString(),
    };

    // Cache the response
    fileTypeStatsCache.set(cacheKey, {
      data: responseData,
      expiresAt: now + CACHE_TTL_MS,
    });

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=600",
      },
    });
  } catch (error) {
    console.error("File type stats API error:", error);

    // Return fallback data if available
    if (fallbackData) {
      const fallbackFileTypes = analyzeFileTypeStats(fallbackData);
      const fallbackResponse: ResponseData = {
        success: true,
        fileTypes: fallbackFileTypes,
        last_updated: new Date().toISOString(),
        fallback: true,
      };

      return NextResponse.json(fallbackResponse, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: "Failed to fetch file type statistics",
      fileTypes: [],
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
