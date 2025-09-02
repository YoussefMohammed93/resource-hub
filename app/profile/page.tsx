"use client";

import {
  CalendarDays,
  CreditCard,
  Download,
  TrendingUp,
  Activity,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useState, useEffect } from "react";
import {
  ProfilePageSkeleton,
  DownloadHistorySkeleton,
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
import { authApi, userApi } from "@/lib/api";
import Footer from "@/components/footer";
import Image from "next/image";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const { isRTL, isLoading } = useLanguage();
  const { t } = useTranslation("common");
  // Search filter (matches ID or URL)
  const [historyQuery, setHistoryQuery] = useState<string>("");

  // Sites provider metadata (for dynamic provider icons)
  type ProviderSite = {
    name: string;
    url: string; // domain like example.com
    icon?: string; // absolute or relative URL
    external?: boolean;
    price?: number;
    last_reset?: string;
  };
  const [sites, setSites] = useState<ProviderSite[]>([]);
  const [, setSitesError] = useState<string | null>(null);

  // Fetch provider sites list once
  useEffect(() => {
    const controller = new AbortController();
    const fetchSites = async () => {
      try {
        const res = await fetch("https://stockaty.virs.tech/v1/sites/get", {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error(`Failed to load sites (${res.status})`);
        const data = await res.json();
        const list = (data?.data?.sites || []) as ProviderSite[];
        setSites(Array.isArray(list) ? list : []);
        setSitesError(null);
      } catch (e: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((e as any)?.name === "AbortError") return;
        const msg =
          typeof e === "object" && e && "message" in e
            ? String((e as { message?: unknown }).message)
            : "Failed to load sites";
        setSitesError(msg);
      }
    };
    fetchSites();
    return () => controller.abort();
  }, []);

  // Helpers to resolve icon by provider name or host
  const normalize = (s?: string) => (s || "").trim().toLowerCase();
  const resolveIconUrl = (icon?: string): string | undefined => {
    if (!icon) return undefined;
    if (/^https?:\/\//i.test(icon)) return icon;
    // Prefix relative icons with API origin
    return `https://stockaty.virs.tech/${icon.replace(/^\/?/, "")}`;
  };
  const getIconForProvider = (nameOrHost?: string): string | undefined => {
    const key = normalize(nameOrHost);
    if (!key) return undefined;
    // Try exact name match
    let site = sites.find((s) => normalize(s.name) === key);
    if (!site) {
      // Try host/domain match (includes for subdomains)
      site = sites.find(
        (s) => key.includes(normalize(s.url)) || normalize(s.url).includes(key)
      );
    }
    return resolveIconUrl(site?.icon);
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Stop profile loading when auth status has resolved
  useEffect(() => {
    if (!authLoading) {
      setIsProfileLoading(false);
    }
  }, [authLoading]);

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
  // Download history state
  type UserHistoryItem = {
    id?: string;
    from: string;
    type?: string; // photo | video | vector | audio (future)
    price: number;
    date?: string;
    file: string; // direct file/media URL
  };
  const [history, setHistory] = useState<UserHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Password change handlers
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fetch download history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await userApi.getDownloadHistory();
        if (res.success) {
          // Support both shapes:
          // 1) swagger: { downloads: [{ from, type, price, date, file }] }
          // 2) current: { history: [{ type: 'download', data: { id, downloadUrl, from, price } }] }
          type DownloadsItem = {
            id?: string;
            from?: string;
            type?: string;
            price?: number;
            date?: string;
            file?: string;
          };
          type HistoryItem = {
            type?: string;
            data?: {
              id?: string;
              downloadUrl?: string;
              from?: string;
              price?: number;
            };
          };

          const isDownloadsShape = (
            v: unknown
          ): v is { downloads: DownloadsItem[] } => {
            return (
              typeof v === "object" &&
              v !== null &&
              Array.isArray((v as Record<string, unknown>).downloads)
            );
          };
          const isHistoryShape = (
            v: unknown
          ): v is { history: HistoryItem[] } => {
            return (
              typeof v === "object" &&
              v !== null &&
              Array.isArray((v as Record<string, unknown>).history)
            );
          };

          const rawDownloads = isDownloadsShape(res) ? res.downloads : [];
          const rawHistory = isHistoryShape(res) ? res.history : [];

          let mapped: UserHistoryItem[] = [];

          if (rawDownloads.length > 0) {
            mapped = rawDownloads.map((d: DownloadsItem) => ({
              id: d.id,
              from: d.from ?? "",
              type: d.type,
              price: d.price ?? 0,
              date: d.date,
              file: d.file ?? "",
            }));
          } else if (rawHistory.length > 0) {
            type HistoryItemWithData = {
              type?: string;
              data: NonNullable<HistoryItem["data"]>;
            };
            const hasData = (h: unknown): h is HistoryItemWithData =>
              typeof h === "object" &&
              h !== null &&
              "data" in (h as Record<string, unknown>) &&
              typeof (h as { data?: unknown }).data === "object" &&
              (h as { data?: unknown }).data !== null;

            mapped = rawHistory
              .filter(hasData)
              .map((h: HistoryItemWithData) => ({
                id: h.data.id,
                from: h.data.from ?? "",
                // top-level `type` here is event type ('download'); media type is unknown
                type: h.type,
                price: h.data.price ?? 0,
                // no explicit date in this shape
                date: undefined,
                file: h.data.downloadUrl ?? "",
              }));
          }
          setHistory(mapped);
        } else {
          setHistoryError(res.error?.message || "Failed to load history");
        }
      } catch (e: unknown) {
        const message =
          typeof e === "object" && e && "message" in e
            ? String((e as { message?: unknown }).message)
            : undefined;
        setHistoryError(message || "Failed to load history");
      } finally {
        setIsHistoryLoading(false);
      }
    };
    if (isAuthenticated) fetchHistory();
  }, [isAuthenticated]);

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
      const result = await authApi.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (result.success) {
        // Clear form on success
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Show success message (you can add toast notification here)
        console.log("Password changed successfully:", result.data?.message);
      } else {
        // Handle API error
        console.error("Password change failed:", result.error?.message);
        // You can add toast notification or error state here
      }
    } catch (error) {
      console.error("Password change error:", error);
      // Handle unexpected errors
    } finally {
      setIsPasswordLoading(false);
    }
  };

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
        <div className="px-4 sm:px-5 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              aria-label={t("header.logo")}
              className="flex items-center"
            >
              <div className="relative w-44 sm:w-48 h-12">
                <Image
                  src="/logo-black.png"
                  alt={t("header.logo")}
                  fill
                  className="block dark:hidden"
                  priority
                />
                <Image
                  src="/logo-white.png"
                  alt={t("header.logo")}
                  fill
                  className="hidden dark:block"
                  priority
                />
              </div>
            </Link>
            <HeaderControls />
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="px-5 py-6 sm:py-8 space-y-4 sm:space-y-5 mb-5">
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
                        {history.length}
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
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {/* Current Plan mini-card */}
                <div className="rounded-xl border bg-card/60 dark:bg-muted/40 p-4 h-full">
                  <div
                    className={`flex items-start ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
                  >
                    <div className="w-9 h-9 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base text-muted-foreground">
                        {t("profile.subscription.currentPlan")}
                      </p>
                      <div
                        className={`mt-1 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        <Badge
                          variant="outline"
                          className="font-medium text-sm"
                        >
                          {user?.subscription?.plan || "Free"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status mini-card */}
                <div className="rounded-xl border bg-card/60 dark:bg-muted/40 p-4 h-full">
                  <div
                    className={`flex items-start ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
                  >
                    <div className="w-9 h-9 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base text-muted-foreground">
                        {t("profile.subscription.status")}
                      </p>
                      <div
                        className={`mt-1 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        <Badge
                          variant={
                            user?.subscription?.active
                              ? "default"
                              : "destructive"
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
                    </div>
                  </div>
                </div>

                {/* Valid Until mini-card */}
                <div className="rounded-xl border bg-card/60 dark:bg-muted/40 p-4 h-full">
                  <div
                    className={`flex items-start ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
                  >
                    <div className="w-9 h-9 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <CalendarDays className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base text-muted-foreground">
                        {t("profile.subscription.validUntil")}
                      </p>
                      <div
                        className={`mt-1 flex items-center text-sm text-foreground ${isRTL ? "flex-row-reverse justify-end" : "justify-start"}`}
                      >
                        {user?.subscription?.until ? (
                          <span className="truncate">
                            {formatDate(user.subscription.until)}
                          </span>
                        ) : (
                          <span className="truncate">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
        {/* Download History Card */}
        <Card className="dark:bg-muted/50">
          <CardHeader>
            <div
              className={`flex items-start justify-between ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
            >
              <div
                className={`flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"}`}
              >
                <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {t("profile.downloadHistory.title")}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {t("profile.downloadHistory.headerDescriptionAlt")}
                  </p>
                </div>
              </div>
              <div
                className={`w-full sm:w-80 ${isRTL ? "text-right" : "text-left"}`}
              >
                <div className="relative">
                  <Search
                    className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${isRTL ? "right-2" : "left-2"}`}
                  />
                  <Input
                    value={historyQuery}
                    onChange={(e) => setHistoryQuery(e.target.value)}
                    placeholder={t("profile.downloadHistory.searchPlaceholder")}
                    className={`${isRTL ? "pr-8" : "pl-8"} h-9`}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isHistoryLoading ? (
              <DownloadHistorySkeleton isRTL={isRTL} />
            ) : historyError ? (
              <div className="text-sm text-red-500">{historyError}</div>
            ) : history.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                {t("profile.downloadHistory.noDownloads")}
              </div>
            ) : (
              (() => {
                const q = historyQuery.trim().toLowerCase();
                const filteredHistory = q
                  ? history.filter(
                      (item) =>
                        (item.id || "").toLowerCase().includes(q) ||
                        (item.file || "").toLowerCase().includes(q)
                    )
                  : history;
                if (!filteredHistory.length) {
                  return (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-muted flex items-center justify-center rounded-full mb-4">
                        <Search className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <div className="text-lg font-medium text-foreground mb-1">
                        {t("profile.downloadHistory.emptySearch.title")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("profile.downloadHistory.emptySearch.description")}
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th
                            className={`py-2 px-3 w-10 ${isRTL ? "text-right" : "text-left"}`}
                          >
                            {`${isRTL ? "أيقون المعرّف" : "Provider Icon"}`}
                          </th>
                          <th
                            className={`py-2 px-3 ${isRTL ? "text-right" : "text-left"}`}
                          >
                            {t("profile.downloadHistory.labels.website")}
                          </th>
                          <th
                            className={`py-2 px-3 ${isRTL ? "text-right" : "text-left"}`}
                          >
                            {t("profile.downloadHistory.credits")}
                          </th>
                          <th
                            className={`py-2 px-3 text-left ${isRTL ? "text-right" : "text-left"}`}
                          >
                            {t("profile.downloadHistory.labels.id")}
                          </th>
                          <th
                            className={`py-2 px-3 ${isRTL ? "text-right" : "text-left"}`}
                          >
                            {t("profile.downloadHistory.labels.url")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="align-top">
                        {filteredHistory.map((item, idx) => {
                          let websiteName = item.from;
                          if (!websiteName) {
                            try {
                              const u = new URL(item.file);
                              const host = u.hostname.replace(/^www\./, "");
                              websiteName = host.split(".")[0] || host;
                            } catch {}
                          }
                          return (
                            <tr key={item.id ?? idx} className="border-b">
                              <td className="py-2 px-3 min-w-[150px]">
                                {(() => {
                                  const iconSrc = getIconForProvider(
                                    websiteName || item.from
                                  );
                                  if (!iconSrc) return null;
                                  return (
                                    <div className="relative w-6 h-6 sm:w-9 sm:h-9">
                                      <Image
                                        src={iconSrc}
                                        alt={`${websiteName || item.from || ""} icon`}
                                        fill
                                        sizes="36"
                                        className="object-contain rounded"
                                      />
                                    </div>
                                  );
                                })()}
                              </td>
                              <td className="py-2 px-3">
                                <Badge variant="secondary">
                                  {item.from || websiteName}
                                </Badge>
                              </td>
                              <td className="py-2 px-3">
                                <Badge variant="outline">
                                  {item.price}{" "}
                                  {t("profile.downloadHistory.credits")}
                                </Badge>
                              </td>
                              <td
                                className="py-2 px-3 font-mono text-xs max-w-[10rem] truncate"
                                title={item.id || ""}
                              >
                                {item.id || "-"}
                              </td>
                              <td className="py-2 px-3 max-w-[22rem]">
                                <a
                                  href={item.file}
                                  target="_blank"
                                  rel="noreferrer"
                                  title={item.file}
                                  className="block w-full truncate text-primary hover:underline"
                                >
                                  {item.file}
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
