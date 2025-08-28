"use client";

import { useTranslation } from "react-i18next";
import { Layers } from "lucide-react";
import { FileData } from "@/lib/api";
import { RelatedFilesCard } from "./related-files-card";

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

  // Don't render if no related files
  if (!fileData || !fileData.related || fileData.related.length === 0) {
    return null;
  }

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

      {/* Responsive grid for related files: 1 col mobile, 2-3 cols tablet, 4 cols desktop, 6 cols ultra-wide (>1600px) */}
      <div className="related-files-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {fileData.related.map((related, index) => (
          <RelatedFilesCard
            key={`${related.file_id}-${index}`}
            related={related}
            index={index}
            imageData={imageData}
            isValidVideoUrl={isValidVideoUrl}
            getVideoMimeType={getVideoMimeType}
            isValidAudioUrl={isValidAudioUrl}
            getAudioMimeType={getAudioMimeType}
          />
        ))}
      </div>
    </div>
  );
}
