/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
  Globe,
  Crown,
  Coins,
  Calendar,
  Clock,
  Star,
  ExternalLink,
  AlertTriangle,
  Info,
  LogIn,
  UserPlus,
} from "lucide-react";
import { downloadApi } from "@/lib/api";
import { useLanguage } from "./i18n-provider";
import { FlyingDownloadAnimation } from "./flying-download-animation";
import { useRouter } from "next/navigation";

interface ApiVerificationResponse {
  success: boolean;
  data?: {
    is_supported: boolean;
    is_allowed: boolean;
    can_afford: boolean;
    site: {
      name: string;
      url: string;
      icon: string;
      price: number;
      external: boolean;
      last_reset: string;
    };
  };
  subscription?:
    | boolean
    | {
        active: boolean;
        plan: string;
        credits: { remaining: number; plan: number };
        until: string;
        allowed_sites: string[];
      };
  error?: {
    id: string | number;
    message: string;
  };
}

interface DownloadVerificationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  downloadUrl: string;
}

export function DownloadVerificationSheet({
  isOpen,
  onClose,
  downloadUrl,
}: DownloadVerificationSheetProps) {
  const { t } = useTranslation("common");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "preparing" | "downloading" | "completed" | "failed"
  >("idle");
  const [, setShowProgress] = useState(false);
  const [verificationData, setVerificationData] =
    useState<ApiVerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFlyingAnimation, setShowFlyingAnimation] = useState(false);
  const [downloadButtonRef, setDownloadButtonRef] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen && downloadUrl) {
      handleVerifyDownload();
    }
  }, [isOpen, downloadUrl]);

  const handleVerifyDownload = async () => {
    setIsVerifying(true);
    setError(null);
    setVerificationData(null);

    try {
      const response = await downloadApi.verifyDownload({ downloadUrl });
      setVerificationData(response as ApiVerificationResponse);
    } catch (err) {
      console.error(err);
      setError("Failed to verify download");
    } finally {
      setIsVerifying(false);
    }
  };

  const performRealDownload = async () => {
    try {
      // First, create the download task via API (this does NOT charge credits yet)
      const response = await downloadApi.createDownload({ downloadUrl });

      if (!response.success) {
        throw new Error(
          response.error?.message || "Failed to create download task"
        );
      }

      const taskId = response.data?.task_id;
      if (!taskId) {
        throw new Error("No task ID received from server");
      }

      // Show success toast
      import("sonner").then(({ toast }) => {
        toast.success(
          t("download.taskCreated", "Download task created successfully"),
          {
            duration: 3000,
            description: t(
              "download.taskCreatedDescription",
              "You can track the progress in the download indicator"
            ),
          }
        );
      });

      // Trigger a custom event to notify the download indicator
      window.dispatchEvent(
        new CustomEvent("downloadTaskCreated", {
          detail: {
            taskId,
            downloadUrl,
            sitePrice: verificationData?.data?.site?.price || 1,
          },
        })
      );

      // Reset states since sheet is already closed
      setIsDownloading(false);
      setDownloadStatus("idle");
      setDownloadProgress(0);
      setShowProgress(false);

      // Note: The download status indicator will now handle polling for task completion
      // and showing progress in the navbar instead of in this sheet
      return;
    } catch (error) {
      console.error("Download preparation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Download failed";
      setError(errorMessage);
      setDownloadStatus("failed");
      setIsDownloading(false);
      setShowProgress(false);
    }
  };

  const handleDownload = async () => {
    if (!verificationData?.data) return;

    setIsDownloading(true);
    setError(null);
    setShowProgress(false); // Don't show progress initially

    // Close the sheet first
    onClose();

    // Wait for sheet to close, then start animation
    setTimeout(() => {
      setShowFlyingAnimation(true);
    }, 400); // Wait for sheet close animation

    // Start the new download process
    await performRealDownload();
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-primary" />
    ) : (
      <XCircle className="w-4 h-4 text-destructive" />
    );
  };

  const canDownload =
    verificationData?.success &&
    verificationData?.data?.is_supported &&
    verificationData?.data?.is_allowed &&
    verificationData?.data?.can_afford;

  // Get detailed failure reasons
  const getFailureReasons = () => {
    if (!verificationData?.data) return [];

    const reasons = [];
    const data = verificationData.data;

    if (!data.is_supported) {
      reasons.push("siteNotSupported");
    }
    if (!data.is_allowed) {
      reasons.push("downloadNotAllowed");
    }
    if (!data.can_afford) {
      reasons.push("insufficientCredits");
    }

    return reasons;
  };

  const failureReasons = getFailureReasons();

  const hasSubscription =
    verificationData?.subscription &&
    typeof verificationData.subscription === "object";
  const subscriptionData = hasSubscription
    ? (verificationData.subscription as {
        active: boolean;
        plan: string;
        credits: { remaining: number; plan: number };
        until: string;
        allowed_sites: string[];
      })
    : null;

  const { isRTL } = useLanguage();
  const router = useRouter();

  const handleAnimationComplete = () => {
    setShowFlyingAnimation(false);
    setDownloadButtonRef(null);
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  // Check if the error is authentication-related
  const isAuthenticationError =
    verificationData &&
    !verificationData.success &&
    verificationData.error?.id === "authentication_required";

  return (
    <>
      <FlyingDownloadAnimation
        isActive={showFlyingAnimation}
        startElement={downloadButtonRef}
        onComplete={handleAnimationComplete}
      />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:w-[90vw] sm:!max-w-lg overflow-y-auto bg-muted/75">
          <SheetHeader className="pb-6">
            <SheetTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Download className="w-6 h-6 text-primary" />
              </div>
              {t("download.verification.title")}
            </SheetTitle>
            <SheetDescription
              className={`text-base text-muted-foreground ${isRTL ? "text-right" : "text-left"}`}
            >
              {t("download.verification.description")}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            {/* Loading State */}
            {isVerifying && (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="text-lg font-medium">
                      {t("download.verification.checking")}
                    </p>
                    <p className="text-muted-foreground">
                      {t("download.verification.checkingDescription")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {error && !isVerifying && (
              <Card className="border-destructive/20">
                <CardContent className="text-center py-12">
                  <div className="space-y-4">
                    <div className="p-3 bg-destructive/10 rounded-full w-fit mx-auto">
                      <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-destructive mb-2">
                        {t("download.verification.error.title")}
                      </h3>
                      <p className="text-destructive/80 mb-4">{error}</p>
                    </div>
                    <Button
                      onClick={handleVerifyDownload}
                      variant="outline"
                      className="gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {t("download.verification.retry")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success State */}
            {verificationData?.success &&
              verificationData.data &&
              !isVerifying && (
                <div className="space-y-6">
                  {/* Site Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        {t("download.verification.site.title")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={verificationData.data.site.icon}
                            alt={verificationData.data.site.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 w-full sm:w-auto">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h4 className="font-semibold text-base sm:text-lg truncate">
                              {verificationData.data.site.name}
                            </h4>
                            {verificationData.data.site.external && (
                              <Badge
                                variant="outline"
                                className="text-xs w-fit"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                {t("download.verification.site.external")}
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm truncate">
                            {verificationData.data.site.url}
                          </p>
                        </div>
                        <div className="w-full sm:w-auto sm:text-right flex-shrink-0">
                          <div className="flex items-center justify-between sm:justify-end gap-2 mb-1">
                            <span className="text-sm text-muted-foreground sm:hidden">
                              {t("download.verification.site.credits")}
                            </span>
                            <div className="flex items-center gap-2">
                              <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                              <span className="text-xl sm:text-2xl font-bold">
                                {verificationData.data.site.price}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground hidden sm:block">
                            {t("download.verification.site.credits")}
                          </p>
                        </div>
                      </div>
                      {verificationData.data.site.last_reset && (
                        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>
                            {t("download.verification.site.lastReset", {
                              date: new Date(
                                verificationData.data.site.last_reset
                              ).toLocaleDateString(),
                            })}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Primary Download Button (after Site Information) */}
                  <div>
                    {canDownload ? (
                      <Button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="w-full"
                        size="lg"
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {downloadStatus === "preparing" &&
                              t(
                                "download.verification.progress.preparingStatus"
                              )}
                            {downloadStatus === "downloading" &&
                              t(
                                "download.verification.progress.downloadingProgress",
                                { progress: downloadProgress.toFixed(0) }
                              )}
                            {downloadStatus === "completed" &&
                              t(
                                "download.verification.progress.completedStatus"
                              )}
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            {t("download.verification.startDownload")}
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        disabled
                        className="w-full"
                        variant="destructive"
                        size="lg"
                      >
                        <XCircle className="w-4 h-4" />
                        {t("download.verification.cannotDownload")}
                      </Button>
                    )}
                  </div>

                  {/* Failure reasons under status */}
                  {!canDownload && failureReasons.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                          <AlertTriangle className="w-5 h-5" />
                          {t("download.verification.issuesTitle")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {failureReasons.map((reason, index) => {
                            const reasonKey = `download.verification.detailedReasons.${reason}`;
                            return (
                              <div
                                key={index}
                                className="border rounded-lg p-4 bg-muted/30"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 mt-0.5">
                                    <div className="w-2 h-2 bg-destructive rounded-full" />
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <h4 className="font-medium text-sm">
                                      {t(`${reasonKey}.title`)}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {t(`${reasonKey}.description`, {
                                        requiredCredits:
                                          verificationData?.data?.site?.price ||
                                          0,
                                        availableCredits:
                                          subscriptionData?.credits
                                            ?.remaining || 0,
                                        expiryDate:
                                          subscriptionData?.until || "",
                                        dailyLimit: 10,
                                        resetTime: "24 hours",
                                        fileSize: "50MB",
                                        maxSize: "100MB",
                                      })}
                                    </p>
                                    <p className="text-sm font-medium text-primary">
                                      {t(`${reasonKey}.suggestion`)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Subscription Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="w-5 h-5" />
                        {t("download.verification.subscription.title")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {verificationData.subscription === false ? (
                        <div className="text-center py-8">
                          <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                            <Crown className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <h4 className="font-medium text-foreground mb-2">
                            {t(
                              "download.verification.subscription.noActiveSubscription"
                            )}
                          </h4>
                          <p className="text-muted-foreground">
                            {t(
                              "download.verification.subscription.noActiveSubscriptionDescription"
                            )}
                          </p>
                        </div>
                      ) : subscriptionData ? (
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={
                                subscriptionData.active
                                  ? "success"
                                  : "secondary"
                              }
                              className="px-3 py-1"
                            >
                              {subscriptionData.active
                                ? t("download.verification.subscription.active")
                                : t(
                                    "download.verification.subscription.inactive"
                                  )}
                            </Badge>
                            <Badge
                              variant="default"
                              className="px-3 py-1 font-medium"
                            >
                              {subscriptionData.plan}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Coins className="w-5 h-5" />
                                <span className="font-medium">
                                  {t(
                                    "download.verification.subscription.credits"
                                  )}
                                </span>
                              </div>
                              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4">
                                <div className="flex items-baseline gap-1 flex-wrap">
                                  <span className="text-2xl sm:text-3xl font-bold text-primary">
                                    {subscriptionData.credits.remaining}
                                  </span>
                                  <span className="text-primary/70">
                                    /{subscriptionData.credits.plan}
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    (subscriptionData.credits.remaining /
                                      subscriptionData.credits.plan) *
                                    100
                                  }
                                  className="mt-2"
                                />
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-secondary-foreground" />
                                <span className="font-medium">
                                  {t(
                                    "download.verification.subscription.expires"
                                  )}
                                </span>
                              </div>
                              <div className="bg-secondary/50 border border-secondary rounded-lg p-3 sm:p-4">
                                <p className="text-base sm:text-lg font-semibold text-secondary-foreground">
                                  {new Date(
                                    subscriptionData.until
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-secondary-foreground/70 mt-1">
                                  {Math.ceil(
                                    (new Date(
                                      subscriptionData.until
                                    ).getTime() -
                                      Date.now()) /
                                      (1000 * 60 * 60 * 24)
                                  )}{" "}
                                  {t(
                                    "download.verification.subscription.daysRemaining"
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-accent-foreground" />
                              <span className="text-sm font-medium">
                                {t(
                                  "download.verification.subscription.allowedSites"
                                )}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {t(
                                "download.verification.subscription.allowedSitesCount",
                                {
                                  count: subscriptionData.allowed_sites.length,
                                  sites:
                                    subscriptionData.allowed_sites.join(", "),
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Info className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground">
                            {t(
                              "download.verification.subscription.noInformation"
                            )}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Download Status Overview */}
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield />
                        {t("download.verification.status.title")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Status Grid */}
                      <div className="grid grid-cols-1 gap-3">
                        {/* Supported Status */}
                        <div className="flex items-center justify-between p-4 rounded-xl border bg-card/50">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${verificationData.data.is_supported ? "bg-primary/10" : "bg-destructive/10"}`}
                            >
                              {getStatusIcon(
                                verificationData.data.is_supported
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm leading-tight">
                                {t("download.verification.status.supported")}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {verificationData.data.is_supported
                                  ? t(
                                      "download.verification.status.supportedDescription"
                                    )
                                  : t(
                                      "download.verification.status.notSupportedDescription"
                                    )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Allowed Status */}
                        <div className="flex items-center justify-between p-4 rounded-xl border bg-card/50">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${verificationData.data.is_allowed ? "bg-primary/10" : "bg-destructive/10"}`}
                            >
                              {getStatusIcon(verificationData.data.is_allowed)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm leading-tight">
                                {t("download.verification.status.allowed")}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {verificationData.data.is_allowed
                                  ? t(
                                      "download.verification.status.allowedDescription"
                                    )
                                  : t(
                                      "download.verification.status.notAllowedDescription"
                                    )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Affordable Status */}
                        <div className="flex items-center justify-between p-4 rounded-xl border bg-card/50">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${verificationData.data.can_afford ? "bg-primary/10" : "bg-destructive/10"}`}
                            >
                              {getStatusIcon(verificationData.data.can_afford)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm leading-tight">
                                {t("download.verification.status.affordable")}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {verificationData.data.can_afford
                                  ? t(
                                      "download.verification.status.affordableDescription"
                                    )
                                  : t(
                                      "download.verification.status.notAffordableDescription"
                                    )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Overall Status Banner */}
                      <div
                        className={`relative overflow-hidden rounded-xl p-4 sm:p-6 ${canDownload ? "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20" : "bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent border border-destructive/20"}`}
                      >
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                          <div
                            className={`p-3 rounded-full ${canDownload ? "bg-primary/20" : "bg-destructive/20"}`}
                          >
                            {canDownload ? (
                              <CheckCircle className="w-6 h-6 text-primary" />
                            ) : (
                              <AlertTriangle className="w-6 h-6 text-destructive" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`text-base sm:text-lg font-bold mb-2 leading-tight ${canDownload ? "text-primary" : "text-destructive"}`}
                            >
                              {canDownload
                                ? t(
                                    "download.verification.status.readyToDownload"
                                  )
                                : t(
                                    "download.verification.status.downloadNotAvailable"
                                  )}
                            </h3>
                            <p
                              className={`text-sm sm:text-base leading-relaxed ${canDownload ? "text-primary/80" : "text-destructive/80"}`}
                            >
                              {canDownload
                                ? t(
                                    "download.verification.status.readyToDownloadDescription"
                                  )
                                : t(
                                    "download.verification.status.downloadNotAvailableDescription",
                                    {
                                      issues: failureReasons
                                        .map((reason) =>
                                          t(
                                            `download.verification.reasons.${reason}`
                                          )
                                        )
                                        .join(", "),
                                    }
                                  )}
                            </p>
                          </div>
                        </div>

                        {/* Decorative elements */}
                        <div
                          className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 ${canDownload ? "bg-primary" : "bg-destructive"}`}
                        />
                        <div
                          className={`absolute -bottom-16 -right-16 w-24 h-24 rounded-full blur-2xl opacity-10 ${canDownload ? "bg-primary" : "bg-destructive"}`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

            {/* Authentication Required State */}
            {isAuthenticationError && (
              <Card className="relative overflow-hidden border-border bg-card">
                <CardContent className="text-center py-12">
                  <div className="space-y-6 relative z-10">
                    {/* Icon */}
                    <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                      <AlertCircle className="w-10 h-10 text-muted-foreground" />
                    </div>

                    {/* Title and Description */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-foreground">
                        {t("download.verification.authentication.title")}
                      </h3>
                      <p
                        className={`text-muted-foreground text-base leading-relaxed max-w-md mx-auto ${
                          isRTL ? "text-center" : "text-center"
                        }`}
                      >
                        {t("download.verification.authentication.description")}
                      </p>
                    </div>

                    {/* Login and Register Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        {/* Login Button */}
                        <div className="flex flex-col items-center space-y-2">
                          <Button
                            onClick={handleLoginClick}
                            className="w-full sm:w-auto min-w-[140px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-200"
                            size="lg"
                          >
                            <LogIn
                              className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`}
                            />
                            {t(
                              "download.verification.authentication.loginButton"
                            )}
                          </Button>
                          <p
                            className={`text-xs text-muted-foreground max-w-[140px] leading-tight ${
                              isRTL ? "text-right" : "text-left"
                            }`}
                          >
                            {t(
                              "download.verification.authentication.loginDescription"
                            )}
                          </p>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center justify-center py-2 sm:py-0">
                          <div className="w-full h-px bg-border sm:w-px sm:h-12"></div>
                          <span className="px-3 text-muted-foreground text-sm font-medium bg-card">
                            {isRTL ? "أو" : "OR"}
                          </span>
                          <div className="w-full h-px bg-border sm:w-px sm:h-12"></div>
                        </div>

                        {/* Register Button */}
                        <div className="flex flex-col items-center space-y-2">
                          <Button
                            onClick={handleRegisterClick}
                            variant="outline"
                            className="w-full sm:w-auto min-w-[140px] border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all duration-200"
                            size="lg"
                          >
                            <UserPlus
                              className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`}
                            />
                            {t(
                              "download.verification.authentication.registerButton"
                            )}
                          </Button>
                          <p
                            className={`text-xs text-muted-foreground max-w-[140px] leading-tight ${
                              isRTL ? "text-right" : "text-left"
                            }`}
                          >
                            {t(
                              "download.verification.authentication.registerDescription"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Decorative elements using design system colors */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 bg-primary"></div>
                    <div className="absolute -bottom-16 -left-16 w-24 h-24 rounded-full blur-2xl opacity-5 bg-primary"></div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Failed Verification State (Non-Authentication Errors) */}
            {verificationData &&
              !verificationData.success &&
              !isVerifying &&
              !isAuthenticationError && (
                <Card className="border-destructive/20">
                  <CardContent className="text-center py-12">
                    <div className="space-y-4">
                      <div className="p-3 bg-destructive/10 rounded-full w-fit mx-auto">
                        <XCircle className="w-8 h-8 text-destructive" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-destructive mb-2">
                          {t("download.verification.error.verificationFailed")}
                        </h3>
                        <p className="text-destructive/80 mb-4">
                          {verificationData.error?.message ||
                            t("download.verification.error.unableToVerify")}
                        </p>
                      </div>
                      <Button
                        onClick={handleVerifyDownload}
                        variant="outline"
                        className="gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {t("download.verification.tryAgain")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>

          {/* Bottom Close Button */}
          <div className="pt-6 border-t mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="w-full"
            >
              {t("download.verification.close")}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
