"use client";

import {
  ArrowUp,
  UserPlus,
  UserMinus,
  CreditCard,
  TrendingUp,
  Calendar,
  Trash2,
  Edit,
  Users,
  Globe,
  Activity,
  Search,
  Filter,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  ExternalLink,
  Package,
  DollarSign,
  FileText,
  Timer,
  Coins,
  Link as LinkIcon,
  Settings,
  Check,
  Menu,
  Loader2,
  Clock,
  Mail,
  X,
  Cookie,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/sidebar";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/i18n-provider";
import { HeaderControls } from "@/components/header-controls";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DashboardSkeleton,
  DashboardStatsCardsSkeleton,
  DashboardActionCardsSkeleton,
  DashboardManagementCardsSkeleton,
  DashboardSitesManagementSkeleton,
  DashboardPackageManagementSkeleton,
} from "@/components/dashboard-skeletons";
import {
  siteApi,
  pricingApi,
  type SiteInput,
  type Site,
  type PricingPlanInput,
} from "@/lib/api";

// Extended Site interface for frontend use
interface FrontendSite extends Site {
  id?: number;
  status?: string;
  addedDate?: string;
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  creditApi,
  userApi,
  type CreditStatistics,
  type CreditHistoryEntry,
  type EnhancedCreditHistoryEntry,
  type UsersStatisticsResponse,
  type UserAccount,
} from "@/lib/api";
import { AdminRouteGuard } from "@/components/admin-route-guard";
import { useAuth } from "@/components/auth-provider";

// Type definitions
interface PricingPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  credits: number;
  daysValidity: number;
  contactUsUrl: string;
  supportedSites: string[];
  features: string[];
}

export default function DashboardPage() {
  const { t } = useTranslation("common");
  const { isRTL, isLoading } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [planError, setPlanError] = useState<string>("");

  // Sidebar state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Upgrade Subscription states
  const [upgradeEmail, setUpgradeEmail] = useState<string>("");
  const [upgradeNewPlan, setUpgradeNewPlan] = useState<string>("");
  const [isUpgradeSubmitting, setIsUpgradeSubmitting] =
    useState<boolean>(false);
  const [upgradeEmailError, setUpgradeEmailError] = useState<string>("");
  const [upgradeNewPlanError, setUpgradeNewPlanError] = useState<string>("");

  // Extend Subscription states
  const [extendEmail, setExtendEmail] = useState<string>("");
  const [extendDays, setExtendDays] = useState<string>("30");
  const [isExtendSubmitting, setIsExtendSubmitting] = useState<boolean>(false);
  const [extendEmailError, setExtendEmailError] = useState<string>("");
  const [extendDaysError, setExtendDaysError] = useState<string>("");

  // Delete Subscription states
  const [deleteEmail, setDeleteEmail] = useState<string>("");
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState<boolean>(false);
  const [deleteEmailError, setDeleteEmailError] = useState<string>("");

  // Users table states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Site management states
  const [isAddSiteDialogOpen, setIsAddSiteDialogOpen] =
    useState<boolean>(false);
  const [siteName, setSiteName] = useState<string>("");
  const [siteUrl, setSiteUrl] = useState<string>("");
  const [sitePrice, setSitePrice] = useState<string>("");
  const [siteIcon, setSiteIcon] = useState<string>("");
  const [siteExternal, setSiteExternal] = useState<boolean>(false);
  const [siteNameError, setSiteNameError] = useState<string>("");
  const [siteUrlError, setSiteUrlError] = useState<string>("");
  const [sitePriceError, setSitePriceError] = useState<string>("");
  const [siteIconError, setSiteIconError] = useState<string>("");
  const [isAddingSite, setIsAddingSite] = useState<boolean>(false);

  // Edit site dialog states
  const [isEditSiteDialogOpen, setIsEditSiteDialogOpen] =
    useState<boolean>(false);
  const [editSiteName, setEditSiteName] = useState<string>("");
  const [editSiteUrl, setEditSiteUrl] = useState<string>("");
  const [editSitePrice, setEditSitePrice] = useState<string>("");
  const [editSiteIcon, setEditSiteIcon] = useState<string>("");
  const [editSiteExternal, setEditSiteExternal] = useState<boolean>(false);
  const [editSiteNameError, setEditSiteNameError] = useState<string>("");
  const [editSiteUrlError, setEditSiteUrlError] = useState<string>("");
  const [editSitePriceError, setEditSitePriceError] = useState<string>("");
  const [editSiteIconError, setEditSiteIconError] = useState<string>("");
  const [isEditingSite, setIsEditingSite] = useState<boolean>(false);
  const [currentEditingSite, setCurrentEditingSite] =
    useState<FrontendSite | null>(null);

  // Package management states
  const [isAddPackageDialogOpen, setIsAddPackageDialogOpen] =
    useState<boolean>(false);
  const [packageName, setPackageName] = useState<string>("");
  const [packagePrice, setPackagePrice] = useState<string>("");
  const [packageDescription, setPackageDescription] = useState<string>("");
  const [packageDaysValidity, setPackageDaysValidity] = useState<string>("");
  const [packageCredits, setPackageCredits] = useState<string>("");
  const [packageContactUrl, setPackageContactUrl] = useState<string>("");
  const [packageSupportedSites, setPackageSupportedSites] =
    useState<string>("");
  const [packageNameError, setPackageNameError] = useState<string>("");
  const [packageDescriptionError, setPackageDescriptionError] =
    useState<string>("");
  const [packageDaysValidityError, setPackageDaysValidityError] =
    useState<string>("");
  const [packageCreditsError, setPackageCreditsError] = useState<string>("");
  const [packageContactUrlError, setPackageContactUrlError] =
    useState<string>("");
  const [packageSupportedSitesError, setPackageSupportedSitesError] =
    useState<string>("");
  const [isAddingPackage, setIsAddingPackage] = useState<boolean>(false);

  // Edit package states
  const [isEditPackageDialogOpen, setIsEditPackageDialogOpen] =
    useState<boolean>(false);
  const [editingPackage, setEditingPackage] = useState<PricingPlan | null>(
    null
  );
  const [editPackageName, setEditPackageName] = useState<string>("");
  const [editPackagePrice, setEditPackagePrice] = useState<string>("");
  const [editPackageDescription, setEditPackageDescription] =
    useState<string>("");
  const [editPackageDaysValidity, setEditPackageDaysValidity] =
    useState<string>("");
  const [editPackageCredits, setEditPackageCredits] = useState<string>("");
  const [editPackageContactUrl, setEditPackageContactUrl] =
    useState<string>("");
  const [editPackageSupportedSites, setEditPackageSupportedSites] =
    useState<string>("");
  const [editPackageNameError, setEditPackageNameError] = useState<string>("");
  const [editPackageDescriptionError, setEditPackageDescriptionError] =
    useState<string>("");
  const [editPackageDaysValidityError, setEditPackageDaysValidityError] =
    useState<string>("");
  const [editPackageCreditsError, setEditPackageCreditsError] =
    useState<string>("");
  const [editPackageContactUrlError, setEditPackageContactUrlError] =
    useState<string>("");
  const [editPackageSupportedSitesError, setEditPackageSupportedSitesError] =
    useState<string>("");
  const [isEditingPackage, setIsEditingPackage] = useState<boolean>(false);

  // Delete package states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isDeletingPackage, setIsDeletingPackage] = useState<boolean>(false);

  // Pricing plans loading state
  const [isLoadingPricingPlans, setIsLoadingPricingPlans] =
    useState<boolean>(false);
  const [pricingPlansError, setPricingPlansError] = useState<string>("");

  // Credit Analytics states
  const [creditAnalytics, setCreditAnalytics] =
    useState<CreditStatistics | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState<boolean>(false);
  const [analyticsError, setAnalyticsError] = useState<string>("");

  // Credit History states
  const [enhancedCreditHistory, setEnhancedCreditHistory] = useState<
    EnhancedCreditHistoryEntry[]
  >([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string>("");
  const [isCreditHistoryDialogOpen, setIsCreditHistoryDialogOpen] =
    useState<boolean>(false);

  // Credit History Dialog filters
  const [historySearchTerm, setHistorySearchTerm] = useState<string>("");
  const [historyTypeFilter, setHistoryTypeFilter] = useState<string>("all");

  // User Management states
  const [usersData, setUsersData] = useState<UsersStatisticsResponse | null>(
    null
  );
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [usersError, setUsersError] = useState<string>("");

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string, locale: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080)
      return `${Math.floor(diffInMinutes / 1440)}d ago`;

    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to get transaction type styling
  const getTransactionTypeConfig = (type: "add" | "use" | "delete") => {
    switch (type) {
      case "add":
        return {
          icon: Plus,
          bgColor: "bg-green-100 dark:bg-green-900/20",
          iconColor: "text-green-600 dark:text-green-400",
          borderColor: "border-green-200 dark:border-green-800",
          amountColor: "text-green-600 dark:text-green-400",
          amountPrefix: "+",
        };
      case "use":
        return {
          icon: Minus,
          bgColor: "bg-orange-100 dark:bg-orange-900/20",
          iconColor: "text-orange-600 dark:text-orange-400",
          borderColor: "border-orange-200 dark:border-orange-800",
          amountColor: "text-orange-600 dark:text-orange-400",
          amountPrefix: "",
        };
      case "delete":
        return {
          icon: Trash2,
          bgColor: "bg-red-100 dark:bg-red-900/20",
          iconColor: "text-red-600 dark:text-red-400",
          borderColor: "border-red-200 dark:border-red-800",
          amountColor: "text-red-600 dark:text-red-400",
          amountPrefix: "-",
        };
      default:
        return {
          icon: CreditCard,
          bgColor: "bg-gray-100 dark:bg-gray-900/20",
          iconColor: "text-gray-600 dark:text-gray-400",
          borderColor: "border-gray-200 dark:border-gray-800",
          amountColor: "text-gray-600 dark:text-gray-400",
          amountPrefix: "",
        };
    }
  };

  // Filter and search functionality for credit history dialog
  const filteredCreditHistory = useMemo(() => {
    return enhancedCreditHistory.filter((entry) => {
      const matchesSearch =
        entry.user_name
          .toLowerCase()
          .includes(historySearchTerm.toLowerCase()) ||
        entry.email.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
        (entry.plan &&
          entry.plan.toLowerCase().includes(historySearchTerm.toLowerCase()));

      const matchesType =
        historyTypeFilter === "all" || entry.type === historyTypeFilter;

      return matchesSearch && matchesType;
    });
  }, [enhancedCreditHistory, historySearchTerm, historyTypeFilter]);

  const clearHistoryFilters = () => {
    setHistorySearchTerm("");
    setHistoryTypeFilter("all");
  };

  // Load credit analytics data
  const loadCreditAnalytics = async () => {
    // Only proceed if user is admin
    if (!isAuthenticated || !user || user.role !== "admin") {
      return;
    }

    setIsLoadingAnalytics(true);
    setAnalyticsError("");

    try {
      const response = await creditApi.getCreditAnalytics();

      if (response.success) {
        // According to Swagger docs, the response structure is:
        // { success: true, statistics: {...} }
        if (response.data && response.data.statistics) {
          // If wrapped in data property
          setCreditAnalytics(response.data.statistics);
        } else if (
          response &&
          typeof response === "object" &&
          "statistics" in response
        ) {
          // If response is direct (has statistics property)
          const directResponse = response as { statistics: CreditStatistics };
          setCreditAnalytics(directResponse.statistics);
        } else {
          setAnalyticsError("Invalid response format");
        }
      } else {
        setAnalyticsError(
          response.error?.message || t("dashboard.errors.failedToLoadAnalytics")
        );
      }
    } catch {
      setAnalyticsError(t("dashboard.errors.failedToLoadAnalytics"));
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  // Load enhanced credit history data
  const loadEnhancedCreditHistory = async () => {
    // Only proceed if user is admin
    if (!isAuthenticated || !user || user.role !== "admin") {
      return;
    }

    setIsLoadingHistory(true);
    setHistoryError("");

    try {
      const response = await creditApi.getCreditHistory();

      if (response.success) {
        // Check for the new enhanced format first
        let historyData: unknown[] = [];

        if (response.data && response.data.history) {
          historyData = response.data.history;
        } else if (
          response &&
          typeof response === "object" &&
          "history" in response
        ) {
          const directResponse = response as { history: unknown[] };
          historyData = directResponse.history;
        } else {
          setHistoryError("Invalid response format");
          return;
        }

        // Check if the data matches the new enhanced format
        if (historyData.length > 0) {
          const firstEntry = historyData[0] as Record<string, unknown>;

          // Check if it has the new format (type, user_name, etc.)
          if (firstEntry.type && firstEntry.user_name && firstEntry.email) {
            // New enhanced format
            const enhancedEntries: EnhancedCreditHistoryEntry[] =
              historyData.map((entry: unknown) => {
                const entryObj = entry as Record<string, unknown>;
                return {
                  type: entryObj.type as "add" | "use" | "delete",
                  timestamp:
                    typeof entryObj.timestamp === "string"
                      ? entryObj.timestamp
                      : "",
                  email:
                    typeof entryObj.email === "string" ? entryObj.email : "",
                  user_name:
                    typeof entryObj.user_name === "string"
                      ? entryObj.user_name
                      : "",
                  plan:
                    typeof entryObj.plan === "string" ? entryObj.plan : null,
                  amount:
                    typeof entryObj.amount === "number"
                      ? entryObj.amount
                      : undefined,
                  reason:
                    typeof entryObj.reason === "string" ? entryObj.reason : undefined,
                };
              });
            setEnhancedCreditHistory(enhancedEntries);
          } else {
            // Legacy format - convert to enhanced format
            const legacyEntries = historyData as CreditHistoryEntry[];

            // Convert legacy to enhanced format for display
            const convertedEntries: EnhancedCreditHistoryEntry[] =
              legacyEntries.map((entry) => ({
                type: entry.action.includes("subscription")
                  ? "add"
                  : entry.action.includes("download") ||
                      entry.action.includes("use")
                    ? "use"
                    : "delete",
                timestamp: entry.timestamp,
                email: entry.email || entry.user_email || "",
                user_name: entry.email || entry.user_email || "Unknown User",
                plan: entry.plan_name || null,
                amount: Math.abs(entry.credits_changed),
              }));
            setEnhancedCreditHistory(convertedEntries);
          }
        } else {
          setEnhancedCreditHistory([]);
        }
      } else {
        setHistoryError(
          response.error?.message || t("dashboard.errors.failedToLoadHistory")
        );
      }
    } catch {
      setHistoryError(t("dashboard.errors.failedToLoadHistory"));
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Load users statistics data
  const loadUsersStatistics = async () => {
    // Only proceed if user is admin
    if (!isAuthenticated || !user || user.role !== "admin") {
      return;
    }

    setIsLoadingUsers(true);
    setUsersError("");

    try {
      const response = await userApi.getUsersStatistics();

      if (response.success) {
        // Backend returns different responses based on user type:
        // 1. Subscribed users only: { success: true, total_users: 2, online_users: 0, users: [] }
        // 2. Premium users: { success: true, total_users: 2, online_users: 0, users: [...] }
        // The users array will be empty for subscribed users, populated for premium users

        // Try multiple response structure patterns
        let userData: UsersStatisticsResponse | null = null;

        if (response.data) {
          // If wrapped in data property
          userData = response.data;
        } else {
          // If response is direct (has total_users, online_users, users properties)
          const directResponse = response as unknown as Record<string, unknown>;
          if (
            directResponse.total_users !== undefined ||
            directResponse.online_users !== undefined
          ) {
            userData = {
              success: true,
              total_users:
                typeof directResponse.total_users === "number"
                  ? directResponse.total_users
                  : 0,
              online_users:
                typeof directResponse.online_users === "number"
                  ? directResponse.online_users
                  : 0,
              users: Array.isArray(directResponse.users)
                ? (directResponse.users as UserAccount[])
                : [],
            };
          }
        }

        if (userData) {
          setUsersData(userData);
        } else {
          setUsersError("Invalid response format");
        }
      } else {
        setUsersError(
          response.error?.message || t("dashboard.errors.failedToLoadUsers")
        );
      }
    } catch {
      setUsersError(t("dashboard.errors.failedToLoadUsers"));
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Load sites data
  const loadSites = async () => {
    // Only proceed if user is admin
    if (!isAuthenticated || !user || user.role !== "admin") {
      return;
    }

    setIsLoadingSites(true);
    setSitesError("");

    try {
      const response = await siteApi.getSites();

      if (response.success) {
        // According to Swagger docs, the response structure is:
        // { success: true, data: { sites: [...] } }
        let apiSites: unknown[] = [];

        if (
          response.data &&
          typeof response.data === "object" &&
          "sites" in response.data
        ) {
          // If wrapped in data.sites
          const dataWithSites = response.data as { sites: unknown[] };
          apiSites = dataWithSites.sites;
        } else if (response.data && Array.isArray(response.data)) {
          // If data is directly an array
          apiSites = response.data;
        } else if (
          response &&
          typeof response === "object" &&
          "sites" in response
        ) {
          // If response has sites property directly
          const responseWithSites = response as { sites: unknown[] };
          apiSites = responseWithSites.sites;
        } else {
          setSitesError("Invalid response format");
          return;
        }

        const frontendSites: FrontendSite[] = apiSites.map(
          (site: unknown, index: number) => {
            const siteObj = site as Record<string, unknown>;
            const siteUrl = typeof siteObj.url === "string" ? siteObj.url : "";
            return {
              name: typeof siteObj.name === "string" ? siteObj.name : "",
              url: siteUrl,
              icon:
                typeof siteObj.icon === "string"
                  ? siteObj.icon
                  : `${siteUrl}/favicon.ico`,
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
              id: index + 1,
              status: "Active" as const,
              addedDate:
                typeof siteObj.last_reset === "string"
                  ? siteObj.last_reset
                  : "",
            };
          }
        );
        setSites(frontendSites);
        console.log("[Sites] Loaded sites:", frontendSites);
      } else {
        console.log("[Sites] Failed to load sites:", response);
        setSitesError(
          response.error?.message || t("dashboard.errors.failedToLoadSites")
        );
      }
    } catch (error) {
      console.log("[Sites] Error loading sites:", error);
      setSitesError(t("dashboard.errors.failedToLoadSites"));
    } finally {
      setIsLoadingSites(false);
    }
  };

  // Load pricing plans data
  const loadPricingPlans = async () => {
    // Only proceed if user is admin
    if (!isAuthenticated || !user || user.role !== "admin") {
      return;
    }

    setIsLoadingPricingPlans(true);
    setPricingPlansError("");

    try {
      const response = await pricingApi.getPricingPlans();

      if (response.success) {
        // Try multiple response structure patterns
        let apiPlans: unknown[] = [];

        if (response.data) {
          // If wrapped in data property
          if (Array.isArray(response.data)) {
            apiPlans = response.data;
          } else if (
            typeof response.data === "object" &&
            "plans" in response.data
          ) {
            const dataWithPlans = response.data as { plans: unknown[] };
            apiPlans = dataWithPlans.plans;
          }
        } else {
          // If response is direct array or has plans property
          const directResponse = response as unknown as Record<string, unknown>;
          if (Array.isArray(directResponse)) {
            apiPlans = directResponse;
          } else if (
            directResponse.plans &&
            Array.isArray(directResponse.plans)
          ) {
            apiPlans = directResponse.plans;
          }
        }

        // Transform API pricing plans to frontend pricing plans
        const frontendPlans: PricingPlan[] = apiPlans.map(
          (plan: unknown, index: number) => {
            const planObj = plan as Record<string, unknown>;
            return {
              id: index + 1, // API doesn't provide ID, so we generate one
              name:
                typeof planObj.name === "string"
                  ? planObj.name
                  : typeof planObj.PlanName === "string"
                    ? planObj.PlanName
                    : "",
              description:
                typeof planObj.description === "string"
                  ? planObj.description
                  : typeof planObj.PlanDescription === "string"
                    ? planObj.PlanDescription
                    : "",
              price:
                typeof planObj.price === "string"
                  ? planObj.price
                  : typeof planObj.PlanPrice === "string"
                    ? planObj.PlanPrice
                    : "",
              credits:
                parseInt(
                  typeof planObj.credits === "string" ? planObj.credits : "0"
                ) || 0,
              daysValidity:
                parseInt(
                  typeof planObj.days === "string"
                    ? planObj.days
                    : typeof planObj.DaysValidity === "string"
                      ? planObj.DaysValidity
                      : "0"
                ) || 0,
              contactUsUrl:
                typeof planObj.contact === "string"
                  ? planObj.contact
                  : typeof planObj.ContactUsUrl === "string"
                    ? planObj.ContactUsUrl
                    : "",
              supportedSites: Array.isArray(planObj.sites)
                ? (planObj.sites as string[])
                : Array.isArray(planObj.Sites)
                  ? (planObj.Sites as string[])
                  : typeof planObj.sites === "string"
                    ? planObj.sites
                        .split(",")
                        .map((site) => site.trim())
                        .filter((site) => site.length > 0)
                    : typeof planObj.Sites === "string"
                      ? planObj.Sites.split(",")
                          .map((site) => site.trim())
                          .filter((site) => site.length > 0)
                      : [],
              features: [
                t("dashboard.packageManagement.features.accessToSites"),
                t("dashboard.packageManagement.features.support"),
                t("dashboard.packageManagement.features.adminManagement"),
              ],
            };
          }
        );

        setPricingPlans(frontendPlans);
      } else {
        setPricingPlansError(
          response.error?.message ||
            t("dashboard.errors.failedToLoadPricingPlans")
        );
      }
    } catch {
      setPricingPlansError(t("dashboard.errors.failedToLoadPricingPlans"));
    } finally {
      setIsLoadingPricingPlans(false);
    }
  };

  // Load data on component mount only if user is admin
  useEffect(() => {
    // Only load data if user is authenticated and is admin
    if (isAuthenticated && user && user.role === "admin") {
      loadCreditAnalytics();
      loadEnhancedCreditHistory();
      loadUsersStatistics();
      loadSites();
      loadPricingPlans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // URL validation
  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle add site
  const handleAddSite = async () => {
    // Reset errors
    setSiteNameError("");
    setSiteUrlError("");
    setSitePriceError("");
    setSiteIconError("");

    // Validate site name
    if (!siteName.trim()) {
      setSiteNameError(t("dashboard.siteManagement.validation.nameRequired"));
      return;
    }

    // Validate site URL
    if (!siteUrl.trim()) {
      setSiteUrlError(t("dashboard.siteManagement.validation.urlRequired"));
      return;
    }
    if (!validateUrl(siteUrl)) {
      setSiteUrlError(t("dashboard.siteManagement.validation.invalidUrl"));
      return;
    }

    // Validate price
    if (!sitePrice.trim()) {
      setSitePriceError(t("dashboard.siteManagement.validation.priceRequired"));
      return;
    }
    if (isNaN(Number(sitePrice)) || Number(sitePrice) <= 0) {
      setSitePriceError(t("dashboard.siteManagement.validation.invalidPrice"));
      return;
    }

    // Validate site icon
    if (!siteIcon.trim()) {
      setSiteIconError(t("dashboard.siteManagement.validation.iconRequired"));
      return;
    }
    if (!validateUrl(siteIcon)) {
      setSiteIconError(t("dashboard.siteManagement.validation.invalidIconUrl"));
      return;
    }

    setIsAddingSite(true);

    try {
      const siteData: SiteInput = {
        SiteName: siteName,
        SiteUrl: siteUrl,
        price: sitePrice,
        icon: siteIcon,
        external: siteExternal,
      };

      const response = await siteApi.addSite(siteData);

      if (response.success && response.data) {
        // response.data is of type SiteActionResponse
        // SiteActionResponse has: { success: boolean, data: { message: string, site: SiteResponse } }
        const siteData = response.data.data?.site;

        const newSite: FrontendSite = {
          name: siteData?.name || siteName,
          url: siteData?.url || siteUrl,
          price: siteData?.price ? Number(siteData.price) : Number(sitePrice),
          icon: siteIcon,
          external: siteExternal,
          total_downloads: 0, // Default value since not returned by API
          today_downloads: 0, // Default value since not returned by API
          last_reset: new Date().toISOString().split("T")[0], // Default to today
          id: sites.length + 1,
          status: "Active",
          addedDate: new Date().toISOString().split("T")[0],
        };

        setSites([...sites, newSite]);
        setIsAddingSite(false);
        setIsAddSiteDialogOpen(false);

        // Reset form
        setSiteName("");
        setSiteUrl("");
        setSitePrice("");
        setSiteIcon("");
        setSiteExternal(false);

        // Show success toast
        toast.success(t("dashboard.siteManagement.toast.addSuccess"));

        // Refresh sites list to get updated data
        await loadSites();
      } else {
        // Handle API error
        const errorMessage =
          response.error?.message ||
          t("dashboard.siteManagement.toast.addError");
        toast.error(errorMessage);
      }
    } catch {
      // Error handling
      toast.error(t("dashboard.siteManagement.toast.addError"));
    } finally {
      setIsAddingSite(false);
    }
  };

  // Handle edit site
  const handleEditSite = async () => {
    if (!currentEditingSite) return;

    // Reset errors
    setEditSiteNameError("");
    setEditSiteUrlError("");
    setEditSitePriceError("");
    setEditSiteIconError("");

    // Validate price
    if (!editSitePrice.trim()) {
      setEditSitePriceError(
        t("dashboard.siteManagement.validation.priceRequired")
      );
      return;
    }
    if (isNaN(Number(editSitePrice)) || Number(editSitePrice) <= 0) {
      setEditSitePriceError(
        t("dashboard.siteManagement.validation.invalidPrice")
      );
      return;
    }

    // Validate site icon
    if (!editSiteIcon.trim()) {
      setEditSiteIconError(
        t("dashboard.siteManagement.validation.iconRequired")
      );
      return;
    }
    if (!validateUrl(editSiteIcon)) {
      setEditSiteIconError(
        t("dashboard.siteManagement.validation.invalidIconUrl")
      );
      return;
    }

    setIsEditingSite(true);

    try {
      const siteData: SiteInput = {
        SiteName: editSiteName,
        SiteUrl: editSiteUrl,
        price: editSitePrice,
        icon: editSiteIcon,
        external: editSiteExternal,
      };

      const response = await siteApi.editSite(siteData);

      if (response.success && response.data) {
        // Update the site in the local state
        const updatedSites = sites.map((site) =>
          site.url === currentEditingSite.url
            ? {
                ...site,
                price: Number(editSitePrice),
                icon: editSiteIcon,
                external: editSiteExternal,
              }
            : site
        );
        setSites(updatedSites);

        setIsEditingSite(false);
        setIsEditSiteDialogOpen(false);

        // Reset form
        setEditSiteName("");
        setEditSiteUrl("");
        setEditSitePrice("");
        setEditSiteIcon("");
        setEditSiteExternal(false);
        setCurrentEditingSite(null);

        // Show success toast
        toast.success(t("dashboard.siteManagement.toast.editSuccess"));

        // Refresh sites list to get updated data
        await loadSites();
      } else {
        // Handle API error
        const errorMessage =
          response.error?.message ||
          t("dashboard.siteManagement.toast.editError");
        toast.error(errorMessage);
      }
    } catch {
      // Error handling
      toast.error(t("dashboard.siteManagement.toast.editError"));
    } finally {
      setIsEditingSite(false);
    }
  };

  // Open edit site dialog
  const openEditSiteDialog = (site: FrontendSite) => {
    setCurrentEditingSite(site);
    setEditSiteName(site.name);
    setEditSiteUrl(site.url);
    setEditSitePrice(site.price.toString());
    setEditSiteIcon(site.icon);
    setEditSiteExternal(site.external);

    // Reset errors
    setEditSiteNameError("");
    setEditSiteUrlError("");
    setEditSitePriceError("");
    setEditSiteIconError("");

    setIsEditSiteDialogOpen(true);
  };

  // Handle delete site
  const handleDeleteSite = async (siteUrl: string) => {
    try {
      const response = await siteApi.deleteSite({ SiteUrl: siteUrl });

      if (response.success) {
        // Remove the site from the local state
        setSites(sites.filter((site) => site.url !== siteUrl));

        // Show success toast
        toast.success(t("dashboard.siteManagement.toast.deleteSuccess"));

        // Refresh sites list to get updated data
        await loadSites();
      } else {
        // Handle API error
        const errorMessage =
          response.error?.message ||
          t("dashboard.siteManagement.toast.deleteError");
        toast.error(errorMessage);
      }
    } catch {
      // Error handling
      toast.error(t("dashboard.siteManagement.toast.deleteError"));
    }
  };

  // Handle add package
  const handleAddPackage = async () => {
    // Reset errors
    setPackageNameError("");
    setPackageDescriptionError("");
    setPackageDaysValidityError("");
    setPackageCreditsError("");
    setPackageContactUrlError("");
    setPackageSupportedSitesError("");

    // Validate package name
    if (!packageName.trim()) {
      setPackageNameError(
        t("dashboard.packageManagement.validation.nameRequired")
      );
      return;
    }

    // Validate description
    if (!packageDescription.trim()) {
      setPackageDescriptionError(
        t("dashboard.packageManagement.validation.descriptionRequired")
      );
      return;
    }

    // Validate days validity
    if (!packageDaysValidity.trim()) {
      setPackageDaysValidityError(
        t("dashboard.packageManagement.validation.daysRequired")
      );
      return;
    }
    if (
      isNaN(Number(packageDaysValidity)) ||
      Number(packageDaysValidity) <= 0
    ) {
      setPackageDaysValidityError(
        t("dashboard.packageManagement.validation.invalidDays")
      );
      return;
    }

    // Validate credits
    if (!packageCredits.trim()) {
      setPackageCreditsError(
        t("dashboard.packageManagement.validation.creditsRequired")
      );
      return;
    }
    if (isNaN(Number(packageCredits)) || Number(packageCredits) <= 0) {
      setPackageCreditsError(
        t("dashboard.packageManagement.validation.invalidCredits")
      );
      return;
    }

    // Validate supported sites (required)
    const sitesArray = packageSupportedSites
      .split(",")
      .map((site) => site.trim())
      .filter((site) => site.length > 0);

    if (sitesArray.length === 0) {
      setPackageSupportedSitesError(
        t("dashboard.packageManagement.validation.sitesRequired")
      );
      return;
    }

    // Debug logging
    console.log("[Pricing Plan] Sites validation debug:", {
      sitesArray,
      loadedSitesCount: sites.length,
      isLoadingSites,
      loadedSites: sites.map((s) => ({ name: s.name, url: s.url })),
    });

    // Validate that all sites exist in the system (only if sites are loaded and we have data)
    if (sites.length > 0 && !isLoadingSites) {
      // Check both site names and URLs for flexibility
      const availableSiteNames = sites.map((site) => site.name.toLowerCase());
      const availableSiteUrls = sites.map((site) => site.url.toLowerCase());

      const invalidSites = sitesArray.filter((site) => {
        const lowerSite = site.toLowerCase();
        return (
          !availableSiteNames.includes(lowerSite) &&
          !availableSiteUrls.includes(lowerSite)
        );
      });

      if (invalidSites.length > 0) {
        setPackageSupportedSitesError(
          `Invalid sites: ${invalidSites.join(", ")}. Available sites: ${sites.map((s) => `${s.name} (${s.url})`).join(", ")}`
        );
        return;
      }
    }

    // Match the exact case from the loaded sites to ensure backend compatibility
    const validatedSites = sitesArray.map((inputSite) => {
      const lowerInput = inputSite.toLowerCase();
      // Find the matching site from loaded sites to get the exact URL
      const matchingSite = sites.find(
        (site) =>
          site.name.toLowerCase() === lowerInput ||
          site.url.toLowerCase() === lowerInput
      );
      // Return the exact site URL as expected by the backend
      return matchingSite ? matchingSite.url : inputSite;
    });

    console.log("[Pricing Plan] Final validated sites:", validatedSites);

    // Validate contact URL (required)
    if (!packageContactUrl.trim()) {
      setPackageContactUrlError(
        t("dashboard.packageManagement.validation.contactUrlRequired")
      );
      return;
    }
    if (!validateUrl(packageContactUrl)) {
      setPackageContactUrlError(
        t("dashboard.packageManagement.validation.invalidUrl")
      );
      return;
    }

    setIsAddingPackage(true);

    try {
      const pricingPlanData: PricingPlanInput = {
        PlanName: packageName,
        PlanPrice: packagePrice.trim() || undefined,
        DaysValidity: packageDaysValidity,
        Sites: validatedSites, // Send as array to backend
        PlanDescription: packageDescription,
        ContactUsUrl: packageContactUrl.trim(), // Required field
        credits: packageCredits,
      };

      console.log(
        "[Pricing Plan] Sending API request with data:",
        pricingPlanData
      );

      const response = await pricingApi.addPricingPlan(pricingPlanData);

      if (response.success) {
        // Reset form first
        setPackageName("");
        setPackagePrice("");
        setPackageDescription("");
        setPackageDaysValidity("");
        setPackageCredits("");
        setPackageContactUrl("");
        setPackageSupportedSites("");

        // Close dialog
        setIsAddPackageDialogOpen(false);

        // Show success toast
        toast.success(t("dashboard.packageManagement.toast.addSuccess"));

        // Reload pricing plans to get the updated list
        await loadPricingPlans();
      } else {
        // Handle API error
        console.log("[Pricing Plan] API Error Response:", response);
        console.log("[Pricing Plan] Full Error Details:", response.error);
        console.log("[Pricing Plan] Error Message:", response.error?.message);
        console.log("[Pricing Plan] Raw Response:", response);

        // Try to get more detailed error information
        const errorMessage =
          response.error?.message ||
          (typeof response.error === "string" ? response.error : null) ||
          t("dashboard.packageManagement.toast.addError");

        console.log("[Pricing Plan] Final Error Message:", errorMessage);

        // Show error toast
        toast.error(errorMessage);

        // Show error in appropriate field based on error message
        if (errorMessage.toLowerCase().includes("sites")) {
          setPackageSupportedSitesError(errorMessage);
        } else if (errorMessage.toLowerCase().includes("name")) {
          setPackageNameError(errorMessage);
        } else if (errorMessage.toLowerCase().includes("description")) {
          setPackageDescriptionError(errorMessage);
        } else if (
          errorMessage.toLowerCase().includes("days") ||
          errorMessage.toLowerCase().includes("validity")
        ) {
          setPackageDaysValidityError(errorMessage);
        } else if (errorMessage.toLowerCase().includes("credits")) {
          setPackageCreditsError(errorMessage);
        } else if (
          errorMessage.toLowerCase().includes("contact") ||
          errorMessage.toLowerCase().includes("url")
        ) {
          setPackageContactUrlError(errorMessage);
        } else {
          // Generic error - show under plan name
          setPackageNameError(errorMessage);
        }
      }
    } catch {
      const errorMessage = t("dashboard.packageManagement.toast.addError");
      setPackageNameError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsAddingPackage(false);
    }
  };

  // Handle edit package
  const handleEditPackage = (plan: PricingPlan) => {
    setEditingPackage(plan);
    setEditPackageName(plan.name);
    setEditPackagePrice(plan.price || "");
    setEditPackageDescription(plan.description);
    setEditPackageDaysValidity(plan.daysValidity.toString());
    setEditPackageCredits(plan.credits.toString());
    setEditPackageContactUrl(plan.contactUsUrl || "");
    setEditPackageSupportedSites(
      plan.supportedSites ? plan.supportedSites.join(", ") : ""
    );
    setIsEditPackageDialogOpen(true);
  };

  // Handle update package
  const handleUpdatePackage = async () => {
    // Reset errors
    setEditPackageNameError("");
    setEditPackageDescriptionError("");
    setEditPackageDaysValidityError("");
    setEditPackageCreditsError("");
    setEditPackageContactUrlError("");
    setEditPackageSupportedSitesError("");

    // Validate package name
    if (!editPackageName.trim()) {
      setEditPackageNameError(
        t("dashboard.packageManagement.validation.nameRequired")
      );
      return;
    }

    // Validate description
    if (!editPackageDescription.trim()) {
      setEditPackageDescriptionError(
        t("dashboard.packageManagement.validation.descriptionRequired")
      );
      return;
    }

    // Validate days validity
    if (!editPackageDaysValidity.trim()) {
      setEditPackageDaysValidityError(
        t("dashboard.packageManagement.validation.daysRequired")
      );
      return;
    }
    if (
      isNaN(Number(editPackageDaysValidity)) ||
      Number(editPackageDaysValidity) <= 0
    ) {
      setEditPackageDaysValidityError(
        t("dashboard.packageManagement.validation.invalidDays")
      );
      return;
    }

    // Validate credits
    if (!editPackageCredits.trim()) {
      setEditPackageCreditsError(
        t("dashboard.packageManagement.validation.creditsRequired")
      );
      return;
    }
    if (isNaN(Number(editPackageCredits)) || Number(editPackageCredits) <= 0) {
      setEditPackageCreditsError(
        t("dashboard.packageManagement.validation.invalidCredits")
      );
      return;
    }

    // Validate supported sites (required)
    const editSitesArray = editPackageSupportedSites
      .split(",")
      .map((site) => site.trim())
      .filter((site) => site.length > 0);

    if (editSitesArray.length === 0) {
      setEditPackageSupportedSitesError(
        t("dashboard.packageManagement.validation.sitesRequired")
      );
      return;
    }

    // Validate that all sites exist in the system (only if sites are loaded and we have data)
    if (sites.length > 0 && !isLoadingSites) {
      // Check both site names and URLs for flexibility
      const availableSiteNames = sites.map((site) => site.name.toLowerCase());
      const availableSiteUrls = sites.map((site) => site.url.toLowerCase());

      const invalidSites = editSitesArray.filter((site) => {
        const lowerSite = site.toLowerCase();
        return (
          !availableSiteNames.includes(lowerSite) &&
          !availableSiteUrls.includes(lowerSite)
        );
      });

      if (invalidSites.length > 0) {
        setEditPackageSupportedSitesError(
          `Invalid sites: ${invalidSites.join(", ")}. Available sites: ${sites.map((s) => `${s.name} (${s.url})`).join(", ")}`
        );
        return;
      }
    }

    // Match the exact case from the loaded sites to ensure backend compatibility
    const validatedEditSites = editSitesArray.map((inputSite) => {
      const lowerInput = inputSite.toLowerCase();
      // Find the matching site from loaded sites to get the exact URL
      const matchingSite = sites.find(
        (site) =>
          site.name.toLowerCase() === lowerInput ||
          site.url.toLowerCase() === lowerInput
      );
      // Return the exact site URL as expected by the backend
      return matchingSite ? matchingSite.url : inputSite;
    });

    // Validate contact URL (required)
    if (!editPackageContactUrl.trim()) {
      setEditPackageContactUrlError(
        t("dashboard.packageManagement.validation.contactUrlRequired")
      );
      return;
    }
    if (!validateUrl(editPackageContactUrl)) {
      setEditPackageContactUrlError(
        t("dashboard.packageManagement.validation.invalidUrl")
      );
      return;
    }

    setIsEditingPackage(true);

    try {
      if (!editingPackage) return;

      const pricingPlanData: PricingPlanInput = {
        PlanName: editPackageName,
        PlanPrice: editPackagePrice.trim() || undefined,
        DaysValidity: editPackageDaysValidity,
        Sites: validatedEditSites, // Send as array to backend
        PlanDescription: editPackageDescription,
        ContactUsUrl: editPackageContactUrl.trim(), // Required field
        credits: editPackageCredits,
      };

      const response = await pricingApi.editPricingPlan(pricingPlanData);

      if (response.success) {
        // Reload pricing plans to get the updated list
        await loadPricingPlans();

        setIsEditPackageDialogOpen(false);

        // Show success toast
        toast.success(t("dashboard.packageManagement.toast.updateSuccess"));

        // Reset form
        setEditingPackage(null);
        setEditPackageName("");
        setEditPackagePrice("");
        setEditPackageDescription("");
        setEditPackageDaysValidity("");
        setEditPackageCredits("");
        setEditPackageContactUrl("");
        setEditPackageSupportedSites("");
      } else {
        // Handle API error
        const errorMessage =
          response.error?.message ||
          t("dashboard.packageManagement.toast.updateError");
        toast.error(errorMessage);
      }
    } catch {
      // Error handling
      toast.error(t("dashboard.packageManagement.toast.updateError"));
    } finally {
      setIsEditingPackage(false);
    }
  };

  // Handle delete package
  const handleDeletePackage = async () => {
    if (!editingPackage) return;

    setIsDeletingPackage(true);

    try {
      const response = await pricingApi.deletePricingPlan({
        PlanName: editingPackage.name,
      });

      if (response.success) {
        // Reload pricing plans to get the updated list
        await loadPricingPlans();

        // Show success toast
        toast.success(t("dashboard.packageManagement.toast.deleteSuccess"));

        // Close alert dialog first
        setIsDeleteDialogOpen(false);

        // Then close main edit dialog after a short delay
        setTimeout(() => {
          setIsEditPackageDialogOpen(false);

          // Reset form
          setEditingPackage(null);
          setEditPackageName("");
          setEditPackagePrice("");
          setEditPackageDescription("");
          setEditPackageDaysValidity("");
          setEditPackageCredits("");
          setEditPackageContactUrl("");
          setEditPackageSupportedSites("");
        }, 300);
      } else {
        // Handle API error
        const errorMessage =
          response.error?.message ||
          t("dashboard.packageManagement.toast.deleteError");
        toast.error(errorMessage);
      }
    } catch {
      // Error handling
      toast.error(t("dashboard.packageManagement.toast.deleteError"));
    } finally {
      setIsDeletingPackage(false);
    }
  };

  // Handle form submission
  const handleAddSubscription = async () => {
    // Only proceed if user is admin
    if (!isAuthenticated || !user || user.role !== "admin") {
      return;
    }

    // Reset errors
    setEmailError("");
    setPlanError("");

    // Validate email
    if (!email.trim()) {
      setEmailError(t("dashboard.addSubscription.validation.emailRequired"));
      return;
    }
    if (!validateEmail(email)) {
      setEmailError(t("dashboard.addSubscription.validation.invalidEmail"));
      return;
    }

    // Validate plan selection
    if (!selectedPlan) {
      setPlanError(t("dashboard.addSubscription.validation.planRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await creditApi.addSubscription({
        email: email.trim(),
        plan_name: selectedPlan,
      });

      if (response.success) {
        setEmail("");
        setSelectedPlan("");
        // Refresh analytics, history, and user data
        loadCreditAnalytics();
        loadEnhancedCreditHistory();
        loadUsersStatistics();
        // Here you would typically show a success message
      } else {
        setEmailError(
          response.error?.message ||
            t("dashboard.errors.failedToAddSubscription")
        );
      }
    } catch {
      setEmailError(t("dashboard.errors.failedToAddSubscription"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle upgrade subscription
  const handleUpgradeSubscription = async () => {
    setUpgradeEmailError("");
    setUpgradeNewPlanError("");

    if (!upgradeEmail.trim()) {
      setUpgradeEmailError(
        t("dashboard.upgradeSubscription.validation.emailRequired")
      );
      return;
    }
    if (!validateEmail(upgradeEmail)) {
      setUpgradeEmailError(
        t("dashboard.upgradeSubscription.validation.invalidEmail")
      );
      return;
    }
    if (!upgradeNewPlan) {
      setUpgradeNewPlanError(
        t("dashboard.upgradeSubscription.validation.planRequired")
      );
      return;
    }

    setIsUpgradeSubmitting(true);

    try {
      const response = await creditApi.upgradeSubscription({
        email: upgradeEmail.trim(),
        plan_name: upgradeNewPlan,
      });

      if (response.success) {
        setUpgradeEmail("");
        setUpgradeNewPlan("");
        // Refresh analytics, history, and user data
        loadCreditAnalytics();
        loadEnhancedCreditHistory();
        loadUsersStatistics();
      } else {
        setUpgradeEmailError(
          response.error?.message ||
            t("dashboard.errors.failedToUpgradeSubscription")
        );
      }
    } catch {
      setUpgradeEmailError(t("dashboard.errors.failedToUpgradeSubscription"));
    } finally {
      setIsUpgradeSubmitting(false);
    }
  };

  // Handle extend subscription
  const handleExtendSubscription = async () => {
    setExtendEmailError("");
    setExtendDaysError("");

    if (!extendEmail.trim()) {
      setExtendEmailError(
        t("dashboard.extendSubscription.validation.emailRequired")
      );
      return;
    }
    if (!validateEmail(extendEmail)) {
      setExtendEmailError(
        t("dashboard.extendSubscription.validation.invalidEmail")
      );
      return;
    }
    if (!extendDays.trim() || parseInt(extendDays) <= 0) {
      setExtendDaysError(
        t("dashboard.extendSubscription.validation.daysRequired")
      );
      return;
    }

    setIsExtendSubmitting(true);

    try {
      const response = await creditApi.extendSubscription({
        email: extendEmail.trim(),
        days: parseInt(extendDays),
      });

      if (response.success) {
        setExtendEmail("");
        setExtendDays("30");
        // Refresh analytics, history, and user data
        loadCreditAnalytics();
        loadEnhancedCreditHistory();
        loadUsersStatistics();
      } else {
        setExtendEmailError(
          response.error?.message ||
            t("dashboard.errors.failedToExtendSubscription")
        );
      }
    } catch {
      setExtendEmailError(t("dashboard.errors.failedToExtendSubscription"));
    } finally {
      setIsExtendSubmitting(false);
    }
  };

  // Handle delete subscription
  const handleDeleteSubscription = async () => {
    setDeleteEmailError("");

    if (!deleteEmail.trim()) {
      setDeleteEmailError(
        t("dashboard.deleteSubscription.validation.emailRequired")
      );
      return;
    }
    if (!validateEmail(deleteEmail)) {
      setDeleteEmailError(
        t("dashboard.deleteSubscription.validation.invalidEmail")
      );
      return;
    }

    setIsDeleteSubmitting(true);

    try {
      const response = await creditApi.deleteSubscription({
        email: deleteEmail.trim(),
      });

      if (response.success) {
        setDeleteEmail("");
        // Refresh analytics, history, and user data
        loadCreditAnalytics();
        loadEnhancedCreditHistory();
        loadUsersStatistics();
      } else {
        setDeleteEmailError(
          response.error?.message ||
            t("dashboard.errors.failedToDeleteSubscription")
        );
      }
    } catch {
      setDeleteEmailError(t("dashboard.errors.failedToDeleteSubscription"));
    } finally {
      setIsDeleteSubmitting(false);
    }
  };

  // Sites data and loading states
  const [sites, setSites] = useState<FrontendSite[]>([]);
  const [isLoadingSites, setIsLoadingSites] = useState<boolean>(false);
  const [sitesError, setSitesError] = useState<string>("");

  const [pricingPlans, setPricingPlans] = useState([
    {
      id: 1,
      name: "Test Plan",
      description: "Perfect for management",
      price: "$99",
      credits: 1000,
      daysValidity: 30,
      contactUsUrl: "",
      supportedSites: ["Site A", "Site B", "Site C"],
      features: [
        "dashboard.packageManagement.features.accessToSites",
        "dashboard.packageManagement.features.support",
        "dashboard.packageManagement.features.adminManagement",
      ],
    },
    {
      id: 2,
      name: "Basic Plan",
      description: "Perfect for management",
      price: "",
      credits: 50,
      daysValidity: 15,
      contactUsUrl: "https://example.com/contact",
      supportedSites: ["Site A", "Site B"],
      features: [
        "dashboard.packageManagement.features.accessToSites",
        "dashboard.packageManagement.features.support",
        "dashboard.packageManagement.features.adminManagement",
      ],
    },
  ]);

  // Transform API user data to match the expected format
  const transformedUsers = useMemo(() => {
    // If we have an error or no data, return empty array
    if (usersError || isLoadingUsers) {
      return [];
    }

    // Check if we have users data
    if (!usersData) {
      return [];
    }

    // Try to find users array in different possible locations
    let usersArray: unknown[] = [];

    if (Array.isArray(usersData.users)) {
      usersArray = usersData.users;
    } else if (Array.isArray(usersData)) {
      usersArray = usersData as unknown[];
    } else {
      return [];
    }

    if (usersArray.length === 0) {
      return [];
    }

    const transformed = usersArray.map((user, index) => {
      const userObj = user as Record<string, unknown>;
      const firstName =
        typeof userObj.firstName === "string"
          ? userObj.firstName
          : typeof userObj.first_name === "string"
            ? userObj.first_name
            : "Unknown";
      const lastName =
        typeof userObj.lastName === "string"
          ? userObj.lastName
          : typeof userObj.last_name === "string"
            ? userObj.last_name
            : "User";

      // Extract subscription data
      const subscription = userObj.subscription as
        | Record<string, unknown>
        | undefined;
      const subscriptionCredits = subscription?.credits as
        | Record<string, unknown>
        | undefined;

      return {
        id: index + 1,
        name: `${firstName} ${lastName}`,
        email: typeof userObj.email === "string" ? userObj.email : "No email",
        phone:
          typeof userObj.phoneNum === "string"
            ? userObj.phoneNum
            : typeof userObj.phone === "string"
              ? userObj.phone
              : "No Number", // Default phone since API might not provide it
        credits:
          typeof subscriptionCredits?.remaining === "number"
            ? subscriptionCredits.remaining
            : typeof userObj.credits === "number"
              ? userObj.credits
              : 0, // Get credits from subscription.credits.remaining
        status: typeof userObj.status === "string" ? userObj.status : "Active", // Default status since API might not provide it
        expiry:
          typeof subscription?.until === "string"
            ? subscription.until
            : typeof userObj.expiry === "string"
              ? userObj.expiry
              : typeof userObj.subscription_expiry === "string"
                ? userObj.subscription_expiry
                : "2024-12-31", // Default expiry since API might not provide it
        plan:
          typeof subscription?.plan === "string"
            ? subscription.plan
            : typeof userObj.plan === "string"
              ? userObj.plan
              : typeof userObj.subscription_plan === "string"
                ? userObj.subscription_plan
                : "Basic Plan", // Default plan since API might not provide it
        avatar: `${firstName.charAt(0)}${lastName.charAt(0)}`,
        joinDate:
          typeof userObj.joinDate === "string"
            ? userObj.joinDate
            : typeof userObj.created_at === "string"
              ? userObj.created_at
              : "2024-01-15", // Default join date since API might not provide it
        lastActive:
          typeof userObj.lastActive === "string"
            ? userObj.lastActive
            : typeof userObj.last_active === "string"
              ? userObj.last_active
              : "2 hours ago", // Default last active since API might not provide it
      };
    });

    return transformed;
  }, [usersData, usersError, isLoadingUsers]);

  // Filter users based on search term and status
  const filteredUsers = transformedUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.plan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      user.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border border-green-200";
      case "expired":
        return "bg-destructive/10 text-destructive border border-destructive/20";
      case "suspended":
        return "bg-muted text-muted-foreground border border-border";
      default:
        return "bg-secondary text-secondary-foreground border border-border";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle className="w-3 h-3" />;
      case "expired":
        return <XCircle className="w-3 h-3" />;
      case "suspended":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <CheckCircle className="w-3 h-3" />;
    }
  };

  // Show loading skeleton while language data is loading
  if (isLoading) {
    return <DashboardSkeleton isRTL={isRTL} />;
  }

  return (
    <AdminRouteGuard>
      <div
        className={`min-h-screen bg-background ${isRTL ? "font-tajawal" : "font-sans"}`}
      >
        {/* Header */}
        <header
          className={`bg-background border-b border-border px-4 sm:px-5 py-4 ${isRTL ? "lg:mr-72" : "lg:ml-72"}`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}
            >
              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="cursor-pointer lg:hidden p-2 hover:bg-muted rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
              <Link
                href="/"
                className="flex items-center gap-1 sm:gap-2 cursor-pointer"
              >
                <div
                  className={`${isRTL && "ml-2"} w-8 h-8 bg-primary rounded-lg flex items-center justify-center`}
                >
                  <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
                </div>
                <span className="text-base sm:text-xl font-semibold text-foreground">
                  {t("header.logo")}
                </span>
              </Link>
            </div>
            <HeaderControls />
          </div>
        </header>
        <div className="flex">
          {/* Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          {/* Main Content */}
          <main
            className={`flex-1 ${isRTL ? "lg:mr-72" : "lg:ml-72"} p-4 sm:p-5 space-y-4 sm:space-y-5 bg-secondary/50`}
          >
            {/* Stats Cards */}
            {isLoadingUsers || isLoadingAnalytics || isLoadingSites ? (
              <DashboardStatsCardsSkeleton />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {/* Total Users Card */}
                <Card className="group dark:bg-muted/50">
                  <CardContent>
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 sm:space-y-4 flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base lg:text-lg font-medium text-foreground uppercase tracking-wide">
                              {t("dashboard.stats.totalUsers.title")}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground/80">
                              {t("dashboard.stats.totalUsers.description")}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {usersData?.total_users?.toLocaleString() || "0"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Active Sites Card */}
                <Card className="group dark:bg-muted/50">
                  <CardContent>
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 sm:space-y-4 flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center">
                            <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base lg:text-lg font-medium text-foreground uppercase tracking-wide">
                              {t("dashboard.stats.activeSites.title")}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground/80">
                              {t("dashboard.stats.activeSites.description")}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {sites?.length?.toLocaleString() || "0"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Online Users Card */}
                <Card className="group dark:bg-muted/50">
                  <CardContent>
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 sm:space-y-4 flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center relative">
                            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base lg:text-lg font-medium text-foreground uppercase tracking-wide">
                              {t("dashboard.stats.onlineUsers.title")}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground/80">
                              {t("dashboard.stats.onlineUsers.description")}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {usersData?.online_users?.toLocaleString() || "0"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Users Management Table */}
            <Card id="users-management" className="dark:bg-muted/50">
              <CardHeader className="w-full flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="w-full max-w-lg">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {t("dashboard.usersManagement.title")}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("dashboard.usersManagement.description")}
                  </p>
                </div>
                <div className="w-full flex flex-col sm:flex-row items-stretch md:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={t(
                        "dashboard.usersManagement.searchPlaceholder"
                      )}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-full md:w-80"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("dashboard.usersManagement.filters.allStatus")}
                      </SelectItem>
                      <SelectItem value="active">
                        {t("dashboard.usersManagement.filters.active")}
                      </SelectItem>
                      <SelectItem value="expired">
                        {t("dashboard.usersManagement.filters.expired")}
                      </SelectItem>
                      <SelectItem value="suspended">
                        {t("dashboard.usersManagement.filters.suspended")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto max-h-[278px] overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th
                          className={`${isRTL ? "text-right" : "text-left"} py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider`}
                        >
                          {t("dashboard.usersManagement.table.headers.user")}
                        </th>
                        <th
                          className={`${isRTL ? "text-right" : "text-left"} py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider`}
                        >
                          {t("dashboard.usersManagement.table.headers.phone")}
                        </th>
                        <th
                          className={`${isRTL ? "text-right" : "text-left"} py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider`}
                        >
                          {t(
                            "dashboard.usersManagement.table.headers.planCredits"
                          )}
                        </th>
                        <th
                          className={`${isRTL ? "text-right" : "text-left"} py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider`}
                        >
                          {t("dashboard.usersManagement.table.headers.status")}
                        </th>
                        <th
                          className={`${isRTL ? "text-right" : "text-left"} py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider`}
                        >
                          {t("dashboard.usersManagement.table.headers.expiry")}
                        </th>
                        <th
                          className={`${isRTL ? "text-left" : "text-right"} py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider`}
                        >
                          {t("dashboard.usersManagement.table.headers.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {isLoadingUsers ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center">
                            <div className="flex flex-col items-center space-y-3">
                              <Loader2 className="w-8 h-8 animate-spin text-primary" />
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {t(
                                    "dashboard.usersManagement.table.loadingUsers"
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {t(
                                    "dashboard.usersManagement.table.loadingDescription"
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : usersError ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center">
                            <div className="flex flex-col items-center space-y-3">
                              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-destructive" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {t(
                                    "dashboard.usersManagement.table.errorLoading"
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {usersError}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center">
                            <div className="flex flex-col items-center space-y-3">
                              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {t(
                                    "dashboard.usersManagement.table.noUsersFound"
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {t(
                                    "dashboard.usersManagement.table.noUsersDescription"
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-muted/50 transition-colors group"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-4">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                    {user.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-foreground truncate">
                                    {user.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm text-foreground">
                                {user.phone}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="space-y-1">
                                <div className="text-sm font-medium text-foreground">
                                  {user.plan}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-primary">
                                    {user.credits}{" "}
                                    {t(
                                      "dashboard.usersManagement.table.credits"
                                    )}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div
                                className={`inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadge(user.status)}`}
                              >
                                {getStatusIcon(user.status)}
                                <span>{user.status}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm text-foreground">
                                {user.expiry}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-end">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-8 px-3"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  {t("common.delete")}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Mobile Card View */}
                <div className="lg:hidden space-y-3 max-h-[400px] overflow-y-auto">
                  {isLoadingUsers ? (
                    <div className="py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {t("dashboard.usersManagement.table.loadingUsers")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "dashboard.usersManagement.table.loadingDescription"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : usersError ? (
                    <div className="py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-6 h-6 text-destructive" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {t("dashboard.usersManagement.table.errorLoading")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {usersError}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {t("dashboard.usersManagement.table.noUsersFound")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "dashboard.usersManagement.table.noUsersDescription"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="bg-card border border-border rounded-xl p-3 space-y-4 hover:bg-muted/20 transition-colors"
                      >
                        {/* Header with Avatar and Status */}
                        <div className="flex flex-col gap-5">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <Avatar className="w-12 h-12 flex-shrink-0">
                              <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                                {user.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="text-base font-semibold text-foreground truncate w-56">
                                {user.name}
                              </div>
                              <div className="text-sm text-muted-foreground truncate w-56">
                                {user.email}
                              </div>
                              <div className="text-sm text-muted-foreground truncate w-56">
                                {user.phone}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {t(
                                  "dashboard.usersManagement.table.lastActive",
                                  {
                                    time: user.lastActive,
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-full flex-shrink-0 ${getStatusBadge(user.status)}`}
                          >
                            {getStatusIcon(user.status)}
                            <span>{user.status}</span>
                          </div>
                        </div>
                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {
                                t(
                                  "dashboard.usersManagement.table.headers.planCredits"
                                ).split(" & ")[0]
                              }
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                              {user.plan}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {t("dashboard.usersManagement.table.credits")}
                            </div>
                            <div className="text-sm font-semibold text-primary flex items-center">
                              <Coins className="w-3 h-3 mr-1" />
                              {user.credits}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {t("dashboard.usersManagement.table.expires")}
                            </div>
                            <div className="text-sm font-semibold text-foreground flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {user.expiry}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {t("dashboard.usersManagement.table.joined")}
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                              {user.joinDate}
                            </div>
                          </div>
                        </div>
                        {/* Action Button */}
                        <div className="pt-3 border-t border-border">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full h-10 text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            {t("dashboard.usersManagement.table.deleteUser")}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {/* Table Footer with Stats */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-border space-y-3 sm:space-y-0">
                  <div className="text-sm text-muted-foreground">
                    {t("dashboard.usersManagement.table.showingUsers", {
                      filtered: filteredUsers.length,
                      total: transformedUsers.length,
                    })}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>
                        {
                          transformedUsers.filter((u) => u.status === "Active")
                            .length
                        }{" "}
                        {t("dashboard.usersManagement.filters.active")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                      <span>
                        {
                          transformedUsers.filter((u) => u.status === "Expired")
                            .length
                        }{" "}
                        {t("dashboard.usersManagement.filters.expired")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <span>
                        {
                          transformedUsers.filter(
                            (u) => u.status === "Suspended"
                          ).length
                        }{" "}
                        {t("dashboard.usersManagement.filters.suspended")}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Second Row: Add New Subscription, Credit History, Credit Analytics */}
            {isLoadingAnalytics || isLoadingHistory || isLoadingPricingPlans ? (
              <DashboardActionCardsSkeleton />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                {/* Add New Subscription Card */}
                <Card className="dark:bg-muted/50">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {t("dashboard.addSubscription.title")}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {t("dashboard.addSubscription.description")}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="add-email"
                        className="text-sm font-medium text-foreground"
                      >
                        {t("dashboard.addSubscription.userEmail")}
                      </Label>
                      <Input
                        id="add-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError("");
                        }}
                        placeholder={t(
                          "dashboard.addSubscription.placeholders.email"
                        )}
                        className={`transition-all ${
                          emailError
                            ? "border-destructive focus-visible:ring-destructive/20"
                            : "focus-visible:ring-primary/20"
                        }`}
                      />
                      {emailError && (
                        <p className="text-xs text-destructive flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{emailError}</span>
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="add-plan"
                        className="text-sm font-medium text-foreground"
                      >
                        {t("dashboard.addSubscription.plan")}
                      </Label>
                      <Select
                        value={selectedPlan}
                        onValueChange={(value) => {
                          setSelectedPlan(value);
                          if (planError) setPlanError("");
                        }}
                      >
                        <SelectTrigger
                          className={`transition-all w-full ${
                            planError
                              ? "border-destructive focus-visible:ring-destructive/20"
                              : "focus-visible:ring-primary/20"
                          }`}
                        >
                          <SelectValue
                            placeholder={t(
                              "dashboard.addSubscription.placeholders.plan"
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {pricingPlans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.name}>
                              {plan.name} - {plan.credits}{" "}
                              {t("dashboard.addSubscription.credits")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {planError && (
                        <p className="text-xs text-destructive flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{planError}</span>
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={handleAddSubscription}
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{t("dashboard.addSubscription.adding")}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <UserPlus className="w-4 h-4" />
                          <span>{t("dashboard.addSubscription.add")}</span>
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Enhanced Credit History Card */}
                <Card className="dark:bg-muted/50">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">
                          {t("dashboard.creditHistory.title")}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {t("dashboard.creditHistory.description")}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingHistory ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : historyError ? (
                      <div className="text-center py-8">
                        <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                        <p className="text-sm text-destructive mb-4">
                          {historyError}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={loadEnhancedCreditHistory}
                        >
                          {t("dashboard.creditHistory.retry")}
                        </Button>
                      </div>
                    ) : enhancedCreditHistory.length > 0 ? (
                      <div className="space-y-3">
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {enhancedCreditHistory
                            .slice(0, 5)
                            .map((entry, index) => {
                              const config = getTransactionTypeConfig(
                                entry.type
                              );
                              const IconComponent = config.icon;

                              return (
                                <div
                                  key={`${entry.email}-${entry.timestamp}-${index}`}
                                  className={`relative flex items-center justify-between p-4 bg-card border rounded-lg hover:bg-muted/50 transition-colors ${config.borderColor}`}
                                >
                                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    {/* Transaction Type Icon */}
                                    <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor}`}
                                    >
                                      <IconComponent
                                        className={`w-5 h-5 ${config.iconColor}`}
                                      />
                                    </div>

                                    {/* Transaction Details */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between space-x-2 mb-1">
                                        <span className="user-name-dashboard text-sm font-medium text-foreground truncate max-w-[120px]">
                                          {entry.user_name}
                                        </span>
                                        <Badge
                                          variant="secondary"
                                          className={`text-xs absolute ${isRTL ? "left-3" : "right-3"}`}
                                        >
                                          {t(
                                            `dashboard.creditHistory.transactions.types.${entry.type}`
                                          )}
                                        </Badge>
                                      </div>

                                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                        <Mail className="w-3 h-3" />
                                        <span className="truncate">
                                          {entry.email}
                                        </span>
                                      </div>

                                      {entry.plan && (
                                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                                          <CreditCard className="w-3 h-3" />
                                          <span>{entry.plan}</span>
                                        </div>
                                      )}

                                      {entry.reason && (
                                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                                          <Activity className="w-3 h-3" />
                                          <span className="capitalize">
                                            {t(
                                              `dashboard.creditHistory.reasons.${entry.reason}`,
                                              { defaultValue: entry.reason }
                                            )}
                                          </span>
                                        </div>
                                      )}

                                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                          {formatTimestamp(
                                            entry.timestamp,
                                            isRTL ? "ar" : "en"
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Amount Display (only for add and use types) */}
                                  {entry.type !== "delete" &&
                                    entry.amount !== undefined && (
                                      <div className="text-right ml-4">
                                        <div
                                          className={`text-sm font-medium ${config.amountColor}`}
                                        >
                                          {config.amountPrefix}
                                          {entry.amount}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              );
                            })}
                        </div>

                        {enhancedCreditHistory.length > 5 && (
                          <div className="pt-3 border-t border-border">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsCreditHistoryDialogOpen(true)}
                              className="w-full"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              {t("dashboard.creditHistory.showAll")} (
                              {enhancedCreditHistory.length})
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-center p-20">
                        <div>
                          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                          <p className="text-sm text-muted-foreground">
                            {t("dashboard.creditHistory.noHistoryData")}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Credit Analytics Card */}
                <Card className="dark:bg-muted/50">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {t("dashboard.creditAnalytics.title")}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {t("dashboard.creditAnalytics.description")}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isLoadingAnalytics ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : analyticsError ? (
                      <div className="text-center py-8">
                        <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                        <p className="text-sm text-destructive">
                          {analyticsError}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={loadCreditAnalytics}
                          className="mt-2"
                        >
                          {t("dashboard.creditAnalytics.retry")}
                        </Button>
                      </div>
                    ) : creditAnalytics ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1 text-center p-4 bg-primary/10 border border-primary/10 rounded-xl">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {t("dashboard.creditAnalytics.totalIssued")}
                            </p>
                            <p className="text-lg font-bold text-foreground">
                              {creditAnalytics.total_credits_issued.toLocaleString()}
                            </p>
                          </div>
                          <div className="space-y-1 text-center p-4 bg-green-400/10 border border-green-400/10 rounded-xl">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {t("dashboard.creditAnalytics.totalUsed")}
                            </p>
                            <p className="text-lg font-bold text-foreground">
                              {creditAnalytics.total_credits_used.toLocaleString()}
                            </p>
                          </div>
                          <div className="space-y-1 text-center p-4 bg-blue-400/10 border border-blue-400/10 rounded-xl">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {t("dashboard.creditAnalytics.remaining")}
                            </p>
                            <p className="text-lg font-bold text-forground">
                              {creditAnalytics.total_remaining_credits.toLocaleString()}
                            </p>
                          </div>
                          <div className="space-y-1 text-center p-4 bg-pink-400/10 border border-pink-400/10 rounded-xl">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {t("dashboard.creditAnalytics.dailyAverage")}
                            </p>
                            <p className="text-lg font-bold text-foreground">
                              {creditAnalytics.average_daily_usage.toFixed(1)}
                            </p>
                          </div>
                        </div>

                        {/* Credits by Plan Section */}
                        {creditAnalytics.credits_by_plan &&
                          Object.keys(creditAnalytics.credits_by_plan).length >
                            0 && (
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-foreground">
                                {t("dashboard.creditAnalytics.creditsByPlan")}
                              </h4>
                              <div className="space-y-2">
                                {Object.entries(
                                  creditAnalytics.credits_by_plan
                                ).map(([planName, credits]) => (
                                  <div
                                    key={planName}
                                    className="flex items-center justify-between p-3 bg-muted/50 border border-border/50 rounded-lg"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                                      <span className="text-sm font-medium text-foreground">
                                        {planName}
                                      </span>
                                    </div>
                                    <span className={`flex items-center gap-2 text-sm font-bold text-primary ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
                                      {credits.toLocaleString()} <span className={`text-muted-foreground ${isRTL && "text-xs"}`}>{`${isRTL ? "نقطة" : "Credits"}`}</span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">
                          {t("dashboard.creditAnalytics.noAnalyticsData")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Third Row: Upgrade Subscription, Extend Subscription, Delete Subscription */}
            {isLoadingPricingPlans ? (
              <DashboardManagementCardsSkeleton />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                {/* Upgrade Subscription Card */}
                <Card className="dark:bg-muted/50">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                        <ArrowUp className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {t("dashboard.upgradeSubscription.title")}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {t("dashboard.upgradeSubscription.description")}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="upgrade-email"
                        className="text-sm font-medium text-foreground"
                      >
                        {t("dashboard.upgradeSubscription.userEmail")}
                      </Label>
                      <Input
                        id="upgrade-email"
                        type="email"
                        value={upgradeEmail}
                        onChange={(e) => {
                          setUpgradeEmail(e.target.value);
                          if (upgradeEmailError) setUpgradeEmailError("");
                        }}
                        placeholder={t(
                          "dashboard.upgradeSubscription.placeholders.email"
                        )}
                        className={`transition-all ${
                          upgradeEmailError
                            ? "border-destructive focus-visible:ring-destructive/20"
                            : "focus-visible:ring-primary/20"
                        }`}
                      />
                      {upgradeEmailError && (
                        <p className="text-xs text-destructive flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{upgradeEmailError}</span>
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="upgrade-plan"
                        className="text-sm font-medium text-foreground"
                      >
                        {t("dashboard.upgradeSubscription.newPlan")}
                      </Label>
                      <Select
                        value={upgradeNewPlan}
                        onValueChange={(value) => {
                          setUpgradeNewPlan(value);
                          if (upgradeNewPlanError) setUpgradeNewPlanError("");
                        }}
                      >
                        <SelectTrigger
                          className={`transition-all w-full ${
                            upgradeNewPlanError
                              ? "border-destructive focus-visible:ring-destructive/20"
                              : "focus-visible:ring-primary/20"
                          }`}
                        >
                          <SelectValue
                            placeholder={t(
                              "dashboard.upgradeSubscription.placeholders.plan"
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {pricingPlans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.name}>
                              {plan.name} - {plan.credits}{" "}
                              {t("dashboard.upgradeSubscription.credits")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {upgradeNewPlanError && (
                        <p className="text-xs text-destructive flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{upgradeNewPlanError}</span>
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={handleUpgradeSubscription}
                      disabled={isUpgradeSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isUpgradeSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>
                            {t("dashboard.upgradeSubscription.upgrading")}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <ArrowUp className="w-4 h-4" />
                          <span>
                            {t("dashboard.upgradeSubscription.upgrade")}
                          </span>
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Extend Subscription Card */}
                <Card className="dark:bg-muted/50">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {t("dashboard.extendSubscription.title")}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {t("dashboard.extendSubscription.description")}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="extend-email"
                        className="text-sm font-medium text-foreground"
                      >
                        {t("dashboard.extendSubscription.userEmail")}
                      </Label>
                      <Input
                        id="extend-email"
                        type="email"
                        value={extendEmail}
                        onChange={(e) => {
                          setExtendEmail(e.target.value);
                          if (extendEmailError) setExtendEmailError("");
                        }}
                        placeholder={t(
                          "dashboard.extendSubscription.placeholders.email"
                        )}
                        className={`transition-all ${
                          extendEmailError
                            ? "border-destructive focus-visible:ring-destructive/20"
                            : "focus-visible:ring-primary/20"
                        }`}
                      />
                      {extendEmailError && (
                        <p className="text-xs text-destructive flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{extendEmailError}</span>
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="extend-days"
                        className="text-sm font-medium text-foreground"
                      >
                        {t("dashboard.extendSubscription.days")}
                      </Label>
                      <Input
                        id="extend-days"
                        type="number"
                        min="1"
                        value={extendDays}
                        onChange={(e) => {
                          setExtendDays(e.target.value);
                          if (extendDaysError) setExtendDaysError("");
                        }}
                        placeholder={t(
                          "dashboard.extendSubscription.placeholders.days"
                        )}
                        className={`transition-all ${
                          extendDaysError
                            ? "border-destructive focus-visible:ring-destructive/20"
                            : "focus-visible:ring-primary/20"
                        }`}
                      />
                      {extendDaysError && (
                        <p className="text-xs text-destructive flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{extendDaysError}</span>
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={handleExtendSubscription}
                      disabled={isExtendSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isExtendSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>
                            {t("dashboard.extendSubscription.extending")}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {t("dashboard.extendSubscription.extend")}
                          </span>
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Delete Subscription Card */}
                <Card className="dark:bg-muted/50 border-destructive/20">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-destructive/10 border border-destructive/10 rounded-lg flex items-center justify-center">
                        <UserMinus className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {t("dashboard.deleteSubscription.title")}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {t("dashboard.deleteSubscription.description")}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="delete-email"
                        className="text-sm font-medium text-foreground"
                      >
                        {t("dashboard.deleteSubscription.userEmail")}
                      </Label>
                      <Input
                        id="delete-email"
                        type="email"
                        value={deleteEmail}
                        onChange={(e) => {
                          setDeleteEmail(e.target.value);
                          if (deleteEmailError) setDeleteEmailError("");
                        }}
                        placeholder={t(
                          "dashboard.deleteSubscription.placeholders.email"
                        )}
                        className={`transition-all ${
                          deleteEmailError
                            ? "border-destructive focus-visible:ring-destructive/20"
                            : "focus-visible:ring-primary/20"
                        }`}
                      />
                      {deleteEmailError && (
                        <p className="text-xs text-destructive flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{deleteEmailError}</span>
                        </p>
                      )}
                    </div>
                    <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-destructive">
                            {t("dashboard.deleteSubscription.warning")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t(
                              "dashboard.deleteSubscription.warningDescription"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleDeleteSubscription}
                      disabled={isDeleteSubmitting}
                      variant="destructive"
                      className="w-full"
                    >
                      {isDeleteSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>
                            {t("dashboard.deleteSubscription.deleting")}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <UserMinus className="w-4 h-4" />
                          <span>
                            {t("dashboard.deleteSubscription.delete")}
                          </span>
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Supported Sites */}
            {isLoadingSites ? (
              <DashboardSitesManagementSkeleton isRTL={isRTL} />
            ) : (
              <Card id="sites-management" className="dark:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {t("dashboard.siteManagement.title")}
                  </CardTitle>
                  <Dialog
                    open={isAddSiteDialogOpen}
                    onOpenChange={setIsAddSiteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Plus className="w-4 h-4 stroke-3" />
                        {t("dashboard.siteManagement.addSite")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className={`sm:max-w-[425px] ${isRTL ? "[&>[data-slot=dialog-close]]:left-4 [&>[data-slot=dialog-close]]:right-auto" : ""}`}
                    >
                      <DialogHeader className={`${isRTL && "sm:text-right"}`}>
                        <DialogTitle className="text-lg font-semibold text-foreground">
                          {t("dashboard.siteManagement.addSite")}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                          {t("dashboard.siteManagement.description")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {/* Site Name */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="site-name"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <Globe className="w-4 h-4" />
                            {t("dashboard.siteManagement.siteName")}
                          </Label>
                          <Input
                            id="site-name"
                            value={siteName}
                            onChange={(e) => {
                              setSiteName(e.target.value);
                              if (siteNameError) setSiteNameError("");
                            }}
                            placeholder={t(
                              "dashboard.siteManagement.placeholders.siteName"
                            )}
                            className={`transition-all ${
                              siteNameError
                                ? "border-destructive focus-visible:ring-destructive/20"
                                : "focus-visible:ring-primary/20"
                            }`}
                          />
                          {siteNameError && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <span className="w-1 h-1 bg-destructive rounded-full"></span>
                              <span>{siteNameError}</span>
                            </p>
                          )}
                        </div>
                        {/* Site URL */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="site-url"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {t("dashboard.siteManagement.siteUrl")}
                          </Label>
                          <Input
                            id="site-url"
                            value={siteUrl}
                            onChange={(e) => {
                              setSiteUrl(e.target.value);
                              if (siteUrlError) setSiteUrlError("");
                            }}
                            placeholder={t(
                              "dashboard.siteManagement.placeholders.siteUrl"
                            )}
                            className={`transition-all ${
                              siteUrlError
                                ? "border-destructive focus-visible:ring-destructive/20"
                                : "focus-visible:ring-primary/20"
                            }`}
                          />
                          {siteUrlError && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <span className="w-1 h-1 bg-destructive rounded-full"></span>
                              <span>{siteUrlError}</span>
                            </p>
                          )}
                        </div>
                        {/* Price */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="site-price"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <CreditCard className="w-4 h-4" />
                            {t("dashboard.siteManagement.price")}
                          </Label>
                          <Input
                            id="site-price"
                            type="number"
                            min="1"
                            value={sitePrice}
                            onChange={(e) => {
                              setSitePrice(e.target.value);
                              if (sitePriceError) setSitePriceError("");
                            }}
                            placeholder={t(
                              "dashboard.siteManagement.placeholders.sitePrice"
                            )}
                            className={`transition-all ${
                              sitePriceError
                                ? "border-destructive focus-visible:ring-destructive/20"
                                : "focus-visible:ring-primary/20"
                            }`}
                          />
                          {sitePriceError && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <span className="w-1 h-1 bg-destructive rounded-full"></span>
                              <span>{sitePriceError}</span>
                            </p>
                          )}
                        </div>
                        {/* Icon URL (Required) */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="site-icon"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <Activity className="w-4 h-4" />
                            {t("dashboard.siteManagement.siteIcon")}
                          </Label>
                          <Input
                            id="site-icon"
                            value={siteIcon}
                            onChange={(e) => {
                              setSiteIcon(e.target.value);
                              if (siteIconError) setSiteIconError("");
                            }}
                            placeholder={t(
                              "dashboard.siteManagement.placeholders.siteIcon"
                            )}
                            className={`focus-visible:ring-primary/20 ${
                              siteIconError
                                ? "border-destructive focus-visible:ring-destructive/20"
                                : ""
                            }`}
                          />
                          {siteIconError && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <span className="w-1 h-1 bg-destructive rounded-full"></span>
                              <span>{siteIconError}</span>
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "dashboard.siteManagement.placeholders.siteIconHelp"
                            )}
                          </p>
                        </div>
                        {/* External Website */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="site-external"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <Cookie className="w-4 h-4" />
                            {t("dashboard.siteManagement.external")}
                          </Label>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="external-no"
                                name="external"
                                checked={!siteExternal}
                                onChange={() => setSiteExternal(false)}
                                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary focus:ring-2"
                              />
                              <Label
                                htmlFor="external-no"
                                className="text-sm text-foreground cursor-pointer"
                              >
                                {t(
                                  "dashboard.siteManagement.placeholders.externalNo"
                                )}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="external-yes"
                                name="external"
                                checked={siteExternal}
                                onChange={() => setSiteExternal(true)}
                                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary focus:ring-2"
                              />
                              <Label
                                htmlFor="external-yes"
                                className="text-sm text-foreground cursor-pointer"
                              >
                                {t(
                                  "dashboard.siteManagement.placeholders.externalYes"
                                )}
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddSiteDialogOpen(false)}
                          disabled={isAddingSite}
                        >
                          {t("common.cancel")}
                        </Button>
                        <Button
                          type="button"
                          onClick={handleAddSite}
                          disabled={isAddingSite}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {isAddingSite ? (
                            <div className="flex items-center space-x-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>
                                {t("dashboard.siteManagement.adding")}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Plus className="w-4 h-4" />
                              <span>{t("dashboard.siteManagement.add")}</span>
                            </div>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Edit Site Dialog */}
                  <Dialog
                    open={isEditSiteDialogOpen}
                    onOpenChange={setIsEditSiteDialogOpen}
                  >
                    <DialogContent
                      className={`sm:max-w-[425px] ${isRTL ? "[&>[data-slot=dialog-close]]:left-4 [&>[data-slot=dialog-close]]:right-auto" : ""}`}
                    >
                      <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-foreground">
                          {t("dashboard.siteManagement.editSite")}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                          {t("dashboard.siteManagement.description")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {/* Site Name */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-site-name"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <Globe className="w-4 h-4" />
                            {t("dashboard.siteManagement.siteName")}
                          </Label>
                          <Input
                            id="edit-site-name"
                            value={editSiteName}
                            disabled={true}
                            className="bg-muted/50 cursor-not-allowed transition-all"
                            placeholder={t(
                              "dashboard.siteManagement.placeholders.siteName"
                            )}
                          />
                          {editSiteNameError && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <span className="w-1 h-1 bg-destructive rounded-full"></span>
                              <span>{editSiteNameError}</span>
                            </p>
                          )}
                        </div>
                        {/* Site URL */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-site-url"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {t("dashboard.siteManagement.siteUrl")}
                          </Label>
                          <Input
                            id="edit-site-url"
                            value={editSiteUrl}
                            disabled={true}
                            className="bg-muted/50 cursor-not-allowed transition-all"
                            placeholder={t(
                              "dashboard.siteManagement.placeholders.siteUrl"
                            )}
                          />
                          {editSiteUrlError && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <span className="w-1 h-1 bg-destructive rounded-full"></span>
                              <span>{editSiteUrlError}</span>
                            </p>
                          )}
                        </div>
                        {/* Site Price */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-site-price"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <DollarSign className="w-4 h-4" />
                            {t("dashboard.siteManagement.price")}
                          </Label>
                          <Input
                            id="edit-site-price"
                            type="number"
                            value={editSitePrice}
                            onChange={(e) => {
                              setEditSitePrice(e.target.value);
                              if (editSitePriceError) setEditSitePriceError("");
                            }}
                            placeholder={t(
                              "dashboard.siteManagement.placeholders.sitePrice"
                            )}
                            className={`transition-all ${
                              editSitePriceError
                                ? "border-destructive focus-visible:ring-destructive/20"
                                : "focus-visible:ring-primary/20"
                            }`}
                          />
                          {editSitePriceError && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <span className="w-1 h-1 bg-destructive rounded-full"></span>
                              <span>{editSitePriceError}</span>
                            </p>
                          )}
                        </div>
                        {/* Site Icon */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-site-icon"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <LinkIcon className="w-4 h-4" />
                            {t("dashboard.siteManagement.siteIcon")}
                          </Label>
                          <Input
                            id="edit-site-icon"
                            type="url"
                            value={editSiteIcon}
                            onChange={(e) => {
                              setEditSiteIcon(e.target.value);
                              if (editSiteIconError) setEditSiteIconError("");
                            }}
                            placeholder={t(
                              "dashboard.siteManagement.placeholders.siteIcon"
                            )}
                            className={`transition-all ${
                              editSiteIconError
                                ? "border-destructive focus-visible:ring-destructive/20"
                                : "focus-visible:ring-primary/20"
                            }`}
                          />
                          {editSiteIconError && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <span className="w-1 h-1 bg-destructive rounded-full"></span>
                              <span>{editSiteIconError}</span>
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground flex items-center space-x-1">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                            <span>
                              {t(
                                "dashboard.siteManagement.placeholders.siteIconHelp"
                              )}
                            </span>
                          </p>
                        </div>
                        {/* External Website */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-external"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <Settings className="w-4 h-4" />
                            {t("dashboard.siteManagement.external")}
                          </Label>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="edit-external-yes"
                                name="edit-external"
                                checked={editSiteExternal}
                                onChange={() => setEditSiteExternal(true)}
                                className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-2"
                              />
                              <Label
                                htmlFor="edit-external-yes"
                                className="text-sm text-foreground cursor-pointer"
                              >
                                {t(
                                  "dashboard.siteManagement.placeholders.externalYes"
                                )}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="edit-external-no"
                                name="edit-external"
                                checked={!editSiteExternal}
                                onChange={() => setEditSiteExternal(false)}
                                className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-2"
                              />
                              <Label
                                htmlFor="edit-external-no"
                                className="text-sm text-foreground cursor-pointer"
                              >
                                {t(
                                  "dashboard.siteManagement.placeholders.externalNo"
                                )}
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditSiteDialogOpen(false)}
                          disabled={isEditingSite}
                        >
                          {t("common.cancel")}
                        </Button>
                        <Button
                          type="button"
                          onClick={handleEditSite}
                          disabled={isEditingSite}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {isEditingSite ? (
                            <div className="flex items-center space-x-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>
                                {t("dashboard.siteManagement.editing")}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Edit className="w-4 h-4" />
                              <span>{t("dashboard.siteManagement.edit")}</span>
                            </div>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoadingSites ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                  ) : sitesError ? (
                    <div className="text-center py-12 text-destructive">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-6 h-6 text-destructive" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{sitesError}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={loadSites}
                            className="mt-2 text-black dark:text-white"
                          >
                            {t("dashboard.siteManagement.table.retry")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : sites.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          <Globe className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {t("dashboard.siteManagement.table.noSites")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "dashboard.siteManagement.table.noSitesDescription"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden md:block overflow-x-auto max-h-[240px] overflow-y-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th
                                className={`${isRTL ? "text-right" : "text-left"} py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider`}
                              >
                                {t(
                                  "dashboard.siteManagement.table.headers.site"
                                )}
                              </th>
                              <th
                                className={`${isRTL ? "text-right" : "text-left"} py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider`}
                              >
                                {t(
                                  "dashboard.siteManagement.table.headers.url"
                                )}
                              </th>
                              <th
                                className={`${isRTL ? "text-right" : "text-left"} py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider`}
                              >
                                {t(
                                  "dashboard.siteManagement.table.headers.price"
                                )}
                              </th>
                              <th
                                className={`${isRTL ? "text-right" : "text-left"} py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider`}
                              >
                                {t(
                                  "dashboard.siteManagement.table.headers.cookieSupport"
                                )}
                              </th>
                              <th
                                className={`${isRTL ? "text-right" : "text-left"} py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider`}
                              >
                                {t(
                                  "dashboard.siteManagement.table.headers.status"
                                )}
                              </th>
                              <th
                                className={`${isRTL ? "text-left" : "text-right"} py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider`}
                              >
                                {t(
                                  "dashboard.siteManagement.table.headers.actions"
                                )}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {sites.map((site) => (
                              <tr
                                key={site.id}
                                className="hover:bg-muted/50 transition-colors group"
                              >
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                                      {site.icon ? (
                                        <img
                                          src={site.icon}
                                          alt={`${site.name} icon`}
                                          width={32}
                                          height={32}
                                          className="w-8 h-8 object-contain"
                                          onError={(e) => {
                                            e.currentTarget.style.display =
                                              "none";
                                            const nextElement = e.currentTarget
                                              .nextElementSibling as HTMLElement;
                                            if (nextElement) {
                                              nextElement.style.display =
                                                "flex";
                                            }
                                          }}
                                        />
                                      ) : null}
                                      <Globe
                                        className="w-4 h-4 text-primary"
                                        style={{
                                          display: site.icon ? "none" : "flex",
                                        }}
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-sm font-medium text-foreground truncate">
                                        {site.name}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <a
                                    href={site.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center space-x-1 max-w-[200px] truncate"
                                  >
                                    <span className="truncate">{site.url}</span>
                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                  </a>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="text-sm font-medium text-foreground">
                                    {site.price}{" "}
                                    {t(
                                      "dashboard.siteManagement.table.credits"
                                    )}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div
                                    className={`inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                                      !site.external
                                        ? "bg-green-100 text-green-800 border border-green-200"
                                        : "bg-orange-100 text-orange-800 border border-orange-200"
                                    }`}
                                  >
                                    {!site.external ? (
                                      <CheckCircle className="w-3 h-3" />
                                    ) : (
                                      <XCircle className="w-3 h-3" />
                                    )}
                                    <span>
                                      {t(
                                        !site.external
                                          ? "dashboard.siteManagement.table.cookieSupported"
                                          : "dashboard.siteManagement.table.cookieNotSupported"
                                      )}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>
                                      {t(
                                        "dashboard.siteManagement.table.active"
                                      )}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div
                                    className={`flex items-center gap-2 ${isRTL ? "justify-end space-x-reverse" : "justify-end"} space-x-2`}
                                  >
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 px-3"
                                      onClick={() => openEditSiteDialog(site)}
                                    >
                                      <Edit className="w-4 h-4" />
                                      {t("dashboard.siteManagement.table.edit")}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="h-8 px-3"
                                      onClick={() => handleDeleteSite(site.url)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      {t(
                                        "dashboard.siteManagement.table.delete"
                                      )}
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* Mobile Card View */}
                      <div className="md:hidden space-y-3">
                        {sites.map((site) => (
                          <div
                            key={site.id}
                            className="bg-card border border-border rounded-xl p-4 space-y-4 hover:bg-muted/20 transition-colors"
                          >
                            {/* Header with Icon and Status */}
                            <div className="flex flex-col">
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                                  {site.icon ? (
                                    <img
                                      src={site.icon}
                                      alt={`${site.name} icon`}
                                      width={20}
                                      height={20}
                                      className="w-5 h-5 object-contain"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                        const nextElement = e.currentTarget
                                          .nextElementSibling as HTMLElement;
                                        if (nextElement) {
                                          nextElement.style.display = "flex";
                                        }
                                      }}
                                    />
                                  ) : null}
                                  <Globe
                                    className="w-5 h-5 text-primary"
                                    style={{
                                      display: site.icon ? "none" : "flex",
                                    }}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-base font-semibold text-foreground truncate">
                                    {site.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Added {site.addedDate}
                                  </div>
                                </div>
                              </div>
                              <div className="inline-flex items-center justify-center mt-4 space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200 flex-shrink-0">
                                <CheckCircle className="w-3 h-3" />
                                <span>{site.status}</span>
                              </div>
                            </div>
                            {/* Site Details */}
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  {t(
                                    "dashboard.siteManagement.table.headers.url"
                                  )}
                                </div>
                                <a
                                  href={site.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`text-sm text-primary hover:text-primary/80 transition-colors flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"} p-2 bg-primary/5 rounded-lg border border-primary/10`}
                                >
                                  <Globe className="w-4 h-4 flex-shrink-0" />
                                  <span className="truncate flex-1 font-medium">
                                    {site.url.replace(/^https?:\/\//, "")}
                                  </span>
                                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                </a>
                              </div>
                              <div className="space-y-1">
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  {t(
                                    "dashboard.siteManagement.table.accessPrice"
                                  )}
                                </div>
                                <div
                                  className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"} p-2 bg-secondary/50 rounded-lg`}
                                >
                                  <Coins className="w-4 h-4 text-primary" />
                                  <span className="text-sm font-semibold text-foreground">
                                    {site.price}{" "}
                                    {t(
                                      "dashboard.siteManagement.table.credits"
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  {t(
                                    "dashboard.siteManagement.table.headers.cookieSupport"
                                  )}
                                </div>
                                <div
                                  className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"} p-2 rounded-lg ${
                                    !site.external
                                      ? "bg-green-50 border border-green-200"
                                      : "bg-orange-50 border border-orange-200"
                                  }`}
                                >
                                  {!site.external ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-orange-600" />
                                  )}
                                  <span
                                    className={`text-sm font-semibold ${
                                      !site.external
                                        ? "text-green-700"
                                        : "text-orange-700"
                                    }`}
                                  >
                                    {t(
                                      !site.external
                                        ? "dashboard.siteManagement.table.cookieSupported"
                                        : "dashboard.siteManagement.table.cookieNotSupported"
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  {t(
                                    "dashboard.siteManagement.table.headers.cookieSupport"
                                  )}
                                </div>
                                <div
                                  className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"} p-2 rounded-lg ${
                                    !site.external
                                      ? "bg-green-50 border border-green-200"
                                      : "bg-orange-50 border border-orange-200"
                                  }`}
                                >
                                  {!site.external ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-orange-600" />
                                  )}
                                  <span
                                    className={`text-sm font-semibold ${
                                      !site.external
                                        ? "text-green-700"
                                        : "text-orange-700"
                                    }`}
                                  >
                                    {t(
                                      !site.external
                                        ? "dashboard.siteManagement.table.cookieSupported"
                                        : "dashboard.siteManagement.table.cookieNotSupported"
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {/* Action Buttons */}
                            <div className="w-full pt-4 border-t border-border">
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-10 flex-1 text-sm font-medium"
                                  onClick={() => openEditSiteDialog(site)}
                                >
                                  <Edit className="w-4 h-4" />
                                  {t("dashboard.siteManagement.table.edit")}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="h-10 flex-1 text-sm font-medium"
                                  onClick={() => handleDeleteSite(site.url)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  {t("dashboard.siteManagement.table.delete")}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
            {/* Pricing Management */}
            {isLoadingPricingPlans ? (
              <DashboardPackageManagementSkeleton isRTL={isRTL} />
            ) : (
              <Card id="pricing-management" className="dark:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {t("dashboard.packageManagement.title")}
                  </CardTitle>
                  <Dialog
                    open={isAddPackageDialogOpen}
                    onOpenChange={setIsAddPackageDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Package className="w-4 h-4 stroke-3" />
                        {t("dashboard.packageManagement.addPackage")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className={`sm:max-w-[475px] max-h-[85vh] overflow-y-auto ${isRTL ? "[&>[data-slot=dialog-close]]:left-4 [&>[data-slot=dialog-close]]:right-auto" : ""}`}
                    >
                      <DialogHeader className={`${isRTL && "sm:text-right"}`}>
                        <DialogTitle className="text-lg font-semibold text-foreground">
                          {t("dashboard.packageManagement.addPackage")}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                          {t("dashboard.packageManagement.description")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        {/* Package Name */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="package-name"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <Package className="w-4 h-4" />
                            {t("dashboard.packageManagement.packageName")}
                          </Label>
                          <Input
                            id="package-name"
                            value={packageName}
                            onChange={(e) => {
                              setPackageName(e.target.value);
                              if (packageNameError) setPackageNameError("");
                            }}
                            placeholder={t(
                              "dashboard.packageManagement.placeholders.packageName"
                            )}
                            className={`transition-all ${
                              packageNameError
                                ? "border-destructive focus-visible:ring-destructive/20"
                                : "focus-visible:ring-primary/20"
                            }`}
                          />
                          {packageNameError && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <span className="w-1 h-1 bg-destructive rounded-full"></span>
                              <span>{packageNameError}</span>
                            </p>
                          )}
                        </div>
                        {/* Price */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="package-price"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <DollarSign className="w-4 h-4" />
                            {t("dashboard.packageManagement.packagePrice")}
                          </Label>
                          <Input
                            id="package-price"
                            value={packagePrice}
                            onChange={(e) => setPackagePrice(e.target.value)}
                            placeholder={t(
                              "dashboard.packageManagement.placeholders.packagePrice"
                            )}
                            className="transition-all focus-visible:ring-primary/20"
                          />
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "dashboard.packageManagement.placeholders.packagePriceHelp"
                            )}
                          </p>
                        </div>
                        {/* Description */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="package-description"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <FileText className="w-4 h-4" />
                            {t(
                              "dashboard.packageManagement.packageDescription"
                            )}
                          </Label>
                          <Input
                            id="package-description"
                            value={packageDescription}
                            onChange={(e) => {
                              setPackageDescription(e.target.value);
                              if (packageDescriptionError)
                                setPackageDescriptionError("");
                            }}
                            placeholder={t(
                              "dashboard.packageManagement.placeholders.packageDescription"
                            )}
                            className={`transition-all ${
                              packageDescriptionError
                                ? "border-destructive focus-visible:ring-destructive/20"
                                : "focus-visible:ring-primary/20"
                            }`}
                          />
                          {packageDescriptionError && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <span className="w-1 h-1 bg-destructive rounded-full"></span>
                              <span>{packageDescriptionError}</span>
                            </p>
                          )}
                        </div>
                        {/* Days Validity and Credits - Two columns */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="package-days"
                              className="text-sm font-medium text-foreground flex items-center"
                            >
                              <Timer className="w-4 h-4" />
                              Days Validity
                            </Label>
                            <Input
                              id="package-days"
                              type="number"
                              min="1"
                              value={packageDaysValidity}
                              onChange={(e) => {
                                setPackageDaysValidity(e.target.value);
                                if (packageDaysValidityError)
                                  setPackageDaysValidityError("");
                              }}
                              placeholder={t(
                                "dashboard.packageManagement.placeholders.daysValidity"
                              )}
                              className={`transition-all ${
                                packageDaysValidityError
                                  ? "border-destructive focus-visible:ring-destructive/20"
                                  : "focus-visible:ring-primary/20"
                              }`}
                            />
                            {packageDaysValidityError && (
                              <p className="text-sm text-destructive flex items-center space-x-1">
                                <span className="w-1 h-1 bg-destructive rounded-full"></span>
                                <span>{packageDaysValidityError}</span>
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="package-credits"
                              className="text-sm font-medium text-foreground flex items-center"
                            >
                              <Coins className="w-4 h-4" />
                              Credits
                            </Label>
                            <Input
                              id="package-credits"
                              type="number"
                              min="1"
                              value={packageCredits}
                              onChange={(e) => {
                                setPackageCredits(e.target.value);
                                if (packageCreditsError)
                                  setPackageCreditsError("");
                              }}
                              placeholder={t(
                                "dashboard.packageManagement.placeholders.credits"
                              )}
                              className={`transition-all ${
                                packageCreditsError
                                  ? "border-destructive focus-visible:ring-destructive/20"
                                  : "focus-visible:ring-primary/20"
                              }`}
                            />
                            {packageCreditsError && (
                              <p className="text-sm text-destructive flex items-center space-x-1">
                                <span className="w-1 h-1 bg-destructive rounded-full"></span>
                                <span>{packageCreditsError}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        {/* Contact Us URL */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="package-contact-url"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <LinkIcon className="w-4 h-4" />
                            {t("dashboard.packageManagement.contactUrl")}
                          </Label>
                          <Input
                            id="package-contact-url"
                            type="url"
                            value={packageContactUrl}
                            onChange={(e) => {
                              setPackageContactUrl(e.target.value);
                              if (packageContactUrlError)
                                setPackageContactUrlError("");
                            }}
                            placeholder={t(
                              "dashboard.packageManagement.placeholders.contactUrl"
                            )}
                            className={`transition-all ${
                              packageContactUrlError
                                ? "border-destructive focus-visible:ring-destructive/20"
                                : "focus-visible:ring-primary/20"
                            }`}
                          />
                          {packageContactUrlError && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <span className="w-1 h-1 bg-destructive rounded-full"></span>
                              <span>{packageContactUrlError}</span>
                            </p>
                          )}
                        </div>
                        {/* Supported Sites */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="package-sites"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <Globe className="w-4 h-4" />
                            {t("dashboard.packageManagement.supportedSites")}
                          </Label>
                          <Input
                            id="package-sites"
                            value={packageSupportedSites}
                            onChange={(e) => {
                              setPackageSupportedSites(e.target.value);
                              if (packageSupportedSitesError) {
                                setPackageSupportedSitesError("");
                              }
                            }}
                            placeholder={t(
                              "dashboard.packageManagement.placeholders.supportedSites"
                            )}
                            className="transition-all focus-visible:ring-primary/20"
                          />
                          {packageSupportedSitesError && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <span className="w-1 h-1 bg-destructive rounded-full"></span>
                              <span>{packageSupportedSitesError}</span>
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "dashboard.packageManagement.placeholders.supportedSitesHelp"
                            )}
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddPackageDialogOpen(false)}
                          disabled={isAddingPackage}
                        >
                          {t("dashboard.packageManagement.buttons.cancel")}
                        </Button>
                        <Button
                          type="button"
                          onClick={handleAddPackage}
                          disabled={isAddingPackage}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {isAddingPackage ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              {t("dashboard.packageManagement.buttons.adding")}
                            </>
                          ) : (
                            <>
                              <Package className="w-4 h-4" />
                              {t(
                                "dashboard.packageManagement.buttons.addPackage"
                              )}
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {/* Edit Package Dialog */}
                  <Dialog
                    open={isEditPackageDialogOpen}
                    onOpenChange={setIsEditPackageDialogOpen}
                  >
                    <DialogContent
                      className={`sm:max-w-[500px] max-h-[85vh] overflow-y-auto ${isRTL ? "[&>[data-slot=dialog-close]]:left-4 [&>[data-slot=dialog-close]]:right-auto" : ""}`}
                    >
                      <DialogHeader className={`${isRTL && "sm:text-right"}`}>
                        <DialogTitle className="text-lg font-semibold text-foreground">
                          {t("dashboard.packageManagement.editPackage")}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                          {t("dashboard.packageManagement.editDescription")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        {/* Package Name */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-package-name"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <Package className="w-4 h-4" />
                            {t("dashboard.packageManagement.packageName")}
                          </Label>
                          <Input
                            id="edit-package-name"
                            value={editPackageName}
                            readOnly
                            placeholder="Enter package name"
                            className={`transition-all cursor-not-allowed opacity-60 bg-muted/50 ${
                              editPackageNameError
                                ? "border-destructive focus-visible:ring-destructive/20"
                                : "focus-visible:ring-primary/20"
                            }`}
                          />
                          {editPackageNameError && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <span className="w-1 h-1 bg-destructive rounded-full"></span>
                              <span>{editPackageNameError}</span>
                            </p>
                          )}
                        </div>
                        {/* Price */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-package-price"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <DollarSign className="w-4 h-4" />
                            {t("dashboard.packageManagement.packagePrice")}
                          </Label>
                          <Input
                            id="edit-package-price"
                            value={editPackagePrice}
                            onChange={(e) =>
                              setEditPackagePrice(e.target.value)
                            }
                            placeholder={t(
                              "dashboard.packageManagement.placeholders.packagePrice"
                            )}
                            className="transition-all focus-visible:ring-primary/20"
                          />
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "dashboard.packageManagement.placeholders.packagePriceHelp"
                            )}
                          </p>
                        </div>
                        {/* Description */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-package-description"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <FileText className="w-4 h-4" />
                            {t(
                              "dashboard.packageManagement.packageDescription"
                            )}
                          </Label>
                          <Input
                            id="edit-package-description"
                            value={editPackageDescription}
                            onChange={(e) => {
                              setEditPackageDescription(e.target.value);
                              if (editPackageDescriptionError)
                                setEditPackageDescriptionError("");
                            }}
                            placeholder={t(
                              "dashboard.packageManagement.placeholders.packageDescription"
                            )}
                            className={`transition-all ${
                              editPackageDescriptionError
                                ? "border-destructive focus-visible:ring-destructive/20"
                                : "focus-visible:ring-primary/20"
                            }`}
                          />
                          {editPackageDescriptionError && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <span className="w-1 h-1 bg-destructive rounded-full"></span>
                              <span>{editPackageDescriptionError}</span>
                            </p>
                          )}
                        </div>
                        {/* Days Validity and Credits - Two columns */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="edit-package-days"
                              className="text-sm font-medium text-foreground flex items-center"
                            >
                              <Timer className="w-4 h-4" />
                              Days Validity
                            </Label>
                            <Input
                              id="edit-package-days"
                              type="number"
                              min="1"
                              value={editPackageDaysValidity}
                              onChange={(e) => {
                                setEditPackageDaysValidity(e.target.value);
                                if (editPackageDaysValidityError)
                                  setEditPackageDaysValidityError("");
                              }}
                              placeholder="30"
                              className={`transition-all ${
                                editPackageDaysValidityError
                                  ? "border-destructive focus-visible:ring-destructive/20"
                                  : "focus-visible:ring-primary/20"
                              }`}
                            />
                            {editPackageDaysValidityError && (
                              <p className="text-sm text-destructive flex items-center space-x-1">
                                <span className="w-1 h-1 bg-destructive rounded-full"></span>
                                <span>{editPackageDaysValidityError}</span>
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="edit-package-credits"
                              className="text-sm font-medium text-foreground flex items-center"
                            >
                              <Coins className="w-4 h-4" />
                              Credits
                            </Label>
                            <Input
                              id="edit-package-credits"
                              type="number"
                              min="1"
                              value={editPackageCredits}
                              onChange={(e) => {
                                setEditPackageCredits(e.target.value);
                                if (editPackageCreditsError)
                                  setEditPackageCreditsError("");
                              }}
                              placeholder="100"
                              className={`transition-all ${
                                editPackageCreditsError
                                  ? "border-destructive focus-visible:ring-destructive/20"
                                  : "focus-visible:ring-primary/20"
                              }`}
                            />
                            {editPackageCreditsError && (
                              <p className="text-sm text-destructive flex items-center space-x-1">
                                <span className="w-1 h-1 bg-destructive rounded-full"></span>
                                <span>{editPackageCreditsError}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        {/* Contact Us URL */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-package-contact-url"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <LinkIcon className="w-4 h-4" />
                            {t("dashboard.packageManagement.contactUrl")}
                          </Label>
                          <Input
                            id="edit-package-contact-url"
                            type="url"
                            value={editPackageContactUrl}
                            onChange={(e) => {
                              setEditPackageContactUrl(e.target.value);
                              if (editPackageContactUrlError)
                                setEditPackageContactUrlError("");
                            }}
                            placeholder="https://example.com/contact"
                            className={`transition-all ${
                              editPackageContactUrlError
                                ? "border-destructive focus-visible:ring-destructive/20"
                                : "focus-visible:ring-primary/20"
                            }`}
                          />
                          {editPackageContactUrlError && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <span className="w-1 h-1 bg-destructive rounded-full"></span>
                              <span>{editPackageContactUrlError}</span>
                            </p>
                          )}
                        </div>
                        {/* Supported Sites */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-package-sites"
                            className="text-sm font-medium text-foreground flex items-center"
                          >
                            <Globe className="w-4 h-4" />
                            {t("dashboard.packageManagement.supportedSites")}
                          </Label>
                          <Input
                            id="edit-package-sites"
                            value={editPackageSupportedSites}
                            onChange={(e) => {
                              setEditPackageSupportedSites(e.target.value);
                              if (editPackageSupportedSitesError) {
                                setEditPackageSupportedSitesError("");
                              }
                            }}
                            placeholder={t(
                              "dashboard.packageManagement.placeholders.supportedSites"
                            )}
                            className="transition-all focus-visible:ring-primary/20"
                          />
                          {editPackageSupportedSitesError && (
                            <p className="text-sm text-destructive flex items-center space-x-1">
                              <span className="w-1 h-1 bg-destructive rounded-full"></span>
                              <span>{editPackageSupportedSitesError}</span>
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "dashboard.packageManagement.placeholders.supportedSitesHelp"
                            )}
                          </p>
                        </div>
                      </div>
                      <DialogFooter className="flex justify-between items-center">
                        <div className="flex-1">
                          <AlertDialog
                            open={isDeleteDialogOpen}
                            onOpenChange={setIsDeleteDialogOpen}
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                disabled={isEditingPackage}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {t(
                                    "dashboard.packageManagement.confirmDelete"
                                  )}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t(
                                    "dashboard.packageManagement.deleteDescription"
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeletingPackage}>
                                  {t(
                                    "dashboard.packageManagement.buttons.cancel"
                                  )}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeletePackage}
                                  disabled={isDeletingPackage}
                                  className="bg-destructive hover:bg-destructive/70 text-white"
                                >
                                  {isDeletingPackage ? (
                                    <>
                                      <Loader2 className="w-5 h-5 animate-spin" />
                                      {t(
                                        "dashboard.packageManagement.deleting"
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="w-4 h-4" />
                                      {t("dashboard.packageManagement.delete")}
                                    </>
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditPackageDialogOpen(false)}
                            disabled={isEditingPackage}
                          >
                            {t("dashboard.packageManagement.buttons.cancel")}
                          </Button>
                          <Button
                            type="button"
                            onClick={handleUpdatePackage}
                            disabled={isEditingPackage}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            {isEditingPackage ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {t(
                                  "dashboard.packageManagement.buttons.updating"
                                )}
                              </>
                            ) : (
                              <>
                                <Settings className="w-4 h-4" />
                                {t(
                                  "dashboard.packageManagement.buttons.updatePackage"
                                )}
                              </>
                            )}
                          </Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoadingPricingPlans ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {[...Array(3)].map((_, index) => (
                        <Card
                          key={`pricing-skeleton-${index}`}
                          className="relative overflow-hidden border-border/50 p-0"
                        >
                          <CardContent className="p-0 dark:bg-secondary">
                            <div className="bg-secondary/50 dark:bg-secondary p-4 sm:p-6 border-b border-border/50">
                              <div className="space-y-2">
                                <div className="h-6 bg-muted animate-pulse rounded"></div>
                                <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                              </div>
                            </div>
                            <div className="p-4 sm:p-6 space-y-4">
                              <div className="h-4 bg-muted animate-pulse rounded"></div>
                              <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
                              <div className="h-8 bg-muted animate-pulse rounded"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : pricingPlansError ? (
                    <div className="text-center py-8">
                      <div className="flex justify-center">
                        <div className=" w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-6 h-6 text-destructive" />
                        </div>
                      </div>
                      <p className="text-destructive my-2">
                        {pricingPlansError}
                      </p>
                      <Button
                        onClick={loadPricingPlans}
                        variant="outline"
                        size="sm"
                      >
                        {t("dashboard.buttons.retry")}
                      </Button>
                    </div>
                  ) : pricingPlans.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        {t("dashboard.packageManagement.noPricingPlans")}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {pricingPlans.map((plan) => (
                        <Card
                          key={plan.id}
                          className="relative overflow-hidden border-border/50 p-0"
                        >
                          <CardContent className="p-0 dark:bg-secondary">
                            {/* Header Section */}
                            <div className="bg-secondary/50 dark:bg-secondary p-4 sm:p-6 border-b border-border/50">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2 flex-1 min-w-0">
                                  <h3 className="text-lg sm:text-xl font-bold text-foreground truncate">
                                    {plan.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {plan.description}
                                  </p>
                                </div>
                                <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                                  <Package className="w-5 h-5 text-primary" />
                                </div>
                              </div>
                            </div>
                            {/* Details Section */}
                            <div className="p-4 sm:p-6 space-y-4">
                              {/* Credits and Validity */}
                              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-1">
                                  <div
                                    className={`flex items-center ${isRTL ? "space-x-reverse !space-x-2" : "space-x-2"} text-xs sm:text-sm text-muted-foreground`}
                                  >
                                    <Coins className="w-4 h-4" />
                                    <span>
                                      {t(
                                        "dashboard.packageManagement.planDetails.credits"
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-base sm:text-lg font-semibold text-foreground">
                                    {plan.credits.toLocaleString()}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <div
                                    className={`flex items-center ${isRTL ? "space-x-reverse !space-x-2" : "space-x-2"} text-xs sm:text-sm text-muted-foreground`}
                                  >
                                    <Timer className="w-4 h-4" />
                                    <span>
                                      {t(
                                        "dashboard.packageManagement.planDetails.validity"
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-base sm:text-lg font-semibold text-foreground">
                                    {plan.daysValidity}{" "}
                                    {t(
                                      "dashboard.packageManagement.planDetails.days"
                                    )}
                                  </p>
                                </div>
                              </div>
                              {/* Supported Sites */}
                              {plan.supportedSites &&
                                plan.supportedSites.length > 0 && (
                                  <div className="space-y-3">
                                    <div
                                      className={`flex items-center ${isRTL ? "space-x-reverse !space-x-2" : "space-x-2"} text-sm text-muted-foreground`}
                                    >
                                      <Globe className="w-4 h-4" />
                                      <span>
                                        {t(
                                          "dashboard.packageManagement.planDetails.supportedSites"
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {(plan.supportedSites || []).map(
                                        (site, index) => (
                                          <span
                                            key={`${plan.id}-site-${index}`}
                                            className={`inline-flex items-center ${isRTL ? "space-x-reverse !space-x-2" : "space-x-2"} px-3 py-2 rounded-lg bg-secondary/50 dark:bg-card/50 border border-secondary text-sm font-medium text-foreground`}
                                          >
                                            <div className="w-4 h-4 bg-primary/10 border border-primary/10 rounded flex items-center justify-center">
                                              <Globe className="w-3 h-3 text-primary" />
                                            </div>
                                            <span>{site}</span>
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              <div
                                className={`flex items-center ${isRTL ? "space-x-reverse !space-x-2" : "space-x-2"} text-sm text-muted-foreground`}
                              >
                                <Check className="w-4 h-4 stroke-3" />
                                <span>
                                  {t("pricing.labels.featuresIncluded")}
                                </span>
                              </div>
                              {/* Features */}
                              <div className="space-y-3">
                                <div className="space-y-3">
                                  {(plan.features || []).map(
                                    (feature, index) => (
                                      <div
                                        key={`${plan.id}-feature-${index}`}
                                        className={`flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"} px-3 py-2 rounded-lg bg-green-50 dark:bg-green-50/10 border border-green-100 dark:border-green-100/10`}
                                      >
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                          <Check className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-foreground font-medium text-sm">
                                          {t(feature)}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* Footer Section */}
                            <div className="p-4 sm:p-6 !pt-0 space-y-3">
                              <Button
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                onClick={() => handleEditPackage(plan)}
                              >
                                <Settings className="w-4 h-4" />
                                {t("dashboard.packageManagement.edit")}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </main>
        </div>

        {/* Enhanced Credit History Dialog */}
        <Dialog
          open={isCreditHistoryDialogOpen}
          onOpenChange={setIsCreditHistoryDialogOpen}
        >
          <DialogContent
            className={`max-w-4xl max-h-[80vh] ${isRTL ? "font-tajawal" : "font-sans"}`}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span>{t("dashboard.creditHistory.title")}</span>
              </DialogTitle>
              <DialogDescription>
                {t("dashboard.creditHistory.description")} -{" "}
                {filteredCreditHistory.length}{" "}
                {t("dashboard.creditHistory.total")}
              </DialogDescription>
            </DialogHeader>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 py-4 border-b border-border">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t("dashboard.search.placeholder")}
                    value={historySearchTerm}
                    onChange={(e) => setHistorySearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select
                  value={historyTypeFilter}
                  onValueChange={setHistoryTypeFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="add">
                      {t("dashboard.creditHistory.transactions.types.add")}
                    </SelectItem>
                    <SelectItem value="use">
                      {t("dashboard.creditHistory.transactions.types.use")}
                    </SelectItem>
                    <SelectItem value="delete">
                      {t("dashboard.creditHistory.transactions.types.delete")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {(historySearchTerm || historyTypeFilter !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearHistoryFilters}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : historyError ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                  <p className="text-sm text-destructive mb-4">
                    {historyError}
                  </p>
                  <Button variant="outline" onClick={loadEnhancedCreditHistory}>
                    {t("dashboard.creditHistory.retry")}
                  </Button>
                </div>
              ) : filteredCreditHistory.length > 0 ? (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                  {filteredCreditHistory.map((entry, index) => {
                    const config = getTransactionTypeConfig(entry.type);
                    const IconComponent = config.icon;

                    return (
                      <div
                        key={`${entry.email}-${entry.timestamp}-${index}`}
                        className={`flex items-center justify-between p-4 bg-card border rounded-lg hover:bg-muted/50 transition-colors ${config.borderColor}`}
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          {/* Transaction Type Icon */}
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${config.bgColor}`}
                          >
                            <IconComponent
                              className={`w-6 h-6 ${config.iconColor}`}
                            />
                          </div>

                          {/* Transaction Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-base font-medium text-foreground truncate">
                                {entry.user_name}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {t(
                                  `dashboard.creditHistory.transactions.types.${entry.type}`
                                )}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">{entry.email}</span>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {formatTimestamp(
                                    entry.timestamp,
                                    isRTL ? "ar" : "en"
                                  )}
                                </span>
                              </div>

                              {entry.plan && (
                                <div className="flex items-center space-x-2 sm:col-span-2">
                                  <CreditCard className="w-4 h-4" />
                                  <span>{entry.plan}</span>
                                </div>
                              )}

                              {entry.reason && (
                                <div className="flex items-center space-x-2 sm:col-span-2">
                                  <Activity className="w-4 h-4" />
                                  <span className="capitalize">
                                    {t(
                                      `dashboard.creditHistory.reasons.${entry.reason}`,
                                      { defaultValue: entry.reason }
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Amount Display (only for add and use types) */}
                        {entry.type !== "delete" &&
                          entry.amount !== undefined && (
                            <div className="text-right ml-4">
                              <div
                                className={`text-lg font-semibold ${config.amountColor}`}
                              >
                                {config.amountPrefix}
                                {entry.amount}
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center text-center py-20">
                  <div>
                    <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-base text-muted-foreground mb-2">
                      {historySearchTerm || historyTypeFilter !== "all"
                        ? "No transactions match your filters"
                        : t("dashboard.creditHistory.noHistoryData")}
                    </p>
                    {(historySearchTerm || historyTypeFilter !== "all") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearHistoryFilters}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminRouteGuard>
  );
}
