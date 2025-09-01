"use client";

import { useTranslation } from "react-i18next";
import { Layers } from "lucide-react";
import { FileData } from "@/lib/api";
import { RelatedFilesCard } from "./related-files-card";
import { useState } from "react";

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

interface RelatedFilesSectionProps {
  fileData: FileData | null;
  imageData: SearchResult;
  isValidVideoUrl: (url: string) => boolean;
  getVideoMimeType: (url: string) => string;
  isValidAudioUrl?: (url: string) => boolean;
  getAudioMimeType?: (url: string) => string;
  className?: string;
}

export function RelatedFilesSection({
  fileData,
  imageData,
  isValidVideoUrl,
  getVideoMimeType,
  isValidAudioUrl,
  getAudioMimeType,
  className = "",
}: RelatedFilesSectionProps) {
  const { t } = useTranslation("common");
  const [, setHoveredImage] = useState<string | null>(null);

  // Don't render if no related files
  if (!fileData || !fileData.related || fileData.related.length === 0) {
    return null;
  }

  // Transform related files to SearchResult format for grid layout
  const transformedResults: SearchResult[] = fileData.related.map((related, index) => {
    const url = related.preview.src || related.url || "";
    let detectedFileType = "image";
    
    if (isValidAudioUrl && isValidAudioUrl(url)) {
      detectedFileType = "audio";
    } else if (isValidVideoUrl(url)) {
      detectedFileType = "video";
    }

    return {
      id: `${related.file_id}-${index}`,
      title: related.metadata.title,
      thumbnail: related.preview.src,
      provider: imageData.provider,
      type: imageData.type,
      file_type: detectedFileType,
      width: related.preview.width || null,
      height: related.preview.height || null,
      url: related.url,
      file_id: related.file_id,
      image_type: imageData.image_type,
      poster: related.preview.src,
      providerIcon: imageData.providerIcon,
    };
  });

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

  // Create dynamic grid rows based on actual image dimensions and aspect ratios
  const createDynamicGridRows = (results: SearchResult[]) => {
    const rows: SearchResult[][] = [];
    let currentIndex = 0;

    while (currentIndex < results.length) {
      const currentRow: SearchResult[] = [];
      let totalWidth = 0;
      const containerWidth = 100; // Percentage-based container width
      const maxItemsPerRow = 6;

      // Build row by filling available space optimally
      for (
        let i = currentIndex;
        i < results.length && currentRow.length < maxItemsPerRow;
        i++
      ) {
        const result = results[i];
        const dimensions = getFallbackDimensions(result);
        let aspectRatio = dimensions.width / dimensions.height;

        // Force PNG files to have 1:1 aspect ratio (except wide PNGs > 420px)
        const isPNG =
          result.file_type === "PNG" ||
          (result.file_type === "image" &&
            result.thumbnail?.toLowerCase().includes(".png")) ||
          result.thumbnail?.toLowerCase().endsWith(".png");
        const apiWidth = parseInt(String(result.width)) || dimensions.width;
        const isWidePNG = isPNG && apiWidth > 420;
        if (isPNG && !isWidePNG) {
          aspectRatio = 1.0;
        }

        // Calculate relative width based on aspect ratio
        let relativeWidth;
        if (aspectRatio >= 8.0) {
          relativeWidth = 60; // Extreme panoramic banners
        } else if (aspectRatio >= 7.0) {
          relativeWidth = 58; // Ultra wide banners
        } else if (aspectRatio >= 6.0) {
          relativeWidth = 56; // Super wide banners
        } else if (aspectRatio >= 5.5) {
          relativeWidth = 54; // Very wide banners
        } else if (aspectRatio >= 5.0) {
          relativeWidth = 52; // Wide banners
        } else if (aspectRatio >= 4.5) {
          relativeWidth = 51; // Panoramic ultra wide
        } else if (aspectRatio >= 4.0) {
          relativeWidth = 50; // Ultra wide panoramic
        } else if (aspectRatio >= 3.8) {
          relativeWidth = 49; // Very wide panoramic
        } else if (aspectRatio >= 3.6) {
          relativeWidth = 48; // Wide panoramic
        } else if (aspectRatio >= 3.4) {
          relativeWidth = 47; // Panoramic landscape
        } else if (aspectRatio >= 3.2) {
          relativeWidth = 46; // Extra wide landscape
        } else if (aspectRatio >= 3.0) {
          relativeWidth = 45; // Very wide landscape
        } else if (aspectRatio >= 2.9) {
          relativeWidth = 44; // Wide landscape plus
        } else if (aspectRatio >= 2.8) {
          relativeWidth = 43; // Wide landscape
        } else if (aspectRatio >= 2.7) {
          relativeWidth = 42; // Standard wide plus
        } else if (aspectRatio >= 2.6) {
          relativeWidth = 41; // Standard wide
        } else if (aspectRatio >= 2.5) {
          relativeWidth = 40; // Medium wide plus
        } else if (aspectRatio >= 2.4) {
          relativeWidth = 39; // Medium wide
        } else if (aspectRatio >= 2.3) {
          relativeWidth = 38; // Landscape wide
        } else if (aspectRatio >= 2.2) {
          relativeWidth = 37; // Landscape medium
        } else if (aspectRatio >= 2.1) {
          relativeWidth = 36; // Landscape standard
        } else if (aspectRatio >= 2.0) {
          relativeWidth = 35; // Classic wide
        } else if (aspectRatio >= 1.95) {
          relativeWidth = 34; // Nearly 2:1
        } else if (aspectRatio >= 1.9) {
          relativeWidth = 33; // Wide landscape
        } else if (aspectRatio >= 1.85) {
          relativeWidth = 32; // Medium landscape plus
        } else if (aspectRatio >= 1.8) {
          relativeWidth = 31; // Medium landscape
        } else if (aspectRatio >= 1.75) {
          relativeWidth = 30; // Landscape mild plus
        } else if (aspectRatio >= 1.7) {
          relativeWidth = 29; // Landscape mild
        } else if (aspectRatio >= 1.65) {
          relativeWidth = 28; // Slightly wide plus
        } else if (aspectRatio >= 1.6) {
          relativeWidth = 27; // Slightly wide
        } else if (aspectRatio >= 1.55) {
          relativeWidth = 26; // Classic landscape plus
        } else if (aspectRatio >= 1.5) {
          relativeWidth = 25; // Classic landscape
        } else if (aspectRatio >= 1.45) {
          relativeWidth = 24; // Mild landscape plus
        } else if (aspectRatio >= 1.4) {
          relativeWidth = 23; // Mild landscape
        } else if (aspectRatio >= 1.35) {
          relativeWidth = 22; // Light landscape plus
        } else if (aspectRatio >= 1.3) {
          relativeWidth = 21; // Light landscape
        } else if (aspectRatio >= 1.25) {
          relativeWidth = 20; // Subtle landscape plus
        } else if (aspectRatio >= 1.2) {
          relativeWidth = 19; // Subtle landscape
        } else if (aspectRatio >= 1.15) {
          relativeWidth = 18; // Nearly square wide plus
        } else if (aspectRatio >= 1.1) {
          relativeWidth = 17; // Nearly square wide
        } else if (aspectRatio >= 1.05) {
          relativeWidth = 16; // Almost square wide
        } else if (aspectRatio >= 1.0) {
          relativeWidth = 15; // Perfect square
        } else if (aspectRatio >= 0.95) {
          relativeWidth = 14; // Almost square tall
        } else if (aspectRatio >= 0.9) {
          relativeWidth = 13; // Nearly square tall
        } else if (aspectRatio >= 0.85) {
          relativeWidth = 12; // Nearly square tall plus
        } else if (aspectRatio >= 0.8) {
          relativeWidth = 11; // Subtle portrait
        } else if (aspectRatio >= 0.75) {
          relativeWidth = 10; // Subtle portrait plus
        } else if (aspectRatio >= 0.7) {
          relativeWidth = 9; // Light portrait
        } else if (aspectRatio >= 0.65) {
          relativeWidth = 8; // Light portrait plus
        } else if (aspectRatio >= 0.6) {
          relativeWidth = 7; // Standard portrait
        } else if (aspectRatio >= 0.55) {
          relativeWidth = 6; // Standard portrait plus
        } else if (aspectRatio >= 0.5) {
          relativeWidth = 5; // Tall portrait
        } else if (aspectRatio >= 0.45) {
          relativeWidth = 4; // Tall portrait plus
        } else if (aspectRatio >= 0.4) {
          relativeWidth = 3; // Very tall portrait
        } else if (aspectRatio >= 0.35) {
          relativeWidth = 2; // Very tall portrait plus
        } else if (aspectRatio >= 0.3) {
          relativeWidth = 1; // Extra tall portrait
        } else {
          relativeWidth = 0.8; // Ultra tall portrait
        }

        // Enforce a minimum share to avoid cards rendering at ~50px widths
        relativeWidth = Math.max(relativeWidth, 12);

        // Check if adding this item would overflow the row
        if (
          totalWidth + relativeWidth > containerWidth &&
          currentRow.length > 0
        ) {
          // If we have space for a narrow image, try to fit one more
          const remainingSpace = containerWidth - totalWidth;
          if (remainingSpace >= 12 && aspectRatio < 0.8) {
            relativeWidth = remainingSpace;
          } else {
            break; // Row is full
          }
        }

        currentRow.push(result);
        totalWidth += relativeWidth;
        currentIndex++;

        // If row is reasonably full (>85%) and we have at least 2 items, consider ending
        if (totalWidth >= 85 && currentRow.length >= 2) {
          // Check if next image is very narrow and can fit
          const nextResult = results[i + 1];
          if (nextResult && currentRow.length < maxItemsPerRow) {
            const nextDimensions = getFallbackDimensions(nextResult);
            const nextAspectRatio =
              nextDimensions.width / nextDimensions.height;
            const remainingSpace = containerWidth - totalWidth;

            // If next image is narrow and fits in remaining space, continue
            if (nextAspectRatio < 0.8 && remainingSpace >= 12) {
              continue;
            }
          }
          break;
        }
      }

      // Ensure we have at least one item in the row
      if (currentRow.length === 0 && currentIndex < results.length) {
        currentRow.push(results[currentIndex]);
        currentIndex++;
      }

      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
    }

    return rows;
  };

  // Get grid template columns based on row items and their aspect ratios
  const getGridTemplateColumns = (rowItems: SearchResult[]) => {
    return rowItems
      .map((item) => {
        const dimensions = getFallbackDimensions(item);
        let aspectRatio = dimensions.width / dimensions.height;

        // Force PNG files to have 1:1 aspect ratio (except wide PNGs > 420px)
        const isPNG =
          item.file_type === "PNG" ||
          (item.file_type === "image" &&
            item.thumbnail?.toLowerCase().includes(".png")) ||
          item.thumbnail?.toLowerCase().endsWith(".png");
        const apiWidth = parseInt(String(item.width)) || dimensions.width;
        const isWidePNG = isPNG && apiWidth > 420;
        if (isPNG && !isWidePNG) {
          aspectRatio = 1.0;
        }

        // Calculate relative width based on aspect ratio (same logic as above)
        let relativeWidth;
        if (aspectRatio >= 8.0) {
          relativeWidth = 60;
        } else if (aspectRatio >= 7.0) {
          relativeWidth = 58;
        } else if (aspectRatio >= 6.0) {
          relativeWidth = 56;
        } else if (aspectRatio >= 5.5) {
          relativeWidth = 54;
        } else if (aspectRatio >= 5.0) {
          relativeWidth = 52;
        } else if (aspectRatio >= 4.5) {
          relativeWidth = 51;
        } else if (aspectRatio >= 4.0) {
          relativeWidth = 50;
        } else if (aspectRatio >= 3.8) {
          relativeWidth = 49;
        } else if (aspectRatio >= 3.6) {
          relativeWidth = 48;
        } else if (aspectRatio >= 3.4) {
          relativeWidth = 47;
        } else if (aspectRatio >= 3.2) {
          relativeWidth = 46;
        } else if (aspectRatio >= 3.0) {
          relativeWidth = 45;
        } else if (aspectRatio >= 2.9) {
          relativeWidth = 44;
        } else if (aspectRatio >= 2.8) {
          relativeWidth = 43;
        } else if (aspectRatio >= 2.7) {
          relativeWidth = 42;
        } else if (aspectRatio >= 2.6) {
          relativeWidth = 41;
        } else if (aspectRatio >= 2.5) {
          relativeWidth = 40;
        } else if (aspectRatio >= 2.4) {
          relativeWidth = 39;
        } else if (aspectRatio >= 2.3) {
          relativeWidth = 38;
        } else if (aspectRatio >= 2.2) {
          relativeWidth = 37;
        } else if (aspectRatio >= 2.1) {
          relativeWidth = 36;
        } else if (aspectRatio >= 2.0) {
          relativeWidth = 35;
        } else if (aspectRatio >= 1.95) {
          relativeWidth = 34;
        } else if (aspectRatio >= 1.9) {
          relativeWidth = 33;
        } else if (aspectRatio >= 1.85) {
          relativeWidth = 32;
        } else if (aspectRatio >= 1.8) {
          relativeWidth = 31;
        } else if (aspectRatio >= 1.75) {
          relativeWidth = 30;
        } else if (aspectRatio >= 1.7) {
          relativeWidth = 29;
        } else if (aspectRatio >= 1.65) {
          relativeWidth = 28;
        } else if (aspectRatio >= 1.6) {
          relativeWidth = 27;
        } else if (aspectRatio >= 1.55) {
          relativeWidth = 26;
        } else if (aspectRatio >= 1.5) {
          relativeWidth = 25;
        } else if (aspectRatio >= 1.45) {
          relativeWidth = 24;
        } else if (aspectRatio >= 1.4) {
          relativeWidth = 23;
        } else if (aspectRatio >= 1.35) {
          relativeWidth = 22;
        } else if (aspectRatio >= 1.3) {
          relativeWidth = 21;
        } else if (aspectRatio >= 1.25) {
          relativeWidth = 20;
        } else if (aspectRatio >= 1.2) {
          relativeWidth = 19;
        } else if (aspectRatio >= 1.15) {
          relativeWidth = 18;
        } else if (aspectRatio >= 1.1) {
          relativeWidth = 17;
        } else if (aspectRatio >= 1.05) {
          relativeWidth = 16;
        } else if (aspectRatio >= 1.0) {
          relativeWidth = 15;
        } else if (aspectRatio >= 0.95) {
          relativeWidth = 14;
        } else if (aspectRatio >= 0.9) {
          relativeWidth = 13;
        } else if (aspectRatio >= 0.85) {
          relativeWidth = 12;
        } else if (aspectRatio >= 0.8) {
          relativeWidth = 11;
        } else if (aspectRatio >= 0.75) {
          relativeWidth = 10;
        } else if (aspectRatio >= 0.7) {
          relativeWidth = 9;
        } else if (aspectRatio >= 0.65) {
          relativeWidth = 8;
        } else if (aspectRatio >= 0.6) {
          relativeWidth = 7;
        } else if (aspectRatio >= 0.55) {
          relativeWidth = 6;
        } else if (aspectRatio >= 0.5) {
          relativeWidth = 5;
        } else if (aspectRatio >= 0.45) {
          relativeWidth = 4;
        } else if (aspectRatio >= 0.4) {
          relativeWidth = 3;
        } else if (aspectRatio >= 0.35) {
          relativeWidth = 2;
        } else if (aspectRatio >= 0.3) {
          relativeWidth = 1;
        } else {
          relativeWidth = 0.8;
        }

        // Enforce a minimum column fraction to avoid overly narrow columns
        relativeWidth = Math.max(relativeWidth, 12);

        return `${relativeWidth}fr`;
      })
      .join(" ");
  };

  const handleImageClick = (result: SearchResult) => {
    // Store image data in localStorage for the details page
    localStorage.setItem(`image_${result.file_id}`, JSON.stringify(result));
    // Navigate to the media details page
    window.location.href = `/media/${result.file_id}`;
  };

  return (
    <div className={className}>
      {/* Section Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <Layers className="w-6 h-6 text-primary" />
          {t("mediaDetail.relatedFiles.title", "Related Files")}
        </h3>
        <p className="text-muted-foreground">
          {t(
            "mediaDetail.relatedFiles.description",
            "Discover similar content from the same provider"
          )}
        </p>
      </div>

      {/* Mobile Layout - Stack all components vertically */}
      <div className="sm:hidden space-y-4">
        {transformedResults.map((result: SearchResult) => (
          <RelatedFilesCard
            key={result.id}
            related={fileData.related.find(r => r.file_id === result.file_id)!}
            index={0}
            imageData={imageData}
            isValidVideoUrl={isValidVideoUrl}
            getVideoMimeType={getVideoMimeType}
            isValidAudioUrl={isValidAudioUrl}
            getAudioMimeType={getAudioMimeType}
          />
        ))}
      </div>

      {/* Desktop Layout - Dynamic CSS Grid */}
      <div className="hidden sm:block w-full">
        {createDynamicGridRows(transformedResults).map(
          (row: SearchResult[], rowIndex: number) => (
            <div
              key={rowIndex}
              className="grid mb-3 2xl:mb-4"
              style={{
                gridTemplateColumns: getGridTemplateColumns(row),
                gap: "20px",
              }}
            >
              {row.map((result: SearchResult) => {
                return (
                  <div
                    key={result.id}
                    className="group relative rounded-lg overflow-hidden transition-all duration-300 cursor-pointer h-[220px] search-card-responsive"
                    onMouseEnter={() => setHoveredImage(result.id)}
                    onMouseLeave={() => setHoveredImage(null)}
                    onClick={() => handleImageClick(result)}
                  >
                    {/* Media Content - Full Card */}
                    <div className="relative w-full h-full">
                      {result.file_type === "audio" ? (
                        /* Audio Card Design - Full Height */
                        <div className="w-full h-full bg-gradient-to-br from-primary/5 via-accent/10 to-primary/10 dark:from-primary/10 dark:via-accent/20 dark:to-primary/15 flex flex-col items-center justify-center p-4 space-y-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                              <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                              </svg>
                            </div>
                            <div className="absolute -inset-1 opacity-30">
                              <div className="w-14 h-14 border-2 border-primary/40 rounded-full animate-ping"></div>
                            </div>
                            <div className="absolute -inset-2 opacity-20">
                              <div className="w-16 h-16 border-2 border-primary/30 rounded-full animate-ping" style={{ animationDelay: "0.5s" }}></div>
                            </div>
                          </div>
                          
                          {/* Audio Waveform Visual */}
                          <div className="flex items-center justify-center gap-0.5 opacity-60">
                            {Array.from({ length: 8 }).map((_, i) => (
                              <div
                                key={i}
                                className="w-0.5 bg-gradient-to-t from-primary/60 to-primary rounded-full animate-pulse"
                                style={{
                                  height: `${Math.random() * 12 + 6}px`,
                                  animationDelay: `${i * 0.1}s`,
                                  animationDuration: "1.5s",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ) : result.file_type === "video" ? (
                        <>
                          <video
                            className="w-full h-full object-cover"
                            poster={result.thumbnail}
                            muted
                            playsInline
                            preload="metadata"
                            onMouseEnter={(e) => {
                              const video = e.target as HTMLVideoElement;
                              video.play().catch(() => {});
                            }}
                            onMouseLeave={(e) => {
                              const video = e.target as HTMLVideoElement;
                              video.pause();
                              video.currentTime = 0;
                            }}
                          >
                            <source src={result.thumbnail} type={getVideoMimeType(result.thumbnail)} />
                          </video>
                          
                          {/* Video Play Icon Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                            <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center group-hover:bg-black/80 transition-colors duration-300">
                              <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
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
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.png";
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
