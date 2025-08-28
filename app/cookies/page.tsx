/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Trash2,
  Menu,
  Cookie,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle,
  Mail,
  User,
  CreditCard,
  Calendar,
  Crown,
  Hash,
  Filter,
  X,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/sidebar";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/components/i18n-provider";
import { HeaderControls } from "@/components/header-controls";
import { AdminRouteGuard } from "@/components/admin-route-guard";
import { cookieApi, siteApi, type CookieData, type Site } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { toast } from "sonner";

// Website option interface for the select dropdown
interface WebsiteOption {
  value: string;
  label: string;
  icon: string;
  iconColor: string;
}

// Helper function to generate icon and color for platform
function getPlatformIcon(
  platformName: string,
  websites: WebsiteOption[]
): { icon: string; iconColor: string } {
  const website = websites.find((w) => w.value === platformName.toLowerCase());
  return website
    ? { icon: website.icon, iconColor: website.iconColor }
    : {
        icon: platformName.charAt(0).toUpperCase(),
        iconColor: "bg-primary",
      };
}

// Helper function to convert Site to WebsiteOption
function siteToWebsiteOption(site: Site): WebsiteOption {
  const name = site.name.toLowerCase();
  const firstLetter = site.name.charAt(0).toUpperCase();

  // Map common site names to colors
  const colorMap: Record<string, string> = {
    twitter: "bg-blue-500",
    facebook: "bg-blue-600",
    instagram: "bg-pink-500",
    youtube: "bg-red-500",
    tiktok: "bg-black",
    linkedin: "bg-blue-700",
    pinterest: "bg-red-600",
    reddit: "bg-orange-500",
    snapchat: "bg-yellow-400",
    discord: "bg-indigo-500",
    telegram: "bg-blue-400",
    whatsapp: "bg-green-500",
    freepik: "bg-blue-500",
    shutterstock: "bg-red-500",
    adobe: "bg-red-600",
    unsplash: "bg-gray-800",
    pexels: "bg-green-600",
    pixabay: "bg-green-500",
  };

  return {
    value: name,
    label: site.name,
    icon: firstLetter,
    iconColor: colorMap[name] || "bg-primary",
  };
}

// Cookies Page Skeleton Component
function CookiesPageSkeleton({ isRTL }: { isRTL: boolean }) {
  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? "font-tajawal" : "font-sans"}`}
    >
      {/* Sidebar Skeleton */}
      <div
        className={`fixed ${isRTL ? "right-0 border-l" : "left-0 border-r"} top-0 w-72 h-screen bg-background border-border z-50 hidden lg:block`}
      >
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Header Skeleton */}
      <header
        className={`${isRTL ? "lg:mr-72" : "lg:ml-72"} border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40`}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 h-16">
          <div
            className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}
          >
            <Skeleton className="h-8 w-8 rounded-lg lg:hidden" />
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center lg:hidden">
              <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main
        className={`relative flex-1 min-h-screen ${isRTL ? "lg:mr-72" : "lg:ml-72"} p-4 sm:p-5 space-y-4 sm:space-y-5 bg-secondary/50 overflow-hidden`}
      >
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top Left Dots Grid */}
          <svg
            className={`absolute top-20 ${isRTL ? "right-10" : "left-10"} w-32 h-24 opacity-20`}
            viewBox="0 0 140 100"
            fill="none"
          >
            {Array.from({ length: 5 }, (_, row) =>
              Array.from({ length: 7 }, (_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={10 + col * 18}
                  cy={10 + row * 16}
                  r="2"
                  fill="currentColor"
                  className="text-primary animate-pulse"
                  style={{
                    animationDelay: `${(row + col) * 0.3}s`,
                    animationDuration: "4s",
                  }}
                />
              ))
            )}
          </svg>

          <svg
            className={`absolute bottom-20 ${isRTL ? "left-10" : "right-10"} w-32 h-24 opacity-20`}
            viewBox="0 0 140 100"
            fill="none"
          >
            {Array.from({ length: 5 }, (_, row) =>
              Array.from({ length: 7 }, (_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={10 + col * 18}
                  cy={10 + row * 16}
                  r="2"
                  fill="currentColor"
                  className="text-primary animate-pulse"
                  style={{
                    animationDelay: `${(row + col) * 0.3}s`,
                    animationDuration: "4s",
                  }}
                />
              ))
            )}
          </svg>

          {/* Top Right Cookie Icon */}
          <div
            className={`absolute top-32 ${isRTL ? "left-20" : "right-20"} animate-float`}
          >
            <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
              <Cookie className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* Bottom Left Filter Icon */}
          <div
            className={`absolute bottom-40 ${isRTL ? "right-16" : "left-16"} animate-float`}
            style={{ animationDelay: "1s" }}
          >
            <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
              <Filter className="w-5 h-5 text-primary/80" />
            </div>
          </div>

          {/* Bottom Right Dots Grid */}
          <svg
            className={`absolute bottom-20 ${isRTL ? "left-16" : "right-16"} w-28 h-20 opacity-15`}
            viewBox="0 0 120 80"
            fill="none"
          >
            {Array.from({ length: 4 }, (_, row) =>
              Array.from({ length: 6 }, (_, col) => (
                <circle
                  key={`bottom-${row}-${col}`}
                  cx={8 + col * 18}
                  cy={8 + row * 16}
                  r="1.5"
                  fill="currentColor"
                  className="text-primary animate-pulse"
                  style={{
                    animationDelay: `${(row + col) * 0.4}s`,
                    animationDuration: "5s",
                  }}
                />
              ))
            )}
          </svg>
        </div>

        {/* Page Header Skeleton */}
        <div
          className={`flex ${isRTL ? "sm:flex-row" : "sm:flex-row"} flex-col sm:items-center justify-between gap-4`}
        >
          <div className={`space-y-2 ${isRTL ? "text-right" : "text-left"}`}>
            <Skeleton className="h-8 sm:h-9 w-48 sm:w-64" />
            <Skeleton className="h-5 w-72 sm:w-96" />
          </div>

          {/* Filter and Add Button Container Skeleton */}
          <div
            className={`w-full sm:w-auto flex ${isRTL ? "flex-row-reverse" : "flex-row"} items-center gap-3`}
          >
            {/* Website Filter Skeleton */}
            <div className="w-full sm:w-auto flex items-center gap-2">
              <Skeleton className="h-10 w-full sm:w-48" />
            </div>
          </div>
        </div>

        {/* Add Cookie Button Skeleton */}
        <div className={`flex ${isRTL ? "justify-start" : "justify-end"} mb-4`}>
          <Skeleton className="h-10 w-full sm:w-48" />
        </div>

        {/* Cookies Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <Card
              key={i}
              className="group relative bg-primary/5 dark:bg-muted/75 border border-border rounded-2xl p-6 overflow-hidden"
            >
              {/* Website Icon Skeleton */}
              <div
                className={`absolute ${isRTL ? "right-4" : "left-4"} top-4 z-10`}
              >
                <Skeleton className="w-10 h-10 rounded-lg" />
              </div>

              {/* Delete Button Skeleton */}
              <div
                className={`absolute ${isRTL ? "left-4" : "right-4"} top-4 z-20`}
              >
                <Skeleton className="h-8 w-8 rounded" />
              </div>

              {/* Background Cookie Icon Skeleton */}
              <div
                className={`absolute -top-24 opacity-10 ${isRTL ? "-left-8" : "-right-8"}`}
              >
                <Cookie className="w-28 h-28 text-orange-500 transform rotate-12" />
              </div>

              {/* Content Skeleton */}
              <div
                className={`relative z-10 space-y-4 mt-16 ${isRTL ? "text-right" : "text-left"}`}
              >
                {/* Domain Title */}
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {Array.from({ length: 5 }, (_, j) => (
                    <div
                      key={j}
                      className={`flex ${isRTL ? "flex-row" : ""} justify-between items-center`}
                    >
                      <div
                        className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Skeleton className="w-4 h-4 rounded" />
                        <Skeleton className="h-4 w-16 sm:w-20" />
                      </div>
                      <Skeleton className="h-4 w-12 sm:w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

function CookiesPageContent() {
  const { t } = useTranslation("common");
  const { isRTL, isLoading } = useLanguage();
  const { isAuthenticated, isAdmin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cookies, setCookies] = useState<CookieData[]>([]);
  const [deletingCookieId, setDeletingCookieId] = useState<number | null>(null);
  const [isCookiesLoading, setIsCookiesLoading] = useState(true);
  const [isAddCookieDialogOpen, setIsAddCookieDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedWebsite, setSelectedWebsite] = useState<string>("");
  const [cookiesJson, setCookiesJson] = useState<string>("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [websites, setWebsites] = useState<WebsiteOption[]>([]);
  const [isLoadingWebsites, setIsLoadingWebsites] = useState<boolean>(false);
  const [websitesError, setWebsitesError] = useState<string | null>(null);
  const [filterWebsite, setFilterWebsite] = useState<string>("all");
  const loadingRef = useRef<boolean>(false);

  // Load websites from API
  const loadWebsites = async () => {
    if (!isAuthenticated || !isAdmin) {
      return;
    }

    setIsLoadingWebsites(true);
    setWebsitesError(null);

    try {
      const response = await siteApi.getSites();

      if (response.success) {
        let apiSites: unknown[] = [];

        if (
          response.data &&
          typeof response.data === "object" &&
          "sites" in response.data
        ) {
          const dataWithSites = response.data as { sites: unknown[] };
          apiSites = dataWithSites.sites;
        } else if (response.data && Array.isArray(response.data)) {
          apiSites = response.data;
        } else if (
          response &&
          typeof response === "object" &&
          "sites" in response
        ) {
          const responseWithSites = response as { sites: unknown[] };
          apiSites = responseWithSites.sites;
        } else {
          setWebsitesError("Invalid response format");
          return;
        }

        const websiteOptions: WebsiteOption[] = apiSites.map(
          (site: unknown) => {
            const siteObj = site as Record<string, unknown>;
            return siteToWebsiteOption({
              name: typeof siteObj.name === "string" ? siteObj.name : "",
              url: typeof siteObj.url === "string" ? siteObj.url : "",
              icon: typeof siteObj.icon === "string" ? siteObj.icon : "",
              external:
                typeof siteObj.external === "boolean"
                  ? siteObj.external
                  : false,
              total_downloads:
                typeof siteObj.total_downloads === "number"
                  ? siteObj.total_downloads
                  : 0,
              today_downloads:
                typeof siteObj.today_downloads === "number"
                  ? siteObj.today_downloads
                  : 0,
              price: typeof siteObj.price === "number" ? siteObj.price : 0,
              last_reset:
                typeof siteObj.last_reset === "string"
                  ? siteObj.last_reset
                  : "",
            });
          }
        );

        setWebsites(websiteOptions);
        console.log("[Websites] Loaded websites:", websiteOptions);
      } else {
        console.log("[Websites] Failed to load websites:", response);
        setWebsitesError(response.error?.message || "Failed to load websites");
      }
    } catch (error) {
      console.error("Failed to load websites:", error);
      setWebsitesError("Failed to load websites. Please try again.");
    } finally {
      setIsLoadingWebsites(false);
    }
  };

  // Load cookies data from backend and websites list
  useEffect(() => {
    const loadCookies = async () => {
      if (loadingRef.current) return; // Prevent duplicate calls
      loadingRef.current = true;

      try {
        setIsCookiesLoading(true);

        const response = await cookieApi.getCookies();
        if (response.success) {
          let rawData: Record<string, Array<Record<string, unknown>>> = {};

          if (
            response.data &&
            typeof response.data === "object" &&
            !Array.isArray(response.data)
          ) {
            const d = response.data as unknown as {
              data?: Record<string, Array<Record<string, unknown>>>;
            };
            if (d.data && typeof d.data === "object") {
              rawData = d.data;
            } else {
              rawData = d as unknown as Record<
                string,
                Array<Record<string, unknown>>
              >;
            }
          }

          const items: CookieData[] = [];
          const nowDate = new Date().toISOString().split("T")[0];
          Object.entries(rawData).forEach(([platform, accounts]) => {
            accounts?.forEach((acc, idx) => {
              const email =
                typeof (acc as any).email === "string"
                  ? (acc as any).email
                  : undefined;
              const user_id =
                typeof (acc as any).user_id === "number"
                  ? (acc as any).user_id
                  : undefined;
              const credits =
                typeof (acc as any).credits === "number"
                  ? (acc as any).credits
                  : undefined;
              const isPremium =
                typeof (acc as any).is_premium === "boolean"
                  ? (acc as any).is_premium
                  : undefined;
              const { icon, iconColor } = getPlatformIcon(
                platform.toLowerCase(),
                websites
              );
              items.push({
                id: Date.now() + items.length + idx,
                platform_name: platform,
                email,
                user_id,
                username: email ? email.split("@")[0] : "user",
                credit: credits,
                lastUpdate: nowDate,
                is_premium: isPremium,
                icon,
                iconColor,
              });
            });
          });

          setCookies(items);
        } else {
          const errorMessage =
            response.error?.message || "Failed to load cookies.";
          toast.error(errorMessage);
          setCookies([]);
        }
      } catch (error) {
        console.error("Failed to load cookies:", error);
        toast.error("Failed to load cookies. Please try again.");
      } finally {
        setIsCookiesLoading(false);
        loadingRef.current = false; // Reset loading flag
      }
    };

    if (isAuthenticated && isAdmin) {
      // Load websites and cookies in parallel
      loadWebsites();
      loadCookies();
    } else {
      setIsCookiesLoading(false);
    }
  }, [isAuthenticated, isAdmin]);
  // Update cookie icons when websites are loaded
  useEffect(() => {
    if (websites.length > 0 && cookies.length > 0) {
      setCookies((prevCookies) =>
        prevCookies.map((cookie) => {
          const { icon, iconColor } = getPlatformIcon(
            cookie.platform_name.toLowerCase(),
            websites
          );
          return { ...cookie, icon, iconColor };
        })
      );
    }
  }, [websites]); // Only run when websites change

  const handleDeleteCookie = async (cookie: CookieData) => {
    setDeletingCookieId(cookie.id);
    try {
      if (!cookie.email) {
        toast.error("Missing email for this cookie entry.");
        setDeletingCookieId(null);
        return;
      }

      const resp = await cookieApi.deleteCookie({
        platform_name: cookie.platform_name,
        email: cookie.email,
      });

      if (resp.success) {
        setCookies((prev) => prev.filter((c) => c.id !== cookie.id));
        toast.success(
          t("cookies.deleteDialog.success", {
            defaultValue: "Cookie deleted successfully",
          })
        );
      } else {
        toast.error(
          resp.error?.message ||
            t("cookies.deleteDialog.error", {
              defaultValue: "Failed to delete cookie",
            })
        );
      }
    } catch (e) {
      console.error("Delete cookie error:", e);
      toast.error(
        t("cookies.deleteDialog.error", {
          defaultValue: "Failed to delete cookie",
        })
      );
    } finally {
      setDeletingCookieId(null);
    }
  };

  // Validate JSON input
  const validateJson = (jsonString: string): boolean => {
    if (!jsonString.trim()) {
      setJsonError(null);
      return false;
    }

    try {
      JSON.parse(jsonString);
      setJsonError(null);
      return true;
    } catch (error) {
      console.error(error);
      setJsonError("Invalid JSON format. Please check your syntax.");
      return false;
    }
  };

  const handleJsonChange = (value: string) => {
    setCookiesJson(value);
    if (value.trim()) {
      validateJson(value);
    } else {
      setJsonError(null);
    }
  };

  const resetDialog = () => {
    setSelectedWebsite("");
    setCookiesJson("");
    setFormError(null);
    setJsonError(null);
  };

  const handleSubmitCookie = async () => {
    if (!selectedWebsite || !cookiesJson.trim()) return;

    // Validate JSON before submitting
    if (!validateJson(cookiesJson)) {
      setFormError("Please provide valid JSON for cookies.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      // Find the original website name (not lowercase) from the websites array
      const selectedWebsiteData = websites.find(
        (w) => w.value === selectedWebsite
      );
      const originalWebsiteName = selectedWebsiteData?.label || selectedWebsite;

      // Add cookie via API
      const response = await cookieApi.addCookie({
        cookies: cookiesJson.trim(),
        platform_name: originalWebsiteName,
      });

      if (response.success && response.data) {
        // Add new cookie to the local state
        const { icon, iconColor } = getPlatformIcon(selectedWebsite, websites);
        const email = (response.data.data?.email as string) || "";
        const user_id =
          typeof (response.data.data as any)?.user_id === "number"
            ? (response.data.data as any).user_id
            : undefined;
        const credits =
          typeof (response.data.data as any)?.credits === "number"
            ? (response.data.data as any).credits
            : undefined;

        const newCookie: CookieData = {
          id: Date.now(), // Use timestamp as ID
          platform_name: originalWebsiteName,
          email,
          user_id,
          username: email ? email.split("@")[0] : "user",
          credit: credits,
          lastUpdate: new Date().toISOString().split("T")[0],
          is_premium: !!(response.data.data as any)?.is_premium,
          icon,
          iconColor,
        };

        setCookies([...cookies, newCookie]);
        toast.success(`Cookie for ${originalWebsiteName} added successfully!`);

        // Reset form
        setIsAddCookieDialogOpen(false);
        resetDialog();
      } else {
        const errorMessage = response.error?.message || "Failed to add cookie";
        setFormError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Submit error:", error);
      const errorMessage = "Network error occurred. Please try again.";
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter cookies based on selected website
  const filteredCookies =
    filterWebsite === "all"
      ? cookies
      : cookies.filter(
          (cookie) => cookie.platform_name.toLowerCase() === filterWebsite
        );

  // Show loading skeleton while language data or cookies data is loading
  if (isLoading || isCookiesLoading) {
    return <CookiesPageSkeleton isRTL={isRTL} />;
  }

  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? "font-tajawal" : "font-sans"}`}
    >
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Header */}
      <header
        className={`${isRTL ? "lg:mr-72" : "lg:ml-72"} border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40`}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="cursor-pointer lg:hidden p-2 hover:bg-muted rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Logo for mobile */}
          <Link href="/" className="lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
            </div>
          </Link>

          {/* Header Controls */}
          <HeaderControls />
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`relative flex-1 min-h-screen ${isRTL ? "lg:mr-72" : "lg:ml-72"} p-4 sm:p-5 space-y-4 sm:space-y-5 bg-secondary/50 overflow-hidden`}
      >
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top Left Dots Grid */}
          <svg
            className={`absolute top-20 ${isRTL ? "right-10" : "left-10"} w-32 h-24 opacity-20`}
            viewBox="0 0 140 100"
            fill="none"
          >
            {Array.from({ length: 5 }, (_, row) =>
              Array.from({ length: 7 }, (_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={10 + col * 18}
                  cy={10 + row * 16}
                  r="2"
                  fill="currentColor"
                  className="text-primary animate-pulse"
                  style={{
                    animationDelay: `${(row + col) * 0.3}s`,
                    animationDuration: "4s",
                  }}
                />
              ))
            )}
          </svg>

          <svg
            className={`absolute bottom-20 ${isRTL ? "left-10" : "right-10"} w-32 h-24 opacity-20`}
            viewBox="0 0 140 100"
            fill="none"
          >
            {Array.from({ length: 5 }, (_, row) =>
              Array.from({ length: 7 }, (_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={10 + col * 18}
                  cy={10 + row * 16}
                  r="2"
                  fill="currentColor"
                  className="text-primary animate-pulse"
                  style={{
                    animationDelay: `${(row + col) * 0.3}s`,
                    animationDuration: "4s",
                  }}
                />
              ))
            )}
          </svg>

          {/* Top Right Cookie Icon */}
          <div
            className={`absolute top-32 ${isRTL ? "left-20" : "right-20"} animate-float`}
          >
            <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
              <Cookie className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* Bottom Left Filter Icon */}
          <div
            className={`absolute bottom-40 ${isRTL ? "right-16" : "left-16"} animate-float`}
            style={{ animationDelay: "1s" }}
          >
            <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
              <Filter className="w-5 h-5 text-primary/80" />
            </div>
          </div>

          {/* Bottom Right Dots Grid */}
          <svg
            className={`absolute bottom-20 ${isRTL ? "left-16" : "right-16"} w-28 h-20 opacity-15`}
            viewBox="0 0 120 80"
            fill="none"
          >
            {Array.from({ length: 4 }, (_, row) =>
              Array.from({ length: 6 }, (_, col) => (
                <circle
                  key={`bottom-${row}-${col}`}
                  cx={8 + col * 18}
                  cy={8 + row * 16}
                  r="1.5"
                  fill="currentColor"
                  className="text-primary animate-pulse"
                  style={{
                    animationDelay: `${(row + col) * 0.4}s`,
                    animationDuration: "5s",
                  }}
                />
              ))
            )}
          </svg>
        </div>
        {/* Page Header */}
        <div
          className={`flex ${isRTL ? "sm:flex-row" : "sm:flex-row"} flex-col sm:items-center justify-between gap-4`}
        >
          <div className={`space-y-2 ${isRTL ? "text-right" : "text-left"}`}>
            <h1
              className={`text-2xl sm:text-3xl font-bold text-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
            >
              {t("cookies.title")}
            </h1>
            <p
              className={`text-muted-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
            >
              {t("cookies.description")}
            </p>
          </div>

          {/* Filter and Add Button Container */}
          <div
            className={`w-full sm:w-auto flex ${isRTL ? "flex-row-reverse" : "flex-row"} items-center gap-3`}
          >
            {/* Website Filter */}
            <div className="w-full sm:w-auto flex items-center gap-2">
              <Select value={filterWebsite} onValueChange={setFilterWebsite}>
                <SelectTrigger
                  className={`w-full sm:w-48 ${isRTL ? "font-tajawal" : "font-sans"}`}
                >
                  <SelectValue
                    placeholder={t("cookies.filter.placeholder", {
                      defaultValue: "Filter by website",
                    })}
                    className={isRTL ? "font-tajawal" : "font-sans"}
                  />
                </SelectTrigger>
                <SelectContent className="w-full sm:w-48">
                  <SelectItem
                    value="all"
                    className={isRTL ? "font-tajawal" : "font-sans"}
                  >
                    <div
                      className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <div className="w-5 h-5 bg-primary rounded text-white text-xs flex items-center justify-center font-bold">
                        *
                      </div>
                      <span>
                        {t("cookies.filter.all", {
                          defaultValue: "All Websites",
                        })}
                      </span>
                    </div>
                  </SelectItem>
                  {websites.map((website) => (
                    <SelectItem
                      key={website.value}
                      value={website.value}
                      className={isRTL ? "font-tajawal" : "font-sans"}
                    >
                      <div
                        className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`w-5 h-5 ${website.iconColor} rounded text-white text-xs flex items-center justify-center font-bold`}
                        >
                          {website.icon}
                        </div>
                        <span>{website.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filterWebsite !== "all" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterWebsite("all")}
                  className="h-9 w-9 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Add Cookie Dialog */}
        <div className={`flex ${isRTL ? "justify-start" : "justify-end"} mb-4`}>
          {/* Add Cookie Button */}
          <Dialog
            open={isAddCookieDialogOpen}
            onOpenChange={(open) => {
              setIsAddCookieDialogOpen(open);
              if (!open) {
                resetDialog();
              }
            }}
          >
            <DialogTrigger asChild className="w-full sm:w-48">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0">
                <Plus className="w-4 h-4 stroke-3" />
                {t("cookies.addCookie.button")}
              </Button>
            </DialogTrigger>
            <DialogContent
              className={`sm:max-w-[1000px] ${isRTL ? "[&>[data-slot=dialog-close]]:left-4 [&>[data-slot=dialog-close]]:right-auto" : ""}`}
            >
              <DialogHeader className={`${isRTL && "sm:text-right"}`}>
                <DialogTitle className={isRTL ? "font-tajawal" : "font-sans"}>
                  {t("cookies.addCookie.dialog.title")}
                </DialogTitle>
                <DialogDescription
                  className={isRTL ? "font-tajawal" : "font-sans"}
                >
                  {t("cookies.addCookie.dialog.description")}
                </DialogDescription>
              </DialogHeader>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Website Selection */}
                <div className="space-y-2">
                  <Label
                    htmlFor="website-select"
                    className={isRTL ? "font-tajawal" : "font-sans"}
                  >
                    {t("cookies.addCookie.dialog.website.label")}
                  </Label>
                  <Select
                    value={selectedWebsite}
                    onValueChange={setSelectedWebsite}
                    disabled={isLoadingWebsites}
                  >
                    <SelectTrigger
                      id="website-select"
                      className={`w-full ${isRTL ? "font-tajawal" : "font-sans"}`}
                    >
                      <SelectValue
                        placeholder={
                          isLoadingWebsites
                            ? t("common.loading")
                            : websitesError
                              ? t("common.error")
                              : t(
                                  "cookies.addCookie.dialog.website.placeholder"
                                )
                        }
                        className={isRTL ? "font-tajawal" : "font-sans"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingWebsites ? (
                        <SelectItem
                          value="loading"
                          disabled
                          className={isRTL ? "font-tajawal" : "font-sans"}
                        >
                          <div
                            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{t("common.loading")}</span>
                          </div>
                        </SelectItem>
                      ) : websitesError ? (
                        <div className="p-2">
                          <div
                            className={`flex items-center gap-2 text-destructive mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <AlertCircle className="w-4 h-4" />
                            <span
                              className={`text-sm ${isRTL ? "font-tajawal" : "font-sans"}`}
                            >
                              {websitesError}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={loadWebsites}
                            className={`w-full ${isRTL ? "font-tajawal" : "font-sans"}`}
                          >
                            {t("common.retry")}
                          </Button>
                        </div>
                      ) : websites.length === 0 ? (
                        <SelectItem
                          value="empty"
                          disabled
                          className={isRTL ? "font-tajawal" : "font-sans"}
                        >
                          <span>
                            {t("cookies.addCookie.dialog.website.noWebsites")}
                          </span>
                        </SelectItem>
                      ) : (
                        websites.map((website) => (
                          <SelectItem
                            key={website.value}
                            value={website.value}
                            className={isRTL ? "font-tajawal" : "font-sans"}
                          >
                            <div
                              className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                            >
                              <div
                                className={`w-5 h-5 ${website.iconColor} rounded text-white text-xs flex items-center justify-center font-bold`}
                              >
                                {website.icon}
                              </div>
                              <span>{website.label}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* JSON Input */}
                <div className="space-y-2">
                  <Label
                    htmlFor="cookies-json"
                    className={isRTL ? "font-tajawal" : "font-sans"}
                  >
                    {t("cookies.addCookie.dialog.json.label")}
                  </Label>
                  <Textarea
                    id="cookies-json"
                    value={cookiesJson}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    placeholder={t("cookies.addCookie.dialog.json.placeholder")}
                    className={`min-h-32 font-mono text-sm ${isRTL ? "text-right" : "text-left"} ${jsonError ? "border-destructive" : ""}`}
                    dir="ltr" // Always LTR for JSON
                  />
                  {jsonError && (
                    <p
                      className={`text-sm text-destructive ${isRTL ? "font-tajawal text-right" : "font-sans text-left"}`}
                    >
                      {jsonError}
                    </p>
                  )}
                  <p
                    className={`text-xs text-muted-foreground ${isRTL ? "font-tajawal text-right" : "font-sans text-left"}`}
                  >
                    {t("cookies.addCookie.dialog.json.help")}
                  </p>
                </div>

                {/* Error Display */}
                {formError && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <p
                      className={`text-sm text-destructive ${isRTL ? "font-tajawal" : "font-sans"}`}
                    >
                      {formError}
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter className={isRTL ? "flex-row-reverse" : ""}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddCookieDialogOpen(false);
                    resetDialog();
                  }}
                  disabled={isSubmitting}
                  className={isRTL ? "font-tajawal" : "font-sans"}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmitCookie}
                  disabled={
                    !selectedWebsite ||
                    !cookiesJson.trim() ||
                    isSubmitting ||
                    !!jsonError
                  }
                  className={`bg-primary hover:bg-primary/90 text-primary-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t("cookies.addCookie.dialog.submitting")}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {t("cookies.addCookie.dialog.submit")}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cookies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCookies.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <Cookie className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3
                className={`text-lg font-semibold text-muted-foreground mb-2 ${isRTL ? "font-tajawal" : "font-sans"}`}
              >
                {filterWebsite === "all"
                  ? t("cookies.empty.title", {
                      defaultValue: "No cookies found",
                    })
                  : t("cookies.empty.filtered", {
                      defaultValue: "No cookies for this website",
                    })}
              </h3>
              <p
                className={`text-sm text-muted-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
              >
                {filterWebsite === "all"
                  ? t("cookies.empty.description", {
                      defaultValue: "Add your first cookie to get started",
                    })
                  : t("cookies.empty.filteredDescription", {
                      defaultValue:
                        "Try selecting a different website or add a new cookie",
                    })}
              </p>
            </div>
          ) : (
            filteredCookies.map((cookie) => (
              <Card
                key={cookie.id}
                className="group relative bg-primary/5 dark:bg-muted/75 border border-border rounded-2xl p-6 transition-all duration-500 hover:border-primary/30 overflow-hidden"
              >
                {/* Hover effect overlay - diagonal sweep */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl transform translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>

                {/* Delete Button - Positioned absolutely in top right */}
                <div
                  className={`absolute ${isRTL ? "left-4" : "right-4"} top-4 z-20`}
                >
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        disabled={deletingCookieId === cookie.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent
                      className={isRTL ? "font-tajawal" : "font-sans"}
                    >
                      <AlertDialogHeader
                        className={isRTL ? "text-right" : "text-left"}
                      >
                        <AlertDialogTitle
                          className={isRTL ? "font-tajawal" : "font-sans"}
                        >
                          {t("cookies.deleteDialog.title")}
                        </AlertDialogTitle>
                        <AlertDialogDescription
                          className={isRTL ? "font-tajawal" : "font-sans"}
                        >
                          {t("cookies.deleteDialog.description", {
                            domain: cookie.platform_name,
                          })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter
                        className={isRTL ? "flex-row-reverse" : ""}
                      >
                        <AlertDialogCancel
                          disabled={deletingCookieId === cookie.id}
                          className={isRTL ? "font-tajawal" : "font-sans"}
                        >
                          {t("common.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCookie(cookie)}
                          disabled={deletingCookieId === cookie.id}
                          className={`bg-destructive hover:bg-destructive/70 text-white ${isRTL ? "font-tajawal" : "font-sans"}`}
                        >
                          {deletingCookieId === cookie.id ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              {t("cookies.deleting")}
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              {t("common.delete")}
                            </>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Website Icon - Positioned absolutely in top left under delete button */}
                <div
                  className={`absolute ${isRTL ? "right-4" : "left-4"} top-4 z-10`}
                >
                  <div
                    className={`w-10 h-10 ${cookie.iconColor} rounded-lg flex items-center justify-center text-white font-bold text-lg`}
                  >
                    {cookie.icon}
                  </div>
                </div>

                {/* Card Content - Relative positioned */}
                <div
                  className={`relative z-10 space-y-4 mt-16 ${isRTL ? "text-right" : "text-left"}`}
                >
                  {/* Domain Title */}
                  <div className="space-y-2">
                    <h3
                      className={`text-lg font-semibold text-foreground group-hover:text-primary transition-colors ${isRTL ? "font-tajawal" : "font-sans"}`}
                    >
                      {cookie.platform_name}
                    </h3>
                  </div>

                  <div
                    className={`absolute -top-24 opacity-10 group-hover:opacity-20 transition-opacity duration-300 ${isRTL ? "-left-8" : "-right-8"}`}
                  >
                    <Cookie className="w-28 h-28 text-orange-500 transform rotate-12" />
                  </div>

                  {/* Cookie Details */}
                  <div className="space-y-4">
                    {/* User ID - only show if it exists */}
                    {cookie.user_id && (
                      <div
                        className={`flex ${isRTL ? "flex-row" : ""} justify-between items-center`}
                      >
                        <div
                          className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <Hash className="w-4 h-4 text-muted-foreground" />
                          <span
                            className={`${isRTL ? "text-base font-tajawal" : "text-sm font-sans"} text-muted-foreground`}
                          >
                            {t("cookies.fields.userId", {
                              defaultValue: "User ID",
                            })}
                            :
                          </span>
                        </div>
                        <span
                          className={`${isRTL ? "text-base font-tajawal" : "text-sm font-sans"} font-medium text-foreground`}
                        >
                          {cookie.user_id}
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex ${isRTL ? "flex-row" : ""} justify-between items-center`}
                    >
                      <div
                        className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span
                          className={`${isRTL ? "text-base font-tajawal" : "text-sm font-sans"} text-muted-foreground`}
                        >
                          {t("cookies.fields.username")}:
                        </span>
                      </div>
                      <span
                        className={`${isRTL ? "text-base font-tajawal" : "text-sm font-sans"} font-medium text-foreground`}
                      >
                        {cookie.username}
                      </span>
                    </div>

                    {/* Email field */}
                    <div
                      className={`flex ${isRTL ? "flex-row" : ""} justify-between items-center`}
                    >
                      <div
                        className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span
                          className={`${isRTL ? "text-base font-tajawal" : "text-sm font-sans"} text-muted-foreground`}
                        >
                          {t("cookies.fields.email", { defaultValue: "Email" })}
                          :
                        </span>
                      </div>
                      <span
                        className={`${isRTL ? "text-base font-tajawal" : "text-sm font-sans"} font-medium text-foreground`}
                      >
                        {cookie.email ||
                          t("cookies.fields.noEmail", {
                            defaultValue: "No email",
                          })}
                      </span>
                    </div>

                    <div
                      className={`flex ${isRTL ? "flex-row" : ""} justify-between items-center`}
                    >
                      <div
                        className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span
                          className={`${isRTL ? "text-base font-tajawal" : "text-sm font-sans"} text-muted-foreground`}
                        >
                          {t("cookies.fields.credit")}:
                        </span>
                      </div>
                      <span
                        className={`${isRTL ? "text-base font-tajawal" : "text-sm font-sans"} font-medium text-foreground`}
                      >
                        {cookie.credit !== undefined && cookie.credit !== null
                          ? `${cookie.credit} ${t("cookies.fields.credits", { defaultValue: "credits" })}`
                          : t("cookies.fields.noCredit", {
                              defaultValue: "No credit",
                            })}
                      </span>
                    </div>
                    <div
                      className={`flex ${isRTL ? "flex-row" : ""} justify-between items-center`}
                    >
                      <div
                        className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span
                          className={`${isRTL ? "text-base font-tajawal" : "text-sm font-sans"} text-muted-foreground`}
                        >
                          {t("cookies.fields.lastUpdate")}:
                        </span>
                      </div>
                      <span
                        className={`${isRTL ? "text-base font-tajawal" : "text-sm font-sans"} font-medium text-foreground`}
                      >
                        {cookie.lastUpdate}
                      </span>
                    </div>

                    {/* Premium status - only show if true */}
                    {cookie.is_premium && (
                      <div
                        className={`flex ${isRTL ? "flex-row" : ""} justify-between items-center`}
                      >
                        <div
                          className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <Crown className="w-4 h-4 text-yellow-500" />
                          <span
                            className={`${isRTL ? "text-base font-tajawal" : "text-sm font-sans"} text-muted-foreground`}
                          >
                            {t("cookies.fields.premium", {
                              defaultValue: "Premium",
                            })}
                            :
                          </span>
                        </div>
                        <span
                          className={`${isRTL ? "text-base font-tajawal" : "text-sm font-sans"} font-medium text-green-600`}
                        >
                          {t("cookies.status.premium", {
                            defaultValue: "Premium User",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default function CookiesPage() {
  return (
    <AdminRouteGuard fallbackPath="/dashboard">
      <CookiesPageContent />
    </AdminRouteGuard>
  );
}
