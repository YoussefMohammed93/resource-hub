"use client";

import {
  CalendarDays,
  CreditCard,
  Download,
  Filter,
  TrendingUp,
  Settings,
  Activity,
  Search,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useCallback } from "react";
import {
  ProfilePageSkeleton,
  DownloadHistoryItemSkeleton,
} from "@/components/profile-page-skeletons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/components/i18n-provider";
import { HeaderControls } from "@/components/header-controls";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { userApi, type DownloadHistoryEntry } from "@/lib/api";

// Utility function to get the correct media URL based on environment and type
const getMediaUrl = (item: DownloadHistoryEntry): string => {
  console.log("[Profile] Processing media URL for item:", {
    from: item.data.from,
    downloadUrl: item.data.downloadUrl,
  });

  // For local files (mock data), use them directly - they work on both localhost and Vercel
  if (item.data.downloadUrl.startsWith("/")) {
    console.log("[Profile] Using local file:", item.data.downloadUrl);
    return item.data.downloadUrl; // This will be "/freepik-1.jpg" from mock data
  }

  // For external URLs (Freepik, etc.), use the media proxy
  if (item.data.downloadUrl.startsWith("http")) {
    const proxyUrl = `/api/media-proxy?url=${encodeURIComponent(item.data.downloadUrl)}`;
    console.log("[Profile] Using media proxy:", proxyUrl);
    return proxyUrl;
  }

  // Fallback to the original file URL
  console.log("[Profile] Using fallback URL:", item.data.downloadUrl);
  return item.data.downloadUrl;
};

// Utility function to check if the item is a video
const isVideoItem = (item: DownloadHistoryEntry): boolean => {
  return (
    item.data.downloadUrl.includes("video") ||
    item.data.downloadUrl.includes(".mp4") ||
    item.data.downloadUrl.includes(".mov")
  );
};

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [sortFilter, setSortFilter] = useState("newest");
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isDownloadHistoryLoading, setIsDownloadHistoryLoading] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadHistory, setDownloadHistory] = useState<
    DownloadHistoryEntry[]
  >([]);
  const [downloadHistoryError, setDownloadHistoryError] = useState<
    string | null
  >(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [imageLoading, setImageLoading] = useState<Set<number>>(new Set());
  const { isRTL, isLoading } = useLanguage();
  const { t } = useTranslation("common");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Password change handlers
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }

    if (passwordData.newPassword.length < 8) {
      return;
    }

    setIsPasswordLoading(true);

    try {
      // Password change API implementation would go here
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      // Error handling would go here
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // Load download history
  const loadDownloadHistory = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsDownloadHistoryLoading(true);
    setDownloadHistoryError(null);
    try {
      const response = await userApi.getDownloadHistory();

      if (response.success) {
        // Handle new response structure: response.data.history or direct response.history
        if (response.data && response.data.history) {
          setDownloadHistory(response.data.history);
        } else if ("history" in response && Array.isArray(response.history)) {
          setDownloadHistory(response.history as DownloadHistoryEntry[]);
        } else {
          setDownloadHistory([]);
        }
      } else {
        const errorMessage =
          response.error?.message || "Failed to load download history";
        setDownloadHistoryError(errorMessage);
        setDownloadHistory([]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Network error occurred";
      setDownloadHistoryError(errorMessage);
      setDownloadHistory([]);
    } finally {
      setIsDownloadHistoryLoading(false);
    }
  }, [isAuthenticated]);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setIsProfileLoading(false);
      loadDownloadHistory();
    }
  }, [isAuthenticated, user, loadDownloadHistory]);

  // Reset image states when download history changes
  useEffect(() => {
    setImageErrors(new Set());
    // Set all images as loading initially
    const loadingSet = new Set<number>();
    downloadHistory.forEach((_, index) => {
      loadingSet.add(index);
    });
    setImageLoading(loadingSet);
  }, [downloadHistory]);

  // Show loading skeleton while authentication, language data or profile data is loading
  if (authLoading || isLoading || isProfileLoading) {
    return <ProfilePageSkeleton />;
  }

  // Show loading if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Filter downloads based on search query
  const filteredDownloads = downloadHistory.filter((item) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      item.data.from.toLowerCase().includes(query) ||
      item.data.id.toLowerCase().includes(query) ||
      item.data.downloadUrl.toLowerCase().includes(query)
    );
  });

  const sortedDownloads = [...filteredDownloads].sort((a, b) => {
    switch (sortFilter) {
      case "newest":
        // Since we don't have date in new format, sort by ID (newer IDs are typically later)
        return b.data.id.localeCompare(a.data.id);
      case "oldest":
        return a.data.id.localeCompare(b.data.id);
      case "credits-high":
        return b.data.price - a.data.price;
      case "credits-low":
        return a.data.price - b.data.price;
      default:
        return 0;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate credits percentage
  const totalCredits = user?.subscription?.credits?.plan || 0;
  const remainingCredits = user?.subscription?.credits?.remaining || 0;
  const usedCredits = totalCredits - remainingCredits;
  const creditsUsedPercentage =
    totalCredits > 0 ? (usedCredits / totalCredits) * 100 : 0;

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.account?.firstName && user?.account?.lastName) {
      return `${user.account.firstName} ${user.account.lastName}`;
    }
    return user?.account?.email || "User";
  };

  // Get user initials
  const getUserInitials = () => {
    if (user?.account?.firstName && user?.account?.lastName) {
      return `${user.account.firstName.charAt(0)}${user.account.lastName.charAt(0)}`.toUpperCase();
    }
    return user?.account?.email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <div
      className={`min-h-screen bg-secondary/50 ${isRTL ? "font-tajawal" : "font-sans"}`}
    >
      {/* Header */}
      <header className="bg-background border-b border-border">
        <header className="px-4 sm:px-5 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className={`flex items-center ${isRTL ? "space-x-reverse !space-x-2" : "space-x-2"}`}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
              </div>
              <span className="text-base sm:text-xl font-semibold text-foreground">
                {t("header.logo")}
              </span>
            </Link>
            <HeaderControls />
          </div>
        </header>
      </header>
      {/* Main Content */}
      <main className="px-5 py-6 sm:py-8 space-y-4 sm:space-y-5">
        {/* User Info Section */}
        <Card className="overflow-hidden dark:bg-muted/50 border-none shadow-xs py-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="relative p-6 sm:p-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl"></div>
            {/* Content */}
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                {/* Avatar Section */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <Avatar className="relative h-24 w-24 sm:h-28 sm:w-28 border-4 border-background/80 backdrop-blur-sm">
                    <AvatarImage
                      src={user?.account?.picture || ""}
                      alt={getUserDisplayName()}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online Status Indicator */}
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-background rounded-full animate-pulse"></div>
                </div>
                {/* User Info */}
                <div className="text-center sm:text-left flex-1 space-y-4">
                  <div className="space-y-2 flex flex-col">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                      {getUserDisplayName()}
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground font-medium">
                      {user?.account?.email}
                    </p>
                    {/* Status Badges */}
                    <div>
                      <Badge
                        variant="outline"
                        className="px-4 py-2 text-sm font-semibold bg-secondary/80 hover:bg-secondary transition-colors"
                      >
                        <CreditCard
                          className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`}
                        />
                        {user?.subscription?.plan || "Free"}{" "}
                        {t("profile.userInfo.member")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Total Downloads Card */}
          <Card className="group dark:bg-muted/50">
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="space-y-3 sm:space-y-4 flex-1">
                  <div
                    className={`flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center">
                      <Download className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-medium text-foreground uppercase tracking-wide">
                        {t("profile.stats.totalDownloads.title")}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground/80">
                        {t("profile.stats.totalDownloads.description")}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div
                      className={`flex items-baseline ${isRTL ? "space-x-reverse !space-x-2" : "space-x-2"}`}
                    >
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {downloadHistory.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Credits Used Card */}
          <Card className="group dark:bg-muted/50">
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="space-y-3 sm:space-y-4 flex-1">
                  <div
                    className={`flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-medium text-foreground uppercase tracking-wide">
                        {t("profile.stats.creditsUsed.title")}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground/80">
                        {t("profile.stats.creditsUsed.description")}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div
                      className={`flex items-baseline ${isRTL ? "space-x-reverse !space-x-2" : "space-x-2"}`}
                    >
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {usedCredits}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Credits Remaining Card */}
          <Card className="group dark:bg-muted/50">
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="space-y-3 sm:space-y-4 flex-1">
                  <div
                    className={`flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-medium text-foreground uppercase tracking-wide">
                        {t("profile.stats.creditsRemaining.title")}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground/80">
                        {t("profile.stats.creditsRemaining.description")}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div
                      className={`flex items-baseline ${isRTL ? "space-x-reverse !space-x-2" : "space-x-2"}`}
                    >
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {remainingCredits}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Plan Status Card */}
          <Card className="group dark:bg-muted/50">
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="space-y-3 sm:space-y-4 flex-1">
                  <div
                    className={`flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center relative">
                      <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      {user?.subscription?.active && (
                        <div
                          className={`absolute -top-1 w-3 h-3 bg-green-500 rounded-full animate-pulse ${isRTL ? "-left-1" : "-right-1"}`}
                        ></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-medium text-foreground uppercase tracking-wide">
                        {t("profile.stats.planStatus.title")}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground/80">
                        {t("profile.stats.planStatus.description")}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div
                      className={`flex items-baseline ${isRTL ? "space-x-reverse !space-x-2" : "space-x-2"}`}
                    >
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground group-hover:text-primary transition-colors capitalize">
                        {t("profile.userInfo.active")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Subscription, Credits & Change Password Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Subscription Card */}
          <Card className="dark:bg-muted/50">
            <CardHeader>
              <div
                className={`flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
              >
                <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {t("profile.subscription.title")}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {t("profile.subscription.description")}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {t("profile.subscription.currentPlan")}
                  </span>
                  <Badge variant="outline" className="font-medium">
                    {user?.subscription?.plan || "Free"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {t("profile.subscription.status")}
                  </span>
                  <Badge
                    variant={
                      user?.subscription?.active ? "default" : "destructive"
                    }
                    className={
                      user?.subscription?.active
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : ""
                    }
                  >
                    {t("profile.userInfo.active")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {t("profile.subscription.validUntil")}
                  </span>
                  <div
                    className={`flex items-center gap-1 text-sm text-foreground ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <CalendarDays className="h-4 w-4" />
                    {user?.subscription?.until
                      ? formatDate(user.subscription.until)
                      : "N/A"}
                  </div>
                </div>
              </div>
              <Separator />
              <Button className="w-full" variant="outline">
                <Settings className="w-4 h-4" />
                {t("profile.subscription.manageSubscription")}
              </Button>
            </CardContent>
          </Card>

          {/* Credits Card */}
          <Card className="dark:bg-muted/50">
            <CardHeader>
              <div
                className={`flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
              >
                <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {t("profile.credits.title")}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {t("profile.credits.description")}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="text-center space-y-2 w-fit bg-secondary/75 dark:bg-secondary  p-4 rounded-xl">
                  <div className="text-3xl font-bold text-primary">
                    {remainingCredits}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("profile.credits.remaining")}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">
                    {t("profile.credits.usageProgress")}
                  </span>
                  <span className="font-medium text-foreground">
                    {Math.round(creditsUsedPercentage)}%
                  </span>
                </div>
                <Progress value={creditsUsedPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {usedCredits} {t("profile.credits.used")}
                  </span>
                  <span>
                    {totalCredits} {t("profile.credits.total")}
                  </span>
                </div>
              </div>
              <Separator />
              <Button className="w-full">
                <CreditCard className="w-4 h-4" />
                {t("profile.credits.buyMore")}
              </Button>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="dark:bg-muted/50">
            <CardHeader>
              <div
                className={`flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
              >
                <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {t("profile.changePassword.title")}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {t("profile.changePassword.description")}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPassword"
                      className="text-sm font-medium text-foreground"
                    >
                      {t("profile.changePassword.currentPassword")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "currentPassword",
                            e.target.value
                          )
                        }
                        placeholder={t(
                          "profile.changePassword.currentPasswordPlaceholder"
                        )}
                        className={`${isRTL ? "pr-10 pl-3" : "pl-3 pr-10"}`}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`absolute top-1/2 transform -translate-y-1/2 h-8 w-8 ${isRTL ? "left-1" : "right-1"}`}
                        onClick={() => togglePasswordVisibility("current")}
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="text-sm font-medium text-foreground"
                    >
                      {t("profile.changePassword.newPassword")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          handlePasswordChange("newPassword", e.target.value)
                        }
                        placeholder={t(
                          "profile.changePassword.newPasswordPlaceholder"
                        )}
                        className={`${isRTL ? "pr-10 pl-3" : "pl-3 pr-10"}`}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`absolute top-1/2 transform -translate-y-1/2 h-8 w-8 ${isRTL ? "left-1" : "right-1"}`}
                        onClick={() => togglePasswordVisibility("new")}
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-foreground"
                    >
                      {t("profile.changePassword.confirmPassword")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        placeholder={t(
                          "profile.changePassword.confirmPasswordPlaceholder"
                        )}
                        className={`${isRTL ? "pr-10 pl-3" : "pl-3 pr-10"}`}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`absolute top-1/2 transform -translate-y-1/2 h-8 w-8 ${isRTL ? "left-1" : "right-1"}`}
                        onClick={() => togglePasswordVisibility("confirm")}
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <p className="text-xs text-muted-foreground">
                    {t("profile.changePassword.passwordRequirements")}
                  </p>
                </div>

                <Separator />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPasswordLoading}
                >
                  {isPasswordLoading ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  {t("profile.changePassword.updatePassword")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        {/* Download History - Full Width */}
        <Card className="dark:bg-muted/50 h-fit">
          <CardHeader className="space-y-6">
            <div
              className={`flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
            >
              <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-foreground">
                  {t("profile.downloadHistory.title")}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                  {t("profile.downloadHistory.description")}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search
                  className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground ${isRTL ? "right-3" : "left-3"}`}
                />
                <Input
                  type="text"
                  placeholder="Source / Source ID / URL / Tag / Debug ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${isRTL ? "pr-10 pl-3" : "pl-10 pr-3"} h-10`}
                />
              </div>
              {/* Filter */}
              <div className="flex sm:justify-end w-full sm:w-auto">
                <Select value={sortFilter} onValueChange={setSortFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="w-4 h-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">
                      {t("profile.downloadHistory.filters.newest")}
                    </SelectItem>
                    <SelectItem value="oldest">
                      {t("profile.downloadHistory.filters.oldest")}
                    </SelectItem>
                    <SelectItem value="credits-high">
                      {t("profile.downloadHistory.filters.creditsHigh")}
                    </SelectItem>
                    <SelectItem value="credits-low">
                      {t("profile.downloadHistory.filters.creditsLow")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isDownloadHistoryLoading ? (
              // Show loading skeletons while download history is loading
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }, (_, i) => (
                  <DownloadHistoryItemSkeleton key={i} isRTL={isRTL} />
                ))}
              </div>
            ) : downloadHistoryError ? (
              <div className="py-12 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                    <Download className="w-9 h-9 text-destructive" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-medium text-foreground">
                      Error Loading Download History
                    </p>
                    <p className="text-base sm:text-lg pt-2 text-muted-foreground">
                      {downloadHistoryError}
                    </p>
                    <Button
                      variant="outline"
                      onClick={loadDownloadHistory}
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            ) : sortedDownloads.length === 0 ? (
              <div className="py-12 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                    <Download className="w-9 h-9 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-medium text-foreground">
                      {t("profile.downloadHistory.empty.title")}
                    </p>
                    <p className="text-base sm:text-lg pt-2 text-muted-foreground">
                      {t("profile.downloadHistory.empty.description")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {sortedDownloads.map((item, index) => (
                  <div
                    key={index}
                    className="group bg-secondary/50 dark:bg-muted/50 border border-border/50 rounded-xl p-4 space-y-4 hover:bg-card hover:border-border transition-all duration-300"
                  >
                    {/* Header with source and ID */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="font-semibold text-foreground text-sm">
                            {item.data.from}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            ID: {item.data.id.substring(0, 30)}...
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs font-medium">
                        {item.data.price} credits
                      </Badge>
                    </div>
                    {/* Download URL preview */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          {item.data.downloadUrl.includes("video")
                            ? "Video"
                            : "Image"}
                        </Badge>
                        <span className="text-xs text-muted-foreground truncate flex-1">
                          {new URL(item.data.downloadUrl).hostname}
                        </span>
                      </div>
                    </div>
                    {/* Main Media Display */}
                    <div
                      className="relative aspect-video bg-muted/30 rounded-xl overflow-hidden cursor-pointer group/media border border-border/30 hover:border-border/60 transition-all duration-300"
                      onClick={() =>
                        window.open(item.data.downloadUrl, "_blank")
                      }
                    >
                      {imageErrors.has(index) ? (
                        // Fallback display when media fails to load
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/60">
                          <div className="text-center space-y-3 p-4">
                            <div>
                              <p className="text-sm text-foreground font-medium capitalize">
                                {item.data.downloadUrl.includes("video")
                                  ? "Video"
                                  : "Image"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Click to view on {item.data.from}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Loading skeleton */}
                          {imageLoading.has(index) && (
                            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/80 animate-pulse flex items-center justify-center">
                              <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <p className="text-xs text-muted-foreground">
                                  Loading...
                                </p>
                              </div>
                            </div>
                          )}
                          {isVideoItem(item) ? (
                            // Video preview with play button overlay
                            <div className="relative w-full h-full">
                              <Image
                                src={getMediaUrl(item)}
                                alt={`Media from ${item.data.from}`}
                                fill
                                className="object-cover transition-transform duration-500"
                                onLoadingComplete={() => {
                                  setImageLoading((prev) => {
                                    const newSet = new Set(prev);
                                    newSet.delete(index);
                                    return newSet;
                                  });
                                }}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onError={(e: any) => {
                                  console.log(
                                    "[Profile] Image load error for item:",
                                    {
                                      index,
                                      item,
                                      src: getMediaUrl(item),
                                      error: e,
                                    }
                                  );
                                  setImageErrors((prev) =>
                                    new Set(prev).add(index)
                                  );
                                  setImageLoading((prev) => {
                                    const newSet = new Set(prev);
                                    newSet.delete(index);
                                    return newSet;
                                  });
                                }}
                              />
                              {/* Video play button overlay */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/media:bg-black/40 transition-all duration-300">
                                <div className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform duration-300">
                                  <div className="w-0 h-0 border-l-[14px] border-l-black border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1"></div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Regular image display
                            <Image
                              src={getMediaUrl(item)}
                              alt={`Media from ${item.data.from}`}
                              fill
                              className="object-cover transition-transform duration-500"
                              onLoadingComplete={() => {
                                setImageLoading((prev) => {
                                  const newSet = new Set(prev);
                                  newSet.delete(index);
                                  return newSet;
                                });
                              }}
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              onError={(e: any) => {
                                console.log(
                                  "[Profile] Image load error for item:",
                                  {
                                    index,
                                    item,
                                    src: getMediaUrl(item),
                                    error: e,
                                  }
                                );
                                setImageErrors((prev) =>
                                  new Set(prev).add(index)
                                );
                                setImageLoading((prev) => {
                                  const newSet = new Set(prev);
                                  newSet.delete(index);
                                  return newSet;
                                });
                              }}
                            />
                          )}
                        </>
                      )}
                      {/* Type Badge Overlay */}
                      <div className="absolute top-3 right-3 z-10">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-black/80 backdrop-blur-sm text-white border-none px-2 py-1 font-medium"
                        >
                          {item.data.downloadUrl.includes("video")
                            ? "Video"
                            : "Image"}
                        </Badge>
                      </div>
                    </div>
                    {/* Footer with download button */}
                    <div className="pt-2">
                      <Button
                        size="sm"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200"
                        onClick={() =>
                          window.open(item.data.downloadUrl, "_blank")
                        }
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Open in {item.data.from}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!isDownloadHistoryLoading && sortedDownloads.length > 4 && (
              <div className="mt-6 text-center">
                <Button variant="outline">
                  {t("profile.downloadHistory.loadMore")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
