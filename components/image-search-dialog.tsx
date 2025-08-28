"use client";

import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ImageSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageUpload?: (file: File) => void;
}

export function ImageSearchDialog({
  open,
  onOpenChange,
  onImageUpload,
}: ImageSearchDialogProps) {
  const { t } = useTranslation("common");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG or PNG)");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be smaller than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Read file for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setUploadProgress(100);
        setIsUploading(false);
        clearInterval(progressInterval);

        console.log(t("hero.imageSearch.uploadSuccess"));

        // Call the onImageUpload callback if provided
        if (onImageUpload) {
          onImageUpload(file);
        }
      };

      reader.onerror = () => {
        setIsUploading(false);
        setUploadProgress(0);
        clearInterval(progressInterval);
        console.error(t("hero.imageSearch.uploadError"));
      };

      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      console.error(t("hero.imageSearch.uploadError"));
      console.error("Upload failed:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSearch = () => {
    if (uploadedImage) {
      // Redirect to search page with image search parameter
      window.location.href = `/search?imageSearch=true`;
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl min-h-[50vh]">
        <DialogHeader>
          <DialogTitle>{t("hero.imageSearch.dialogTitle")}</DialogTitle>
          <DialogDescription>
            {t("hero.imageSearch.dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!uploadedImage ? (
            <>
              {/* Drag and Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground mb-2">
                  {t("hero.imageSearch.dragAndDrop")}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  {t("hero.imageSearch.orClickToBrowse")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("hero.imageSearch.supportedFormats")}
                </p>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("hero.imageSearch.uploading")}
                    </span>
                    <span className="text-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              {/* Tip Text */}
              <p className="text-xs text-muted-foreground text-center">
                {t("hero.imageSearch.tipText")}
              </p>
            </>
          ) : (
            <>
              {/* Image Preview */}
              <div className="space-y-3">
                <div className="relative border rounded-lg p-4 bg-muted/30">
                  <div className="relative w-full h-40">
                    <Image
                      src={uploadedImage}
                      alt="Uploaded image preview"
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="flex-1"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </Button>
                  <Button onClick={handleSearch} className="flex-1">
                    <ImageIcon className="w-4 h-4" />
                    Search Similar
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
