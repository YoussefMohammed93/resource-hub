/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/components/i18n-provider";
import { HeaderControls } from "@/components/header-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Wand2,
  Loader2,
  Download,
  CheckCircle,
  RotateCcw,
  CreditCard,
  AlertTriangle,
  Coins,
  Palette,
  ImageIcon,
  Eye,
  Copy,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import Footer from "@/components/footer";

// Types
interface GenerationData {
  prompt: string;
  negativePrompt?: string;
  imageSize: string;
}

interface GalleryImage {
  id: string;
  url: string;
  prompt: string;
  imageSize: string;
  createdAt: string;
  createdBy: string;
  views?: number;
}

// Image Generation Form Component
interface ImageGenerationFormProps {
  onGenerate: (data: {
    prompt: string;
    negativePrompt?: string;
    imageSize: string;
  }) => void;
  isGenerating: boolean;
}

function ImageGenerationForm({
  onGenerate,
  isGenerating,
}: ImageGenerationFormProps) {
  const { t } = useTranslation("common");
  const { isRTL } = useLanguage();

  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [imageSize, setImageSize] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const imageSizeOptions = [
    {
      value: "512x512",
      label: t("aiImageGenerator.form.imageSize.options.512x512"),
    },
    {
      value: "768x768",
      label: t("aiImageGenerator.form.imageSize.options.768x768"),
    },
    {
      value: "1024x1024",
      label: t("aiImageGenerator.form.imageSize.options.1024x1024"),
    },
    {
      value: "512x768",
      label: t("aiImageGenerator.form.imageSize.options.512x768"),
    },
    {
      value: "768x512",
      label: t("aiImageGenerator.form.imageSize.options.768x512"),
    },
    {
      value: "1024x768",
      label: t("aiImageGenerator.form.imageSize.options.1024x768"),
    },
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!prompt.trim()) {
      newErrors.prompt = t("aiImageGenerator.form.prompt.required");
    } else if (prompt.trim().length < 3) {
      newErrors.prompt = t("aiImageGenerator.errors.invalidPrompt");
    }

    if (!imageSize) {
      newErrors.imageSize = "Please select an image size";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("aiImageGenerator.errors.invalidPrompt"));
      return;
    }

    onGenerate({
      prompt: prompt.trim(),
      negativePrompt: negativePrompt.trim() || undefined,
      imageSize,
    });
  };

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    if (errors.prompt && value.trim().length >= 3) {
      setErrors((prev) => ({ ...prev, prompt: "" }));
    }
  };

  const handleImageSizeChange = (value: string) => {
    setImageSize(value);
    if (errors.imageSize) {
      setErrors((prev) => ({ ...prev, imageSize: "" }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      role="form"
      aria-label={t("aiImageGenerator.form.title")}
    >
      {/* Main Prompt */}
      <div className="space-y-2" role="group" aria-labelledby="prompt-label">
        <Label
          id="prompt-label"
          htmlFor="prompt"
          className={isRTL ? "text-right" : "text-left"}
        >
          {t("aiImageGenerator.form.prompt.label")} *
        </Label>
        <Textarea
          id="prompt"
          name="prompt"
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder={t("aiImageGenerator.form.prompt.placeholder")}
          className={`min-h-[100px] resize-none ${
            errors.prompt
              ? "border-destructive focus-visible:border-destructive"
              : ""
          } ${isRTL ? "text-right" : "text-left"}`}
          disabled={isGenerating}
          maxLength={500}
          aria-describedby={
            errors.prompt
              ? "prompt-error prompt-help prompt-count"
              : "prompt-help prompt-count"
          }
          aria-invalid={!!errors.prompt}
          aria-required="true"
        />
        {errors.prompt && (
          <p
            id="prompt-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.prompt}
          </p>
        )}
        <p id="prompt-help" className="text-xs text-muted-foreground">
          {t("aiImageGenerator.form.prompt.examples")}
        </p>
        <div
          id="prompt-count"
          className={`text-xs text-muted-foreground ${isRTL ? "text-left" : "text-right"}`}
          aria-live="polite"
        >
          {prompt.length}/500
        </div>
      </div>

      {/* Image Size and Negative Prompt Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Image Size */}
        <div
          className="space-y-2"
          role="group"
          aria-labelledby="imageSize-label"
        >
          <Label
            id="imageSize-label"
            htmlFor="imageSize"
            className={isRTL ? "text-right" : "text-left"}
          >
            {t("aiImageGenerator.form.imageSize.label")} *
          </Label>
          <Select
            value={imageSize}
            onValueChange={handleImageSizeChange}
            disabled={isGenerating}
            name="imageSize"
            required
          >
            <SelectTrigger
              id="imageSize"
              className={`w-full ${errors.imageSize ? "border-destructive" : ""}`}
              aria-describedby={
                errors.imageSize ? "imageSize-error" : undefined
              }
              aria-invalid={!!errors.imageSize}
              aria-required="true"
            >
              <SelectValue
                placeholder={t("aiImageGenerator.form.imageSize.placeholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {imageSizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.imageSize && (
            <p
              id="imageSize-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.imageSize}
            </p>
          )}
        </div>

        {/* Negative Prompt */}
        <div
          className="space-y-2"
          role="group"
          aria-labelledby="negativePrompt-label"
        >
          <Label
            id="negativePrompt-label"
            htmlFor="negativePrompt"
            className={isRTL ? "text-right" : "text-left"}
          >
            {t("aiImageGenerator.form.negativePrompt.label")}
          </Label>
          <Input
            id="negativePrompt"
            name="negativePrompt"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder={t("aiImageGenerator.form.negativePrompt.placeholder")}
            className={isRTL ? "text-right" : "text-left"}
            disabled={isGenerating}
            maxLength={200}
            aria-describedby="negativePrompt-help"
          />
          <p id="negativePrompt-help" className="text-xs text-muted-foreground">
            {t("aiImageGenerator.form.negativePrompt.description")}
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isGenerating || !prompt.trim() || !imageSize}
        size="lg"
        aria-describedby="submit-help"
        aria-label={
          isGenerating
            ? t("aiImageGenerator.form.generating")
            : t("aiImageGenerator.form.submit")
        }
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            {t("aiImageGenerator.form.generating")}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            {t("aiImageGenerator.form.submit")}
          </>
        )}
      </Button>
      <p id="submit-help" className="sr-only">
        {isGenerating
          ? "Image generation is in progress. Please wait."
          : "Click to generate an AI image based on your prompt and settings."}
      </p>
    </form>
  );
}

// Credit Display Component
interface CreditDisplayProps {
  selectedImageSize: string;
  userCredits: number;
  onBuyCredits?: () => void;
}

function CreditDisplay({
  selectedImageSize,
  userCredits,
  onBuyCredits,
}: CreditDisplayProps) {
  const { t } = useTranslation("common");

  // Credit cost mapping
  const creditCosts: { [key: string]: number } = {
    "512x512": 1,
    "768x768": 2,
    "1024x1024": 3,
    "512x768": 2,
    "768x512": 2,
    "1024x768": 3,
  };

  const getCreditCost = (size: string): number => {
    return creditCosts[size] || 1;
  };

  const currentCost = selectedImageSize ? getCreditCost(selectedImageSize) : 1;
  const hasEnoughCredits = userCredits >= currentCost;

  const getCreditCostText = (size: string): string => {
    const cost = getCreditCost(size);
    return `${cost} ${cost === 1 ? t("aiImageGenerator.credits.credit") : t("aiImageGenerator.credits.credits")}`;
  };

  return (
    <div className="space-y-4">
      {/* Current Credit Balance */}
      <Card className="dark:bg-muted/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Coins className="w-4 h-4 text-primary" />
              {t("aiImageGenerator.credits.title")}
            </CardTitle>
            <Badge variant={hasEnoughCredits ? "default" : "destructive"}>
              {userCredits}{" "}
              {userCredits === 1
                ? t("aiImageGenerator.credits.credit")
                : t("aiImageGenerator.credits.credits")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cost Information */}
          {selectedImageSize ? (
            <div className="space-y-3">
              <div
                className={`flex items-center justify-between p-3 rounded-lg ${
                  hasEnoughCredits
                    ? "bg-primary/10 border border-primary/20"
                    : "bg-destructive/10 border border-destructive/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  {hasEnoughCredits ? (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  )}
                  <span className="text-sm font-medium">
                    {t("aiImageGenerator.credits.willCost")}
                  </span>
                </div>
                <span
                  className={`font-semibold ${
                    hasEnoughCredits ? "text-primary" : "text-destructive"
                  }`}
                >
                  {currentCost}{" "}
                  {currentCost === 1
                    ? t("aiImageGenerator.credits.credit")
                    : t("aiImageGenerator.credits.credits")}
                </span>
              </div>

              {!hasEnoughCredits && (
                <div className="text-center space-y-3">
                  <p className="text-sm text-destructive font-medium">
                    {t("aiImageGenerator.credits.insufficient")}
                  </p>
                  {onBuyCredits && (
                    <Button
                      onClick={onBuyCredits}
                      variant="outline"
                      size="sm"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <CreditCard className="w-4 h-4" />
                      {t("aiImageGenerator.credits.buyMore")}
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Select an image size to see credit cost
              </p>
            </div>
          )}

          {/* Cost Breakdown */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              {t("aiImageGenerator.form.imageSize.creditCostSize")} :
            </h4>
            <div className="space-y-1">
              {Object.entries(creditCosts).map(([size]) => (
                <div
                  key={size}
                  className={`flex items-center justify-between text-xs p-2 rounded ${
                    selectedImageSize === size
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  <span>
                    {t(`aiImageGenerator.form.imageSize.options.${size}`)}
                  </span>
                  <span>{getCreditCostText(size)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Image Generation Loading Component
interface ImageGenerationLoadingProps {
  prompt: string;
  imageSize: string;
}

function ImageGenerationLoading({
  prompt,
  imageSize,
}: ImageGenerationLoadingProps) {
  const { t } = useTranslation("common");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const loadingSteps = [
    {
      icon: Wand2,
      text: t("aiImageGenerator.loading.generating"),
      duration: 3000,
    },
    {
      icon: Palette,
      text: t("aiImageGenerator.loading.almostDone"),
      duration: 2000,
    },
    {
      icon: Sparkles,
      text: t("aiImageGenerator.loading.finalizing"),
      duration: 1000,
    },
  ];

  useEffect(() => {
    const totalDuration = loadingSteps.reduce(
      (sum, step) => sum + step.duration,
      0
    );
    let elapsed = 0;
    let stepIndex = 0;

    const interval = setInterval(() => {
      elapsed += 100;

      // Calculate overall progress
      const overallProgress = Math.min((elapsed / totalDuration) * 100, 95);
      setProgress(overallProgress);

      // Update current step
      let cumulativeDuration = 0;
      for (let i = 0; i < loadingSteps.length; i++) {
        cumulativeDuration += loadingSteps[i].duration;
        if (elapsed <= cumulativeDuration) {
          if (stepIndex !== i) {
            stepIndex = i;
            setCurrentStep(i);
          }
          break;
        }
      }

      // Complete the progress when done
      if (elapsed >= totalDuration) {
        setProgress(100);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = loadingSteps[currentStep]?.icon || Loader2;

  return (
    <Card className="dark:bg-muted/50">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
            <CurrentIcon className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
              {t("aiImageGenerator.result.title")}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {loadingSteps[currentStep]?.text ||
                t("aiImageGenerator.loading.generating")}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Image Placeholder with Loading Animation */}
        <div className="relative">
          <div className="aspect-square w-full max-w-md mx-auto bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 animate-pulse" />

            {/* Loading Skeleton Grid */}
            <div className="relative z-10 grid grid-cols-4 gap-2 p-4 w-full h-full">
              {Array.from({ length: 16 }, (_, i) => (
                <Skeleton
                  key={i}
                  className="aspect-square rounded animate-pulse"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    animationDuration: "2s",
                  }}
                />
              ))}
            </div>

            {/* Center Loading Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-border/50">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            </div>
          </div>
        </div>

        {/* Generation Details */}
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-pulse" />
            <div className="flex-1 space-y-1">
              <p className="font-medium text-foreground">Prompt:</p>
              <p className="text-muted-foreground line-clamp-2">{prompt}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <span className="font-medium text-foreground">Size:</span>
            <span className="text-muted-foreground">{imageSize}</span>
          </div>
        </div>

        {/* Loading Steps Indicator */}
        <div className="flex items-center justify-center space-x-2">
          {loadingSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={index}
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                <StepIcon
                  className={`w-4 h-4 ${isActive ? "animate-pulse" : ""}`}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Generated Image Display Component
interface GeneratedImageDisplayProps {
  imageUrl: string;
  prompt: string;
  imageSize: string;
  creditsUsed: number;
  onGenerateAnother: () => void;
}

function GeneratedImageDisplay({
  imageUrl,
  prompt,
  imageSize,
  creditsUsed,
  onGenerateAnother,
}: GeneratedImageDisplayProps) {
  const { t } = useTranslation("common");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Fetch the image
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `ai-generated-${imageSize}-${timestamp}.png`;
      link.download = filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      window.URL.revokeObjectURL(url);

      setDownloadComplete(true);
      toast.success("Image downloaded successfully!");

      // Reset download complete state after 3 seconds
      setTimeout(() => setDownloadComplete(false), 3000);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(t("aiImageGenerator.errors.downloadFailed"));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy prompt:", error);
      toast.error("Failed to copy prompt");
    }
  };

  return (
    <Card className="dark:bg-muted/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
                {t("aiImageGenerator.result.title")}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {t("aiImageGenerator.result.costConfirmation", {
                  credits: creditsUsed,
                })}
              </p>
            </div>
          </div>
          <Badge
            variant="default"
            className="bg-primary/10 text-primary border-primary/20"
          >
            {imageSize}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Generated Image */}
        <div className="relative group">
          <div className="aspect-square w-full max-w-md mx-auto bg-muted/30 rounded-lg overflow-hidden border border-border">
            <Image
              src={imageUrl}
              alt={`AI generated image: ${prompt}`}
              width={512}
              height={512}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>

          {/* Overlay with quick actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-background/90 backdrop-blur-sm"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : downloadComplete ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Prompt Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              Generated from prompt:
            </h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyPrompt}
              className="h-auto p-1 text-muted-foreground hover:text-foreground"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
            <p className="text-sm text-muted-foreground italic">&quot;{prompt}&quot;</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full"
            size="lg"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("aiImageGenerator.result.downloading")}
              </>
            ) : downloadComplete ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                {t("aiImageGenerator.result.downloadButton")}
              </>
            )}
          </Button>

          <Button
            onClick={onGenerateAnother}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <RotateCcw className="w-4 h-4" />
            {t("aiImageGenerator.result.generateAnother")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Latest Images Gallery Component
interface LatestImagesGalleryProps {
  onImageClick: (image: GalleryImage) => void;
  limit?: number;
}

function LatestImagesGallery({
  onImageClick,
  limit = 12,
}: LatestImagesGalleryProps) {
  const { t } = useTranslation("common");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Mock data for demonstration (without likes)
  const mockImages: GalleryImage[] = [
    {
      id: "1",
      url: "/image-1.jpg",
      prompt: "A beautiful sunset over mountains with vibrant colors",
      imageSize: "1024x1024",
      createdAt: "2024-01-15T10:30:00Z",
      createdBy: "Artist123",
      views: 234,
    },
    {
      id: "2",
      url: "/image-2.webp",
      prompt: "Modern office interior with natural lighting",
      imageSize: "768x768",
      createdAt: "2024-01-15T09:15:00Z",
      createdBy: "Designer456",
      views: 156,
    },
    {
      id: "3",
      url: "/freepik-1.jpg",
      prompt: "Abstract colorful painting with geometric shapes",
      imageSize: "512x512",
      createdAt: "2024-01-15T08:45:00Z",
      createdBy: "Creative789",
      views: 289,
    },
    // Add more mock images...
    ...Array.from({ length: 9 }, (_, i) => ({
      id: `${i + 4}`,
      url: `/image-${(i % 3) + 1}.jpg`,
      prompt: `Creative AI generated image ${i + 4}`,
      imageSize: ["512x512", "768x768", "1024x1024"][i % 3],
      createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
      createdBy: `User${i + 4}`,
      views: Math.floor(Math.random() * 500),
    })),
  ];

  useEffect(() => {
    // Simulate API call
    const loadImages = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setImages(mockImages.slice(0, limit));
        setHasMore(mockImages.length > limit);
      } catch (err) {
        console.error(err);
        setError(t("aiImageGenerator.errors.loadGalleryFailed"));
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [limit, t]);

  const loadMoreImages = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const currentLength = images.length;
      const newImages = mockImages.slice(currentLength, currentLength + 8);

      setImages((prev) => [...prev, ...newImages]);
      setHasMore(currentLength + newImages.length < mockImages.length);
    } catch (err) {
      console.error(err);
      setError(t("aiImageGenerator.errors.loadGalleryFailed"));
    } finally {
      setLoadingMore(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8 text-destructive" />
        </div>
        <p className="text-destructive font-medium mb-2">
          Failed to load gallery
        </p>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gallery Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        role="grid"
        aria-label={t("aiImageGenerator.gallery.title")}
      >
        {isLoading
          ? Array.from({ length: limit }, (_, i) => (
              <GalleryImageSkeleton key={i} />
            ))
          : images.map((image) => (
              <GalleryImageCard
                key={image.id}
                image={image}
                onClick={() => onImageClick(image)}
                formatTimeAgo={formatTimeAgo}
              />
            ))}
      </div>

      {/* Load More Button */}
      {!isLoading && hasMore && (
        <div className="text-center">
          <Button
            onClick={loadMoreImages}
            disabled={loadingMore}
            variant="outline"
            size="lg"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {t("aiImageGenerator.gallery.loading")}
              </>
            ) : (
              t("aiImageGenerator.gallery.loadMore")
            )}
          </Button>
        </div>
      )}

      {/* No Images */}
      {!isLoading && images.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium mb-2">
            {t("aiImageGenerator.gallery.noImages")}
          </p>
          <p className="text-muted-foreground text-sm">
            Be the first to create something amazing!
          </p>
        </div>
      )}
    </div>
  );
}

// Gallery Image Card Component (without heart/like icons)
function GalleryImageCard({
  image,
  onClick,
  formatTimeAgo,
}: {
  image: GalleryImage;
  onClick: () => void;
  formatTimeAgo: (date: string) => string;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="group relative aspect-square bg-muted/30 rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="gridcell"
      aria-label={`AI generated image: ${image.prompt}. Created by ${image.createdBy} ${formatTimeAgo(image.createdAt)}. ${image.views} views. Click to view details.`}
    >
      {/* Image */}
      {!imageError ? (
        <Image
          src={image.url}
          alt={image.prompt}
          fill
          className={`object-cover transition-all duration-300 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted/50">
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
      )}

      {/* Loading Skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0">
          <Skeleton className="w-full h-full" />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content Overlay */}
      <div className="absolute inset-0 p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Top Stats */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{image.views}</span>
            </div>
          </div>
          <span className="bg-black/50 px-2 py-1 rounded text-xs">
            {image.imageSize}
          </span>
        </div>

        {/* Bottom Info */}
        <div className="text-white">
          <p className="text-xs font-medium line-clamp-2 mb-1">
            {image.prompt}
          </p>
          <div className="flex items-center justify-between text-xs opacity-80">
            <span>{image.createdBy}</span>
            <span>{formatTimeAgo(image.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Gallery Image Skeleton Component
function GalleryImageSkeleton() {
  return (
    <div className="aspect-square">
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
  );
}

// Image Modal Component (without share functionality and heart/like icons)
interface ImageModalProps {
  image: GalleryImage | null;
  isOpen: boolean;
  onClose: () => void;
}

function ImageModal({ image, isOpen, onClose }: ImageModalProps) {
  const { t } = useTranslation("common");
  const { isRTL } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  if (!image) return null;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(image.prompt);
      setPromptCopied(true);
      toast.success(t("aiImageGenerator.modal.promptCopied"));

      // Reset copied state after 2 seconds
      setTimeout(() => setPromptCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy prompt:", error);
      toast.error("Failed to copy prompt");
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Fetch the image
      const response = await fetch(image.url);
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `ai-image-${image.id}-${timestamp}.png`;
      link.download = filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      window.URL.revokeObjectURL(url);

      setDownloadComplete(true);
      toast.success("Image downloaded successfully!");

      // Reset download complete state after 3 seconds
      setTimeout(() => setDownloadComplete(false), 3000);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(t("aiImageGenerator.errors.downloadFailed"));
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleModalClose = () => {
    setImageLoaded(false);
    setImageError(false);
    setIsDownloading(false);
    setDownloadComplete(false);
    setPromptCopied(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-5xl max-w-[95vw] h-[90vh] overflow-y-auto sm:h-auto p-0 sm:overflow-hidden">
        <div
          className={`flex flex-col-reverse sm:flex-row h-full ${isRTL ? "sm:flex-row-reverse" : ""}`}
        >
          {/* Left Side - Image */}
          <div className="flex-1 relative bg-muted/20 min-h-[300px] sm:min-h-[500px] flex items-center justify-center">
            {!imageError ? (
              <>
                <Image
                  src={image.url}
                  alt={image.prompt}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  priority
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Skeleton className="w-full h-full" />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <p className="text-sm">Failed to load image</p>
              </div>
            )}
          </div>

          {/* Right Side - Details with mobile scrolling */}
          <div className="w-full sm:w-80 flex flex-col max-h-full">
            {/* Header */}
            <DialogHeader className="p-6 pb-4 border-b border-border flex-shrink-0">
              <DialogTitle className="text-lg font-semibold">
                {t("aiImageGenerator.modal.title")}
              </DialogTitle>
            </DialogHeader>

            {/* Content - Scrollable on mobile */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Image Stats (without heart/like icons) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{image.views || 0}</span>
                  </div>
                </div>
                <Badge variant="secondary">{image.imageSize}</Badge>
              </div>

              {/* Original Prompt */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    {t("aiImageGenerator.modal.originalPrompt")}
                  </h3>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <p className="text-sm text-foreground leading-relaxed">
                    &quot;{image.prompt}&quot;
                  </p>
                </div>
                <Button
                  onClick={handleCopyPrompt}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={promptCopied}
                >
                  {promptCopied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {t("aiImageGenerator.modal.copyPrompt")}
                    </>
                  )}
                </Button>
              </div>

              {/* Image Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>
                      {t("aiImageGenerator.modal.createdBy")}: {image.createdBy}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {t("aiImageGenerator.modal.createdAt")}:{" "}
                      {formatDate(image.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 pt-4 border-t border-border space-y-3 flex-shrink-0">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full"
                size="lg"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Downloading...
                  </>
                ) : downloadComplete ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Downloaded!
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    {t("aiImageGenerator.modal.downloadImage")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Skeleton component for loading state
function AIImageGeneratorSkeleton() {
  const { isRTL } = useLanguage();

  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? "font-tajawal" : "font-sans"}`}
    >
      {/* Header Skeleton */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-5">
          <div className="flex items-center justify-between h-16">
            <div
              className={`flex items-center gap-1 sm:gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
              </div>
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="container mx-auto max-w-7xl px-4 sm:px-5 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Page Title Skeleton */}
        <div className="text-center space-y-3 sm:space-y-4">
          <Skeleton className="h-8 sm:h-10 w-64 sm:w-80 mx-auto" />
          <Skeleton className="h-5 sm:h-6 w-80 sm:w-96 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Image Generation Form Skeleton */}
          <div className="lg:col-span-2">
            <Card className="dark:bg-muted/50">
              <CardHeader>
                <div
                  className={`flex items-center ${isRTL ? "space-x-reverse space-x-3" : "space-x-3"}`}
                >
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40 sm:w-48" />
                    <Skeleton className="h-3 w-48 sm:w-64" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 sm:w-24" />
                  <Skeleton className="h-20 sm:h-24 w-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16 sm:w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 sm:w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <Skeleton className="h-10 sm:h-12 w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Credit Display Skeleton */}
          <div className="space-y-6">
            <Card className="dark:bg-muted/50">
              <CardHeader>
                <div
                  className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}
                >
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-5 w-24 sm:w-32" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-12 sm:h-16 w-full" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Latest Images Gallery Skeleton */}
        <div className="space-y-6">
          <div
            className={`text-center lg:text-left space-y-2 ${isRTL ? "lg:text-right" : ""}`}
          >
            <Skeleton className="h-7 sm:h-8 w-48 sm:w-64 mx-auto lg:mx-0" />
            <Skeleton className="h-4 w-64 sm:w-80 mx-auto lg:mx-0" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="aspect-square">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AIImageGeneratorPage() {
  const { t } = useTranslation("common");
  const { isRTL, isLoading } = useLanguage();

  // State management
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationData, setGenerationData] = useState<GenerationData | null>(
    null
  );
  const [selectedImageModal, setSelectedImageModal] =
    useState<GalleryImage | null>(null);
  const [userCredits, setUserCredits] = useState(25); // Mock user credits
  const [creditsUsed, setCreditsUsed] = useState(0);

  // Show loading skeleton while language data is loading
  if (isLoading) {
    return <AIImageGeneratorSkeleton />;
  }

  // Handle image generation
  const handleGenerate = async (data: GenerationData) => {
    setIsGenerating(true);
    setGenerationData(data);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 6000));

      // Mock generated image (in real app, this would come from API)
      const mockImageUrl = "/image-1.jpg";
      setGeneratedImage(mockImageUrl);

      // Calculate and deduct credits
      const creditCost = getCreditCost(data.imageSize);
      setCreditsUsed(creditCost);
      setUserCredits((prev) => prev - creditCost);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to get credit cost
  const getCreditCost = (size: string): number => {
    const costs: { [key: string]: number } = {
      "512x512": 1,
      "768x768": 2,
      "1024x1024": 3,
      "512x768": 2,
      "768x512": 2,
      "1024x768": 3,
    };
    return costs[size] || 1;
  };

  // Handle generate another
  const handleGenerateAnother = () => {
    setGeneratedImage(null);
    setGenerationData(null);
    setCreditsUsed(0);
  };

  // Handle buy credits
  const handleBuyCredits = () => {
    // In real app, this would open payment modal
    console.log("Buy credits clicked");
  };

  // Handle gallery image click
  const handleGalleryImageClick = (image: GalleryImage) => {
    setSelectedImageModal(image);
  };

  // Handle modal close
  const handleModalClose = () => {
    setSelectedImageModal(null);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-primary/10 to-primary/15 ${isRTL ? "font-tajawal" : "font-sans"}`}
    >
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-5">
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

      {/* Main Content */}
      <main
        className="container mx-auto max-w-7xl px-4 sm:px-5 py-6 sm:py-8 space-y-6 sm:space-y-8"
        role="main"
        aria-label={t("aiImageGenerator.title")}
      >
        {/* Page Title */}
        <header className="text-center space-y-3 sm:space-y-4">
          <div
            className={`flex items-center justify-center gap-2 sm:gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center"
              aria-hidden="true"
            >
              <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              {t("aiImageGenerator.title")}
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            {t("aiImageGenerator.description")}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Generation Form */}
            {!isGenerating && !generatedImage && (
              <Card className="dark:bg-muted/50">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
                        {t("aiImageGenerator.form.title")}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {t("aiImageGenerator.form.description")}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ImageGenerationForm
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                  />
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {isGenerating && generationData && (
              <ImageGenerationLoading
                prompt={generationData.prompt}
                imageSize={generationData.imageSize}
              />
            )}

            {/* Generated Image Display */}
            {generatedImage && generationData && !isGenerating && (
              <GeneratedImageDisplay
                imageUrl={generatedImage}
                prompt={generationData.prompt}
                imageSize={generationData.imageSize}
                creditsUsed={creditsUsed}
                onGenerateAnother={handleGenerateAnother}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CreditDisplay
              selectedImageSize={generationData?.imageSize || ""}
              userCredits={userCredits}
              onBuyCredits={handleBuyCredits}
            />
          </div>
        </div>

        {/* Latest Images Gallery */}
        <div className="space-y-6">
          <div
            className={`text-center lg:text-left space-y-2 ${isRTL ? "lg:text-right" : ""}`}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {t("aiImageGenerator.gallery.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("aiImageGenerator.gallery.subtitle")}
            </p>
          </div>

          <LatestImagesGallery
            onImageClick={handleGalleryImageClick}
            limit={12}
          />
        </div>

        {/* Image Modal */}
        <ImageModal
          image={selectedImageModal}
          isOpen={!!selectedImageModal}
          onClose={handleModalClose}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
