/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import {
  X,
  Download,
  Eye,
  ArrowLeft,
  Copy,
  Info,
  Palette,
  Layers,
  Monitor,
  Hash,
  Globe,
  Shield,
  Sparkles,
  Star,
  Crown,
  User,
  Mail,
  CreditCard,
  Coins,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/components/i18n-provider";
import { HeaderControls } from "@/components/header-controls";
import Footer from "@/components/footer";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tag,
  ExternalLink,
  Loader2,
  AlertCircle,
  ImageIcon,
  VideoIcon,
  AudioLines,
  Users,
} from "lucide-react";
import { searchApi, type ProviderDataRequest, type FileData } from "@/lib/api";
import { RelatedFilesSection } from "@/components/media/related-files-section";
import { useAuth } from "@/components/auth-provider";

// Type definitions for search result (matching the search page)
interface SearchResult {
  id: string;
  title: string;
  thumbnail: string;
  provider: string;
  type: string;
  file_type: string;
  width: number | null;
  height: number | null;
  url: string;
  file_id: string;
  image_type: string;
  poster?: string;
  providerIcon?: string;
}

export default function ImageDetailsPage() {
  const { t } = useTranslation("common");
  const { isRTL } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [imageData, setImageData] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullImageOpen, setIsFullImageOpen] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [showAllKeywords, setShowAllKeywords] = useState(false);

  // Enhanced provider data state
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isProviderDataLoading, setIsProviderDataLoading] = useState(false);
  const [providerDataError, setProviderDataError] = useState<string | null>(
    null
  );
  const [isDownloading, setIsDownloading] = useState(false);

  // Map provider names to match the API specification
  const mapProviderName = useCallback((providerName: string): string => {
    const providerMapping: { [key: string]: string } = {
      "Adobe Stock": "AdobeStock",
      AdobeStock: "AdobeStock",
      "Creative Fabrica": "CreativeFabrica",
      CreativeFabrica: "CreativeFabrica",
      Envato: "Envato",
      Freepik: "Freepik",
      "Motion Elements": "MotionElements",
      MotionElements: "MotionElements",
      "PNG Tree": "PngTree",
      PngTree: "PngTree",
      Shutterstock: "Shutterstock",
      Storyblocks: "Storyblocks",
      Vecteezy: "Vecteezy",
    };

    return providerMapping[providerName] || providerName;
  }, []);

  // Fetch enhanced provider data
  const fetchProviderData = useCallback(
    async (mediaData: SearchResult) => {
      if (!mediaData.provider || !mediaData.url || !mediaData.file_id) {
        console.log("Missing required data for provider API:", {
          provider: mediaData.provider,
          url: !!mediaData.url,
          file_id: !!mediaData.file_id,
        });
        return;
      }

      setIsProviderDataLoading(true);
      setProviderDataError(null);

      try {
        // Map the provider name to match API specification
        const mappedPlatform = mapProviderName(mediaData.provider);

        const request: ProviderDataRequest = {
          platform: mappedPlatform,
          file_url: mediaData.url,
          file_id: mediaData.file_id,
        };

        console.log("Original provider:", mediaData.provider);
        console.log("Mapped platform:", mappedPlatform);
        console.log("Full request object:", request);
        console.log("Request JSON:", JSON.stringify(request));
        const response = await searchApi.getProviderData(request);

        if (response.success && response.data) {
          setFileData(response.data.data);
          console.log("Provider data loaded successfully:", response.data.data);
        } else {
          const errorMessage =
            response.error?.message || "Failed to load enhanced details";
          setProviderDataError(errorMessage);
          console.error("Provider data error:", errorMessage);
        }
      } catch (err) {
        console.error("Error fetching provider data:", err);
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setProviderDataError(errorMessage);
      } finally {
        setIsProviderDataLoading(false);
      }
    },
    [mapProviderName]
  );

  // Handle media download
  const handleDownload = useCallback(async () => {
    if (!imageData) return;

    setIsDownloading(true);
    try {
      // Use the mapped provider name for consistency
      const mappedProvider = mapProviderName(imageData.provider);

      const response = await searchApi.submitMediaDownload({
        link: imageData.url,
        id: imageData.file_id,
        website: mappedProvider,
      });

      if (response.success) {
        console.log("Download request submitted successfully:", response.data);
        // You could show a success notification here
      } else {
        console.error("Download failed:", response.error?.message);
        // You could show an error notification here
      }
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  }, [imageData, mapProviderName]);

  // Check if high resolution data is available and valid
  const isHighResolutionAvailable = useCallback(
    (fileData: FileData | null): boolean => {
      if (!fileData || !fileData.high_resolution) {
        return false;
      }

      const { src, width, height } = fileData.high_resolution;

      // Convert width and height to numbers if they're strings
      const numWidth = typeof width === "string" ? parseInt(width, 10) : width;
      const numHeight =
        typeof height === "string" ? parseInt(height, 10) : height;

      // Check if all required properties exist and are valid
      return !!(
        src &&
        typeof src === "string" &&
        src.trim() !== "" &&
        width &&
        height &&
        !isNaN(numWidth) &&
        !isNaN(numHeight) &&
        numWidth > 0 &&
        numHeight > 0
      );
    },
    []
  );

  // Format file type for display (first letter capitalized)
  const formatFileType = useCallback((fileType: string): string => {
    if (!fileType || typeof fileType !== "string") {
      return "Unknown";
    }

    const trimmed = fileType.trim().toLowerCase();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }, []);

  // Get image data from URL parameters or localStorage
  useEffect(() => {
    const imageId = params.id as string;

    // Try to get image data from localStorage (passed from search page)
    const storedImageData = localStorage.getItem(`image_${imageId}`);
    if (storedImageData) {
      try {
        const parsedData = JSON.parse(storedImageData);
        setImageData(parsedData);
        setIsLoading(false);

        // Fetch enhanced provider data
        fetchProviderData(parsedData);
      } catch (error) {
        console.error("Failed to parse stored image data:", error);
        setIsLoading(false);
      }
    } else {
      // If no stored data, redirect back to search
      router.push("/search");
    }
  }, [params.id, router, fetchProviderData]);

  // Check if URL is a valid video URL with enhanced detection
  const isValidVideoUrl = useCallback((url: string): boolean => {
    if (!url) return false;

    // Enhanced video extensions for better cross-browser support
    const videoExtensions = [
      ".mp4",
      ".webm",
      ".ogg",
      ".ogv",
      ".mov",
      ".avi",
      ".mkv",
      ".flv",
      ".wmv",
      ".m4v",
      ".3gp",
      ".3g2",
    ];
    const hasVideoExtension = videoExtensions.some((ext) =>
      url.toLowerCase().includes(ext)
    );

    // Enhanced video streaming domains
    const videoStreamingDomains = [
      "cloudfront.net",
      "amazonaws.com",
      "vimeo.com",
      "youtube.com",
      "youtu.be",
      "jwpcdn.com",
      "jwplatform.com",
      "brightcove.com",
      "wistia.com",
      "vidyard.com",
    ];
    const hasVideoStreamingDomain = videoStreamingDomains.some((domain) =>
      url.includes(domain)
    );

    return hasVideoExtension || hasVideoStreamingDomain;
  }, []);

  // Get video MIME type for better browser compatibility
  const getVideoMimeType = useCallback((url: string): string => {
    if (!url) return "video/mp4";

    const extension = url.toLowerCase().split(".").pop();
    const mimeTypes: { [key: string]: string } = {
      mp4: "video/mp4",
      webm: "video/webm",
      ogg: "video/ogg",
      ogv: "video/ogg",
      mov: "video/quicktime",
      avi: "video/x-msvideo",
      mkv: "video/x-matroska",
      flv: "video/x-flv",
      wmv: "video/x-ms-wmv",
      m4v: "video/mp4",
      "3gp": "video/3gpp",
      "3g2": "video/3gpp2",
    };

    return mimeTypes[extension || ""] || "video/mp4";
  }, []);

  // Determine if current item is a video
  const isVideoItem = useCallback((): boolean => {
    if (!imageData) return false;

    return (
      imageData.file_type === "video" ||
      imageData.type === "video" ||
      imageData.image_type?.toLowerCase().includes("video") ||
      isValidVideoUrl(imageData.thumbnail)
    );
  }, [imageData, isValidVideoUrl]);

  // Check if URL is a valid audio URL
  const isValidAudioUrl = useCallback((url: string): boolean => {
    if (!url) return false;

    // Audio extensions for cross-browser support
    const audioExtensions = [
      ".mp3",
      ".wav",
      ".ogg",
      ".oga",
      ".aac",
      ".m4a",
      ".flac",
      ".wma",
      ".opus",
      ".webm", // WebM can contain audio
    ];
    const hasAudioExtension = audioExtensions.some((ext) =>
      url.toLowerCase().includes(ext)
    );

    // Audio streaming domains
    const audioStreamingDomains = [
      "audio-previews.elements.envatousercontent.com",
      "soundcloud.com",
      "spotify.com",
      "bandcamp.com",
    ];
    const hasAudioStreamingDomain = audioStreamingDomains.some((domain) =>
      url.includes(domain)
    );

    return hasAudioExtension || hasAudioStreamingDomain;
  }, []);

  // Get audio MIME type for better browser compatibility
  const getAudioMimeType = useCallback((url: string): string => {
    if (!url) return "audio/mpeg";

    const extension = url.toLowerCase().split(".").pop();
    const mimeTypes: { [key: string]: string } = {
      mp3: "audio/mpeg",
      wav: "audio/wav",
      ogg: "audio/ogg",
      oga: "audio/ogg",
      aac: "audio/aac",
      m4a: "audio/mp4",
      flac: "audio/flac",
      wma: "audio/x-ms-wma",
      opus: "audio/opus",
      webm: "audio/webm",
    };

    return mimeTypes[extension || ""] || "audio/mpeg";
  }, []);

  // Determine if current item is an audio file
  const isAudioItem = useCallback((): boolean => {
    if (!imageData) return false;

    return (
      imageData.file_type === "audio" ||
      imageData.type === "audio" ||
      (imageData.image_type?.toLowerCase().includes("audio") ?? false) ||
      isValidAudioUrl(imageData.thumbnail) ||
      (fileData?.high_resolution?.src
        ? isValidAudioUrl(fileData.high_resolution.src)
        : false)
    );
  }, [imageData, fileData, isValidAudioUrl]);

  // Generate proxy URL for audio to bypass CORS
  const getProxyAudioUrl = useCallback((audioUrl: string): string => {
    if (!audioUrl) return "";

    // Check if it's an external URL that needs proxying
    if (
      audioUrl.includes("audio-previews.elements.envatousercontent.com") ||
      audioUrl.includes("elements.envatousercontent.com")
    ) {
      return `/api/proxy/audio?url=${encodeURIComponent(audioUrl)}`;
    }

    // Return original URL if it doesn't need proxying
    return audioUrl;
  }, []);

  // Generate video thumbnail using canvas
  const generateVideoThumbnail = useCallback(
    (videoElement: HTMLVideoElement): Promise<string> => {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve("/placeholder.png");
          return;
        }

        canvas.width = videoElement.videoWidth || 320;
        canvas.height = videoElement.videoHeight || 240;
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve(thumbnailUrl);
      });
    },
    []
  );

  // Handle keyboard controls for full-screen video
  useEffect(() => {
    if (!isFullImageOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!imageData || !isVideoItem()) return;

      const video = document.querySelector("video") as HTMLVideoElement;
      if (!video) return;

      switch (event.code) {
        case "Space":
          event.preventDefault();
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
          break;
        case "ArrowLeft":
          event.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;
        case "ArrowRight":
          event.preventDefault();
          video.currentTime = Math.min(video.duration, video.currentTime + 10);
          break;
        case "ArrowUp":
          event.preventDefault();
          video.volume = Math.min(1, video.volume + 0.1);
          break;
        case "ArrowDown":
          event.preventDefault();
          video.volume = Math.max(0, video.volume - 0.1);
          break;
        case "KeyM":
          event.preventDefault();
          video.muted = !video.muted;
          break;
        case "KeyF":
          event.preventDefault();
          if (video.requestFullscreen) {
            video.requestFullscreen();
          }
          break;
        case "Escape":
          setIsFullImageOpen(false);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullImageOpen, imageData]);

  if (isLoading) {
    return (
      <div
        className={`min-h-screen bg-background font-sans ${isRTL ? "font-tajawal" : ""}`}
      >
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="media-header mx-auto max-w-7xl px-4 sm:px-5">
            <div className="flex items-center justify-between h-16">
              <div
                className={`flex items-center gap-1 sm:gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
              >
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

        {/* Main Content with Gradient Background */}
        <div className="bg-gradient-to-br from-primary/20 via-muted/20 to-primary/20 min-h-screen relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-80"></div>

          {/* Floating Decorative Elements - Same as actual page */}
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

          <main className="container mx-auto max-w-7xl px-4 sm:px-5 py-6 relative z-10">
            {/* Back Button Skeleton */}
            <div className="mb-6">
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>

            {/* Media Details Content Skeleton */}
            <div className="space-y-6">
              {/* Mobile Layout: Stack all components vertically */}
              <div className="xl:hidden space-y-6">
                {/* 1. Image/video card at the top */}
                <div className="bg-card dark:bg-card/50 rounded-xl border border-primary/40 dark:border-primary/20 overflow-hidden">
                  {/* Provider Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-muted/30 to-muted/10">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>

                  {/* Media Display Area */}
                  <div
                    className="relative bg-gradient-to-br from-muted/20 to-muted/5 flex items-center justify-center"
                    style={{ minHeight: "400px", maxHeight: "650px" }}
                  >
                    <Skeleton className="w-full h-full" />
                  </div>
                </div>

                {/* 2. Name and download card below the media */}
                <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>

                {/* 3. User Profile Card Skeleton */}
                <div className="bg-card dark:bg-card/50 border border-primary/30 dark:border-primary/20 rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <Skeleton className="w-4 h-4 sm:w-5 sm:h-5" />
                      <Skeleton className="h-5 sm:h-6 w-14 sm:w-16" />
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      {/* User Avatar and Name Skeleton */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                        <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                          <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                          <Skeleton className="h-2 sm:h-3 w-24 sm:w-32" />
                        </div>
                      </div>

                      {/* Subscription Plan Skeleton */}
                      <div className="flex justify-between items-center py-1 sm:py-2 border-b border-border/30">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Skeleton className="w-3 h-3 sm:w-4 sm:h-4" />
                          <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                        </div>
                        <Skeleton className="h-5 sm:h-6 w-10 sm:w-12 rounded-md" />
                      </div>

                      {/* Credit Balance Skeleton */}
                      <div className="flex justify-between items-center py-1 sm:py-2">
                        <div className="flex items-center gap-1 sm:gap-2">
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
                </div>

                {/* 4. Details card */}
                <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Skeleton className="w-5 h-5" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center py-2 border-b border-border/30"
                        >
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. High resolution view card */}
                <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center"
                        >
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                      ))}
                      <div className="pt-2 border-t border-border/50">
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Actions card */}
                <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                  <div className="p-6">
                    <Skeleton className="h-6 w-24 mb-4" />
                    <div className="space-y-3">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 7. Keywords card */}
                <div className="bg-card dark:bg-card/50 border border-border/50 rounded-xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Skeleton className="w-5 h-5" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-8 rounded-full ml-auto" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-16 rounded-full" />
                      ))}
                    </div>
                    <Skeleton className="h-8 w-24 mt-4" />
                  </div>
                </div>

                {/* 8. Related files section at the bottom */}
                <div className="space-y-6">
                  {/* Section Header */}
                  <div className="text-center">
                    <Skeleton className="h-8 w-48 mx-auto mb-2" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                  </div>

                  {/* Responsive grid for related files: 1 col mobile, 2-3 cols tablet, 4 cols desktop, 6 cols ultra-wide */}
                  <div className="related-files-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-card rounded-lg overflow-hidden border border-border shadow-sm"
                      >
                        <Skeleton className="w-full aspect-video" />
                        <div className="p-3 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <div className="flex gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                          </div>
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop Layout: Two-column grid */}
              <div
                className={`hidden xl:grid xl:grid-cols-5 gap-8 ${isRTL ? "xl:grid-flow-col-dense" : ""}`}
              >
                {/* Media Display Section */}
                <div
                  className={`xl:col-span-3 ${isRTL ? "xl:order-2" : ""} space-y-6`}
                >
                  {/* Main Media Card */}
                  <div className="bg-card dark:bg-card/50 rounded-xl border border-border/50 overflow-hidden">
                    {/* Provider Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-muted/30 to-muted/10">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-14 h-14 rounded-lg" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>

                    {/* Media Display Area */}
                    <div
                      className="relative bg-gradient-to-br from-muted/20 to-muted/5 flex items-center justify-center"
                      style={{ minHeight: "400px", maxHeight: "650px" }}
                    >
                      <Skeleton className="w-full h-full" />
                    </div>
                  </div>

                  {/* Keywords Section */}
                  <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="w-5 h-5" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-8 rounded-full ml-auto" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <Skeleton key={i} className="h-8 w-16 rounded-full" />
                        ))}
                      </div>
                      <Skeleton className="h-8 w-24 mt-4" />
                    </div>
                  </div>

                  {/* Related Files Section */}
                  <div className="space-y-6">
                    {/* Section Header */}
                    <div className="text-center">
                      <Skeleton className="h-8 w-48 mx-auto mb-2" />
                      <Skeleton className="h-4 w-64 mx-auto" />
                    </div>

                    {/* Responsive grid for related files: 1 col mobile, 2-3 cols tablet, 4 cols desktop, 6 cols ultra-wide */}
                    <div className="related-files-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-card rounded-lg overflow-hidden border border-border shadow-sm"
                        >
                          <Skeleton className="w-full aspect-video" />
                          <div className="p-3 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <div className="flex gap-2">
                              <Skeleton className="h-5 w-16 rounded-full" />
                              <Skeleton className="h-5 w-20 rounded-full" />
                            </div>
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar - Details and Actions */}
                <div
                  className={`xl:col-span-2 space-y-6 ${isRTL ? "xl:order-1" : ""}`}
                >
                  {/* Title and Basic Info Card */}
                  <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-8 w-full" />
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  </div>

                  {/* User Profile Card Skeleton */}
                  <div className="bg-card dark:bg-card/50 border border-primary/30 dark:border-primary/20 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Skeleton className="w-4 h-4 sm:w-5 sm:h-5" />
                        <Skeleton className="h-5 sm:h-6 w-14 sm:w-16" />
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        {/* User Avatar and Name Skeleton */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                          <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                            <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                            <Skeleton className="h-2 sm:h-3 w-24 sm:w-32" />
                          </div>
                        </div>

                        {/* Subscription Plan Skeleton */}
                        <div className="flex justify-between items-center py-1 sm:py-2 border-b border-border/80">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Skeleton className="w-3 h-3 sm:w-4 sm:h-4" />
                            <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                          </div>
                          <Skeleton className="h-5 sm:h-6 w-10 sm:w-12 rounded-md" />
                        </div>

                        {/* Credit Balance Skeleton */}
                        <div className="flex justify-between items-center py-1 sm:py-2">
                          <div className="flex items-center gap-1 sm:gap-2">
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
                  </div>

                  {/* Details Card */}
                  <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="w-5 h-5" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center py-2 border-b border-border/30"
                          >
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* High Resolution Card */}
                  <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Skeleton className="w-4 h-4" />
                        <Skeleton className="h-6 w-32" />
                      </div>
                      <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center"
                          >
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-5 w-16" />
                          </div>
                        ))}
                        <div className="pt-2 border-t border-border/50">
                          <Skeleton className="h-8 w-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Actions Card */}
                  <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                    <div className="p-6">
                      <Skeleton className="h-6 w-24 mb-4" />
                      <div className="space-y-3">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <Skeleton key={i} className="h-10 w-full" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!imageData) {
    return (
      <div
        className={`min-h-screen bg-background font-sans ${isRTL ? "font-tajawal" : ""}`}
      >
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="media-header mx-auto max-w-7xl px-4 sm:px-5">
            <div className="flex items-center justify-between h-16">
              <div
                className={`flex items-center gap-1 sm:gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
              >
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
        <main className="container mx-auto max-w-7xl px-4 sm:px-5 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {t("mediaDetail.notFound.title")}
            </h1>
            <p className="text-muted-foreground mb-6">
              {t("mediaDetail.notFound.description")}
            </p>
            <Link href="/search">
              <Button>
                <ArrowLeft className="w-4 h-4" />
                {t("mediaDetail.notFound.backButton")}
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-background font-sans ${isRTL ? "font-tajawal" : ""}`}
    >
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="media-header mx-auto max-w-7xl px-4 sm:px-5">
          <div className="flex items-center justify-between h-16">
            <div
              className={`flex items-center gap-1 sm:gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
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

      {/* Main Content with Background Elements */}
      <div className="bg-gradient-to-br from-primary/20 via-muted/20 to-primary/20 min-h-screen relative overflow-hidden">
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

        {/* Floating Icons for Visual Consistency */}
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
            <Eye className="w-4 h-4 text-primary" />
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

        {/* Floating Icon 6 - Top Right Corner */}
        <div
          className={`hidden md:block absolute top-40 ${isRTL ? "left-16" : "right-16"} animate-float-delayed`}
        >
          <div className="w-11 h-11 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Floating Icon 7 - Bottom Right */}
        <div
          className={`hidden sm:block absolute bottom-20 ${isRTL ? "left-1/4" : "right-1/4"} animate-float`}
        >
          <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Floating Icon 8 - Bottom Center */}
        <div
          className={`hidden lg:block absolute bottom-32 ${isRTL ? "right-1/3" : "left-1/3"} animate-float-delayed`}
        >
          <div className="w-9 h-9 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-primary" />
          </div>
        </div>

        <main className="mx-auto max-w-7xl media-page px-4 sm:px-5 py-6 relative z-10">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("mediaDetail.backToSearch")}
            </Button>
          </div>

          {/* Media Details Content */}
          <div className="space-y-6">
            {/* Mobile Layout: Stack all components vertically */}
            <div className="xl:hidden space-y-6">
              {/* 1. Image/video card at the top */}
              <div className="bg-card dark:bg-card/50 rounded-xl border border-primary/40 dark:border-primary/20 overflow-hidden">
                {/* Provider Header */}
                <div
                  className={`flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-muted/30 to-muted/10 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <img
                          src={imageData.providerIcon}
                          alt={imageData.provider}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<Globe class="w-5 h-5 text-muted-foreground" />`;
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground text-sm">
                        {imageData.provider}
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      {formatFileType(imageData.file_type)}
                    </Badge>
                  </div>
                </div>

                {/* Media Display */}
                <div
                  className="relative bg-gradient-to-br from-muted/20 to-muted/5 flex items-center justify-center"
                  style={{ maxHeight: "650px", minHeight: "400px" }}
                >
                  {/* Video Loading Indicator */}
                  {isVideoItem() && isVideoLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                      <div className="flex items-center gap-3 bg-black/80 text-white px-6 py-3 rounded-xl shadow-lg">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">
                          {t("mediaDetail.videoPlayer.loadingVideo")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Audio Loading Indicator */}
                  {isAudioItem() && isAudioLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                      <div className="flex items-center gap-3 bg-black/80 text-white px-6 py-3 rounded-xl shadow-lg">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">
                          {t("mediaDetail.audioPlayer.loadingAudio")}
                        </span>
                      </div>
                    </div>
                  )}

                  {isAudioItem() ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-6">
                      {/* Audio Icon */}
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                        <AudioLines className="w-12 h-12 text-primary" />
                      </div>

                      {/* Audio Title */}
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {imageData.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t("mediaDetail.audioPlayer.clickToPlay")}
                        </p>
                      </div>

                      {/* Audio Player */}
                      <audio
                        className="w-full max-w-md"
                        controls
                        controlsList="nodownload"
                        preload="auto"
                        style={{ height: "40px" }}
                        onLoadStart={() => setIsAudioLoading(true)}
                        onCanPlay={() => setIsAudioLoading(false)}
                        onLoadedData={() => setIsAudioLoading(false)}
                        onError={() => setIsAudioLoading(false)}
                        onWaiting={() => setIsAudioLoading(true)}
                        onPlaying={() => setIsAudioLoading(false)}
                      >
                        <source
                          src={getProxyAudioUrl(
                            fileData?.high_resolution?.src ||
                              imageData.thumbnail
                          )}
                          type={getAudioMimeType(
                            fileData?.high_resolution?.src ||
                              imageData.thumbnail
                          )}
                        />
                        {/* Fallback message for browsers that don't support audio */}
                        <p className="text-muted-foreground text-center p-4">
                          {t("mediaDetail.audioPlayer.browserNotSupported")}
                          <a
                            href={getProxyAudioUrl(
                              fileData?.high_resolution?.src ||
                                imageData.thumbnail
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline ml-1"
                          >
                            {t("mediaDetail.audioPlayer.downloadAudio")}
                          </a>
                        </p>
                      </audio>
                    </div>
                  ) : isVideoItem() && isValidVideoUrl(imageData.thumbnail) ? (
                    <video
                      className="w-full h-full object-contain"
                      poster={imageData.poster || "/placeholder.png"}
                      controls
                      controlsList="nodownload"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      crossOrigin="anonymous"
                      style={{
                        maxHeight: "650px",
                        width: "100%",
                        height: "auto",
                      }}
                      onLoadedData={async (e) => {
                        const video = e.target as HTMLVideoElement;
                        setIsVideoLoading(false);
                        try {
                          video.currentTime = 1;
                          await new Promise((resolve) => {
                            video.onseeked = resolve;
                          });
                          const thumbnailUrl =
                            await generateVideoThumbnail(video);
                          video.poster = thumbnailUrl;
                        } catch (error) {
                          console.warn(
                            "Failed to generate video thumbnail:",
                            error
                          );
                        }
                      }}
                      onError={(e) => {
                        console.warn("Video load error, showing as image");
                        setIsVideoLoading(false);
                        const video = e.target as HTMLVideoElement;
                        video.style.display = "none";
                        const container = video.parentElement;
                        if (container) {
                          const fallbackImg = document.createElement("img");
                          fallbackImg.src = imageData.thumbnail;
                          fallbackImg.alt = imageData.title;
                          fallbackImg.className =
                            "w-full h-full object-contain max-h-[65vh]";
                          container.appendChild(fallbackImg);
                        }
                      }}
                      onCanPlay={() => {
                        console.log("Video can start playing");
                        setIsVideoLoading(false);
                      }}
                      onLoadStart={() => {
                        console.log("Video load started");
                        setIsVideoLoading(true);
                      }}
                      onWaiting={() => {
                        setIsVideoLoading(true);
                      }}
                      onPlaying={() => {
                        setIsVideoLoading(false);
                      }}
                    >
                      {/* Multiple source elements for better browser compatibility */}
                      <source
                        src={imageData.thumbnail}
                        type={getVideoMimeType(imageData.thumbnail)}
                      />
                      {/* Fallback message for browsers that don't support video */}
                      <p className="text-muted-foreground text-center p-4">
                        {t("mediaDetail.videoPlayer.browserNotSupported")}
                        <a
                          href={imageData.thumbnail}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline ml-1"
                        >
                          {t("mediaDetail.videoPlayer.downloadVideo")}
                        </a>
                      </p>
                    </video>
                  ) : (
                    <img
                      src={imageData.thumbnail}
                      alt={imageData.title}
                      className="w-full h-full object-contain cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                      style={{
                        maxHeight: "650px",
                        width: "100%",
                        height: "auto",
                      }}
                      onClick={() => setIsFullImageOpen(true)}
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = "/placeholder.png";
                      }}
                    />
                  )}
                </div>
              </div>

              {/* 2. Name and download card below the media */}
              <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-foreground mb-3 leading-tight">
                    {imageData.title}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      <span className="font-mono">{imageData.file_id}</span>
                    </div>
                    {imageData.width && imageData.height && (
                      <div className="flex items-center gap-1">
                        <Monitor className="w-4 h-4" />
                        <span>
                          {imageData.width} × {imageData.height}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div
                    className={`grid ${isAudioItem() ? "grid-cols-1" : "grid-cols-2"} gap-3`}
                  >
                    <Button
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                      onClick={handleDownload}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {isDownloading
                        ? t("mediaDetail.actions.downloading")
                        : t("mediaDetail.actions.download")}
                    </Button>
                    {!isAudioItem() && (
                      <Button onClick={() => setIsFullImageOpen(true)}>
                        <Eye className="w-4 h-4" />
                        {isVideoItem()
                          ? t("mediaDetail.actions.viewFullVideo")
                          : t("mediaDetail.actions.viewFullImage")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. User Profile Card */}
              {isAuthenticated && user && (
                <div className="bg-card dark:bg-card/50 border border-primary/30 dark:border-primary/20 rounded-xl overflow-hidden shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground text-lg">
                        {t("profile.title")}
                      </h3>
                    </div>

                    <div className="space-y-4">
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
                            className={`flex items-center gap-1 text-sm text-muted-foreground`}
                          >
                            <Mail className="w-3 h-3" />
                            <span className="truncate">
                              {user.account?.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Subscription Plan */}
                      <div className="flex justify-between items-center py-2 border-b border-border/30">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          {t("profile.subscription.currentPlan")}
                        </span>
                        <div className="px-2 py-1 bg-primary/10 border border-primary/20 rounded-md">
                          <span className="text-xs font-semibold text-primary">
                            {user.subscription?.plan || "Free"}
                          </span>
                        </div>
                      </div>

                      {/* Credit Balance */}
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Coins className="w-4 h-4" />
                          {t("profile.stats.creditsRemaining.title")}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-bold text-primary">
                            {user.subscription?.credits?.remaining || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            / {user.subscription?.credits?.plan || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Details card */}
              <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground text-lg">
                      {t("mediaDetail.details.title")}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        {t("mediaDetail.details.fileType")}
                      </span>
                      <Badge variant="secondary" className="font-medium">
                        {formatFileType(imageData.file_type)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        {t("mediaDetail.details.provider")}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {imageData.provider}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        {t("mediaDetail.details.mediaId")}
                      </span>
                      <span className="text-xs font-mono bg-muted px-2 py-1 rounded border">
                        {imageData.file_id}
                      </span>
                    </div>
                    {imageData.width && imageData.height && (
                      <div className="flex justify-between items-center py-2 border-b border-border/30">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          {t("mediaDetail.details.dimensions")}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {imageData.width} × {imageData.height}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        {t("mediaDetail.details.format")}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {imageData.image_type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. High resolution view card */}
              {fileData && isHighResolutionAvailable(fileData) && (
                <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                  <div className="p-6">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      {isAudioItem() ? (
                        <AudioLines className="w-4 h-4 text-primary" />
                      ) : isVideoItem() ? (
                        <VideoIcon className="w-4 h-4 text-primary" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-primary" />
                      )}
                      {isAudioItem()
                        ? t("mediaDetail.highResolution.titleAudio")
                        : t("mediaDetail.highResolution.title")}
                    </h3>
                    <div className="space-y-3">
                      {/* Only show dimensions and aspect ratio for images and videos, not audio */}
                      {!isAudioItem() && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {t("mediaDetail.highResolution.dimensions")}:
                            </span>
                            <Badge variant="outline" className="font-mono">
                              {fileData?.high_resolution?.width} ×{" "}
                              {fileData?.high_resolution?.height}
                            </Badge>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {t("mediaDetail.highResolution.aspectRatio")}:
                            </span>
                            <span className="text-sm font-medium">
                              {fileData?.high_resolution?.width &&
                              fileData?.high_resolution?.height
                                ? (
                                    (typeof fileData.high_resolution.width ===
                                    "string"
                                      ? parseInt(
                                          fileData.high_resolution.width,
                                          10
                                        )
                                      : fileData.high_resolution.width) /
                                    (typeof fileData.high_resolution.height ===
                                    "string"
                                      ? parseInt(
                                          fileData.high_resolution.height,
                                          10
                                        )
                                      : fileData.high_resolution.height)
                                  ).toFixed(2)
                                : "N/A"}
                              :1
                            </span>
                          </div>
                        </>
                      )}

                      {/* Only show total pixels for images and videos, not audio */}
                      {!isAudioItem() && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {t("mediaDetail.highResolution.totalPixels")}:
                          </span>
                          <span className="text-sm font-medium">
                            {fileData?.high_resolution?.width &&
                            fileData?.high_resolution?.height
                              ? (
                                  ((typeof fileData.high_resolution.width ===
                                  "string"
                                    ? parseInt(
                                        fileData.high_resolution.width,
                                        10
                                      )
                                    : fileData.high_resolution.width) *
                                    (typeof fileData.high_resolution.height ===
                                    "string"
                                      ? parseInt(
                                          fileData.high_resolution.height,
                                          10
                                        )
                                      : fileData.high_resolution.height)) /
                                  1000000
                                ).toFixed(1)
                              : "N/A"}
                            MP
                          </span>
                        </div>
                      )}

                      <div className="pt-2">
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => setIsFullImageOpen(true)}
                        >
                          <Eye className="w-4 h-4" />
                          {isAudioItem()
                            ? t("mediaDetail.highResolution.viewAudio")
                            : isVideoItem()
                              ? t("mediaDetail.highResolution.viewVideo")
                              : t("mediaDetail.highResolution.viewImage")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Actions card */}
              <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    {t("mediaDetail.actions.title")}
                  </h3>
                  <div className="space-y-3">
                    {/* Copy Link Button */}
                    <Button
                      variant="outline"
                      onClick={() => {
                        const pageUrl = window.location.href;
                        navigator.clipboard.writeText(pageUrl).then(() => {
                          import("sonner").then(({ toast }) => {
                            toast.success(t("mediaDetail.copyLink.success"));
                          });
                        });
                      }}
                      className="w-full justify-start border-border/50 hover:bg-muted/50"
                    >
                      <Copy className="w-4 h-4" />
                      {t("mediaDetail.actions.copyLink")}
                    </Button>

                    {/* External Link Button */}
                    <Button
                      variant="outline"
                      className="w-full justify-start border-border/50 hover:bg-muted/50"
                      asChild
                    >
                      <a
                        href={imageData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {t("mediaDetail.actions.viewOnProvider", {
                          provider: imageData.provider,
                        })}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* 7. Keywords card */}
              {fileData &&
                fileData.keywords &&
                fileData.keywords.length > 0 && (
                  <div className="bg-card dark:bg-card/50 border border-border/50 rounded-xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-foreground text-lg">
                            {t("mediaDetail.keywords.title")}
                          </h3>
                        </div>
                        <Badge variant="outline">
                          {fileData.keywords.length}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(showAllKeywords
                          ? fileData.keywords
                          : fileData.keywords.slice(0, 8)
                        ).map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs px-3 py-1.5 hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer border border-border/30"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      {fileData.keywords.length > 8 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAllKeywords(!showAllKeywords)}
                          className="mt-4 text-primary hover:text-primary/80 hover:bg-primary/5"
                        >
                          {showAllKeywords
                            ? t("mediaDetail.keywords.showLess")
                            : t("mediaDetail.keywords.showMore")}
                          <ArrowLeft
                            className={`w-4 h-4 ml-2 transition-transform duration-200 ${showAllKeywords ? "rotate-90" : "-rotate-90"}`}
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                )}

              {/* 8. Related files section at the bottom */}
              <RelatedFilesSection
                fileData={fileData}
                imageData={imageData}
                isValidVideoUrl={isValidVideoUrl}
                getVideoMimeType={getVideoMimeType}
                isValidAudioUrl={isValidAudioUrl}
                getAudioMimeType={getAudioMimeType}
              />
            </div>

            {/* Desktop Layout: Keep the current layout exactly as it is now */}
            <div
              className={`hidden xl:grid xl:grid-cols-5 gap-8 ${isRTL ? "xl:grid-flow-col-dense" : ""}`}
            >
              {/* Media Display Section */}
              <div className={`xl:col-span-3 ${isRTL ? "xl:order-2" : ""}`}>
                <div className="bg-card dark:bg-card/50 rounded-xl border border-border/50 overflow-hidden">
                  {/* Provider Header */}
                  <div
                    className={`flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-muted/30 to-muted/10 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <div className="relative">
                        <div className="w-14 h-14 flex items-center justify-center">
                          <img
                            src={imageData.providerIcon}
                            alt={imageData.provider}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<Globe class="w-5 h-5 text-muted-foreground" />`;
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <h2 className="font-semibold text-foreground text-sm">
                          {imageData.provider}
                        </h2>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5"
                      >
                        {formatFileType(imageData.file_type)}
                      </Badge>
                    </div>
                  </div>

                  {/* Media Display */}
                  <div
                    className="relative bg-gradient-to-br from-muted/20 to-muted/5 flex items-center justify-center"
                    style={{ maxHeight: "650px", minHeight: "400px" }}
                  >
                    {/* Video Loading Indicator */}
                    {isVideoItem() && isVideoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 rounded-lg">
                        <div className="flex items-center gap-3 bg-black/80 text-white px-6 py-3 rounded-xl">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-medium">
                            {t("mediaDetail.loading.title")}
                          </span>
                        </div>
                      </div>
                    )}

                    {isAudioItem() ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-6">
                        {/* Audio Icon */}
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                          <AudioLines className="w-12 h-12 text-primary" />
                        </div>

                        {/* Audio Title */}
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {imageData.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t("mediaDetail.audioPlayer.clickToPlay")}
                          </p>
                        </div>

                        {/* Audio Player */}
                        <audio
                          key={
                            fileData?.high_resolution?.src ||
                            imageData.thumbnail
                          }
                          className="w-full max-w-md"
                          controls
                          controlsList="nodownload"
                          preload="auto"
                          style={{ height: "40px" }}
                          onLoadStart={() => setIsAudioLoading(true)}
                          onCanPlay={() => setIsAudioLoading(false)}
                          onLoadedData={() => setIsAudioLoading(false)}
                          onLoadedMetadata={() => setIsAudioLoading(false)}
                          onError={() => setIsAudioLoading(false)}
                          onWaiting={() => setIsAudioLoading(true)}
                          onPlaying={() => setIsAudioLoading(false)}
                        >
                          <source
                            src={getProxyAudioUrl(
                              fileData?.high_resolution?.src ||
                                imageData.thumbnail
                            )}
                            type={getAudioMimeType(
                              fileData?.high_resolution?.src ||
                                imageData.thumbnail
                            )}
                          />
                          {/* Fallback message for browsers that don't support audio */}
                          <p className="text-muted-foreground text-center p-4">
                            {t("mediaDetail.audioPlayer.browserNotSupported")}
                            <a
                              href={getProxyAudioUrl(
                                fileData?.high_resolution?.src ||
                                  imageData.thumbnail
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline ml-1"
                            >
                              {t("mediaDetail.audioPlayer.downloadAudio")}
                            </a>
                          </p>
                        </audio>
                      </div>
                    ) : isVideoItem() &&
                      isValidVideoUrl(imageData.thumbnail) ? (
                      <video
                        className="w-full h-full object-contain rounded-lg"
                        poster={imageData.poster || "/placeholder.png"}
                        controls
                        controlsList="nodownload"
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        crossOrigin="anonymous"
                        style={{
                          maxHeight: "650px",
                          width: "100%",
                          height: "auto",
                        }}
                        onLoadedData={async (e) => {
                          const video = e.target as HTMLVideoElement;
                          setIsVideoLoading(false);
                          try {
                            video.currentTime = 1;
                            await new Promise((resolve) => {
                              video.onseeked = resolve;
                            });
                            const thumbnailUrl =
                              await generateVideoThumbnail(video);
                            video.poster = thumbnailUrl;
                          } catch (error) {
                            console.warn(
                              "Failed to generate video thumbnail:",
                              error
                            );
                          }
                        }}
                        onError={(e) => {
                          console.warn("Video load error, showing as image");
                          setIsVideoLoading(false);
                          const video = e.target as HTMLVideoElement;
                          video.style.display = "none";
                          const container = video.parentElement;
                          if (container) {
                            const fallbackImg = document.createElement("img");
                            fallbackImg.src = imageData.thumbnail;
                            fallbackImg.alt = imageData.title;
                            fallbackImg.className =
                              "w-full h-full object-contain max-h-[65vh]";
                            container.appendChild(fallbackImg);
                          }
                        }}
                        onCanPlay={() => {
                          console.log("Video can start playing");
                          setIsVideoLoading(false);
                        }}
                        onLoadStart={() => {
                          console.log("Video load started");
                          setIsVideoLoading(true);
                        }}
                        onWaiting={() => {
                          setIsVideoLoading(true);
                        }}
                        onPlaying={() => {
                          setIsVideoLoading(false);
                        }}
                      >
                        {/* Multiple source elements for better browser compatibility */}
                        <source
                          src={imageData.thumbnail}
                          type={getVideoMimeType(imageData.thumbnail)}
                        />
                        {/* Fallback message for browsers that don't support video */}
                        <p className="text-muted-foreground text-center p-4">
                          Your browser does not support the video tag.
                          <a
                            href={imageData.thumbnail}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline ml-1"
                          >
                            Download the video
                          </a>
                        </p>
                      </video>
                    ) : (
                      <img
                        src={imageData.thumbnail}
                        alt={imageData.title}
                        className="w-full h-full object-contain cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                        style={{
                          maxHeight: "650px",
                          width: "100%",
                          height: "auto",
                        }}
                        onClick={() => setIsFullImageOpen(true)}
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = "/placeholder.png";
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Keywords Section - Moved below main image */}
                {fileData &&
                  fileData.keywords &&
                  fileData.keywords.length > 0 && (
                    <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden mt-6">
                      <div className="p-6">
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="flex items-center gap-2">
                            <Tag className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-foreground text-lg">
                              {t("mediaDetail.keywords.title")}
                            </h3>
                          </div>
                          <Badge variant="outline">
                            {fileData.keywords.length}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(showAllKeywords
                            ? fileData.keywords
                            : fileData.keywords.slice(0, 8)
                          ).map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs px-3 py-1.5 hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer border border-border/30"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                        {fileData.keywords.length > 8 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAllKeywords(!showAllKeywords)}
                            className="mt-4 text-primary hover:text-primary/80 hover:bg-primary/5"
                          >
                            {showAllKeywords
                              ? t("mediaDetail.keywords.showLess")
                              : t("mediaDetail.keywords.showMore")}
                            <ArrowLeft
                              className={`w-4 h-4 ml-2 transition-transform duration-200 ${showAllKeywords ? "rotate-90" : "-rotate-90"}`}
                            />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Sidebar - Details and Actions */}
              <div
                className={`xl:col-span-2 space-y-6 ${isRTL ? "xl:order-1" : ""}`}
              >
                {/* Title and Basic Info Card */}
                <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-foreground mb-3 leading-tight">
                      {imageData.title}
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Hash className="w-4 h-4" />
                        <span className="font-mono">{imageData.file_id}</span>
                      </div>
                      {imageData.width && imageData.height && (
                        <div className="flex items-center gap-1">
                          <Monitor className="w-4 h-4" />
                          <span>
                            {imageData.width} × {imageData.height}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div
                      className={`grid ${isAudioItem() ? "grid-cols-1" : "grid-cols-2"} gap-3`}
                    >
                      <Button
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                        onClick={handleDownload}
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        {isDownloading
                          ? t("mediaDetail.actions.downloading")
                          : t("mediaDetail.actions.download")}
                      </Button>
                      {!isAudioItem() && (
                        <Button onClick={() => setIsFullImageOpen(true)}>
                          <Eye className="w-4 h-4" />
                          {isVideoItem()
                            ? t("mediaDetail.actions.viewFullVideo")
                            : t("mediaDetail.actions.viewFullImage")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* User Profile Card */}
                {isAuthenticated && user && (
                  <div className="bg-card dark:bg-card/50 border border-primary/50 dark:border-primary/20 rounded-xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-foreground text-lg">
                          {t("profile.title")}
                        </h3>
                      </div>

                      <div className="space-y-4">
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
                              className={`flex items-center gap-1 text-sm text-muted-foreground`}
                            >
                              <Mail className="w-3 h-3" />
                              <span className="truncate">
                                {user.account?.email}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Subscription Plan */}
                        <div className="flex justify-between items-center py-2 border-b border-border/80">
                          <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            {t("profile.subscription.currentPlan")}
                          </span>
                          <div className="px-2 py-1 bg-primary/10 border border-primary/20 rounded-md">
                            <span className="text-xs font-semibold text-primary">
                              {user.subscription?.plan || "Free"}
                            </span>
                          </div>
                        </div>

                        {/* Credit Balance */}
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <Coins className="w-4 h-4" />
                            {t("profile.stats.creditsRemaining.title")}
                          </span>
                          <div className="flex items-center gap-2 text-right">
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
                  </div>
                )}

                {/* Details Card */}
                <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground text-lg">
                        {t("mediaDetail.details.title")}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border/80">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          {t("mediaDetail.details.fileType")}
                        </span>
                        <Badge variant="secondary" className="font-medium">
                          {formatFileType(imageData.file_type)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/80">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          {t("mediaDetail.details.provider")}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {imageData.provider}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/80">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          {t("mediaDetail.details.mediaId")}
                        </span>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded border">
                          {imageData.file_id}
                        </span>
                      </div>
                      {imageData.width && imageData.height && (
                        <div className="flex justify-between items-center py-2 border-b border-border/80">
                          <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            {t("mediaDetail.details.dimensions")}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {imageData.width} × {imageData.height}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Palette className="w-4 h-4" />
                          {t("mediaDetail.details.format")}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {imageData.image_type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Provider Data Loading */}
                {isProviderDataLoading && (
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <h3 className="font-semibold text-foreground">
                        {t("mediaDetail.providerData.loadingTitle")}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {/* Keywords Loading */}
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <div className="flex flex-wrap gap-1">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton
                              key={i}
                              className="h-6 w-16 rounded-full"
                            />
                          ))}
                        </div>
                      </div>

                      {/* High Resolution Loading */}
                      <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      </div>

                      {/* Related Files Loading */}
                      <div>
                        <Skeleton className="h-4 w-28 mb-2" />
                        <div className="space-y-2">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className="flex gap-3 p-3 border rounded-lg"
                            >
                              <Skeleton className="w-16 h-16 rounded-lg" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-2/3" />
                                <Skeleton className="h-6 w-20" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {providerDataError && (
                  <div className="p-4 border-b border-border">
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-destructive mb-1">
                            {t("mediaDetail.providerData.errorTitle")}
                          </h4>
                          <p className="text-sm text-destructive/80">
                            {providerDataError}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 h-8 text-xs border-destructive/20 hover:bg-destructive/5"
                            onClick={() =>
                              imageData && fetchProviderData(imageData)
                            }
                          >
                            {t("mediaDetail.providerData.retryButton")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {fileData && (
                  <>
                    {/* High Resolution Info - Only show when data is available */}
                    {isHighResolutionAvailable(fileData) && (
                      <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                        <div className="p-6">
                          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            {isAudioItem() ? (
                              <AudioLines className="w-4 h-4 text-primary" />
                            ) : isVideoItem() ? (
                              <VideoIcon className="w-4 h-4 text-primary" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-primary" />
                            )}
                            {isAudioItem()
                              ? t("mediaDetail.highResolution.titleAudio")
                              : t("mediaDetail.highResolution.title")}
                          </h3>
                          <div className="space-y-3">
                            {/* Only show dimensions and aspect ratio for images and videos, not audio */}
                            {!isAudioItem() && (
                              <>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    {t("mediaDetail.highResolution.dimensions")}
                                    :
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="font-mono"
                                  >
                                    {fileData?.high_resolution?.width} ×{" "}
                                    {fileData?.high_resolution?.height}
                                  </Badge>
                                </div>

                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    {t(
                                      "mediaDetail.highResolution.aspectRatio"
                                    )}
                                    :
                                  </span>
                                  <span className="text-sm font-medium">
                                    {fileData?.high_resolution?.width &&
                                    fileData?.high_resolution?.height
                                      ? (
                                          (typeof fileData.high_resolution
                                            .width === "string"
                                            ? parseInt(
                                                fileData.high_resolution.width,
                                                10
                                              )
                                            : fileData.high_resolution.width) /
                                          (typeof fileData.high_resolution
                                            .height === "string"
                                            ? parseInt(
                                                fileData.high_resolution.height,
                                                10
                                              )
                                            : fileData.high_resolution.height)
                                        ).toFixed(2)
                                      : "N/A"}
                                    :1
                                  </span>
                                </div>
                              </>
                            )}

                            {/* Only show total pixels for images and videos, not audio */}
                            {!isAudioItem() && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                  {t("mediaDetail.highResolution.totalPixels")}:
                                </span>
                                <span className="text-sm font-medium">
                                  {fileData?.high_resolution?.width &&
                                  fileData?.high_resolution?.height
                                    ? (
                                        ((typeof fileData.high_resolution
                                          .width === "string"
                                          ? parseInt(
                                              fileData.high_resolution.width,
                                              10
                                            )
                                          : fileData.high_resolution.width) *
                                          (typeof fileData.high_resolution
                                            .height === "string"
                                            ? parseInt(
                                                fileData.high_resolution.height,
                                                10
                                              )
                                            : fileData.high_resolution
                                                .height)) /
                                        1000000
                                      ).toFixed(1)
                                    : "N/A"}
                                  MP
                                </span>
                              </div>
                            )}

                            <div className="pt-2">
                              <Button
                                size="sm"
                                className="w-full"
                                onClick={() => setIsFullImageOpen(true)}
                              >
                                <Eye className="w-4 h-4" />
                                {isAudioItem()
                                  ? t("mediaDetail.highResolution.viewAudio")
                                  : isVideoItem()
                                    ? t("mediaDetail.highResolution.viewVideo")
                                    : t("mediaDetail.highResolution.viewImage")}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Additional Actions Card */}
                <div className="bg-card dark:bg-card/50 border border-primary/40 dark:border-primary/20 rounded-xl overflow-hidden">
                  <div className="p-6">
                    <h3 className="font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      {t("mediaDetail.actions.title")}
                    </h3>
                    <div className="space-y-3">
                      {/* Copy Link Button */}
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          const pageUrl = window.location.href;
                          navigator.clipboard.writeText(pageUrl).then(() => {
                            import("sonner").then(({ toast }) => {
                              toast.success(t("mediaDetail.copyLink.success"));
                            });
                          });
                        }}
                      >
                        <Copy className="w-4 h-4" />
                        {t("mediaDetail.actions.copyLink")}
                      </Button>

                      {/* External Link Button */}
                      <Button
                        className="w-full justify-start"
                        asChild
                        variant="outline"
                      >
                        <a
                          href={imageData.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {t("mediaDetail.actions.viewOnProvider", {
                            provider: imageData.provider,
                          })}
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Related Files Section - Moved below keywords with new layout */}
          <RelatedFilesSection
            fileData={fileData}
            imageData={imageData}
            isValidVideoUrl={isValidVideoUrl}
            getVideoMimeType={getVideoMimeType}
            isValidAudioUrl={isValidAudioUrl}
            getAudioMimeType={getAudioMimeType}
            className="mt-6 hidden xl:grid"
          />
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Full Screen Media Dialog */}
      <Dialog open={isFullImageOpen} onOpenChange={setIsFullImageOpen}>
        <DialogTitle className="sr-only">
          {isVideoItem()
            ? t("mediaDetail.mediaViewer.fullScreenTitle")
            : t("mediaDetail.mediaViewer.fullScreenTitle")}
        </DialogTitle>
        <DialogContent
          className="!max-w-[95vw] !max-h-[95vh] w-full h-full p-0 overflow-hidden border-none rounded-xl bg-black/95"
          showCloseButton={false}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullImageOpen(false)}
              className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-20 w-10 h-10 p-0 bg-black/50 hover:bg-black/70 text-white hover:text-white border rounded-none border-white/40`}
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Video Loading Indicator for Full Screen */}
            {isVideoItem() && isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-15">
                <div className="flex items-center gap-2 bg-black/80 text-white px-6 py-3 rounded-lg">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>
                    {t("mediaDetail.videoPlayer.fullScreenLoadingVideo")}
                  </span>
                </div>
              </div>
            )}

            {/* Full Size Media */}
            {isAudioItem() ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-8 bg-gradient-to-br from-background/95 to-muted/50">
                {/* Audio Icon */}
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                  <AudioLines className="w-16 h-16 text-primary" />
                </div>

                {/* Audio Title */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    {imageData.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("mediaDetail.audioPlayer.clickToPlay")}
                  </p>
                </div>

                {/* Audio Player */}
                <audio
                  key={fileData?.high_resolution?.src || imageData.thumbnail}
                  className="w-full max-w-lg"
                  controls
                  controlsList="nodownload"
                  preload="auto"
                  style={{ height: "54px" }}
                  onLoadStart={() => setIsAudioLoading(true)}
                  onCanPlay={() => setIsAudioLoading(false)}
                  onLoadedData={() => setIsAudioLoading(false)}
                  onLoadedMetadata={() => setIsAudioLoading(false)}
                  onError={() => setIsAudioLoading(false)}
                  onWaiting={() => setIsAudioLoading(true)}
                  onPlaying={() => setIsAudioLoading(false)}
                >
                  {/* Try high resolution audio first if available */}
                  {isHighResolutionAvailable(fileData) &&
                    isValidAudioUrl(fileData!.high_resolution!.src) && (
                      <source
                        src={getProxyAudioUrl(fileData!.high_resolution!.src)}
                        type={getAudioMimeType(fileData!.high_resolution!.src)}
                      />
                    )}
                  <source
                    src={getProxyAudioUrl(imageData.thumbnail)}
                    type={getAudioMimeType(imageData.thumbnail)}
                  />
                  {/* Fallback message for browsers that don't support audio */}
                  <p className="text-foreground text-center p-4">
                    {t("mediaDetail.audioPlayer.browserNotSupported")}
                    <a
                      href={getProxyAudioUrl(
                        isHighResolutionAvailable(fileData)
                          ? fileData!.high_resolution!.src
                          : imageData.thumbnail
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline ml-1"
                    >
                      {t("mediaDetail.audioPlayer.downloadAudio")}
                    </a>
                  </p>
                </audio>
              </div>
            ) : isVideoItem() && isValidVideoUrl(imageData.thumbnail) ? (
              <video
                className="max-w-full max-h-full object-contain"
                poster={imageData.poster || "/placeholder.png"}
                controls
                controlsList="nodownload"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.warn(
                    "Full screen video load error, showing as image"
                  );
                  setIsVideoLoading(false);
                  const video = e.target as HTMLVideoElement;
                  video.style.display = "none";
                  const container = video.parentElement;
                  if (container) {
                    const fallbackImg = document.createElement("img");
                    // Use high resolution image if available, otherwise fallback to thumbnail
                    const imgSrc = isHighResolutionAvailable(fileData)
                      ? fileData!.high_resolution!.src
                      : imageData.thumbnail;
                    fallbackImg.src = imgSrc;
                    fallbackImg.alt = imageData.title;
                    fallbackImg.className =
                      "max-w-full max-h-full object-contain";
                    fallbackImg.onerror = () => {
                      fallbackImg.src = "/placeholder.png";
                    };
                    container.appendChild(fallbackImg);
                  }
                }}
                onCanPlay={() => {
                  console.log("Full screen video can start playing");
                  setIsVideoLoading(false);
                }}
                onLoadStart={() => {
                  console.log("Full screen video load started");
                  setIsVideoLoading(true);
                }}
                onPlay={() => {
                  console.log("Full screen video started playing");
                  setIsVideoLoading(false);
                }}
                onPause={() => {
                  console.log("Full screen video paused");
                }}
                onWaiting={() => {
                  setIsVideoLoading(true);
                }}
                onPlaying={() => {
                  setIsVideoLoading(false);
                }}
                onLoadedData={() => {
                  setIsVideoLoading(false);
                }}
              >
                {/* Multiple source elements for better browser compatibility */}
                {/* Try high resolution video first if available */}
                {isHighResolutionAvailable(fileData) &&
                  isValidVideoUrl(fileData!.high_resolution!.src) && (
                    <source
                      src={fileData!.high_resolution!.src}
                      type={getVideoMimeType(fileData!.high_resolution!.src)}
                    />
                  )}
                <source
                  src={imageData.thumbnail}
                  type={getVideoMimeType(imageData.thumbnail)}
                />
                {/* Fallback message for browsers that don't support video */}
                <p className="text-white text-center p-4">
                  {t("mediaDetail.videoPlayer.fullScreenBrowserNotSupported")}
                  <a
                    href={
                      isHighResolutionAvailable(fileData)
                        ? fileData!.high_resolution!.src
                        : imageData.thumbnail
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline ml-1"
                  >
                    {t("mediaDetail.videoPlayer.fullScreenDownloadVideo")}
                  </a>
                </p>
              </video>
            ) : (
              <img
                src={
                  isHighResolutionAvailable(fileData)
                    ? fileData!.high_resolution!.src
                    : imageData.thumbnail
                }
                alt={imageData.title}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  // Fallback to thumbnail if high resolution fails
                  if (img.src !== imageData.thumbnail) {
                    img.src = imageData.thumbnail;
                  } else {
                    img.src = "/placeholder.png";
                  }
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
