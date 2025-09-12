/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Menu,
  ImageIcon,
  File,
  Palette,
  Camera,
  AlertCircle,
  WifiOff,
  AudioLines,
  Headphones,
  Volume2,
  User,
  Mail,
  CreditCard,
  Coins,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/i18n-provider";
import { HeaderControls } from "@/components/header-controls";
import { useState, Suspense, useEffect, useCallback, useRef } from "react";
import { searchApi } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { DownloadVerificationSheet } from "@/components/download-verification-sheet";
import Image from "next/image";

// Type definitions for API response
interface ApiSearchResult {
  url: string;
  file_id: string;
  file_type: string;
  image_type: string;
  metadata: {
    title: string;
    description: string | null;
  };
  preview: {
    src: string;
    width: number | null;
    height: number | null;
  };
}

interface ApiResponse {
  success: boolean;
  data: {
    query: string;
    page: string;
  };
  results: {
    [provider: string]:
      | {
          icon?: string;
          results: ApiSearchResult[];
        }
      | ApiSearchResult[];
  };
}

// Transformed search result for UI
interface SearchResult {
  id: string;
  title: string;
  thumbnail: string; // For images: image URL; for videos: preview .mp4
  provider: string;
  type: string;
  file_type: string; // 'video' | 'image' | etc
  width: number | null;
  height: number | null;
  url: string; // Provider page URL
  file_id: string;
  image_type: string;
  poster?: string; // Poster image URL for videos
  providerIcon?: string; // Provider icon URL from API
}

// Provider statistics from API
interface ProviderStats {
  id: string;
  name: string;
  logo: string;
  count: number;
  isOnline: boolean;
}

// File type statistics from API
interface FileTypeStats {
  id: string;
  count: number;
}

// Note: Provider and file type statistics are now extracted directly from search results
// No separate API calls needed

// Helpers for deterministic shuffling and file type normalization
function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

// Format file type for display (first letter capitalized)
function formatFileType(fileType: string): string {
  if (!fileType || typeof fileType !== "string") {
    return "Unknown";
  }

  const trimmed = fileType.trim().toLowerCase();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seededShuffle<T>(array: T[], seedStr: string): T[] {
  const arr = array.slice();
  const rng = mulberry32(hashString(seedStr));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function normalizeFileType(
  fileTypeRaw: string | null | undefined,
  imageTypeRaw: string | null | undefined
): string {
  const ft = (fileTypeRaw || "").toString().trim().toLowerCase();
  const it = (imageTypeRaw || "").toString().trim().toLowerCase();
  // Videos: exclude video-templates from plain videos
  if (ft === "video" || ft === "stock-video" || it === "video") return "video";
  // GIFs: handle GIF files as a distinct type
  if (ft === "gif" || it === "gif") return "gif";
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

// Transform API results to UI format with randomized mixing across providers
function transformApiResults(
  apiResponse: ApiResponse,
  limitResults: boolean = true
): SearchResult[] {
  const all: SearchResult[] = [];

  Object.entries(apiResponse.results).forEach(([provider, data]) => {
    // Handle both old format (array) and new format (object with icon and results)
    const items = Array.isArray(data) ? data : data.results || [];
    const providerIcon = Array.isArray(data) ? undefined : data.icon;

    items.forEach((item, index) => {
      const normalizedType = normalizeFileType(item.file_type, item.image_type);
      const base: SearchResult = {
        id: `${provider}-${item.file_id}-${index}-${apiResponse.data?.page || "1"}`, // Include page in ID to avoid duplicates
        title: item.metadata.title || "Untitled",
        thumbnail: item.preview.src,
        provider,
        type: item.image_type,
        file_type: normalizedType,
        width: item.preview.width,
        height: item.preview.height,
        url: item.url,
        file_id: item.file_id,
        image_type: item.image_type,
        providerIcon: getProviderIcon(provider, providerIcon), // Add provider icon to search result
      };
      if (normalizedType === "video" && item.url) {
        base.poster = `/api/video-thumbnail?url=${encodeURIComponent(item.url)}`;
      }
      all.push(base);
    });
  });

  // Randomize/mix results deterministically by query+page to avoid provider grouping
  const seed = `${apiResponse.data?.query || ""}::${apiResponse.data?.page || "1"}`;
  const shuffled = seededShuffle(all, seed);
  return limitResults ? shuffled.slice(0, 60) : shuffled;
}

// Provider icon mapping for fallback when API doesn't provide icons
const getProviderIcon = (providerName: string, apiIcon?: string): string => {
  // Use API icon if available
  if (apiIcon) return apiIcon;

  // Fallback mapping based on provider name
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
  };

  return (
    providerIconMap[providerName] ||
    `https://www.google.com/s2/favicons?domain=${providerName.toLowerCase()}.com&sz=64`
  );
};

// Search content component that uses useSearchParams
function SearchContent() {
  const { t } = useTranslation("common");
  const { language, isRTL, isLoading } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialType = searchParams.get("type") || "all";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>(initialType);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [isDownloadSheetOpen, setIsDownloadSheetOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  // API state
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [allResults, setAllResults] = useState<SearchResult[]>([]); // Store all unfiltered results
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  // Dynamic sidebar data state - extracted from search results
  const [providers, setProviders] = useState<ProviderStats[]>([]);
  const [fileTypes, setFileTypes] = useState<FileTypeStats[]>([]);
  const [providersError, setProvidersError] = useState<string | null>(null);
  const [fileTypesError, setFileTypesError] = useState<string | null>(null);

  const resultsPerPage = 60; // Updated to match requirements
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Functions to extract dynamic sidebar data from search results
  const extractProvidersFromResults = (
    apiResponse: ApiResponse
  ): ProviderStats[] => {
    const providerStats: ProviderStats[] = [];

    Object.entries(apiResponse.results).forEach(([providerName, data]) => {
      // Handle both old format (array) and new format (object with icon and results)
      const items = Array.isArray(data) ? data : data.results || [];
      const providerIcon = Array.isArray(data) ? undefined : data.icon;

      // Create provider stats
      const provider: ProviderStats = {
        id: providerName.toLowerCase().replace(/\s+/g, ""), // Normalize ID for filtering
        name: providerName,
        logo: getProviderIcon(providerName, providerIcon),
        count: items.length,
        isOnline: true, // Assume online if we got results
      };

      providerStats.push(provider);
    });

    // Sort by count (descending) then by name
    return providerStats.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });
  };

  const extractFileTypesFromResults = (
    apiResponse: ApiResponse
  ): FileTypeStats[] => {
    const fileTypeCounts = new Map<string, number>();

    Object.entries(apiResponse.results).forEach(([, data]) => {
      // Handle both old format (array) and new format (object with icon and results)
      const items = Array.isArray(data) ? data : data.results || [];

      items.forEach((item) => {
        const normalizedType = normalizeFileType(
          item.file_type,
          item.image_type
        );
        const displayType = formatFileType(normalizedType);

        fileTypeCounts.set(
          displayType,
          (fileTypeCounts.get(displayType) || 0) + 1
        );
      });
    });

    // Convert to array and sort by count (descending)
    const fileTypeStats: FileTypeStats[] = Array.from(
      fileTypeCounts.entries()
    ).map(([type, count]) => ({
      id: type,
      count,
    }));

    return fileTypeStats.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.id.localeCompare(b.id);
    });
  };

  // Apply filter to results - simplified for direct API pagination
  const applyCurrentFilter = (
    results: SearchResult[],
    page: number = currentPage
  ) => {
    const filterMap: Record<string, string> = {
      images: "image",
      videos: "video",
      vectors: "vector",
      templates: "template",
      icons: "icon",
      audio: "audio",
      "3d": "3d",
      fonts: "font",
    };

    let filteredResults = results;

    // Apply provider filter if any providers are selected
    if (selectedProviders.length > 0) {
      filteredResults = filteredResults.filter((result) =>
        selectedProviders.includes(
          result.provider.toLowerCase().replace(/\s+/g, "")
        )
      );
    }

    // Apply file type filter
    if (selectedFilter !== "all") {
      const target = filterMap[selectedFilter];
      if (target) {
        filteredResults = filteredResults.filter(
          (result) => result.file_type === target
        );
      }
    }

    // Apply selected file types filter
    if (selectedFileTypes.length > 0) {
      filteredResults = filteredResults.filter((result) => {
        // Format the result file type to match the display format used in sidebar
        const resultFileType = formatFileType(result.file_type);
        return selectedFileTypes.includes(resultFileType);
      });
    }

    // Set filtered results directly (no client-side pagination)
    setSearchResults(filteredResults);

    // Update total results - use a reasonable estimate for pagination
    // Since we're now using direct API calls, we'll estimate total results
    setTotalResults(
      filteredResults.length + (page > 1 ? (page - 1) * resultsPerPage : 0)
    );
  };
  // Add a ref to track ongoing search requests to prevent duplicates
  const searchRequestRef = useRef<string | null>(null);

  // Perform search API call - simplified to make only ONE direct API call
  const performSearch = async (
    query: string,
    page: number = 1,
    retryCount: number = 0
  ) => {
    if (!query.trim()) return;

    // Create a unique request ID to prevent duplicate requests
    const requestId = `${query}-${page}-${Date.now()}`;

    // Check if there's already an ongoing request for the same query and page
    if (searchRequestRef.current === `${query}-${page}`) {
      console.log("Duplicate request prevented for:", query, "page:", page);
      return;
    }

    // Set the current request
    searchRequestRef.current = `${query}-${page}`;

    console.log("Starting search request:", requestId);
    setIsSearchLoading(true);
    setSearchError(null);

    try {
      // Make a single direct API call to the requested page using the optimized search API
      const searchResponse = await searchApi.search({ query, page });

      if (!searchResponse.success || !searchResponse.data) {
        throw new Error(
          searchResponse.error?.message || "Invalid API response format"
        );
      }

      const apiResponse = searchResponse.data;
      if (!apiResponse.results) {
        throw new Error("No results in API response");
      }

      // Transform API results
      const pageResults = transformApiResults(apiResponse, false);

      // Extract providers and file types from the API response
      const extractedProviders = extractProvidersFromResults(apiResponse);
      const extractedFileTypes = extractFileTypesFromResults(apiResponse);

      // Update sidebar data
      setProviders(extractedProviders);
      setFileTypes(extractedFileTypes);
      setProvidersError(null);
      setFileTypesError(null);

      // For page 1, store all results for filtering. For other pages, append to existing results
      if (page === 1) {
        setAllResults(pageResults);
      } else {
        setAllResults((prev) => [...prev, ...pageResults]);
      }

      // Apply current filter to results
      applyCurrentFilter(pageResults, page);
      setCurrentPage(page);

      // Clear any previous errors
      setSearchError(null);
      console.log("Search request completed:", requestId);
    } catch (error) {
      console.error(`Search attempt ${retryCount + 1} failed:`, error);

      // Enhanced error handling with specific error types
      let errorMessage = "Search failed";

      if (error instanceof Error) {
        // Handle specific error types
        if (
          error.message.includes("timeout") ||
          error.message.includes("ECONNABORTED")
        ) {
          errorMessage = "Search request timed out. Please try again.";
        } else if (
          error.message.includes("rate_limit") ||
          error.message.includes("429")
        ) {
          errorMessage =
            "Too many search requests. Please wait before trying again.";
        } else if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }

      // Retry logic - retry up to 2 times with exponential backoff
      if (retryCount < 2) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(
          `Retrying search in ${delay}ms (attempt ${retryCount + 2}/3)`
        );
        setTimeout(() => {
          performSearch(query, page, retryCount + 1);
        }, delay);
        return;
      }

      // Final failure after retries
      setSearchError(
        `${errorMessage}${retryCount > 0 ? ` (after ${retryCount + 1} attempts)` : ""}`
      );
      setSearchResults([]);
      setAllResults([]);
      setTotalResults(0);

      // Clear sidebar data on error
      setProviders([]);
      setFileTypes([]);
      setProvidersError("Failed to load provider data");
      setFileTypesError("Failed to load file type data");
    } finally {
      if (retryCount === 0) {
        // Only set loading false on the initial call
        setIsSearchLoading(false);
        // Clear the request reference
        searchRequestRef.current = null;
      }
    }
  };

  // Enhanced URL detection for supported platforms (same as home page)
  const detectSupportedUrl = (query: string): boolean => {
    const trimmedQuery = query.trim();

    // Check for common URL patterns
    const urlPatterns = [
      /^https?:\/\//i, // Starts with http:// or https://
      /^www\./i, // Starts with www.
      /\.(com|org|net|edu|gov|io|co|uk|de|fr|es|it|jp|cn|ru|br|in|au|ca|mx|nl|se|no|dk|fi|pl|cz|hu|ro|bg|hr|si|sk|ee|lv|lt|mt|cy|lu|be|at|ch|li|mc|sm|va|ad|is|fo|gl|sj|bv|hm|cc|tv|tk|ml|ga|cf|gq|st|td|ne|bf|ml|sn|gm|gw|cv|mr|dz|tn|ly|eg|sd|ss|er|et|so|dj|ke|ug|tz|rw|bi|mw|zm|zw|bw|na|sz|ls|za|mg|mu|sc|km|yt|re|sh|ac|ta|fk|gs|pn|ck|nu|nf|tv|ki|nr|pw|fm|mh|mp|gu|as|pr|vi|vg|ai|ms|kn|ag|dm|lc|vc|gd|bb|tt|gy|sr|gf|br|uy|py|bo|pe|ec|co|ve|cl|ar|fj|sb|vu|nc|pf|wf|ws|to|tv|tk|nu|ck|ki|nr|pw|fm|mh|mp|gu|as|pr|vi|vg|ai|ms|kn|ag|dm|lc|vc|gd|bb|tt|gy|sr|gf)$/i,
      /freepik\.com/i,
      /shutterstock\.com/i,
      /adobe\.com/i,
      /stock\.adobe\.com/i,
      /gettyimages\.com/i,
      /unsplash\.com/i,
      /pexels\.com/i,
      /pixabay\.com/i,
      /vecteezy\.com/i,
      /dreamstime\.com/i,
      /123rf\.com/i,
      /depositphotos\.com/i,
      /istockphoto\.com/i,
      /elements\.envato\.com/i,
      /creativemarket\.com/i,
      /canva\.com/i,
      /figma\.com/i,
      /flaticon\.com/i,
      /icons8\.com/i,
      /thenounproject\.com/i,
      /storyset\.com/i,
    ];

    const urlRegex =
      /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/ \w \.-]*)*\/?$/i;
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

    return (
      urlPatterns.some((pattern) => pattern.test(trimmedQuery)) ||
      urlRegex.test(trimmedQuery) ||
      domainRegex.test(trimmedQuery)
    );
  };

  // Handle search button click
  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      return;
    }

    // Check if the input is a URL from supported platforms
    if (detectSupportedUrl(trimmedQuery)) {
      // Open download verification sheet for URLs
      let processedUrl = trimmedQuery;

      // Add https:// if no protocol is specified
      if (!processedUrl.match(/^https?:\/\//i)) {
        processedUrl = `https://${processedUrl}`;
      }

      setDownloadUrl(processedUrl);
      setIsDownloadSheetOpen(true);
      return;
    }

    // For regular text searches, proceed normally
    if (searchQuery.trim()) {
      // Update URL without page reload
      const url = new URL(window.location.href);
      url.searchParams.set("q", searchQuery);
      window.history.pushState({}, "", url.toString());

      // Perform search
      performSearch(searchQuery, 1);
    }
  };

  // Load initial search results - only once when component mounts
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, 1);
    }
  }, [initialQuery]);

  // Note: Sidebar data is now loaded dynamically from search results
  // No need for separate API calls on component mount

  // Apply filters when filter selection changes (without triggering new API calls)
  useEffect(() => {
    if (allResults.length > 0) {
      // Reset to page 1 when filter changes
      setCurrentPage(1);
      applyCurrentFilter(allResults, 1);
    }
  }, [selectedFilter]);

  // Re-apply filters when provider selection changes
  useEffect(() => {
    if (allResults.length > 0) {
      // Reset to page 1 when provider filter changes
      setCurrentPage(1);
      applyCurrentFilter(allResults, 1);
    }
  }, [selectedProviders]);

  // Re-apply filters when file type selection changes
  useEffect(() => {
    if (allResults.length > 0) {
      // Reset to page 1 when file type filter changes
      setCurrentPage(1);
      applyCurrentFilter(allResults, 1);
    }
  }, [selectedFileTypes]);

  useEffect(() => {
    return () => {
      // Cleanup all video elements when component unmounts
      const videos = document.querySelectorAll("video");
      videos.forEach((video) => {
        video.pause();
        video.currentTime = 0;
        video.src = "";
        video.load();
      });
    };
  }, [currentPage, searchResults]);

  // Handle video play/pause with proper error handling
  const handleVideoHover = useCallback(
    (video: HTMLVideoElement, play: boolean) => {
      if (play) {
        video.play().catch((error) => {
          console.warn("Video play failed:", error);
          // Fallback: show poster image by hiding video
          video.style.display = "none";
          const poster = video.nextElementSibling as HTMLImageElement;
          if (poster && poster.tagName === "IMG") {
            poster.style.display = "block";
          }
        });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    },
    []
  );

  // Check if URL is a valid video URL
  const isValidVideoUrl = useCallback((url: string): boolean => {
    if (!url) return false;

    // Check for common video file extensions
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
    const hasVideoExtension = videoExtensions.some((ext) =>
      url.toLowerCase().includes(ext)
    );

    // Check for video streaming domains
    const videoStreamingDomains = [
      "cloudfront.net",
      "amazonaws.com",
      "vimeo.com",
      "youtube.com",
    ];
    const hasVideoStreamingDomain = videoStreamingDomains.some((domain) =>
      url.includes(domain)
    );

    return hasVideoExtension || hasVideoStreamingDomain;
  }, []);

  // Generate video thumbnail using canvas (client-side)
  const generateVideoThumbnail = useCallback(
    (videoElement: HTMLVideoElement): Promise<string> => {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve("/placeholder.png");
          return;
        }

        // Set canvas size to video dimensions
        canvas.width = videoElement.videoWidth || 320;
        canvas.height = videoElement.videoHeight || 240;

        // Draw the current frame
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Convert to data URL
        const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve(thumbnailUrl);
      });
    },
    []
  );

  // Get video poster - use a simple approach that works
  const getVideoPoster = useCallback((videoUrl: string): string => {
    if (!videoUrl) return "/placeholder.png";

    // For now, we'll use placeholder and generate thumbnail on load
    // This is more reliable than trying to extract frames from URLs
    return "/placeholder.png";
  }, []);

  // Function to detect image dimensions from URL
  const detectImageDimensions = useCallback(
    (imageUrl: string): Promise<{ width: number; height: number }> => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();

        img.onload = () => {
          const dimensions = {
            width: img.naturalWidth,
            height: img.naturalHeight,
          };

          resolve(dimensions);
        };

        img.onerror = () => {
          reject(new Error(`Failed to load image: ${imageUrl}`));
        };

        // Set crossOrigin to handle CORS issues
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
      });
    },
    []
  );

  // Function to detect all search results dimensions (silent)
  const logAllResultsDimensions = useCallback(async () => {
    const dimensionPromises = searchResults.map(async (result, index) => {
      try {
        const dimensions = await detectImageDimensions(result.thumbnail);
        return {
          index: index + 1,
          id: result.id,
          title: result.title,
          provider: result.provider,
          fileType: result.file_type,
          originalWidth: result.width,
          originalHeight: result.height,
          detectedWidth: dimensions.width,
          detectedHeight: dimensions.height,
          url: result.thumbnail,
        };
      } catch (error) {
        return {
          index: index + 1,
          id: result.id,
          title: result.title,
          provider: result.provider,
          fileType: result.file_type,
          originalWidth: result.width,
          originalHeight: result.height,
          detectedWidth: null,
          detectedHeight: null,
          url: result.thumbnail,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });

    try {
      const results = await Promise.allSettled(dimensionPromises);
      const successfulResults = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      return successfulResults;
    } catch (error) {
      console.error("Failed to detect dimensions:", error);
      return [];
    }
  }, [searchResults, detectImageDimensions]);

  // Auto-detect dimensions when search results change
  useEffect(() => {
    if (searchResults.length > 0) {
      // Add a small delay to ensure images are rendered
      const timer = setTimeout(() => {
        logAllResultsDimensions();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [searchResults, logAllResultsDimensions]);

  const toggleProvider = (providerId: string) => {
    setSelectedProviders((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId]
    );
  };

  const toggleFileType = (typeId: string) => {
    setSelectedFileTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  // Advanced masonry grid with truly varied row heights
  const createDynamicGridRows = (results: SearchResult[]) => {
    const rows: { items: SearchResult[]; height: number }[] = [];
    let currentIndex = 0;

    // Get viewport width for container calculations
    const getViewportWidth = () => {
      if (typeof window !== "undefined") {
        return window.innerWidth;
      }
      return 1200; // fallback
    };

    // Calculate available width for images (accounting for sidebar, padding, gaps)
    const getAvailableWidth = () => {
      const viewportWidth = getViewportWidth();
      const sidebarWidth = viewportWidth >= 1024 ? 320 : 0; // lg breakpoint
      const containerPadding = 40; // px-5 on both sides
      const availableWidth = viewportWidth - sidebarWidth - containerPadding;
      return Math.max(600, availableWidth); // minimum 600px
    };

    const availableWidth = getAvailableWidth();
    const gapSize = 20; // gap between items

    // Define varied row height patterns
    const getRowHeightPattern = (rowIndex: number) => {
      const viewportWidth = getViewportWidth();
      let heightPatterns: number[];

      if (viewportWidth >= 1600) {
        heightPatterns = [500, 200, 350, 250, 400, 180, 300, 220, 450, 160];
      } else if (viewportWidth >= 1200) {
        heightPatterns = [400, 180, 300, 220, 350, 160, 280, 200, 380, 140];
      } else {
        heightPatterns = [350, 160, 250, 200, 300, 140, 240, 180, 320, 120];
      }

      return heightPatterns[rowIndex % heightPatterns.length];
    };

    // Calculate natural height for an image
    const getNaturalHeight = (result: SearchResult) => {
      const dimensions = getFallbackDimensions(result);
      return dimensions.height;
    };

    // Check if an image is suitable for a specific row height
    const isImageSuitableForRowHeight = (
      result: SearchResult,
      targetRowHeight: number
    ) => {
      const naturalHeight = getNaturalHeight(result);

      // Calculate scaling factor needed
      const scaleFactor = targetRowHeight / naturalHeight;

      // Image is suitable if scaling isn't too extreme
      // Allow more flexibility for better grouping
      const isScaleReasonable = scaleFactor >= 0.2 && scaleFactor <= 5.0;

      // Prefer images that don't need extreme scaling
      const isPreferred = scaleFactor >= 0.5 && scaleFactor <= 2.0;

      return {
        suitable: isScaleReasonable,
        preferred: isPreferred,
        scaleFactor,
      };
    };

    // Calculate optimal row height based on the images actually in the row
    const calculateOptimalRowHeight = (
      rowItems: SearchResult[],
      targetRowHeight: number
    ) => {
      if (rowItems.length === 0) return targetRowHeight;

      const viewportWidth = getViewportWidth();

      // Get the first image's natural height as base
      const firstImage = rowItems[0];
      const firstDimensions = getFallbackDimensions(firstImage);
      const baseHeight = firstDimensions.height;

      // Calculate average aspect ratio of all images in row
      const totalAspectRatio = rowItems.reduce((sum, item) => {
        const dimensions = getFallbackDimensions(item);
        return sum + dimensions.width / dimensions.height;
      }, 0);
      const avgAspectRatio = totalAspectRatio / rowItems.length;

      // Create truly varied heights based on image content and viewport
      let optimalHeight: number;

      // Enhanced height calculation for better variety
      if (baseHeight >= 800) {
        // Very tall images
        if (viewportWidth >= 1800) {
          optimalHeight = 500;
        } else if (viewportWidth >= 1600) {
          optimalHeight = 450;
        } else if (viewportWidth >= 1200) {
          optimalHeight = 400;
        } else {
          optimalHeight = 350;
        }
      } else if (baseHeight >= 600) {
        // Tall images
        if (viewportWidth >= 1800) {
          optimalHeight = 400;
        } else if (viewportWidth >= 1600) {
          optimalHeight = 380;
        } else if (viewportWidth >= 1200) {
          optimalHeight = 350;
        } else {
          optimalHeight = 320;
        }
      } else if (baseHeight >= 400) {
        // Medium-tall images
        if (viewportWidth >= 1800) {
          optimalHeight = 320;
        } else if (viewportWidth >= 1600) {
          optimalHeight = 300;
        } else if (viewportWidth >= 1200) {
          optimalHeight = 280;
        } else {
          optimalHeight = 250;
        }
      } else if (baseHeight >= 250) {
        // Medium images
        if (viewportWidth >= 1800) {
          optimalHeight = 280;
        } else if (viewportWidth >= 1600) {
          optimalHeight = 260;
        } else if (viewportWidth >= 1200) {
          optimalHeight = 240;
        } else {
          optimalHeight = 220;
        }
      } else if (baseHeight >= 150) {
        // Small-medium images
        if (viewportWidth >= 1800) {
          optimalHeight = 240;
        } else if (viewportWidth >= 1600) {
          optimalHeight = 220;
        } else if (viewportWidth >= 1200) {
          optimalHeight = 200;
        } else {
          optimalHeight = 180;
        }
      } else {
        // Small images
        if (viewportWidth >= 1800) {
          optimalHeight = 200;
        } else if (viewportWidth >= 1600) {
          optimalHeight = 180;
        } else if (viewportWidth >= 1200) {
          optimalHeight = 160;
        } else {
          optimalHeight = 140;
        }
      }

      // Adjust based on average aspect ratio for more variety
      if (avgAspectRatio > 2.5) {
        // Very wide images - significantly reduce height
        optimalHeight *= 0.7;
      } else if (avgAspectRatio > 1.8) {
        // Wide images - reduce height
        optimalHeight *= 0.85;
      } else if (avgAspectRatio < 0.6) {
        // Very tall images - significantly increase height
        optimalHeight *= 1.3;
      } else if (avgAspectRatio < 0.9) {
        // Tall images - increase height
        optimalHeight *= 1.15;
      }

      // Ensure reasonable bounds with better variety
      const minHeight =
        viewportWidth >= 1800
          ? 180
          : viewportWidth >= 1600
            ? 160
            : viewportWidth >= 1200
              ? 140
              : 120;
      const maxHeight =
        viewportWidth >= 1800
          ? 550
          : viewportWidth >= 1600
            ? 500
            : viewportWidth >= 1200
              ? 450
              : 400;

      return Math.round(
        Math.max(minHeight, Math.min(maxHeight, optimalHeight))
      );
    };

    while (currentIndex < results.length) {
      const rowIndex = rows.length;
      const targetRowHeight = getRowHeightPattern(rowIndex);
      const currentRow: SearchResult[] = [];
      let totalWidthUsed = 0;
      let remainingImages = results.slice(currentIndex);

      // First, try to find preferred images for this row height
      let foundPreferred = false;

      // Determine maximum cards per row based on viewport width
      // >=1750px => allow up to 6 cards; otherwise cap at 5
      const maxPerRow = getViewportWidth() >= 1750 ? 6 : 5;

      for (
        let i = 0;
        i < remainingImages.length && currentRow.length < maxPerRow;
        i++
      ) {
        const result = remainingImages[i];
        const suitability = isImageSuitableForRowHeight(
          result,
          targetRowHeight
        );

        if (!suitability.suitable) continue;

        // For the first image, prefer images that fit well with this row height
        if (
          currentRow.length === 0 &&
          !suitability.preferred &&
          !foundPreferred
        ) {
          // Look ahead to see if there are better matches
          const hasPreferredLater = remainingImages
            .slice(i + 1, i + 10)
            .some(
              (img) =>
                isImageSuitableForRowHeight(img, targetRowHeight).preferred
            );
          if (hasPreferredLater) continue;
        }

        const dimensions = getFallbackDimensions(result);
        let actualWidth = dimensions.width;
        let actualHeight = dimensions.height;

        // Handle PNG special cases
        const isPNG =
          result.file_type === "PNG" ||
          (result.file_type === "image" &&
            result.thumbnail?.toLowerCase().includes(".png")) ||
          result.thumbnail?.toLowerCase().endsWith(".png");
        const isWidePNG = isPNG && actualWidth > 420;

        if (isPNG && !isWidePNG) {
          const size = Math.max(actualWidth, actualHeight);
          actualWidth = size;
          actualHeight = size;
        }

        // Calculate display width based on the target row height
        const aspectRatio = actualWidth / actualHeight;
        const displayWidth = Math.round(targetRowHeight * aspectRatio);

        // Check if this image fits in the current row
        const gapsNeeded = currentRow.length > 0 ? gapSize : 0;
        const widthWithGap = displayWidth + gapsNeeded;

        // If adding this image would exceed available width and we have at least one item
        if (
          totalWidthUsed + widthWithGap > availableWidth &&
          currentRow.length > 0
        ) {
          break;
        }

        // Skip images that would create single-item rows - enforce minimum 2 cards
        if (currentRow.length === 0 && displayWidth > availableWidth) {
          // Try to find a smaller image to pair with this one instead
          continue;
        }

        // Stop adding if we already reached the maximum for this viewport
        if (currentRow.length >= maxPerRow) {
          break;
        }

        currentRow.push(result);
        totalWidthUsed += widthWithGap;
        currentIndex += remainingImages.indexOf(result) + 1;

        // Update remaining images
        remainingImages = results.slice(currentIndex);
        foundPreferred = true;

        // Reset loop counter since we modified the array
        i = -1;
      }

      // Enforce minimum cards per row based on viewport width
      // >=1750px => minimum 4; >=1700px => minimum 3; otherwise minimum 2
      const vw = getViewportWidth();
      const minPerRow = vw >= 1750 ? 4 : vw >= 1700 ? 3 : 2;

      // If nothing selected due to width checks, seed the row with at least one item
      if (currentRow.length === 0 && currentIndex < results.length) {
        currentRow.push(results[currentIndex]);
        currentIndex++;
      }

      // Ensure the row meets the minimum required items when possible
      while (currentRow.length < minPerRow && currentIndex < results.length) {
        currentRow.push(results[currentIndex]);
        currentIndex++;
      }

      if (currentRow.length > 0) {
        // Calculate the actual optimal height based on the images in this row
        const actualRowHeight = calculateOptimalRowHeight(
          currentRow,
          targetRowHeight
        );
        rows.push({ items: currentRow, height: actualRowHeight });
      }
    }

    return rows;
  };

  // Calculate grid columns using dynamic row heights
  const getGridTemplateColumns = (
    rowItems: SearchResult[],
    rowHeight: number
  ) => {
    const getViewportWidth = () => {
      if (typeof window !== "undefined") {
        return window.innerWidth;
      }
      return 1200;
    };

    const getAvailableWidth = () => {
      const viewportWidth = getViewportWidth();
      const sidebarWidth = viewportWidth >= 1024 ? 320 : 0;
      const containerPadding = 40;
      const availableWidth = viewportWidth - sidebarWidth - containerPadding;
      return Math.max(600, availableWidth);
    };

    const availableWidth = getAvailableWidth();
    const gapSize = 20;
    const totalGaps = (rowItems.length - 1) * gapSize;
    const widthForImages = availableWidth - totalGaps;

    // Calculate actual display widths for each image using the specific row height
    const displayWidths = rowItems.map((item) => {
      const dimensions = getFallbackDimensions(item);
      let actualWidth = dimensions.width;
      let actualHeight = dimensions.height;

      const isPNG =
        item.file_type === "PNG" ||
        (item.file_type === "image" &&
          item.thumbnail?.toLowerCase().includes(".png")) ||
        item.thumbnail?.toLowerCase().endsWith(".png");
      const isWidePNG = isPNG && actualWidth > 420;

      if (isPNG && !isWidePNG) {
        const size = Math.max(actualWidth, actualHeight);
        actualWidth = size;
        actualHeight = size;
      }

      const aspectRatio = actualWidth / actualHeight;
      return Math.round(rowHeight * aspectRatio); // Use the specific row height
    });

    // If total width exceeds available space, scale proportionally
    const totalDisplayWidth = displayWidths.reduce(
      (sum, width) => sum + width,
      0
    );

    if (totalDisplayWidth > widthForImages) {
      const scaleFactor = widthForImages / totalDisplayWidth;
      return displayWidths
        .map((width) => `${Math.round(width * scaleFactor)}px`)
        .join(" ");
    }

    // If we have extra space, distribute it proportionally
    if (totalDisplayWidth < widthForImages) {
      const extraSpace = widthForImages - totalDisplayWidth;
      const totalAspectRatio = displayWidths.reduce(
        (sum, width) => sum + width,
        0
      );

      return displayWidths
        .map((width) => {
          const proportion = width / totalAspectRatio;
          const extraWidth = Math.round(extraSpace * proportion);
          return `${width + extraWidth}px`;
        })
        .join(" ");
    }

    // Perfect fit - use actual widths
    return displayWidths.map((width) => `${width}px`).join(" ");
  };

  // Handle image click to navigate to details
  const handleImageClick = (result: SearchResult) => {
    // Store image data in localStorage for the media page
    localStorage.setItem(`image_${result.id}`, JSON.stringify(result));

    // Navigate to the media details page
    window.location.href = `/media/${result.id}`;
  };

  // Handle media download by opening verification sheet
  const handleMediaDownload = (link: string, id: string, website: string) => {
    // Validate inputs
    if (!link || !id || !website) {
      console.error("Missing required download parameters:", {
        link,
        id,
        website,
      });
      return;
    }

    // Set the download URL and open the verification sheet
    setDownloadUrl(link);
    setIsDownloadSheetOpen(true);
  };

  // Smooth scroll to top of results
  const scrollToResultsTop = () => {
    const el = document.getElementById("results-top");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && searchQuery) {
      scrollToResultsTop();
      performSearch(searchQuery, page);
    }
  };

  // Get fallback dimensions for items with null width/height
  const getFallbackDimensions = (result: SearchResult) => {
    if (result.width && result.height) {
      return { width: result.width, height: result.height };
    }

    // Fallback dimensions based on content type
    if (result.file_type === "video") {
      return { width: 400, height: 225 }; // 16:9 aspect ratio
    } else {
      return { width: 300, height: 200 }; // 3:2 aspect ratio for images
    }
  };

  // Generate skeleton data with varied aspect ratios for masonry layout
  const generateSkeletonData = (count: number) => {
    const aspectRatios = [
      { width: 300, height: 400 }, // Portrait
      { width: 400, height: 300 }, // Landscape
      { width: 350, height: 350 }, // Square
      { width: 500, height: 300 }, // Wide landscape
      { width: 280, height: 420 }, // Tall portrait
      { width: 450, height: 250 }, // Ultra wide
      { width: 320, height: 380 }, // Mild portrait
      { width: 380, height: 280 }, // Mild landscape
      { width: 600, height: 300 }, // Banner
      { width: 300, height: 500 }, // Very tall
    ];

    return Array.from({ length: count }, (_, i) => {
      const ratio = aspectRatios[i % aspectRatios.length];
      return {
        id: `skeleton-${i}`,
        width: ratio.width,
        height: ratio.height,
        file_type: i % 4 === 0 ? "video" : i % 8 === 0 ? "audio" : "image",
      };
    });
  };

  // Create skeleton grid rows using the same logic as real results
  const createSkeletonGridRows = (skeletonData: any[]) => {
    const rows: any[][] = [];
    let currentIndex = 0;

    while (currentIndex < skeletonData.length) {
      const currentRow: any[] = [];
      let totalWidth = 0;
      const containerWidth = 100;
      const maxItemsPerRow = 6;

      for (
        let i = currentIndex;
        i < skeletonData.length && currentRow.length < maxItemsPerRow;
        i++
      ) {
        const item = skeletonData[i];
        const aspectRatio = item.width / item.height;

        // Calculate relative width using the same logic as real results
        let relativeWidth;
        if (aspectRatio >= 3.0) {
          relativeWidth = 45;
        } else if (aspectRatio >= 2.5) {
          relativeWidth = 40;
        } else if (aspectRatio >= 2.0) {
          relativeWidth = 35;
        } else if (aspectRatio >= 1.5) {
          relativeWidth = 25;
        } else if (aspectRatio >= 1.2) {
          relativeWidth = 19;
        } else if (aspectRatio >= 1.0) {
          relativeWidth = 15;
        } else if (aspectRatio >= 0.8) {
          relativeWidth = 11;
        } else if (aspectRatio >= 0.6) {
          relativeWidth = 7;
        } else {
          relativeWidth = 5;
        }

        if (
          totalWidth + relativeWidth > containerWidth &&
          currentRow.length > 0
        ) {
          break;
        }

        currentRow.push(item);
        totalWidth += relativeWidth;
        currentIndex++;

        if (totalWidth >= 85 && currentRow.length >= 2) {
          break;
        }
      }

      if (currentRow.length === 0 && currentIndex < skeletonData.length) {
        currentRow.push(skeletonData[currentIndex]);
        currentIndex++;
      }

      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
    }

    return rows;
  };

  // Get skeleton grid template columns
  const getSkeletonGridTemplateColumns = (rowItems: any[]) => {
    return rowItems
      .map((item) => {
        const aspectRatio = item.width / item.height;

        let relativeWidth;
        if (aspectRatio >= 3.0) {
          relativeWidth = 45;
        } else if (aspectRatio >= 2.5) {
          relativeWidth = 40;
        } else if (aspectRatio >= 2.0) {
          relativeWidth = 35;
        } else if (aspectRatio >= 1.5) {
          relativeWidth = 25;
        } else if (aspectRatio >= 1.2) {
          relativeWidth = 19;
        } else if (aspectRatio >= 1.0) {
          relativeWidth = 15;
        } else if (aspectRatio >= 0.8) {
          relativeWidth = 11;
        } else if (aspectRatio >= 0.6) {
          relativeWidth = 7;
        } else {
          relativeWidth = 5;
        }

        return `${relativeWidth}fr`;
      })
      .join(" ");
  };

  // Get responsive height for mobile/desktop
  const getResponsiveHeight = (
    result: SearchResult,
    isMobile: boolean = false
  ) => {
    const dimensions = getFallbackDimensions(result);
    const aspectRatio = dimensions.height / dimensions.width;

    if (isMobile) {
      // Mobile: limit height to reasonable values with 220px base
      return Math.min(275, Math.max(220, 220 * aspectRatio));
    } else {
      // Desktop: use calculated height with limits
      return Math.min(400, Math.max(150, 220 * aspectRatio));
    }
  };

  // Show loading skeleton while language data is loading
  if (isLoading) {
    return (
      <div
        className={`min-h-screen bg-background font-sans ${isRTL ? "font-tajawal" : ""}`}
      >
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="px-4 sm:px-5 w-full search-container-3xl">
            <div className="flex items-center justify-between h-16">
              <div
                className={`flex items-center gap-1 sm:gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                {/* Mobile menu button skeleton */}
                <Skeleton className="w-8 h-8 rounded-lg lg:hidden" />
                <div className="relative w-44 sm:w-48 h-12 px-2 lg:px-0">
                  <Skeleton className="w-full h-full rounded" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
            </div>
          </div>
        </header>

        <div className="relative dark:bg-secondary">
          {/* Sidebar - Fixed position always */}
          <aside
            className={`
            fixed ${isRTL ? "right-0 !border-l" : "left-0 !border-r"} top-16 w-72 sidebar-3xl h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/50 via-primary/20 to-primary/65 backdrop-blur-sm border-border z-50 transition-transform duration-300 ease-in-out overflow-y-auto shadow-lg lg:shadow-none lg:border-r lg:border-l-0
            ${isRTL ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
          >
            <div className="p-0 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto bg-gradient-to-b from-background/80 via-background/60 to-background/80 backdrop-blur-sm">
              {/* User Profile Skeleton */}
              <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-muted/40 dark:bg-card/30 border-b border-border">
                <div
                  className={`flex items-center gap-2 sm:gap-3 ${isRTL ? "flex-row" : ""}`}
                >
                  <Skeleton className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg" />
                  <Skeleton className="w-16 sm:w-20 h-4 sm:h-5" />
                  <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 ml-auto" />
                </div>

                <div className="bg-muted/40 dark:bg-card/30 border border-primary/50 dark:border-primary/20 rounded-lg p-3 sm:p-4 shadow-sm space-y-3">
                  {/* User Avatar and Name Skeleton */}
                  <div
                    className={`flex items-center gap-2 sm:gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                    <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                      <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                      <Skeleton className="h-2 sm:h-3 w-24 sm:w-32" />
                    </div>
                  </div>

                  {/* Subscription Plan Skeleton */}
                  <div
                    className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex items-center gap-1 sm:gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <Skeleton className="w-3 h-3 sm:w-4 sm:h-4" />
                      <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                    </div>
                    <Skeleton className="h-5 sm:h-6 w-10 sm:w-12 rounded-md" />
                  </div>

                  {/* Credit Balance Skeleton */}
                  <div
                    className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex items-center gap-1 sm:gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <Skeleton className="w-3 h-3 sm:w-4 sm:h-4" />
                      <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                    </div>
                    <div className="text-right space-y-0.5 sm:space-y-1">
                      <Skeleton className="h-3 sm:h-4 w-6 sm:w-8" />
                      <Skeleton className="h-2 sm:h-3 w-8 sm:w-12" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Providers Filter Skeleton */}
              <div className="space-y-4 p-4 bg-muted/40 dark:bg-card/30 border-b border-border">
                <div
                  className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}
                >
                  <Skeleton className="w-9 h-9 rounded-lg" />
                  <Skeleton className="w-24 h-5" />
                  <Skeleton className="w-4 h-4 ml-auto" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-16 rounded-lg" />
                  ))}
                </div>
              </div>

              {/* File Type Filter Skeleton */}
              <div className="space-y-4 p-4 bg-muted/40 dark:bg-card/30">
                <div
                  className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}
                >
                  <Skeleton className="w-9 h-9 rounded-lg" />
                  <Skeleton className="w-20 h-5" />
                  <Skeleton className="w-4 h-4 ml-auto" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="w-16 h-8 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - 9 columns on desktop, full width on mobile */}
          <main
            className={`relative col-span-12 lg:col-span-9 min-w-0 bg-gradient-to-br from-primary/15 via-primary/5 to-primary/20 overflow-hidden ${isRTL ? "lg:mr-72 main-content-3xl rtl" : "lg:ml-72 main-content-3xl"}`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-80"></div>

            <div className="min-h-screen relative z-10 p-4 sm:p-6 space-y-6">
              <div className="w-full flex flex-col gap-5 sm:flex-row sm:items-center max-w-3xl mx-auto search-container-3xl search-section-3xl">
                {/* Search Bar - Centered */}
                <div className="flex justify-center w-full sm:w-3/4">
                  <div className="w-full max-w-2xl search-bar-3xl">
                    <Skeleton className="w-full h-14 rounded-xl" />
                  </div>
                </div>

                {/* Filter Section Behind Search Bar */}
                <div className="flex justify-center w-full sm:w-1/4">
                  <div className="w-full max-w-md">
                    <Skeleton className="w-full h-14 rounded-xl" />
                  </div>
                </div>
              </div>

              {/* Search Results Count */}
              <div className="text-center space-y-2">
                <Skeleton className="w-64 h-12 mx-auto rounded-full" />
                <Skeleton className="w-80 h-4 mx-auto" />
              </div>

              {/* Results Grid - Mobile: Grid (1 item per row), SM+: Masonry Layout */}
              <div className="space-y-4 results-grid-3xl">
                {/* Mobile Layout - Grid with 1 column */}
                <div className="grid grid-cols-1 gap-4 sm:hidden">
                  {generateSkeletonData(6).map((item, i) => {
                    const aspectRatio = item.height / item.width;
                    const height = Math.min(
                      275,
                      Math.max(220, 220 * aspectRatio)
                    );
                    return (
                      <Skeleton
                        key={i}
                        className="w-full rounded-lg"
                        style={{ height: `${height}px` }}
                      />
                    );
                  })}
                </div>

                {/* Desktop Layout - Masonry Grid matching actual results */}
                <div className="hidden sm:block w-full">
                  {createSkeletonGridRows(generateSkeletonData(18)).map(
                    (row: any[], rowIndex: number) => (
                      <div
                        key={rowIndex}
                        className="grid mb-3 2xl:mb-4"
                        style={{
                          gridTemplateColumns:
                            getSkeletonGridTemplateColumns(row),
                          gap: "20px",
                        }}
                      >
                        {row.map((item: any) => {
                          return (
                            <Skeleton
                              key={item.id}
                              className="rounded-lg"
                              style={{
                                height: "230px", // Fixed height like actual results
                              }}
                            />
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Bottom Pagination Skeleton */}
              <div className="flex justify-center pt-8">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton
                        key={i}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl"
                      />
                    ))}
                  </div>
                  <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-background font-sans ${isRTL ? "font-tajawal" : ""}`}
    >
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="px-4 sm:px-5 w-full search-container-3xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Mobile Menu Button */}
            <div
              className={`flex items-center gap-1 sm:gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              {/* Mobile Sidebar Toggle */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="cursor-pointer lg:hidden p-2 hover:bg-muted rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label={t("search.toggleFilters")}
              >
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
              <Link
                href="/"
                aria-label={t("header.logo")}
                className="flex items-center"
              >
                <div className="relative w-44 sm:w-48 h-12">
                  {/* Light mode logos */}
                  <Image
                    src={language === "ar" ? "/logo-black-ar.png" : "/logo-black-en.png"}
                    alt={t("header.logo")}
                    fill
                    className="block dark:hidden"
                    priority
                  />
                  {/* Dark mode logos */}
                  <Image
                    src={language === "ar" ? "/logo-white-ar.png" : "/logo-white-en.png"}
                    alt={t("header.logo")}
                    fill
                    className="hidden dark:block"
                    priority
                  />
                </div>
              </Link>
            </div>
            <HeaderControls />
          </div>
        </div>
      </header>

      <div className="relative dark:bg-secondary">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Filters - Fixed position always */}
        <aside
          className={`
          fixed ${isRTL ? "right-0 !border-l" : "left-0 !border-r"} top-16 w-72 sidebar-3xl h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/50 via-primary/20 to-primary/65 backdrop-blur-sm border-border z-50 transition-transform duration-300 ease-in-out overflow-y-auto no-scrollbar lg:border-r lg:border-l-0
          ${isSidebarOpen ? "translate-x-0" : `${isRTL ? "translate-x-full" : "-translate-x-full"} lg:translate-x-0`}
        `}
        >
          <div className="p-0 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto no-scrollbar bg-gradient-to-b from-background/80 via-background/60 to-background/80 backdrop-blur-sm">
            {/* User Profile Section */}
            {isAuthenticated && user && (
              <div className="space-y-4 p-4 bg-muted/40 dark:bg-card/30 border-b border-border">
                <div
                  className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}
                >
                  <div className="p-2 bg-primary/10 rounded-lg border border-primary/10">
                    <User className="size-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground">
                    {t("profile.title")}
                  </h3>
                  <button
                    className={`${isRTL ? "mr-auto" : "ml-auto"} p-1 hover:bg-secondary rounded transition-colors`}
                  >
                    <ChevronRight
                      className={`w-4 h-4 text-muted-foreground hover:text-foreground ${isRTL ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                <div className="bg-background dark:bg-muted/35 border border-border dark:border-primary/20 rounded-lg p-4 space-y-3">
                  {/* User Avatar and Name */}
                  <div className={`flex items-center gap-3`}>
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/30">
                      {user.account?.picture ? (
                        <img
                          src={user.account.picture}
                          alt={`${user.account?.firstName || ""} ${user.account?.lastName || ""}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm truncate">
                        {user.account?.firstName && user.account?.lastName
                          ? `${user.account.firstName} ${user.account.lastName}`
                          : user.account?.email || "User"}
                      </h4>
                      <div
                        className={`flex items-center gap-1 text-xs text-muted-foreground ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Mail className="w-3 h-3" />
                        <span className="truncate text-sm">
                          {user.account?.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Plan */}
                  <div
                    className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {t("profile.subscription.currentPlan")}
                      </span>
                    </div>
                    <div className="px-2 py-1 bg-primary/10 border border-primary/20 rounded-md">
                      <span className="text-xs font-semibold text-primary">
                        {user.subscription?.plan || "Free"}
                      </span>
                    </div>
                  </div>

                  {/* Credit Balance */}
                  <div
                    className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <Coins className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {t("profile.stats.creditsRemaining.title")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-right">
                      <div className="text-sm font-bold text-muted-foreground">
                        {user.subscription?.credits?.remaining || 0}
                      </div>
                      <div className="text-sm font-bold text-primary">
                        / {user.subscription?.credits?.plan || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Providers Filter */}
            <div className="space-y-4 p-4 bg-muted/40 dark:bg-card/30 border-b border-border">
              <div
                className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}
              >
                <div className="p-2 bg-primary/10 rounded-lg border border-primary/10">
                  <ImageIcon className="size-5 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">
                  {t("search.filters.providers")}
                </h3>
                <button
                  className={`${isRTL ? "mr-auto" : "ml-auto"} p-1 hover:bg-secondary rounded transition-colors`}
                >
                  <ChevronRight
                    className={`w-4 h-4 text-muted-foreground hover:text-foreground ${isRTL ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {isSearchLoading ? (
                  // Loading skeleton for providers during search
                  Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-16 rounded-lg" />
                  ))
                ) : providersError ? (
                  // Error state
                  <div className="col-span-2 text-center py-4">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-red-500">{providersError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        searchQuery && performSearch(searchQuery, 1)
                      }
                      className="mt-2"
                    >
                      {t("common.retry")}
                    </Button>
                  </div>
                ) : providers.length === 0 && !searchQuery ? (
                  // Empty state when no search performed
                  <div className="col-span-2 text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      {t("search.providers.searchToSeeProviders")}
                    </p>
                  </div>
                ) : providers.length === 0 && searchQuery ? (
                  // Empty state when search performed but no providers found
                  <div className="col-span-2 text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      {t("search.providers.noData")}
                    </p>
                  </div>
                ) : (
                  // Render providers
                  providers.map((provider) => (
                    <div
                      key={provider.id}
                      onClick={() =>
                        provider.isOnline && toggleProvider(provider.id)
                      }
                      className={`
                        w-full p-3 rounded-lg border group dark:bg-muted/35 relative
                        ${
                          !provider.isOnline
                            ? "opacity-60 cursor-not-allowed border-border bg-muted/30"
                            : selectedProviders.includes(provider.id)
                              ? "border-primary bg-primary/10 shadow-sm cursor-pointer"
                              : "border-border hover:border-primary/50 bg-background hover:bg-muted/50 cursor-pointer"
                        }
                      `}
                    >
                      {/* Status Indicator */}
                      <div
                        className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} z-10`}
                      >
                        {provider.isOnline ? (
                          <div
                            className="w-3 h-3 bg-green-500 rounded-full border-2 border-background shadow-sm"
                            title={t("search.status.online")}
                          />
                        ) : (
                          <div
                            className="w-3 h-3 bg-red-500 rounded-full border-2 border-background shadow-sm"
                            title={t("search.status.offline")}
                          />
                        )}
                      </div>

                      <div
                        className={`relative ${!provider.isOnline ? "grayscale" : ""}`}
                      >
                        <img
                          src={provider.logo}
                          alt={provider.name}
                          width={150}
                          height={56}
                          className={`w-full h-14 rounded object-contain transition-opacity ${
                            provider.isOnline ? "group-hover:opacity-90" : ""
                          }`}
                        />

                        {/* Offline Overlay */}
                        {!provider.isOnline && (
                          <div className="absolute inset-0 bg-black/20 rounded flex items-center justify-center">
                            <WifiOff className="w-6 h-6 text-red-500" />
                          </div>
                        )}
                      </div>

                      <div
                        className={`mt-2 text-sm text-center transition-colors ${
                          !provider.isOnline
                            ? "text-muted-foreground/60"
                            : selectedProviders.includes(provider.id)
                              ? "text-primary hover:text-primary"
                              : "text-muted-foreground group-hover:text-primary"
                        }`}
                      >
                        <span
                          className="block w-full truncate"
                          title={provider.name}
                        >
                          {provider.name}
                        </span>
                        {!provider.isOnline && (
                          <div className="text-xs text-red-500 mt-1">
                            {t("search.status.offline")}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* File Type Filter */}
            <div className="space-y-4 p-4 bg-muted/40 dark:bg-card/30">
              <div
                className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}
              >
                <div className="p-2 bg-primary/10 rounded-lg border border-primary/10">
                  <File className="size-5 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">
                  {t("search.filters.fileType")}
                </h3>
                <button
                  className={`${isRTL ? "mr-auto" : "ml-auto"} p-1 hover:bg-secondary rounded transition-colors`}
                >
                  <ChevronRight
                    className={`w-4 h-4 text-muted-foreground hover:text-foreground ${isRTL ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={
                    selectedFileTypes.length === 0 ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedFileTypes([])}
                  className="text-sm sm:text-lg font-medium px-5 !h-10"
                >
                  {t("search.filters.all")}
                </Button>
                {isSearchLoading ? (
                  // Loading skeleton for file types during search
                  Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="w-16 h-8 rounded-full" />
                  ))
                ) : fileTypesError ? (
                  // Error state
                  <div className="w-full text-center py-2">
                    <p className="text-xs text-red-500">{fileTypesError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        searchQuery && performSearch(searchQuery, 1)
                      }
                      className="mt-1 text-xs"
                    >
                      {t("common.retry")}
                    </Button>
                  </div>
                ) : fileTypes.length === 0 && !searchQuery ? (
                  // Empty state when no search performed
                  <div className="w-full text-center py-2">
                    <p className="text-xs text-muted-foreground">
                      {t("search.fileTypes.searchToSeeTypes")}
                    </p>
                  </div>
                ) : fileTypes.length === 0 && searchQuery ? (
                  // Empty state when search performed but no file types found
                  <div className="w-full text-center py-2">
                    <p className="text-xs text-muted-foreground">
                      {t("search.fileTypes.noData")}
                    </p>
                  </div>
                ) : (
                  // Render file types
                  fileTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={
                        selectedFileTypes.includes(type.id)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleFileType(type.id)}
                      className="text-sm sm:text-lg font-medium relative group px-5 !h-10"
                    >
                      {type.id}
                    </Button>
                  ))
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - 9 columns on desktop, full width on mobile */}
        <main
          className={`relative col-span-12 lg:col-span-9 min-w-0 bg-gradient-to-br from-primary/15 via-primary/5 to-primary/20 overflow-hidden ${isRTL ? "lg:mr-72 main-content-3xl rtl" : "lg:ml-72 main-content-3xl"}`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-20"></div>

          {/* Anchor for scroll-to-top of results */}
          <div id="results-top" />

          <div className="min-h-screen relative z-10 p-4 sm:p-6 space-y-6">
            <div className="w-full flex flex-col gap-5 sm:flex-row sm:items-center max-w-3xl mx-auto search-container-3xl search-section-3xl">
              {/* Search Bar - Centered */}
              <div className="flex justify-center w-full sm:w-3/4">
                <div className="w-full max-w-2xl search-bar-3xl">
                  <div className="relative">
                    <Search
                      className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5`}
                    />
                    <Input
                      type="text"
                      placeholder={t("search.searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSearch();
                        }
                      }}
                      className={`${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} placeholder:text-base py-3 !h-14 text-base border-2 border-border focus:border-primary rounded-xl bg-background`}
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                    <Button
                      onClick={handleSearch}
                      className={`absolute ${isRTL ? "left-0.5" : "right-0.5"} top-1/2 transform -translate-y-1/2 !px-6 h-[52px] bg-primary hover:bg-primary/90 rounded-xl`}
                    >
                      <span>{t("search.searchButton")}</span>
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filter Section Behind Search Bar */}
              <div className="flex justify-center w-full sm:w-1/4">
                <div className="w-full max-w-md">
                  <Select
                    value={selectedFilter}
                    onValueChange={setSelectedFilter}
                  >
                    <SelectTrigger className="w-full !h-14 bg-background/80 rounded-xl border-2 border-border hover:border-primary/50 transition-all duration-200">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4" />
                          <span>All Content</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="images">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          <span>Images</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="vectors">
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4" />
                          <span>Vectors</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="videos">
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          <span>Videos</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="templates">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4" />
                          <span>Templates</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Search Results Header */}
            <div className="text-center space-y-3">
              <div
                className={`flex items-center justify-center ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 shadow-sm">
                  <Search className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {t("search.results.showingFor")}
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    “{searchQuery || t("search.results.defaultQuery")}”
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <span className="text-sm sm:text-base">
                  {t("search.results.totalFound", { count: totalResults })}
                </span>
              </div>
            </div>

            {/* Offline Providers Notification */}
            {(() => {
              const offlineProviders = providers.filter((p) => !p.isOnline);
              if (offlineProviders.length > 0) {
                return (
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                      <div
                        className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                            {t("search.status.someProvidersOffline")}
                          </h3>
                          <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                            {t("search.status.offlineProvidersMessage")}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {offlineProviders.map((provider) => (
                              <span
                                key={provider.id}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-800/50 text-amber-800 dark:text-amber-200 text-xs rounded-full"
                              >
                                <WifiOff className="w-3 h-3" />
                                {provider.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Loading State */}
            {isSearchLoading && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Searching...
                  </h3>
                </div>
                <div className="space-y-4 results-grid-3xl">
                  <div className="grid grid-cols-1 gap-4 sm:hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="w-full h-64 rounded-lg" />
                    ))}
                  </div>
                  <div className="hidden sm:flex sm:flex-col sm:w-full">
                    {Array.from({ length: 3 }).map((_, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="flex gap-2 sm:gap-4 justify-center flex-wrap mb-4"
                      >
                        {Array.from({ length: 4 }).map((_, i) => (
                          <Skeleton
                            key={i}
                            className="rounded-lg"
                            style={{
                              flex: `${1.2 + i * 0.2} 1 0`,
                              height: "250px",
                              minWidth: "150px",
                              maxWidth: "400px",
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {searchError && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Search Error
                </h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  {searchError}
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={() =>
                      searchQuery && performSearch(searchQuery, currentPage)
                    }
                    disabled={isSearchLoading}
                  >
                    {isSearchLoading ? "Retrying..." : "Try Again"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    If the problem persists, the API service may be temporarily
                    unavailable.
                  </p>
                </div>
              </div>
            )}

            {/* No Results State */}
            {!isSearchLoading &&
              !searchError &&
              searchResults.length === 0 &&
              searchQuery && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Results Found
                  </h3>
                  <p className="text-muted-foreground">
                    Try searching with different keywords
                  </p>
                </div>
              )}

            {/* Results Grid - Mobile: Grid (1 item per row), SM+: Flex with varied widths */}
            {!isSearchLoading && !searchError && searchResults.length > 0 && (
              <>
                {/* Mobile Layout - Grid with 1 column */}
                <div className="grid grid-cols-1 gap-4 sm:hidden">
                  {searchResults.map((result) => {
                    const responsiveHeight = getResponsiveHeight(result, true);
                    return (
                      <div
                        key={result.id}
                        className={`group relative bg-card rounded-lg overflow-hidden transition-all duration-300 cursor-pointer xl-1600:!h-[275px] ${
                          result.file_type === "audio"
                            ? "border border-primary/50 shadow-sm hover:border-primary hover:shadow-md"
                            : "border border-border hover:border-primary/50"
                        }`}
                        style={{ height: `${responsiveHeight}px` }}
                        onMouseEnter={() => setHoveredImage(result.id)}
                        onMouseLeave={() => setHoveredImage(null)}
                        onClick={() => handleImageClick(result)}
                      >
                        {/* Media Content */}
                        <div className="relative w-full h-full">
                          {result.file_type === "audio" ? (
                            /* Audio Card Design - Mobile */
                            <div className="w-full h-full bg-gradient-to-br from-primary/5 via-accent/10 to-primary/10 dark:from-primary/10 dark:via-accent/20 dark:to-primary/15 flex flex-col items-center justify-center p-6 space-y-4">
                              {/* Audio Icon with Animation */}
                              <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                                  <AudioLines className="w-8 h-8 text-primary-foreground" />
                                </div>
                                {/* Animated Sound Waves */}
                                <div className="absolute -inset-2 opacity-30">
                                  <div className="w-20 h-20 border-2 border-primary/40 rounded-full animate-ping"></div>
                                </div>
                                <div className="absolute -inset-4 opacity-20">
                                  <div
                                    className="w-24 h-24 border-2 border-primary/30 rounded-full animate-ping"
                                    style={{ animationDelay: "0.5s" }}
                                  ></div>
                                </div>
                              </div>

                              {/* Audio Title */}
                              <div className="text-center space-y-1">
                                <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">
                                  {result.title}
                                </h3>
                                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                  <Headphones className="w-3 h-3" />
                                  Audio File
                                </p>
                              </div>

                              {/* Audio Waveform Visual */}
                              <div className="flex items-center justify-center gap-1 opacity-60">
                                {Array.from({ length: 12 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-1 bg-gradient-to-t from-primary/60 to-primary rounded-full animate-pulse"
                                    style={{
                                      height: `${Math.random() * 16 + 8}px`,
                                      animationDelay: `${i * 0.1}s`,
                                      animationDuration: "1.5s",
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          ) : (result.file_type === "video" ||
                              result.file_type === "gif") &&
                            isValidVideoUrl(result.thumbnail) ? (
                            <>
                              <video
                                src={result.thumbnail}
                                poster={result.poster || "/placeholder.png"}
                                className="w-full h-full object-cover"
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                onLoadedData={async (e) => {
                                  // Generate thumbnail when video loads
                                  const video = e.target as HTMLVideoElement;
                                  try {
                                    video.currentTime = 1; // Seek to 1 second
                                    await new Promise((resolve) => {
                                      video.onseeked = resolve;
                                    });
                                    const thumbnailUrl =
                                      await generateVideoThumbnail(video);
                                    video.poster = thumbnailUrl;

                                    // Update fallback image too
                                    const fallbackImg =
                                      video.nextElementSibling as HTMLImageElement;
                                    if (fallbackImg) {
                                      fallbackImg.src = thumbnailUrl;
                                    }
                                  } catch (error) {
                                    console.warn(
                                      "Failed to generate video thumbnail:",
                                      error
                                    );
                                  }
                                }}
                                onMouseEnter={(e) =>
                                  handleVideoHover(
                                    e.target as HTMLVideoElement,
                                    true
                                  )
                                }
                                onMouseLeave={(e) =>
                                  handleVideoHover(
                                    e.target as HTMLVideoElement,
                                    false
                                  )
                                }
                                onError={(e) => {
                                  const video = e.target as HTMLVideoElement;
                                  video.style.display = "none";
                                  const fallback =
                                    video.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = "flex";
                                }}
                              />
                              {/* Fallback for videos/gifs - text placeholder if no poster */}
                              {result.poster ? (
                                <img
                                  src={result.poster}
                                  alt={result.title}
                                  className="w-full h-full object-cover"
                                  style={{ display: "none" }}
                                />
                              ) : (
                                <div
                                  className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm"
                                  style={{ display: "none" }}
                                >
                                  <div className="text-center">
                                    <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    No thumbnail available
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <img
                              src={result.thumbnail}
                              alt={result.title}
                              className={`w-full h-full ${(() => {
                                const isPNG =
                                  result.file_type === "PNG" ||
                                  (result.file_type === "image" &&
                                    result.thumbnail
                                      ?.toLowerCase()
                                      .includes(".png")) ||
                                  result.thumbnail
                                    ?.toLowerCase()
                                    .endsWith(".png");
                                const apiWidth =
                                  parseInt(String(result.width)) ||
                                  getFallbackDimensions(result).width;
                                const isWidePNG = isPNG && apiWidth > 420;
                                return isPNG && !isWidePNG
                                  ? "object-contain"
                                  : "object-cover";
                              })()}`}
                              loading="lazy"
                              onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.src = "/placeholder.png"; // Fallback image
                                console.warn(
                                  "Image load error for:",
                                  result.thumbnail
                                );
                              }}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                              }}
                            />
                          )}

                          {/* Provider Icon */}
                          <div
                            className={`absolute top-2 ${isRTL ? "right-2" : "left-2"} p-1 bg-white/90 backdrop-blur-sm rounded-md shadow-sm`}
                          >
                            <img
                              src={result.providerIcon}
                              alt={result.provider}
                              width={40}
                              height={40}
                              className="w-10 h-10 object-contain rounded"
                              onError={(e) => {
                                // Fallback to text badge if icon fails to load
                                const target = e.target as HTMLImageElement;
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<span class="px-2 py-1 bg-black/70 text-white text-xs rounded-md">${result.provider}</span>`;
                                }
                              }}
                            />
                          </div>

                          {/* File Type Badge */}
                          <div
                            className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} px-2 py-1 ${
                              result.file_type === "video"
                                ? "bg-destructive/90"
                                : result.file_type === "audio"
                                  ? "bg-primary/90"
                                  : "bg-primary/80"
                            } text-white text-xs rounded-md flex items-center gap-1 shadow-sm`}
                          >
                            {result.file_type === "video" && (
                              <Camera className="w-3 h-3" />
                            )}
                            {result.file_type === "audio" && (
                              <Volume2 className="w-3 h-3" />
                            )}
                            {formatFileType(result.file_type)}
                          </div>

                          {/* Hover Overlay */}
                          <div
                            className={`absolute inset-0 bg-black/20 transition-all duration-300 ${hoveredImage === result.id ? "opacity-100" : "opacity-0"}`}
                          >
                            {/* Download Button - Bottom Center - Appears on hover */}
                            <Button
                              size="sm"
                              className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary hover:bg-primary/90 transition-all duration-300 ${hoveredImage === result.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent opening modal
                                handleMediaDownload(
                                  result.url,
                                  result.file_id,
                                  result.provider
                                );
                              }}
                            >
                              <Download className="w-4 h-4" />
                              {t("search.actions.download")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Layout - Masonry Grid with explicit item heights */}
                <div className="hidden sm:block w-full">
                  {createDynamicGridRows(searchResults).map(
                    (
                      rowData: { items: SearchResult[]; height: number },
                      rowIndex: number
                    ) => (
                      <div
                        key={rowIndex}
                        className="grid mb-4 2xl:mb-6"
                        style={{
                          gridTemplateColumns: getGridTemplateColumns(
                            rowData.items,
                            rowData.height
                          ),
                          gap: "20px",
                        }}
                      >
                        {rowData.items.map((result: SearchResult) => {
                          const rowHeight = rowData.height;
                          return (
                            <div
                              key={result.id}
                              className={`group relative bg-card rounded-lg overflow-hidden transition-all duration-300 cursor-pointer search-card-responsive ${
                                result.file_type === "audio"
                                  ? "border border-primary/50 shadow-sm hover:border-primary hover:shadow-md"
                                  : "border border-border hover:border-primary/50"
                              }`}
                              style={{ height: `${rowHeight}px` }}
                              onMouseEnter={() => setHoveredImage(result.id)}
                              onMouseLeave={() => setHoveredImage(null)}
                              onClick={() => handleImageClick(result)}
                            >
                              {/* Media Content */}
                              <div className="relative w-full h-full">
                                {result.file_type === "audio" ? (
                                  /* Audio Card Design - Desktop */
                                  <div className="w-full h-full bg-gradient-to-br from-primary/5 via-accent/10 to-primary/10 dark:from-primary/10 dark:via-accent/20 dark:to-primary/15 flex flex-col items-center justify-center p-4 space-y-3">
                                    {/* Audio Icon with Animation */}
                                    <div className="relative">
                                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                                        <AudioLines className="w-6 h-6 text-primary-foreground" />
                                      </div>
                                      {/* Animated Sound Waves */}
                                      <div className="absolute -inset-1 opacity-30">
                                        <div className="w-14 h-14 border-2 border-primary/40 rounded-full animate-ping"></div>
                                      </div>
                                      <div className="absolute -inset-2 opacity-20">
                                        <div
                                          className="w-16 h-16 border-2 border-primary/30 rounded-full animate-ping"
                                          style={{ animationDelay: "0.5s" }}
                                        ></div>
                                      </div>
                                    </div>

                                    {/* Audio Title */}
                                    <div className="text-center space-y-1">
                                      <h3 className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">
                                        {result.title}
                                      </h3>
                                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                        <Headphones className="w-3 h-3" />
                                        Audio
                                      </p>
                                    </div>

                                    {/* Audio Waveform Visual - Smaller for desktop */}
                                    <div className="flex items-center justify-center gap-0.5 opacity-60">
                                      {Array.from({ length: 10 }).map(
                                        (_, i) => (
                                          <div
                                            key={i}
                                            className="w-0.5 bg-gradient-to-t from-primary/60 to-primary rounded-full animate-pulse"
                                            style={{
                                              height: `${Math.random() * 12 + 6}px`,
                                              animationDelay: `${i * 0.1}s`,
                                              animationDuration: "1.5s",
                                            }}
                                          />
                                        )
                                      )}
                                    </div>
                                  </div>
                                ) : (result.file_type === "video" ||
                                    result.file_type === "gif") &&
                                  isValidVideoUrl(result.thumbnail) ? (
                                  <>
                                    <video
                                      src={result.thumbnail}
                                      poster={getVideoPoster(result.thumbnail)}
                                      className="w-full h-full object-cover"
                                      muted
                                      loop
                                      playsInline
                                      preload="metadata"
                                      onLoadedData={async (e) => {
                                        // Generate thumbnail when video loads
                                        const video =
                                          e.target as HTMLVideoElement;
                                        try {
                                          video.currentTime = 1; // Seek to 1 second
                                          await new Promise((resolve) => {
                                            video.onseeked = resolve;
                                          });
                                          const thumbnailUrl =
                                            await generateVideoThumbnail(video);
                                          video.poster = thumbnailUrl;

                                          // Update fallback image too
                                          const fallbackImg =
                                            video.nextElementSibling as HTMLImageElement;
                                          if (fallbackImg) {
                                            fallbackImg.src = thumbnailUrl;
                                          }
                                        } catch (error) {
                                          console.warn(
                                            "Failed to generate video thumbnail:",
                                            error
                                          );
                                        }
                                      }}
                                      onMouseEnter={(e) =>
                                        handleVideoHover(
                                          e.target as HTMLVideoElement,
                                          true
                                        )
                                      }
                                      onMouseLeave={(e) =>
                                        handleVideoHover(
                                          e.target as HTMLVideoElement,
                                          false
                                        )
                                      }
                                      onError={(e) => {
                                        console.warn(
                                          "Video load error, falling back to image"
                                        );
                                        const video =
                                          e.target as HTMLVideoElement;
                                        video.style.display = "none";
                                        const fallbackImg =
                                          video.nextElementSibling as HTMLImageElement;
                                        if (fallbackImg) {
                                          fallbackImg.style.display = "block";
                                        }
                                      }}
                                    />
                                    {/* Fallback for videos - text placeholder if no poster */}
                                    {result.poster ? (
                                      <img
                                        src={result.poster}
                                        alt={result.title}
                                        className="w-full h-full object-cover"
                                        style={{ display: "none" }}
                                        loading="lazy"
                                        onError={(e) => {
                                          const img =
                                            e.target as HTMLImageElement;
                                          img.style.display = "none";
                                          const textPlaceholder =
                                            img.nextElementSibling as HTMLDivElement;
                                          if (textPlaceholder) {
                                            textPlaceholder.style.display =
                                              "flex";
                                          }
                                        }}
                                      />
                                    ) : null}
                                    {/* Text placeholder for videos without poster */}
                                    <div
                                      className="absolute inset-0 flex items-center justify-center bg-muted/80 text-muted-foreground"
                                      style={{
                                        display: result.poster
                                          ? "none"
                                          : "none",
                                      }}
                                    >
                                      <div className="text-center">
                                        <div className="text-2xl mb-2">🎥</div>
                                        <div className="text-sm font-medium">
                                          Video Preview
                                        </div>
                                        <div className="text-xs">
                                          No thumbnail available
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <img
                                    src={result.thumbnail}
                                    alt={result.title}
                                    className={`w-full h-full ${(() => {
                                      const isPNG =
                                        result.file_type === "PNG" ||
                                        (result.file_type === "image" &&
                                          result.thumbnail
                                            ?.toLowerCase()
                                            .includes(".png")) ||
                                        result.thumbnail
                                          ?.toLowerCase()
                                          .endsWith(".png");
                                      const apiWidth =
                                        parseInt(String(result.width)) ||
                                        getFallbackDimensions(result).width;
                                      const isWidePNG = isPNG && apiWidth > 420;
                                      return isPNG && !isWidePNG
                                        ? "object-contain"
                                        : "object-cover";
                                    })()}`}
                                    loading="lazy"
                                    onError={(e) => {
                                      const img = e.target as HTMLImageElement;
                                      img.src = "/placeholder.png"; // Fallback image
                                      console.warn(
                                        "Image load error for:",
                                        result.thumbnail
                                      );
                                    }}
                                    style={{
                                      maxWidth: "100%",
                                      maxHeight: "100%",
                                    }}
                                  />
                                )}

                                {/* Provider Icon */}
                                <div
                                  className={`absolute top-2 ${isRTL ? "right-2" : "left-2"} p-1 bg-black/90 backdrop-blur-sm rounded-md shadow-sm`}
                                >
                                  <img
                                    src={result.providerIcon}
                                    alt={result.provider}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 object-contain rounded"
                                    onError={(e) => {
                                      // Fallback to text badge if icon fails to load
                                      const target =
                                        e.target as HTMLImageElement;
                                      const parent = target.parentElement;
                                      if (parent) {
                                        parent.innerHTML = `<span class="px-2 py-1 bg-black/70 text-white text-xs rounded-md">${result.provider}</span>`;
                                      }
                                    }}
                                  />
                                </div>

                                {/* File Type Badge */}
                                <div
                                  className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} px-2 py-1 ${
                                    result.file_type === "video"
                                      ? "bg-destructive/90"
                                      : result.file_type === "audio"
                                        ? "bg-primary/90"
                                        : "bg-primary/80"
                                  } text-white text-xs rounded-md flex items-center gap-1 shadow-sm`}
                                >
                                  {result.file_type === "video" && (
                                    <Camera className="w-3 h-3" />
                                  )}
                                  {result.file_type === "audio" && (
                                    <Volume2 className="w-3 h-3" />
                                  )}
                                  {formatFileType(result.file_type)}
                                </div>

                                {/* Hover Overlay */}
                                <div
                                  className={`absolute inset-0 bg-black/20 transition-all duration-300 ${hoveredImage === result.id ? "opacity-100" : "opacity-0"}`}
                                >
                                  {/* Download Button - Bottom Center - Appears on hover */}
                                  <Button
                                    size="sm"
                                    className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary hover:bg-primary/90 transition-all duration-300 ${hoveredImage === result.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent opening modal
                                      handleMediaDownload(
                                        result.url,
                                        result.file_id,
                                        result.provider
                                      );
                                    }}
                                  >
                                    <Download className="w-4 h-4" />
                                    {t("search.actions.download")}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              </>
            )}

            {/* Bottom Pagination with Page Numbers */}
            {!isSearchLoading &&
              !searchError &&
              searchResults.length > 0 &&
              totalPages > 1 && (
                <div className="flex justify-center pt-8">
                  <div
                    className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {/* Previous Button */}
                    <Button
                      variant="outline"
                      size="lg"
                      disabled={currentPage === 1 || isSearchLoading}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="w-10 h-10 sm:w-12 sm:h-12 p-0 rounded-xl border-2"
                    >
                      <ChevronLeft
                        className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`}
                      />
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-2">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="lg"
                              disabled={isSearchLoading}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 sm:w-12 sm:h-12 p-0 rounded-xl border-2 font-semibold ${
                                currentPage === pageNum
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "hover:bg-muted"
                              }`}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    {/* Next Button */}
                    <Button
                      variant="outline"
                      size="lg"
                      disabled={currentPage === totalPages || isSearchLoading}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="w-10 h-10 sm:w-12 sm:h-12 p-0 rounded-xl border-2"
                    >
                      <ChevronRight
                        className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`}
                      />
                    </Button>
                  </div>
                </div>
              )}
          </div>
        </main>
      </div>

      {/* Download Verification Sheet */}
      <DownloadVerificationSheet
        isOpen={isDownloadSheetOpen}
        onClose={() => setIsDownloadSheetOpen(false)}
        downloadUrl={downloadUrl}
      />
    </div>
  );
}

// Loading component for Suspense fallback
function SearchPageLoading() {
  const { isRTL } = useLanguage();

  // Generate skeleton data with varied aspect ratios for masonry layout
  const generateSkeletonData = (count: number) => {
    const aspectRatios = [
      { width: 300, height: 400 }, // Portrait
      { width: 400, height: 300 }, // Landscape
      { width: 350, height: 350 }, // Square
      { width: 500, height: 300 }, // Wide landscape
      { width: 280, height: 420 }, // Tall portrait
      { width: 450, height: 250 }, // Ultra wide
      { width: 320, height: 380 }, // Mild portrait
      { width: 380, height: 280 }, // Mild landscape
      { width: 600, height: 300 }, // Banner
      { width: 300, height: 500 }, // Very tall
    ];

    return Array.from({ length: count }, (_, i) => {
      const ratio = aspectRatios[i % aspectRatios.length];
      return {
        id: `skeleton-${i}`,
        width: ratio.width,
        height: ratio.height,
        file_type: i % 4 === 0 ? "video" : i % 8 === 0 ? "audio" : "image",
      };
    });
  };

  // Create skeleton grid rows using the same logic as real results
  const createSkeletonGridRows = (skeletonData: any[]) => {
    const rows: any[][] = [];
    let currentIndex = 0;

    while (currentIndex < skeletonData.length) {
      const currentRow: any[] = [];
      let totalWidth = 0;
      const containerWidth = 100;
      const maxItemsPerRow = 6;

      for (
        let i = currentIndex;
        i < skeletonData.length && currentRow.length < maxItemsPerRow;
        i++
      ) {
        const item = skeletonData[i];
        const aspectRatio = item.width / item.height;

        // Calculate relative width using the same logic as real results
        let relativeWidth;
        if (aspectRatio >= 3.0) {
          relativeWidth = 45;
        } else if (aspectRatio >= 2.5) {
          relativeWidth = 40;
        } else if (aspectRatio >= 2.0) {
          relativeWidth = 35;
        } else if (aspectRatio >= 1.5) {
          relativeWidth = 25;
        } else if (aspectRatio >= 1.2) {
          relativeWidth = 19;
        } else if (aspectRatio >= 1.0) {
          relativeWidth = 15;
        } else if (aspectRatio >= 0.8) {
          relativeWidth = 11;
        } else if (aspectRatio >= 0.6) {
          relativeWidth = 7;
        } else {
          relativeWidth = 5;
        }

        if (
          totalWidth + relativeWidth > containerWidth &&
          currentRow.length > 0
        ) {
          break;
        }

        currentRow.push(item);
        totalWidth += relativeWidth;
        currentIndex++;

        if (totalWidth >= 85 && currentRow.length >= 2) {
          break;
        }
      }

      if (currentRow.length === 0 && currentIndex < skeletonData.length) {
        currentRow.push(skeletonData[currentIndex]);
        currentIndex++;
      }

      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
    }

    return rows;
  };

  // Get skeleton grid template columns
  const getSkeletonGridTemplateColumns = (rowItems: any[]) => {
    return rowItems
      .map((item) => {
        const aspectRatio = item.width / item.height;

        let relativeWidth;
        if (aspectRatio >= 3.0) {
          relativeWidth = 45;
        } else if (aspectRatio >= 2.5) {
          relativeWidth = 40;
        } else if (aspectRatio >= 2.0) {
          relativeWidth = 35;
        } else if (aspectRatio >= 1.5) {
          relativeWidth = 25;
        } else if (aspectRatio >= 1.2) {
          relativeWidth = 19;
        } else if (aspectRatio >= 1.0) {
          relativeWidth = 15;
        } else if (aspectRatio >= 0.8) {
          relativeWidth = 11;
        } else if (aspectRatio >= 0.6) {
          relativeWidth = 7;
        } else {
          relativeWidth = 5;
        }

        return `${relativeWidth}fr`;
      })
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="px-4 sm:px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-44 sm:w-48 h-12">
                <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      <div className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-primary/20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-100"></div>

        {/* Sidebar - Fixed position always */}
        <aside
          className={`fixed ${isRTL ? "right-0 border-l" : "left-0 border-r"} top-16 w-80 h-[calc(100vh-4rem)] bg-card border-border z-50 transition-transform duration-300 ease-in-out overflow-y-auto shadow-lg lg:shadow-none ${isRTL ? "lg:border-l lg:border-r-0" : "lg:border-r lg:border-l-0"} ${isRTL ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="p-6 space-y-6 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
            {/* Providers Filter Skeleton */}
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <Skeleton className="w-24 h-5" />
                <Skeleton className="w-4 h-4 ml-auto" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="w-full h-16 rounded-lg" />
                ))}
              </div>
            </div>

            <Skeleton className="w-full h-px" />

            {/* File Type Filter Skeleton */}
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <Skeleton className="w-20 h-5" />
                <Skeleton className="w-4 h-4 ml-auto" />
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="w-16 h-8 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - Matches current layout */}
        <main
          className={`relative col-span-12 lg:col-span-9 min-w-0 bg-gradient-to-br from-primary/20 via-primary/5 to-primary/20 overflow-hidden ${isRTL ? "lg:mr-72" : "lg:ml-72"}`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-100"></div>

          <div className="min-h-screen relative z-10 p-4 sm:p-6 space-y-6">
            {/* Search Bar */}
            <div className="flex justify-center">
              <Skeleton className="w-full max-w-2xl h-12 rounded-xl" />
            </div>

            {/* Top Pagination */}
            <div className="flex justify-center">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl"
                    />
                  ))}
                </div>
                <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
              </div>
            </div>

            {/* Suggestions */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center space-x-3">
              <Skeleton className="w-24 h-4" />
              <div className="grid place-content-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-fit">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-20 h-10 rounded-full" />
                ))}
              </div>
            </div>

            {/* Search Results Count */}
            <div className="text-center space-y-2">
              <Skeleton className="w-64 h-6 mx-auto" />
              <Skeleton className="w-80 h-4 mx-auto" />
            </div>

            {/* Results Grid - Mobile: Single column, Desktop: Masonry Layout */}
            <div className="space-y-4">
              {/* Mobile Layout - Single column with varied heights */}
              <div className="grid grid-cols-1 gap-4 sm:hidden">
                {generateSkeletonData(6).map((item, i) => {
                  const aspectRatio = item.height / item.width;
                  const height = Math.min(
                    275,
                    Math.max(220, 220 * aspectRatio)
                  );
                  return (
                    <Skeleton
                      key={i}
                      className="w-full rounded-lg"
                      style={{ height: `${height}px` }}
                    />
                  );
                })}
              </div>

              {/* Desktop Layout - Masonry Grid matching actual results */}
              <div className="hidden sm:block w-full">
                {createSkeletonGridRows(generateSkeletonData(18)).map(
                  (row: any[], rowIndex: number) => (
                    <div
                      key={rowIndex}
                      className="grid mb-3 2xl:mb-4"
                      style={{
                        gridTemplateColumns:
                          getSkeletonGridTemplateColumns(row),
                        gap: "20px",
                      }}
                    >
                      {row.map((item: any) => {
                        return (
                          <Skeleton
                            key={item.id}
                            className="rounded-lg"
                            style={{
                              height: "220px", // Fixed height like actual results
                            }}
                          />
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Bottom Pagination */}
            <div className="flex justify-center pt-8">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl"
                    />
                  ))}
                </div>
                <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchContent />
    </Suspense>
  );
}
