"use client";

import { Badge } from "@/components/ui/badge";
import { VideoIcon, AudioLines, Headphones, Volume2 } from "lucide-react";
import { RelatedFile } from "@/lib/api";

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

interface RelatedFilesCardProps {
  related: RelatedFile;
  index: number;
  imageData: SearchResult;
  isValidVideoUrl: (url: string) => boolean;
  getVideoMimeType: (url: string) => string;
  isValidAudioUrl?: (url: string) => boolean;
  getAudioMimeType?: (url: string) => string;
}

export function RelatedFilesCard({
  related,
  index,
  imageData,
  isValidVideoUrl,
  getVideoMimeType,
  isValidAudioUrl,
}: RelatedFilesCardProps) {
  // Use passed audio detection function or fallback to local implementation
  const checkIsValidAudioUrl =
    isValidAudioUrl ||
    ((url: string): boolean => {
      if (!url) return false;
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
        ".webm",
      ];
      const hasAudioExtension = audioExtensions.some((ext) =>
        url.toLowerCase().includes(ext)
      );
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
    });

  // Determine file type based on URL patterns
  const determineFileType = (): string => {
    const url = related.preview.src || related.url || "";
    if (checkIsValidAudioUrl(url)) return "audio";
    if (isValidVideoUrl(url)) return "video";
    return "image";
  };

  const detectedFileType = determineFileType();

  // Create a mock SearchResult for navigation
  const relatedSearchResult: SearchResult = {
    id: related.file_id,
    title: related.metadata.title,
    thumbnail: related.preview.src,
    provider: imageData.provider,
    type: imageData.type,
    file_type: detectedFileType, // Use detected file type
    width: related.preview.width || null,
    height: related.preview.height || null,
    url: related.url,
    file_id: related.file_id,
    image_type: imageData.image_type,
    poster: related.preview.src,
    providerIcon: imageData.providerIcon,
  };

  // Check if this related item is a video or audio
  const isRelatedVideo = detectedFileType === "video";
  const isRelatedAudio = detectedFileType === "audio";

  const handleClick = () => {
    // Store the related file data and navigate
    localStorage.setItem(
      `image_${related.file_id}`,
      JSON.stringify(relatedSearchResult)
    );
    window.location.href = `/media/${related.file_id}`;
  };

  return (
    <div
      key={index}
      className={`group relative bg-card rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
        isRelatedAudio
          ? "border border-primary/50 shadow-sm hover:border-primary hover:shadow-md"
          : "border border-border hover:border-primary/50 shadow-sm"
      }`}
      onClick={handleClick}
    >
      {/* Media Preview */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {isRelatedAudio ? (
          /* Audio Card Design - Same as search page */
          <div className="w-full h-full bg-gradient-to-br from-primary/5 via-accent/10 to-primary/10 dark:from-primary/10 dark:via-accent/20 dark:to-primary/15 flex flex-col items-center justify-center p-4 space-y-2">
            {/* Audio Icon with Animation */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                <AudioLines className="w-5 h-5 text-primary-foreground" />
              </div>
              {/* Animated Sound Waves */}
              <div className="absolute -inset-1 opacity-30">
                <div className="w-12 h-12 border-2 border-primary/40 rounded-full animate-ping"></div>
              </div>
              <div className="absolute -inset-2 opacity-20">
                <div
                  className="w-14 h-14 border-2 border-primary/30 rounded-full animate-ping"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
            </div>

            {/* Audio Label */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Headphones className="w-3 h-3" />
                Audio
              </p>
            </div>

            {/* Audio Waveform Visual */}
            <div className="flex items-center justify-center gap-0.5 opacity-60">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 bg-gradient-to-t from-primary/60 to-primary rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 10 + 4}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: "1.5s",
                  }}
                />
              ))}
            </div>

            {/* Audio Badge */}
            <div className="absolute top-2 left-2">
              <Badge
                variant="secondary"
                className="text-xs bg-primary/90 text-white border-none shadow-sm"
              >
                <Volume2 className="w-3 h-3 mr-1" />
                Audio
              </Badge>
            </div>
          </div>
        ) : isRelatedVideo ? (
          <>
            {/* Video with poster */}
            <video
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              poster={related.preview.src}
              muted
              playsInline
              preload="metadata"
              onError={(e) => {
                // Fallback to image if video fails
                const video = e.target as HTMLVideoElement;
                const container = video.parentElement;
                if (container) {
                  video.style.display = "none";
                  const fallbackImg = document.createElement("img");
                  fallbackImg.src = related.preview.src;
                  fallbackImg.alt = related.metadata.title;
                  fallbackImg.className =
                    "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300";
                  fallbackImg.onerror = () => {
                    fallbackImg.src = "/placeholder.png";
                  };
                  container.appendChild(fallbackImg);
                }
              }}
            >
              <source
                src={related.preview.src}
                type={getVideoMimeType(related.preview.src)}
              />
            </video>

            {/* Video Play Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
              <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center group-hover:bg-black/80 transition-colors duration-300">
                <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
              </div>
            </div>

            {/* Video Badge */}
            <div className="absolute top-2 left-2">
              <Badge
                variant="secondary"
                className="text-xs bg-destructive/90 text-white border-none shadow-sm"
              >
                <VideoIcon className="w-3 h-3 mr-1" />
                Video
              </Badge>
            </div>
          </>
        ) : (
          <>
            {/* Regular Image */}
            <img
              src={related.preview.src}
              alt={related.metadata.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.png";
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors text-sm">
          {related.metadata.title}
        </h4>
        <div className="flex items-center gap-2 mb-2">
          {related.preview.width && related.preview.height && (
            <Badge variant="secondary" className="text-xs">
              {related.preview.width} × {related.preview.height}
            </Badge>
          )}
        </div>
        {related.metadata.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {related.metadata.description}
          </p>
        )}
      </div>
    </div>
  );
}
