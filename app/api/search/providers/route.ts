import { join } from "path";
import { readFileSync } from "fs";
import { NextResponse } from "next/server";

const API_BASE_URL = "https://stockaty.virs.tech/v1";

// Types
interface ProviderStats {
  count: number;
  isOnline: boolean;
}

interface Provider {
  id: string;
  name: string;
  logo: string;
  count: number;
  isOnline: boolean;
}

interface SearchItem {
  [key: string]: unknown;
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
  providers: Provider[];
  last_updated: string;
  fallback?: boolean;
}

interface ErrorResponse {
  success: boolean;
  error: string;
  providers: Provider[];
}

// Cache for provider statistics
const providerStatsCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

// Provider icon mapping
const getProviderIcon = (providerName: string): string => {
  const providerIconMap: Record<string, string> = {
    Freepik: "https://cdn-icons-png.freepik.com/512/18/18551.png",
    Shutterstock: "https://cdn.worldvectorlogo.com/logos/shutterstock.svg",
    "Adobe Stock": "https://cdn.worldvectorlogo.com/logos/adobe-2.svg",
    AdobeStock: "https://cdn.worldvectorlogo.com/logos/adobe-2.svg",
    "Getty Images": "https://cdn.worldvectorlogo.com/logos/getty-images-1.svg",
    Unsplash: "https://cdn.worldvectorlogo.com/logos/unsplash-1.svg",
    Storyblocks: "https://www.storyblocks.com/favicon.ico",
    Envato: "https://cdn.worldvectorlogo.com/logos/envato.svg",
    Vexels: "https://www.vexels.com/favicon.ico",
    Vectory: "https://vectory.com/favicon.ico",
    UI8: "https://ui8.net/favicon.ico",
    RawPixel: "https://www.rawpixel.com/favicon.ico",
    PNGTree: "https://pngtree.com/favicon.ico",
    PngTree: "https://pngtree.com/favicon.ico",
    Vecteezy:
      "https://static.vecteezy.com/system/resources/favicons/favicon-32x32.png",
    CreativeFabrica: "https://www.creativefabrica.com/favicon.ico",
    MotionElements: "https://www.motionelements.com/favicon.ico",
  };

  return (
    providerIconMap[providerName] ||
    `https://www.google.com/s2/favicons?domain=${providerName.toLowerCase()}.com&sz=64`
  );
};

// Load search.json as fallback data to analyze providers
let fallbackData: SearchResults | null = null;
try {
  const fallbackPath = join(process.cwd(), "search.json");
  fallbackData = JSON.parse(
    readFileSync(fallbackPath, "utf8")
  ) as SearchResults;
} catch (error) {
  console.warn("Could not load search.json fallback data:", error);
}

// Function to analyze provider statistics from search results
function analyzeProviderStats(searchResults: SearchResults): Provider[] {
  const providerStats: Record<string, ProviderStats> = {};

  if (searchResults && searchResults.results) {
    Object.entries(searchResults.results).forEach(
      ([providerName, data]: [string, SearchItem[] | ProviderData]) => {
        const items = Array.isArray(data) ? data : data.results || [];
        providerStats[providerName] = {
          count: items.length,
          isOnline: true, // Assume online if we have results
        };
      }
    );
  }

  // Convert to array format expected by frontend
  return Object.entries(providerStats).map(([name, stats]) => ({
    id: name.toLowerCase().replace(/\s+/g, ""),
    name,
    logo: getProviderIcon(name),
    count: stats.count,
    isOnline: stats.isOnline,
  }));
}

// Function to get provider statistics from live API
async function getLiveProviderStats(): Promise<Provider[]> {
  try {
    // Try to get recent search results to analyze providers
    const response = await fetch(`${API_BASE_URL}/search?query=design&page=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "ResourceHub-ProviderStats/1.0",
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = (await response.json()) as SearchResults;
      return analyzeProviderStats(data);
    }
  } catch (error) {
    console.error("Failed to get live provider stats:", error);
  }

  // Fallback to analyzing fallback data
  if (fallbackData) {
    return analyzeProviderStats(fallbackData);
  }

  return [];
}

export async function GET() {
  try {
    // Check cache first
    const cacheKey = "provider-stats";
    const now = Date.now();
    const cached = providerStatsCache.get(cacheKey);

    if (cached && cached.expiresAt > now) {
      return NextResponse.json(cached.data, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=600", // 10 minutes
        },
      });
    }

    // Get provider statistics
    const providers = await getLiveProviderStats();

    const responseData: ResponseData = {
      success: true,
      providers,
      last_updated: new Date().toISOString(),
    };

    // Cache the response
    providerStatsCache.set(cacheKey, {
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
    console.error("Provider stats API error:", error);

    // Return fallback data if available
    if (fallbackData) {
      const fallbackProviders = analyzeProviderStats(fallbackData);
      const fallbackResponse: ResponseData = {
        success: true,
        providers: fallbackProviders,
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
      error: "Failed to fetch provider statistics",
      providers: [],
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
