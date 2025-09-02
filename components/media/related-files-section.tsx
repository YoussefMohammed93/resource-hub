"use client";

import { useTranslation } from "react-i18next";
import { Layers } from "lucide-react";
import { FileData } from "@/lib/api";
import { RelatedFilesCard } from "./related-files-card";
import { useState } from "react";
import Link from "next/link";

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

  // Get viewport width for responsive height calculations
  const getViewportWidth = () => {
    if (typeof window === 'undefined') return 1200;
    return window.innerWidth;
  };

  // Get row height pattern based on viewport width and row index
  const getRowHeightPattern = (rowIndex: number) => {
    const viewportWidth = getViewportWidth();
    
    if (viewportWidth >= 1800) {
      const heightOptions = [180, 240, 300, 400, 500, 550];
      return heightOptions[rowIndex % heightOptions.length];
    } else if (viewportWidth >= 1600) {
      const heightOptions = [200, 260, 320, 380, 450];
      return heightOptions[rowIndex % heightOptions.length];
    } else if (viewportWidth >= 1200) {
      const heightOptions = [220, 280, 340, 400];
      return heightOptions[rowIndex % heightOptions.length];
    } else {
      const heightOptions = [240, 300, 360];
      return heightOptions[rowIndex % heightOptions.length];
    }
  };

  // Calculate optimal row height based on first image and average aspect ratio
  const calculateOptimalRowHeight = (rowItems: SearchResult[], targetRowHeight: number) => {
    if (rowItems.length === 0) return targetRowHeight;
    
    const viewportWidth = getViewportWidth();
    const firstImage = rowItems[0];
    const firstDimensions = getFallbackDimensions(firstImage);
    let baseHeight = firstDimensions.height;
    
    // Calculate average aspect ratio of all images in row
    const totalAspectRatio = rowItems.reduce((sum, item) => {
      const dims = getFallbackDimensions(item);
      return sum + (dims.width / dims.height);
    }, 0);
    const avgAspectRatio = totalAspectRatio / rowItems.length;
    
    // Adjust base height based on average aspect ratio
    if (avgAspectRatio > 2.0) {
      baseHeight *= 0.8; // Reduce height for wide images
    } else if (avgAspectRatio < 0.8) {
      baseHeight *= 1.2; // Increase height for tall images
    }
    
    // Apply viewport-specific scaling and constraints
    let minHeight, maxHeight, scaleFactor;
    
    if (viewportWidth >= 1800) {
      minHeight = 180;
      maxHeight = 550;
      scaleFactor = 0.9;
    } else if (viewportWidth >= 1600) {
      minHeight = 200;
      maxHeight = 450;
      scaleFactor = 0.95;
    } else if (viewportWidth >= 1200) {
      minHeight = 220;
      maxHeight = 400;
      scaleFactor = 1.0;
    } else {
      minHeight = 240;
      maxHeight = 360;
      scaleFactor = 1.1;
    }
    
    const optimalHeight = baseHeight * scaleFactor;
    return Math.round(Math.max(minHeight, Math.min(maxHeight, optimalHeight)));
  };

  // Check if image is suitable for target row height
  const isImageSuitableForRowHeight = (result: SearchResult, targetHeight: number) => {
    const dimensions = getFallbackDimensions(result);
    const naturalHeight = dimensions.height;
    
    // Calculate how much the image would need to be scaled
    const scaleFactor = targetHeight / naturalHeight;
    
    // Prefer images that don't need extreme scaling
    if (scaleFactor < 0.5 || scaleFactor > 2.0) {
      return { suitable: false, score: 0 };
    }
    
    // Score based on how close the natural height is to target
    const heightDiff = Math.abs(naturalHeight - targetHeight);
    const score = Math.max(0, 100 - (heightDiff / targetHeight) * 100);
    
    return { suitable: true, score };
  };

  // Create dynamic grid rows with varied heights based on image content
  const createDynamicGridRows = (results: SearchResult[]) => {
    const rows: { items: SearchResult[]; height: number }[] = [];
    let currentIndex = 0;

    while (currentIndex < results.length) {
      const rowIndex = rows.length;
      const targetRowHeight = getRowHeightPattern(rowIndex);
      const currentRow: SearchResult[] = [];
      const remainingImages = results.slice(currentIndex);
      
      // Sort remaining images by suitability for this row height
      const sortedImages = remainingImages
        .map(img => ({
          ...img,
          suitability: isImageSuitableForRowHeight(img, targetRowHeight)
        }))
        .sort((a, b) => b.suitability.score - a.suitability.score);
      
      // Build row with most suitable images, enforcing min 2, max 5
      for (let i = 0; i < sortedImages.length && currentRow.length < 5; i++) {
        const result = sortedImages[i];
        const suitability = isImageSuitableForRowHeight(result, targetRowHeight);
        
        // Add image if suitable or if we need to fill minimum requirement
        if (suitability.suitable || currentRow.length < 2) {
          currentRow.push(result);
          // Remove from remaining images
          const originalIndex = results.findIndex(r => r.id === result.id);
          if (originalIndex >= currentIndex) {
            results.splice(originalIndex, 1);
            if (originalIndex === currentIndex) {
              // Don't increment currentIndex since we removed current item
            } else {
              // Adjust currentIndex if we removed an item before it
              currentIndex--;
            }
          }
        }
      }
      
      // Enforce minimum 2 cards per row
      while (currentRow.length < 2 && currentIndex < results.length) {
        currentRow.push(results[currentIndex]);
        results.splice(currentIndex, 1);
      }
      
      // If we have items in the row, calculate optimal height and add to rows
      if (currentRow.length > 0) {
        const actualRowHeight = calculateOptimalRowHeight(currentRow, targetRowHeight);
        rows.push({ items: currentRow, height: actualRowHeight });
      }
      
      // Move to next batch of images
      if (results.length === 0) break;
      currentIndex = 0; // Reset since we're modifying the array
    }

    // Rebalance if the last row has only one item
    if (rows.length > 1 && rows[rows.length - 1].items.length === 1) {
      const lastIndex = rows.length - 1;
      const prevIndex = lastIndex - 1;
      const lastRow = rows[lastIndex];
      const prevRow = rows[prevIndex];

      if (prevRow.items.length > 2 || prevRow.items.length === 5) {
        // Move the most suitable item from previous row to the last row
        let bestIdx = 0;
        let bestScore = -1;
        for (let i = 0; i < prevRow.items.length; i++) {
          const suitability = isImageSuitableForRowHeight(prevRow.items[i], lastRow.height);
          const score = suitability.suitable ? suitability.score : 0;
          if (score > bestScore) {
            bestScore = score;
            bestIdx = i;
          }
        }
        const moved = prevRow.items.splice(bestIdx, 1)[0];
        lastRow.items.push(moved);

        // Recalculate heights for both rows
        const prevTarget = getRowHeightPattern(prevIndex);
        prevRow.height = calculateOptimalRowHeight(prevRow.items, prevTarget);
        const lastTarget = getRowHeightPattern(lastIndex);
        lastRow.height = calculateOptimalRowHeight(lastRow.items, lastTarget);
      } else if (prevRow.items.length < 5) {
        // Merge the single item into the previous row when it has capacity
        prevRow.items.push(...lastRow.items);
        const prevTarget = getRowHeightPattern(prevIndex);
        prevRow.height = calculateOptimalRowHeight(prevRow.items, prevTarget);
        rows.pop();
      } else {
        // Fallback: move one item from previous row
        const moved = prevRow.items.pop()!;
        lastRow.items.push(moved);
        const prevTarget = getRowHeightPattern(prevIndex);
        prevRow.height = calculateOptimalRowHeight(prevRow.items, prevTarget);
        const lastTarget = getRowHeightPattern(lastIndex);
        lastRow.height = calculateOptimalRowHeight(lastRow.items, lastTarget);
      }
    }

    return rows;
  };

  // Get grid template columns based on row items, their aspect ratios, and row height
  const getGridTemplateColumns = (rowItems: SearchResult[], rowHeight: number) => {
    return rowItems
      .map((item) => {
        const dimensions = getFallbackDimensions(item);
        const aspectRatio = dimensions.width / dimensions.height;
        
        // Calculate width based on row height and aspect ratio
        const calculatedWidth = rowHeight * aspectRatio;
        
        // Convert to relative units (fr) based on calculated width
        const relativeWidth = Math.max(calculatedWidth / 20, 8); // Minimum 8fr
        
        return `${relativeWidth.toFixed(1)}fr`;
      })
      .join(" ");
  };

  const handleImageClick = (result: SearchResult) => {
    // Store image data in localStorage for the details page
    localStorage.setItem(`image_${result.file_id}`, JSON.stringify(result));
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

      {/* Desktop Layout - Dynamic Masonry Grid with varied heights */}
      <div className="hidden sm:block w-full">
        {createDynamicGridRows(transformedResults).map(
          (rowData: { items: SearchResult[]; height: number }, rowIndex: number) => (
            <div
              key={rowIndex}
              className="grid mb-4 2xl:mb-6"
              style={{
                gridTemplateColumns: getGridTemplateColumns(rowData.items, rowData.height),
                gap: "20px",
              }}
            >
              {rowData.items.map((result: SearchResult) => {
                const rowHeight = rowData.height;
                return (
                  <Link
                    href={`/media/${result.file_id}`}
                    key={result.id}
                    className="group relative rounded-lg overflow-hidden transition-all duration-300 cursor-pointer search-card-responsive block"
                    style={{ height: `${rowHeight}px` }}
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
                  </Link>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
