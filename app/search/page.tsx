/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Menu,
  ImageIcon,
  File,
  Shield,
  Sparkles,
  Crown,
  Users,
  Star,
  Zap,
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
  const { isRTL, isLoading } = useLanguage();
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

  // Handle search button click
  const handleSearch = () => {
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

  const getImageFlex = (index: number) => {
    // Create varied flex values for different widths (flex-grow values)
    const flexValues = [1.2, 1.6, 1.4, 2.0, 1.1, 1.8, 1.3, 1.5, 1.7, 1.45];
    return flexValues[index % flexValues.length];
  };

  const handleImageClick = (result: SearchResult) => {
    // Store image data in localStorage for the details page
    localStorage.setItem(`image_${result.id}`, JSON.stringify(result));

    // Navigate to the media details page
    window.location.href = `/media/${result.id}`;
  };

  // Handle media download using the new API
  const handleMediaDownload = async (
    link: string,
    id: string,
    website: string
  ) => {
    try {
      // Validate inputs
      if (!link || !id || !website) {
        console.error("Missing required download parameters:", {
          link,
          id,
          website,
        });
        return;
      }

      console.log("Submitting download request:", { link, id, website });

      const response = await searchApi.submitMediaDownload({
        link,
        id,
        website,
      });

      if (response.success) {
        // Handle successful download response
        console.log("Download request submitted successfully:", response.data);
        // In a real app, you might want to show a success notification
        // or redirect to a download page
      } else {
        console.error("Download failed:", response.error?.message);
        // Handle specific error cases
        const errorId = response.error?.id;
        let errorMessage = response.error?.message || "Download failed";

        switch (errorId) {
          case "missing_link":
            errorMessage = "File link is required for download";
            break;
          case "missing_id":
            errorMessage = "File ID is required for download";
            break;
          case "missing_website":
            errorMessage = "Website name is required for download";
            break;
          case "rate_limit":
            errorMessage =
              "Too many download requests. Please wait before trying again.";
            break;
          case "timeout":
            errorMessage = "Download request timed out. Please try again.";
            break;
          default:
            errorMessage =
              response.error?.message || "Download failed. Please try again.";
        }

        console.error("Download error:", errorMessage);
      }
    } catch (error) {
      console.error("Download error:", error);
      // Handle network or unexpected errors
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      console.error("Unexpected download error:", errorMessage);
    }
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

  // Get responsive height for mobile/desktop
  const getResponsiveHeight = (
    result: SearchResult,
    isMobile: boolean = false
  ) => {
    const dimensions = getFallbackDimensions(result);
    const aspectRatio = dimensions.height / dimensions.width;

    if (isMobile) {
      // Mobile: limit height to reasonable values
      return Math.min(300, Math.max(200, 300 * aspectRatio));
    } else {
      // Desktop: use calculated height with limits
      return Math.min(400, Math.max(150, 250 * aspectRatio));
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
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-32 h-6" />
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
                  {Array.from({ length: 8 }).map((_, i) => (
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

            {/* Floating Decorative Elements - Skeleton versions */}
            <div
              className={`absolute top-20 ${isRTL ? "right-5/12" : "left-5/12"} transform -translate-x-1/2 md:top-32`}
            >
              <Skeleton className="w-[120px] h-[120px] rounded-lg opacity-30" />
            </div>

            <div
              className={`hidden md:block absolute top-1/3 ${isRTL ? "left-4 md:left-8" : "right-4 md:right-8"}`}
            >
              <Skeleton className="w-[100px] h-[120px] rounded-lg opacity-40" />
            </div>

            <div
              className={`absolute bottom-32 ${isRTL ? "left-1/4" : "right-1/4"} transform translate-x-1/2`}
            >
              <Skeleton className="w-[80px] h-[80px] rounded-lg opacity-25" />
            </div>

            <div
              className={`hidden lg:block absolute top-16 ${isRTL ? "left-1/4" : "right-1/4"}`}
            >
              <Skeleton className="w-[60px] h-[60px] rounded-lg opacity-35" />
            </div>

            {/* Floating Icon Skeletons */}
            <div
              className={`hidden md:block absolute top-8 ${isRTL ? "left-1/3 md:left-2/12" : "right-1/3 md:right-2/5"} md:top-12`}
            >
              <Skeleton className="w-10 h-10 rounded-lg" />
            </div>

            <div
              className={`hidden sm:block absolute top-32 ${isRTL ? "right-20" : "left-20"}`}
            >
              <Skeleton className="w-10 h-10 rounded-lg" />
            </div>

            <div
              className={`hidden md:block absolute top-64 ${isRTL ? "left-32" : "right-32"}`}
            >
              <Skeleton className="w-12 h-12 rounded-lg" />
            </div>

            <div
              className={`hidden sm:block absolute bottom-40 ${isRTL ? "right-32" : "left-32"}`}
            >
              <Skeleton className="w-9 h-9 rounded-lg" />
            </div>

            <div
              className={`hidden lg:block absolute top-1/2 ${isRTL ? "right-16" : "left-16"} transform -translate-y-1/2`}
            >
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>

            <div
              className={`hidden md:block absolute top-1/3 ${isRTL ? "right-1/2" : "left-1/2"} transform -translate-x-1/2`}
            >
              <Skeleton className="w-10 h-10 rounded-lg" />
            </div>

            <div
              className={`hidden md:block absolute top-40 ${isRTL ? "left-16" : "right-16"}`}
            >
              <Skeleton className="w-11 h-11 rounded-lg" />
            </div>

            <div
              className={`hidden sm:block absolute bottom-20 ${isRTL ? "left-1/4" : "right-1/4"}`}
            >
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>

            <div
              className={`hidden lg:block absolute bottom-32 ${isRTL ? "right-1/3" : "left-1/3"}`}
            >
              <Skeleton className="w-9 h-9 rounded-lg" />
            </div>

            <div
              className={`hidden md:block absolute top-2 ${isRTL ? "right-5/8" : "left-5/8"}`}
            >
              <Skeleton className="w-10 h-10 rounded-lg" />
            </div>

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

              <div className="relative z-10">
                {/* Platforms Grid Skeleton - Modern Card Design */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-7 platforms-grid-3xl gap-1 sm:gap-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="w-full h-[45px] rounded-xl platform-card"
                    />
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div
                className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center ${isRTL ? "space-x-reverse sm:space-x-3" : "space-x-3"}`}
              >
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

              {/* Results Grid - Mobile: Grid (1 item per row), SM+: Flex with varied widths */}
              <div className="space-y-4 results-grid-3xl">
                {/* Mobile Layout - Grid with 1 column */}
                <div className="grid grid-cols-1 gap-4 sm:hidden">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-64 rounded-lg" />
                  ))}
                </div>

                {/* Desktop Layout - Flex with varied widths */}
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
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
              </div>
              <Link
                href="/"
                className="text-base sm:text-xl font-semibold text-foreground"
              >
                {t("header.logo")}
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
          fixed ${isRTL ? "right-0 !border-l" : "left-0 !border-r"} top-16 w-72 sidebar-3xl h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/50 via-primary/20 to-primary/65 backdrop-blur-sm border-border z-50 transition-transform duration-300 ease-in-out overflow-y-auto lg:border-r lg:border-l-0
          ${isSidebarOpen ? "translate-x-0" : `${isRTL ? "translate-x-full" : "-translate-x-full"} lg:translate-x-0`}
        `}
        >
          <div className="p-0 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto bg-gradient-to-b from-background/80 via-background/60 to-background/80 backdrop-blur-sm">
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
                  <div
                    className={`flex items-center gap-3`}
                  >
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
                        <span className="truncate text-sm">{user.account?.email}</span>
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
                        {provider.count} {t("search.filters.items")}
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
                      <span className="pl-1 text-[11px] sm:text-base">
                        {type.count} {t("search.filters.items")}
                      </span>
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
          <div className="absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-80"></div>

          {/* Floating Decorative Elements */}
          {/* Shape 1 - Grid Dots Pattern (Top Left) */}
          <div
            className={`absolute top-20 ${isRTL ? "right-5/12" : "left-5/12"} transform -translate-x-1/2 md:top-32`}
          >
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              className="text-primary/30"
            >
              {Array.from({ length: 6 }, (_, row) =>
                Array.from({ length: 6 }, (_, col) => (
                  <circle
                    key={`dot-${row}-${col}`}
                    cx={10 + col * 18}
                    cy={10 + row * 18}
                    r="2"
                    fill="currentColor"
                    className="animate-pulse-slow"
                    style={{
                      animationDelay: `${(row + col) * 0.1}s`,
                      opacity: Math.random() * 0.6 + 0.3,
                    }}
                  />
                ))
              )}
            </svg>
          </div>

          {/* Shape 2 - Square Grid Pattern (Right Side) */}
          <div
            className={`hidden md:block absolute top-1/3 ${isRTL ? "left-4 md:left-8" : "right-4 md:right-8"}`}
          >
            <svg
              width="100"
              height="120"
              viewBox="0 0 100 120"
              fill="none"
              className="text-primary/40"
            >
              {Array.from({ length: 8 }, (_, row) =>
                Array.from({ length: 8 }, (_, col) => (
                  <rect
                    key={`square-${row}-${col}`}
                    x={8 + col * 16}
                    y={8 + row * 14}
                    width="3"
                    height="3"
                    fill="currentColor"
                    className="animate-pulse-slow"
                    style={{
                      animationDelay: `${(row + col) * 0.08}s`,
                      opacity: Math.random() * 0.5 + 0.25,
                    }}
                  />
                ))
              )}
            </svg>
          </div>

          {/* Shape 3 - Circle Pattern (Bottom) */}
          <div
            className={`absolute bottom-32 ${isRTL ? "left-1/4" : "right-1/4"} transform translate-x-1/2`}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              className="text-primary/25"
            >
              {Array.from({ length: 5 }, (_, row) =>
                Array.from({ length: 5 }, (_, col) => (
                  <circle
                    key={`circle-${row}-${col}`}
                    cx={8 + col * 16}
                    cy={8 + row * 16}
                    r="1.5"
                    fill="currentColor"
                    className="animate-pulse-slow"
                    style={{
                      animationDelay: `${(row + col) * 0.15}s`,
                      opacity: Math.random() * 0.4 + 0.2,
                    }}
                  />
                ))
              )}
            </svg>
          </div>

          {/* Shape 4 - Diamond Pattern (Top Right) */}
          <div
            className={`hidden lg:block absolute top-16 ${isRTL ? "left-1/4" : "right-1/4"}`}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              className="text-primary/35"
            >
              {Array.from({ length: 4 }, (_, row) =>
                Array.from({ length: 4 }, (_, col) => (
                  <polygon
                    key={`diamond-${row}-${col}`}
                    points={`${8 + col * 14},${5 + row * 14} ${11 + col * 14},${8 + row * 14} ${8 + col * 14},${11 + row * 14} ${5 + col * 14},${8 + row * 14}`}
                    fill="currentColor"
                    className="animate-pulse-slow"
                    style={{
                      animationDelay: `${(row + col) * 0.12}s`,
                      opacity: Math.random() * 0.5 + 0.3,
                    }}
                  />
                ))
              )}
            </svg>
          </div>

          {/* Floating Icon 1 - Top Right */}
          <div
            className={`hidden md:block absolute top-8 ${isRTL ? "left-1/3 md:left-2/12" : "right-1/3 md:right-2/5"} md:top-12`}
          >
            <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-float">
              <Shield className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Floating Icon 2 - Top Left */}
          <div
            className={`hidden sm:block absolute top-32 ${isRTL ? "right-20" : "left-20"} animate-float-delayed`}
          >
            <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Anchor for scroll-to-top of results */}
          <div id="results-top" />

          {/* Floating Icon 3 - Middle Right */}
          <div
            className={`hidden md:block absolute top-64 ${isRTL ? "left-32" : "right-32"} animate-float`}
          >
            <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* Floating Icon 4 - Bottom Left */}
          <div
            className={`hidden sm:block absolute bottom-40 ${isRTL ? "right-32" : "left-32"} animate-float-delayed`}
          >
            <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Floating Icon 5 - Center Left */}
          <div
            className={`hidden lg:block absolute top-1/2 ${isRTL ? "right-16" : "left-16"} transform -translate-y-1/2 animate-float`}
          >
            <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Floating Icon 7 - Top Right Corner */}
          <div
            className={`hidden md:block absolute top-40 ${isRTL ? "left-16" : "right-16"} animate-float-delayed`}
          >
            <div className="w-11 h-11 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Floating Icon 8 - Bottom Right */}
          <div
            className={`hidden sm:block absolute bottom-20 ${isRTL ? "left-1/4" : "right-1/4"} animate-float`}
          >
            <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Floating Icon 9 - Bottom Center */}
          <div
            className={`hidden lg:block absolute bottom-32 ${isRTL ? "right-1/3" : "left-1/3"} animate-float-delayed`}
          >
            <div className="w-9 h-9 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
              <Palette className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Floating Icon 10 - Top Center */}
          <div
            className={`hidden md:block absolute top-2 ${isRTL ? "right-5/8" : "left-5/8"} animate-float`}
          >
            <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
          </div>

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
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                      <SelectItem value="icons">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          <span>Icons</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Search Results Count */}
            <div className="text-center space-y-2">
              <div
                className={`flex items-center justify-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <h2 className="text-lg font-semibold text-foreground">
                  {t("search.results.stockImages")}{" "}
                  <span className="text-primary">
                    {searchQuery || t("search.results.defaultQuery")}
                  </span>
                  .
                </h2>
              </div>
              <p className="text-muted-foreground">
                {t("search.results.description", {
                  count: totalResults,
                  query: searchQuery || t("search.results.defaultQuery"),
                })}{" "}
                {t("search.results.vectorsText")}{" "}
              </p>
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
              <div className="space-y-4 results-grid-3xl">
                {/* Mobile Layout - Grid with 1 column */}
                <div className="grid grid-cols-1 gap-4 sm:hidden">
                  {searchResults.map((result) => {
                    const responsiveHeight = getResponsiveHeight(result, true);
                    return (
                      <div
                        key={result.id}
                        className={`group relative bg-card rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
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
                          ) : result.file_type === "video" &&
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
                                  console.warn(
                                    "Video load error, falling back to image"
                                  );
                                  const video = e.target as HTMLVideoElement;
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
                                    const img = e.target as HTMLImageElement;
                                    img.style.display = "none";
                                    const textPlaceholder =
                                      img.nextElementSibling as HTMLDivElement;
                                    if (textPlaceholder) {
                                      textPlaceholder.style.display = "flex";
                                    }
                                  }}
                                />
                              ) : null}
                              {/* Text placeholder for videos without poster */}
                              <div
                                className="absolute inset-0 flex items-center justify-center bg-muted/80 text-muted-foreground"
                                style={{
                                  display: result.poster ? "none" : "none",
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
                              className="w-full h-full object-cover"
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

                {/* Desktop Layout - Flex with varied widths (SM and up) */}
                <div className="hidden sm:flex sm:flex-col sm:w-full">
                  {Array.from(
                    { length: Math.ceil(searchResults.length / 4) },
                    (_, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="flex gap-2 sm:gap-4 justify-center flex-wrap mb-4"
                      >
                        {searchResults
                          .slice(rowIndex * 4, (rowIndex + 1) * 4)
                          .map((result, index) => {
                            const actualIndex = rowIndex * 4 + index;
                            const flexValue = getImageFlex(actualIndex);
                            return (
                              <div
                                key={result.id}
                                className={`group relative bg-card rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                                  result.file_type === "audio"
                                    ? "border border-primary/50 shadow-sm hover:border-primary hover:shadow-md"
                                    : "border border-border hover:border-primary/50"
                                }`}
                                style={{
                                  flex: `${flexValue} 1 0`,
                                  height: "250px",
                                  minWidth: "150px",
                                  maxWidth: "400px",
                                }}
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
                                  ) : result.file_type === "video" &&
                                    isValidVideoUrl(result.thumbnail) ? (
                                    <>
                                      <video
                                        src={result.thumbnail}
                                        poster={getVideoPoster(
                                          result.thumbnail
                                        )}
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
                                              await generateVideoThumbnail(
                                                video
                                              );
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
                                          <div className="text-2xl mb-2">
                                            🎥
                                          </div>
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
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                      onError={(e) => {
                                        const img =
                                          e.target as HTMLImageElement;
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
              </div>
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
    </div>
  );
}

// Loading component for Suspense fallback
function SearchPageLoading() {
  const { isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="px-4 sm:px-5">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile menu button skeleton */}
              <Skeleton className="w-8 h-8 rounded-lg lg:hidden" />
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-32 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
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

            {/* Results Grid - Mobile: Single column, Desktop: Varied widths */}
            <div className="space-y-4">
              {/* Mobile Layout - Single column */}
              <div className="grid grid-cols-1 gap-4 sm:hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="w-full h-64 rounded-lg" />
                ))}
              </div>

              {/* Desktop Layout - Flex with varied widths */}
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

            {/* Bottom Pagination */}
            <div className="flex justify-center pt-8">
              <div className="flex items-center gap-2">
                <Skeleton className="w-20 h-8 rounded" />
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-16 h-8 rounded" />
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
