/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  Search,
  Image as ImageIcon,
  Eye,
  PhoneCall,
  Menu,
  X,
  Cat,
  Check,
  Zap,
  Crown,
  Globe,
  Timer,
  Coins,
  ExternalLink,
  Shield,
  Download,
  Sparkles,
  Users,
  Star,
  Palette,
  Camera,
  File,
  AlertCircle,
  Loader2,
  Package,
  Heart,
  User,
  TrendingUp,
  Target,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import Footer from "@/components/footer";
import FAQSection from "@/components/faq-section";
import {
  HeaderSkeleton,
  HeroSkeleton,
  FeaturesSkeleton,
  CategoriesSkeleton,
  SupportedPlatformsSkeleton,
  FooterSkeleton,
  FAQSkeleton,
  TestimonialsSkeleton,
  StatisticsSkeleton,
} from "@/components/home-page-skeletons";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/i18n-provider";
import { HeaderControls } from "@/components/header-controls";
import { ImageSearchDialog } from "@/components/image-search-dialog";
import { publicApi, type PricingPlan, type Site } from "@/lib/api";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

// StatisticCard component for animated counters
interface StatisticCardProps {
  value: number;
  label: string;
  suffix: string;
  delay?: number;
  icon?: React.ReactNode;
}

function StatisticCard({
  value,
  label,
  suffix,
  delay = 0,
  icon,
}: StatisticCardProps) {
  const { count, elementRef } = useAnimatedCounter({
    end: value,
    duration: 3000 + delay,
    decimals: 0,
  });
  const { isRTL } = useLanguage();

  // Format the number with commas for better readability
  const formatNumber = (num: number) => {
    return Math.floor(num).toLocaleString();
  };

  return (
    <div
      ref={elementRef}
      className="group bg-card border border-border rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-lg relative overflow-hidden flex flex-col items-center justify-center min-h-[200px]"
    >
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl transform scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
        {/* Icon */}
        {icon && (
          <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-2xl flex items-center justify-center">
            {icon}
          </div>
        )}

        {/* Animated Number */}
        <div className="space-y-1">
          <div className="flex items-baseline justify-center">
            <span className="text-3xl sm:text-4xl font-bold text-primary">
              {formatNumber(count)}
            </span>
            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary ml-1">
              {suffix}
            </span>
          </div>
        </div>

        {/* Label */}
        <p
          className={`text-base lg:text-lg font-medium text-muted-foreground leading-relaxed ${isRTL && "font-medium"}`}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

// Platform data organized by categories for tabbed interface
const platformsByCategory = {
  imagesVectors: [
    {
      id: 1,
      name: "Freepik",
      url: "https://www.freepik.com",
      icon: "/freepik-small.png",
    },
    {
      id: 2,
      name: "Shutterstock",
      url: "https://www.shutterstock.com",
      icon: "/shutterstock-small.webp",
    },
    {
      id: 3,
      name: "Adobe Stock",
      url: "https://stock.adobe.com",
      icon: null,
      bgColor: "bg-red-600",
      initials: "Ae",
    },
    {
      id: 101,
      name: "Freepik",
      url: "https://www.freepik.com",
      icon: "/freepik-small.png",
    },
    {
      id: 200,
      name: "Shutterstock",
      url: "https://www.shutterstock.com",
      icon: "/shutterstock-small.webp",
    },
    {
      id: 300,
      name: "Adobe Stock",
      url: "https://stock.adobe.com",
      icon: null,
      bgColor: "bg-red-600",
      initials: "Ae",
    },
    {
      id: 4,
      name: "Getty Images",
      url: "https://www.gettyimages.com",
      icon: null,
      bgColor: "bg-violet-500",
      initials: "G",
    },
    {
      id: 5,
      name: "Unsplash",
      url: "https://unsplash.com",
      icon: null,
      bgColor: "bg-blue-500",
      initials: "U",
    },
    {
      id: 6,
      name: "Pexels",
      url: "https://www.pexels.com",
      icon: null,
      bgColor: "bg-green-600",
      initials: "P",
    },
    {
      id: 7,
      name: "Pixabay",
      url: "https://pixabay.com",
      icon: null,
      bgColor: "bg-blue-600",
      initials: "Px",
    },
    {
      id: 8,
      name: "Vecteezy",
      url: "https://www.vecteezy.com",
      icon: null,
      bgColor: "bg-indigo-600",
      initials: "V",
    },
    {
      id: 9,
      name: "Dreamstime",
      url: "https://www.dreamstime.com",
      icon: null,
      bgColor: "bg-teal-600",
      initials: "DT",
    },
    {
      id: 10,
      name: "123RF",
      url: "https://www.123rf.com",
      icon: null,
      bgColor: "bg-purple-600",
      initials: "123",
    },
    {
      id: 11,
      name: "Depositphotos",
      url: "https://depositphotos.com",
      icon: null,
      bgColor: "bg-orange-600",
      initials: "D",
    },
    {
      id: 12,
      name: "iStock",
      url: "https://www.istockphoto.com",
      icon: null,
      bgColor: "bg-emerald-600",
      initials: "iS",
    },
    {
      id: 13,
      name: "Envato Elements",
      url: "https://elements.envato.com",
      icon: null,
      bgColor: "bg-green-700",
      initials: "EE",
    },
    {
      id: 14,
      name: "Creative Market",
      url: "https://creativemarket.com",
      icon: null,
      bgColor: "bg-pink-600",
      initials: "CM",
    },
    {
      id: 15,
      name: "Canva",
      url: "https://www.canva.com",
      icon: null,
      bgColor: "bg-cyan-500",
      initials: "C",
    },
    {
      id: 16,
      name: "Figma Community",
      url: "https://www.figma.com/community",
      icon: null,
      bgColor: "bg-purple-500",
      initials: "F",
    },
    {
      id: 17,
      name: "Flaticon",
      url: "https://www.flaticon.com",
      icon: null,
      bgColor: "bg-blue-700",
      initials: "FI",
    },
    {
      id: 18,
      name: "Icons8",
      url: "https://icons8.com",
      icon: null,
      bgColor: "bg-yellow-600",
      initials: "I8",
    },
    {
      id: 19,
      name: "Noun Project",
      url: "https://thenounproject.com",
      icon: null,
      bgColor: "bg-gray-700",
      initials: "NP",
    },
    {
      id: 20,
      name: "Storyset",
      url: "https://storyset.com",
      icon: null,
      bgColor: "bg-rose-600",
      initials: "SS",
    },
  ],
  videos: [
    {
      id: 21,
      name: "Shutterstock",
      url: "https://www.shutterstock.com/video",
      icon: "/shutterstock-small.webp",
    },
    {
      id: 22,
      name: "Adobe Stock",
      url: "https://stock.adobe.com/video",
      icon: null,
      bgColor: "bg-red-600",
      initials: "Ae",
    },
    {
      id: 23,
      name: "Getty Images",
      url: "https://www.gettyimages.com/video",
      icon: null,
      bgColor: "bg-violet-500",
      initials: "G",
    },
    {
      id: 24,
      name: "Pond5",
      url: "https://www.pond5.com",
      icon: null,
      bgColor: "bg-emerald-600",
      initials: "P5",
    },
    {
      id: 25,
      name: "VideoHive",
      url: "https://videohive.net",
      icon: null,
      bgColor: "bg-orange-600",
      initials: "VH",
    },
    {
      id: 26,
      name: "Pexels Videos",
      url: "https://www.pexels.com/videos",
      icon: null,
      bgColor: "bg-green-600",
      initials: "P",
    },
    {
      id: 27,
      name: "Pixabay Videos",
      url: "https://pixabay.com/videos",
      icon: null,
      bgColor: "bg-blue-600",
      initials: "Px",
    },
    {
      id: 28,
      name: "Vimeo Stock",
      url: "https://vimeo.com/stock",
      icon: null,
      bgColor: "bg-blue-500",
      initials: "V",
    },
    {
      id: 29,
      name: "Motion Array",
      url: "https://motionarray.com",
      icon: null,
      bgColor: "bg-purple-600",
      initials: "MA",
    },
    {
      id: 30,
      name: "Storyblocks",
      url: "https://www.storyblocks.com",
      icon: null,
      bgColor: "bg-indigo-600",
      initials: "SB",
    },
    {
      id: 31,
      name: "Artgrid",
      url: "https://artgrid.io",
      icon: null,
      bgColor: "bg-gray-700",
      initials: "AG",
    },
    {
      id: 32,
      name: "Coverr",
      url: "https://coverr.co",
      icon: null,
      bgColor: "bg-teal-600",
      initials: "C",
    },
    {
      id: 33,
      name: "Mixkit",
      url: "https://mixkit.co",
      icon: null,
      bgColor: "bg-pink-600",
      initials: "MK",
    },
    {
      id: 34,
      name: "Videvo",
      url: "https://www.videvo.net",
      icon: null,
      bgColor: "bg-cyan-600",
      initials: "VD",
    },
    {
      id: 35,
      name: "Life of Vids",
      url: "https://www.lifeofvids.com",
      icon: null,
      bgColor: "bg-rose-600",
      initials: "LV",
    },
    {
      id: 36,
      name: "Mazwai",
      url: "https://mazwai.com",
      icon: null,
      bgColor: "bg-amber-600",
      initials: "M",
    },
    {
      id: 37,
      name: "Dissolve",
      url: "https://dissolve.com",
      icon: null,
      bgColor: "bg-lime-600",
      initials: "D",
    },
    {
      id: 38,
      name: "Clipstill",
      url: "https://www.clipstill.com",
      icon: null,
      bgColor: "bg-violet-600",
      initials: "CS",
    },
    {
      id: 39,
      name: "Envato Elements",
      url: "https://elements.envato.com/video",
      icon: null,
      bgColor: "bg-green-700",
      initials: "EE",
    },
    {
      id: 40,
      name: "Footage Firm",
      url: "https://footagefirm.com",
      icon: null,
      bgColor: "bg-slate-600",
      initials: "FF",
    },
  ],
  soundEffects: [
    {
      id: 41,
      name: "AudioJungle",
      url: "https://audiojungle.net",
      icon: null,
      bgColor: "bg-purple-600",
      initials: "AJ",
    },
    {
      id: 42,
      name: "Pond5",
      url: "https://www.pond5.com/sound-effects",
      icon: null,
      bgColor: "bg-emerald-600",
      initials: "P5",
    },
    {
      id: 43,
      name: "Adobe Stock",
      url: "https://stock.adobe.com/audio",
      icon: null,
      bgColor: "bg-red-600",
      initials: "Ae",
    },
    {
      id: 44,
      name: "Shutterstock",
      url: "https://www.shutterstock.com/music",
      icon: "/shutterstock-small.webp",
    },
    {
      id: 45,
      name: "Freesound",
      url: "https://freesound.org",
      icon: null,
      bgColor: "bg-blue-700",
      initials: "FS",
    },
    {
      id: 46,
      name: "Zapsplat",
      url: "https://www.zapsplat.com",
      icon: null,
      bgColor: "bg-yellow-600",
      initials: "ZS",
    },
    {
      id: 47,
      name: "Epidemic Sound",
      url: "https://www.epidemicsound.com",
      icon: null,
      bgColor: "bg-green-600",
      initials: "ES",
    },
    {
      id: 48,
      name: "Artlist",
      url: "https://artlist.io",
      icon: null,
      bgColor: "bg-black",
      initials: "AL",
    },
    {
      id: 49,
      name: "Musicbed",
      url: "https://www.musicbed.com",
      icon: null,
      bgColor: "bg-blue-600",
      initials: "MB",
    },
    {
      id: 50,
      name: "PremiumBeat",
      url: "https://www.premiumbeat.com",
      icon: null,
      bgColor: "bg-orange-600",
      initials: "PB",
    },
    {
      id: 51,
      name: "AudioBlocks",
      url: "https://www.audioblocks.com",
      icon: null,
      bgColor: "bg-indigo-600",
      initials: "AB",
    },
    {
      id: 52,
      name: "Soundstripe",
      url: "https://www.soundstripe.com",
      icon: null,
      bgColor: "bg-pink-600",
      initials: "SS",
    },
    {
      id: 53,
      name: "Bensound",
      url: "https://www.bensound.com",
      icon: null,
      bgColor: "bg-teal-600",
      initials: "BS",
    },
    {
      id: 54,
      name: "YouTube Audio Library",
      url: "https://www.youtube.com/audiolibrary",
      icon: null,
      bgColor: "bg-red-500",
      initials: "YT",
    },
    {
      id: 55,
      name: "BBC Sound Effects",
      url: "https://sound-effects.bbcrewind.co.uk",
      icon: null,
      bgColor: "bg-gray-700",
      initials: "BBC",
    },
    {
      id: 56,
      name: "Splice Sounds",
      url: "https://splice.com/sounds",
      icon: null,
      bgColor: "bg-cyan-600",
      initials: "SP",
    },
    {
      id: 57,
      name: "Loopmasters",
      url: "https://www.loopmasters.com",
      icon: null,
      bgColor: "bg-violet-600",
      initials: "LM",
    },
    {
      id: 58,
      name: "Native Instruments",
      url: "https://www.native-instruments.com",
      icon: null,
      bgColor: "bg-slate-700",
      initials: "NI",
    },
    {
      id: 59,
      name: "Envato Elements",
      url: "https://elements.envato.com/audio",
      icon: null,
      bgColor: "bg-green-700",
      initials: "EE",
    },
    {
      id: 60,
      name: "Motion Array",
      url: "https://motionarray.com/browse/music",
      icon: null,
      bgColor: "bg-purple-600",
      initials: "MA",
    },
  ],
};

// Platform interface
interface Platform {
  id: number;
  name: string;
  url?: string;
  icon: string | null;
  bgColor?: string;
  initials?: string;
}

// Helper function to render platform cards
const PlatformCard = ({ platform }: { platform: Platform }) => (
  <a
    href={platform.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative aspect-square bg-background dark:bg-muted/50 border border-border/50 rounded-lg transition-all duration-200 hover:border-primary/40 cursor-pointer overflow-hidden"
    title={platform.name}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    <div className="relative w-full h-full p-2 flex flex-col items-center justify-center">
      <div className="w-12 h-12 sm:w-24 sm:h-24 mb-1 sm:mb-2 relative">
        {platform.icon ? (
          <Image
            src={platform.icon}
            alt={platform.name}
            fill
            className="object-contain"
          />
        ) : (
          <div
            className={`w-full h-full ${platform.bgColor} rounded flex items-center justify-center`}
          >
            <span className="text-white font-bold text-sm sm:text-lg">
              {platform.initials}
            </span>
          </div>
        )}
      </div>
      <span className="text-xs sm:text-base font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
        {platform.name}
      </span>
    </div>
  </a>
);

export default function HomePage() {
  const { t } = useTranslation("common");
  const { isRTL, isLoading } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchType, setSearchType] = useState("all");
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Pricing plans state
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [isLoadingPricing, setIsLoadingPricing] = useState(true);
  const [pricingError, setPricingError] = useState<string | null>(null);

  // Sites state for supported sites mapping
  const [sites, setSites] = useState<Site[]>([]);
  const [, setIsLoadingSites] = useState(true);
  const [, setSitesError] = useState<string | null>(null);

  // Carousel state for testimonials
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // URL validation regex patterns
  const urlRegex =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
  const domainRegex =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

  // Validate and clean search query
  const validateAndCleanQuery = (
    query: string
  ): { isValid: boolean; cleanedQuery: string; error?: string } => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return {
        isValid: false,
        cleanedQuery: "",
        error: t("search.errors.emptyQuery"),
      };
    }

    if (trimmedQuery.length < 2) {
      return {
        isValid: false,
        cleanedQuery: "",
        error: t("search.errors.tooShort"),
      };
    }

    if (trimmedQuery.length > 100) {
      return {
        isValid: false,
        cleanedQuery: "",
        error: t("search.errors.tooLong"),
      };
    }

    // Check if it's a URL
    if (urlRegex.test(trimmedQuery) || domainRegex.test(trimmedQuery)) {
      return {
        isValid: false,
        cleanedQuery: "",
        error: t("search.errors.urlNotAllowed"),
      };
    }

    // Remove special characters that might cause issues
    const cleanedQuery = trimmedQuery
      .replace(/[<>\"'&]/g, "")
      .replace(/\s+/g, " ");

    if (cleanedQuery !== trimmedQuery) {
      console.warn("Query was cleaned:", {
        original: trimmedQuery,
        cleaned: cleanedQuery,
      });
    }

    return { isValid: true, cleanedQuery };
  };

  const handleSearch = async () => {
    const validation = validateAndCleanQuery(searchQuery);

    if (!validation.isValid) {
      setSearchError(validation.error || t("search.errors.invalid"));
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      // Build search URL with type filter
      const searchParams = new URLSearchParams();
      searchParams.set("q", validation.cleanedQuery);

      if (searchType !== "all") {
        searchParams.set("type", searchType);
      }

      // Navigate to search page
      window.location.href = `/search?${searchParams.toString()}`;
    } catch (error) {
      console.error("Search navigation error:", error);
      setSearchError(t("search.errors.navigation"));
      setIsSearching(false);
    }
  };

  const handleSmoothScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Height of fixed header
      const elementPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  // Load pricing plans from API
  const loadPricingPlans = async () => {
    try {
      setIsLoadingPricing(true);
      setPricingError(null);

      const response = await publicApi.getPricingPlans();

      if (response.success && response.data) {
        // Handle different response structures
        let apiPlans: unknown[] = [];

        if (Array.isArray(response.data)) {
          apiPlans = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          apiPlans = response.data.data;
        }

        // Transform API pricing plans to frontend format
        const transformedPlans: PricingPlan[] = apiPlans.map(
          (plan: unknown, index: number) => {
            const planObj = plan as Record<string, unknown>;
            return {
              id: index + 1,
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

        setPricingPlans(transformedPlans);
      } else {
        setPricingError(
          response.error?.message || t("pricing.errors.failedToLoad")
        );
      }
    } catch (error) {
      console.error("Failed to load pricing plans:", error);
      setPricingError(t("pricing.errors.failedToLoad"));
    } finally {
      setIsLoadingPricing(false);
    }
  };

  // Load sites from API
  const loadSites = async () => {
    try {
      setIsLoadingSites(true);
      setSitesError(null);

      const response = await publicApi.getSites();

      if (response.success && response.data) {
        // Handle different response structures
        let apiSites: unknown[] = [];

        if (Array.isArray(response.data)) {
          apiSites = response.data;
        } else if (
          response.data.data &&
          response.data.data.sites &&
          Array.isArray(response.data.data.sites)
        ) {
          apiSites = response.data.data.sites;
        }

        // Transform API sites to frontend format
        const transformedSites: Site[] = apiSites.map((site: unknown) => {
          const siteObj = site as Record<string, unknown>;
          return {
            name: typeof siteObj.name === "string" ? siteObj.name : "",
            url: typeof siteObj.url === "string" ? siteObj.url : "",
            icon:
              typeof siteObj.icon === "string"
                ? siteObj.icon
                : `${typeof siteObj.url === "string" ? siteObj.url : ""}/favicon.ico`,
            total_downloads:
              typeof siteObj.total_downloads === "number"
                ? siteObj.total_downloads
                : 0,
            external:
              typeof siteObj.external === "boolean" ? siteObj.external : false,
            today_downloads:
              typeof siteObj.today_downloads === "number"
                ? siteObj.today_downloads
                : 0,
            price: typeof siteObj.price === "number" ? siteObj.price : 0,
            last_reset:
              typeof siteObj.last_reset === "string" ? siteObj.last_reset : "",
          };
        });

        setSites(transformedSites);
      } else {
        setSitesError(
          response.error?.message || t("pricing.errors.failedToLoadSites")
        );
      }
    } catch (error) {
      console.error("Failed to load sites:", error);
      setSitesError(t("pricing.errors.failedToLoadSites"));
    } finally {
      setIsLoadingSites(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadPricingPlans();
    loadSites();
  }, []);

  // Handle responsive behavior for mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle carousel API and slide tracking
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    onSelect(); // Set initial slide

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Auto-play functionality for mobile only
  useEffect(() => {
    if (!carouselApi || !isMobile) return;

    const autoPlay = setInterval(() => {
      carouselApi.scrollNext();
    }, 4000); // Auto-advance every 4 seconds

    return () => clearInterval(autoPlay);
  }, [carouselApi, isMobile]);

  // Show loading skeletons while language data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <HeaderSkeleton />
        <HeroSkeleton />
        <SupportedPlatformsSkeleton />
        <CategoriesSkeleton />
        <TestimonialsSkeleton />
        <StatisticsSkeleton />
        <FeaturesSkeleton />
        <FAQSkeleton />
        <FooterSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-5">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="cursor-pointer md:hidden p-2 hover:bg-muted rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
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
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => handleSmoothScroll("home")}
                className={`hover:bg-primary hover:text-white ${isRTL && "text-base"}`}
              >
                {t("header.navigation.home")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleSmoothScroll("platforms")}
                className={`hover:bg-primary hover:text-white ${isRTL && "text-base"}`}
              >
                {t("header.navigation.platforms")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleSmoothScroll("pricing")}
                className={`hover:bg-primary hover:text-white ${isRTL && "text-base"}`}
              >
                {t("header.navigation.pricing")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleSmoothScroll("categories")}
                className={`hover:bg-primary hover:text-white ${isRTL && "text-base"}`}
              >
                {t("header.navigation.categories")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleSmoothScroll("features")}
                className={`hover:bg-primary hover:text-white ${isRTL && "text-base"}`}
              >
                {t("header.navigation.features")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleSmoothScroll("faq")}
                className={`hover:bg-primary hover:text-white ${isRTL && "text-base"}`}
              >
                {t("header.navigation.faq")}
              </Button>
            </nav>
            {/* Header Controls */}
            <HeaderControls />
          </div>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Mobile Navigation Menu */}
      <aside
        className={`fixed left-0 top-0 w-72 h-screen bg-background border-r border-border z-50 transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Mobile Close Button */}
          <div
            className={`absolute right-6 top-5 ${isRTL && "left-6 right-auto"}`}
          >
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="cursor-pointer p-2 hover:bg-muted rounded-lg transition-colors min-h-[33px] min-w-[33px] flex items-center justify-center"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Logo Section */}
            <div className="flex items-center space-x-2 pb-4 border-b border-border">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
              </div>
              <span className="text-lg font-semibold text-foreground">
                {t("header.logo")}
              </span>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              <button
                onClick={() => handleSmoothScroll("home")}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors w-full text-left"
              >
                <span className="text-base">{t("header.navigation.home")}</span>
              </button>
              <button
                onClick={() => handleSmoothScroll("platforms")}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors w-full text-left"
              >
                <span className="text-base">
                  {t("header.navigation.platforms")}
                </span>
              </button>
              <button
                onClick={() => handleSmoothScroll("pricing")}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors w-full text-left"
              >
                <span className="text-base">
                  {t("header.navigation.pricing")}
                </span>
              </button>
              <button
                onClick={() => handleSmoothScroll("categories")}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors w-full text-left"
              >
                <span className="text-base">
                  {t("header.navigation.categories")}
                </span>
              </button>
              <button
                onClick={() => handleSmoothScroll("features")}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors w-full text-left"
              >
                <span className="text-base">
                  {t("header.navigation.features")}
                </span>
              </button>
              <button
                onClick={() => handleSmoothScroll("faq")}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors w-full text-left"
              >
                <span className="text-base">{t("header.navigation.faq")}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen bg-gradient-to-br from-primary/20 via-primary/5 to-primary/20 py-12 md:pb-20 md:pt-8 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-100"></div>
        {/* Shape 1 - Grid Dots Pattern (like your reference image) */}
        <div
          className={`absolute bottom-32 ${isRTL ? "right-5/12" : "left-5/12"} transform -translate-x-1/2 md:bottom-40`}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            className="text-primary/60"
          >
            {/* Grid of dots - 8 rows x 10 columns */}
            {Array.from({ length: 8 }, (_, row) =>
              Array.from({ length: 10 }, (_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={10 + col * 14}
                  cy={10 + row * 12}
                  r="2"
                  fill="currentColor"
                  className="animate-pulse-slow"
                  style={{
                    animationDelay: `${(row + col) * 0.1}s`,
                    opacity: Math.random() * 0.5 + 0.3,
                  }}
                />
              ))
            )}
          </svg>
        </div>
        {/* Shape 2 - Square Grid Pattern (Left Side) */}
        <div className="hidden md:block absolute top-1/3 left-4 md:left-8">
          <svg
            width="100"
            height="120"
            viewBox="0 0 100 120"
            fill="none"
            className="text-primary/40"
          >
            {/* Grid of squares - 8 rows x 8 columns */}
            {Array.from({ length: 8 }, (_, row) =>
              Array.from({ length: 8 }, (_, col) => (
                <rect
                  key={`square-${row}-${col}`}
                  x={8 + col * 16}
                  y={8 + row * 14}
                  width="3"
                  height="3"
                  fill="currentColor"
                  className="animate-pulse-slow"
                  style={{
                    animationDelay: `${(row + col) * 0.08}s`,
                    opacity: Math.random() * 0.5 + 0.25,
                  }}
                />
              ))
            )}
          </svg>
        </div>
        {/* Shape 3 - Diamond Grid Pattern (Bottom Right) */}
        <div className="absolute bottom-20 right-12 md:bottom-32 md:right-20">
          <svg
            width="90"
            height="90"
            viewBox="0 0 90 90"
            fill="none"
            className="text-primary/45"
          >
            {/* Grid of diamonds - 5 rows x 5 columns */}
            {Array.from({ length: 5 }, (_, row) =>
              Array.from({ length: 5 }, (_, col) => (
                <rect
                  key={`diamond-${row}-${col}`}
                  x={10 + col * 16}
                  y={10 + row * 16}
                  width="4"
                  height="4"
                  transform={`rotate(45 ${12 + col * 16} ${12 + row * 16})`}
                  fill="currentColor"
                  className="animate-pulse-slow"
                  style={{
                    animationDelay: `${(row + col) * 0.15}s`,
                    opacity: Math.random() * 0.4 + 0.4,
                  }}
                />
              ))
            )}
          </svg>
        </div>
        {/* Shape 4 - Top Center Left Dots */}
        <div
          className={`absolute top-12 ${isRTL ? "right-1/3 md:right-2/5" : "left-1/3 md:left-2/5"} md:top-16 opacity-30`}
        >
          <svg
            width="60"
            height="40"
            viewBox="0 0 60 40"
            fill="none"
            className="text-primary/40"
          >
            {/* Small grid of dots - 3 rows x 4 columns */}
            {Array.from({ length: 3 }, (_, row) =>
              Array.from({ length: 4 }, (_, col) => (
                <circle
                  key={`top-center-${row}-${col}`}
                  cx={8 + col * 12}
                  cy={8 + row * 12}
                  r="1.5"
                  fill="currentColor"
                  className="animate-pulse-slow"
                  style={{
                    animationDelay: `${(row + col) * 0.2}s`,
                    opacity: Math.random() * 0.5 + 0.4,
                  }}
                />
              ))
            )}
          </svg>
        </div>
        {/* Shape 5 - Top Center Right Floating Icon */}
        <div
          className={`hidden md:block absolute top-8 ${isRTL ? "left-1/3 md:left-2/12" : "right-1/3 md:right-4/5"} md:top-12`}
        >
          <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-float">
            <Shield className="w-5 h-5 text-primary" />
          </div>
        </div>
        {/* Shape 6 - Top Center Right Small Squares */}
        <div
          className={`absolute top-16 ${isRTL ? "left-1/4 md:left-1/3" : "right-1/4 md:right-1/3"} md:top-20 opacity-35`}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            className="text-primary/30"
          >
            {/* Small squares grid - 5x5 */}
            {Array.from({ length: 5 }, (_, row) =>
              Array.from({ length: 5 }, (_, col) => (
                <rect
                  key={`square-top-${row}-${col}`}
                  x={6 + col * 12}
                  y={6 + row * 12}
                  width="3"
                  height="3"
                  fill="currentColor"
                  className="animate-pulse-slow"
                  style={{
                    animationDelay: `${(row + col) * 0.15}s`,
                    opacity: Math.random() * 0.5 + 0.3,
                  }}
                />
              ))
            )}
          </svg>
        </div>

        {/* Additional Floating Icons - 9 more decorative elements */}
        {/* Icon 1 - Top Left Corner */}
        <div
          className={`hidden lg:block absolute top-20 ${isRTL ? "right-8" : "left-8"}`}
        >
          <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-float">
            <Zap className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Icon 2 - Top Right Corner */}
        <div
          className={`hidden lg:block absolute top-24 ${isRTL ? "left-12" : "right-12"}`}
        >
          <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-bounce-slow">
            <Crown className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Icon 3 - Middle Left */}
        <div
          className={`hidden md:block absolute top-1/2 ${isRTL ? "right-4" : "left-4"} transform -translate-y-1/2`}
        >
          <div className="w-11 h-11 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-float-delayed">
            <Users className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Icon 4 - Middle Right */}
        <div
          className={`hidden md:block absolute top-1/2 ${isRTL ? "left-6" : "right-6"} transform -translate-y-1/2`}
        >
          <div className="w-9 h-9 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-float">
            <Timer className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Icon 5 - Bottom Left */}
        <div
          className={`hidden md:block absolute bottom-24 ${isRTL ? "right-16" : "left-16"}`}
        >
          <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-bounce-slow">
            <Coins className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Icon 6 - Bottom Right */}
        <div
          className={`hidden md:block absolute bottom-28 ${isRTL ? "left-20" : "right-20"}`}
        >
          <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-float-delayed">
            <Check className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Icon 7 - Top Center */}
        <div
          className={`hidden lg:block absolute top-16 ${isRTL ? "right-5/6" : "left-5/6"} transform -translate-x-1/2`}
        >
          <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-float">
            <ExternalLink className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Icon 8 - Bottom Center Left */}
        <div
          className={`hidden md:block absolute bottom-16 ${isRTL ? "right-1/3" : "left-1/3"}`}
        >
          <div className="w-11 h-11 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-bounce-slow">
            <Cat className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Icon 9 - Bottom Center Right */}
        <div
          className={`hidden md:block absolute bottom-20 ${isRTL ? "left-1/4" : "right-1/4"}`}
        >
          <div className="w-9 h-9 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-float-delayed">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-5 relative z-10">
          <div className="flex flex-col items-center justify-center min-h-[85vh] sm:min-h-[80vh] text-center space-y-6 sm:space-y-8 lg:space-y-12 py-8 sm:py-0">
            {/* Centered Content */}
            <div className="space-y-4 sm:space-y-6 max-w-4xl px-2 sm:px-0">
              <h1 className="text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground font-sans leading-tight sm:leading-tight">
                {t("hero.title")}{" "}
                <span className="text-primary block sm:inline">
                  {t("hero.titleHighlight")}
                </span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto px-2 sm:px-0">
                {t("hero.description")}
              </p>
            </div>
            {/* Centered Search Bar */}
            <div className="w-full max-w-5xl px-4 sm:px-0">
              {/* Mobile Layout */}
              <div className="sm:hidden space-y-4">
                {/* Search Type Dropdown for Mobile */}
                <div className="w-full">
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger className="w-full !h-14 text-base border-2 border-border focus:border-primary rounded-xl bg-background/80 backdrop-blur-sm">
                      <SelectValue
                        placeholder={t("hero.searchType.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4" />
                          <span>{t("hero.searchType.all")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="images">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          <span>{t("hero.searchType.images")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="vectors">
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4" />
                          <span>{t("hero.searchType.vectors")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="videos">
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          <span>{t("hero.searchType.videos")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="templates">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4" />
                          <span>{t("hero.searchType.templates")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="icons">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          <span>{t("hero.searchType.icons")}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search
                    className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 transform -translate-y-1/2 stroke-2 text-muted-foreground w-5 h-5`}
                  />
                  <Input
                    type="text"
                    placeholder={t("hero.searchPlaceholderMobile")}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (searchError) setSearchError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                    disabled={isSearching}
                    className={`${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} py-8 h-16 text-lg border-2 ${
                      searchError
                        ? "border-red-500 focus:border-red-500"
                        : "border-border focus:border-primary"
                    } rounded-xl bg-background/80 backdrop-blur-sm w-full ${isSearching ? "opacity-50" : ""} placeholder:text-muted-foreground/70`}
                  />
                  {searchError && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {searchError}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    className="w-full py-7 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl min-h-[3.5rem] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSearching ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        {t("hero.searching")}
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 stroke-2" />
                        {t("hero.searchButton")}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setIsImageSearchOpen(true)}
                    variant="outline"
                    disabled={isSearching}
                    className="w-full py-7 px-6 text-base font-semibold rounded-xl border-2 border-border hover:border-primary/50 min-h-[3.5rem] touch-manipulation flex flex-row gap-3 items-center justify-center disabled:opacity-50"
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-base font-medium">
                      {t("hero.imageSearch.buttonText")}
                    </span>
                  </Button>
                </div>
              </div>
              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center gap-5">
                <div className="w-full relative flex items-center">
                  {/* Search Type Dropdown */}
                  <div
                    className={`absolute ${isRTL ? "right-2" : "left-2"} top-1/2 transform -translate-y-1/2 z-10`}
                  >
                    <Select value={searchType} onValueChange={setSearchType}>
                      <SelectTrigger className="w-44 !h-16 border-0 bg-secondary hover:bg-secondary/70 dark:hover:bg-muted/50 focus:ring-0 focus:ring-offset-0">
                        <SelectValue
                          placeholder={t("hero.searchType.placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div
                            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <Search className="w-4 h-4" />
                            <span>{t("hero.searchType.all")}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="images">
                          <div
                            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span>{t("hero.searchType.images")}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="vectors">
                          <div
                            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <Palette className="w-4 h-4" />
                            <span>{t("hero.searchType.vectors")}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="videos">
                          <div
                            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <Camera className="w-4 h-4" />
                            <span>{t("hero.searchType.videos")}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="templates">
                          <div
                            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <File className="w-4 h-4" />
                            <span>{t("hero.searchType.templates")}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="icons">
                          <div
                            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <Star className="w-4 h-4" />
                            <span>{t("hero.searchType.icons")}</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search Input */}
                  <Input
                    type="text"
                    placeholder={t("hero.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (searchError) setSearchError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                    disabled={isSearching}
                    className={`${isRTL ? "pr-48 pl-32" : "pl-48 pr-32"} py-8 h-20 text-xl border-2 ${
                      searchError
                        ? "border-red-500 focus:border-red-500"
                        : "border-border focus:border-primary"
                    } rounded-xl bg-background/80 backdrop-blur-sm placeholder:text-xl ${isRTL && "placeholder:text-lg"} ${isSearching ? "opacity-50" : ""} placeholder:text-muted-foreground/70`}
                  />

                  {/* Search Button */}
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    className={`absolute ${isRTL ? "left-2" : "right-2"} top-1/2 transform -translate-y-1/2 !px-6 !h-16 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL && "text-base"}`}
                  >
                    {isSearching ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        {t("hero.searching")}
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 stroke-3" />
                        {t("hero.searchButton")}
                      </>
                    )}
                  </Button>
                </div>
                {/* Image Search Button */}
                <Button
                  onClick={() => setIsImageSearchOpen(true)}
                  variant="outline"
                  disabled={isSearching}
                  className="!px-5 border-2 border-border hover:border-primary/50 flex flex-col gap-2 h-auto min-h-20 disabled:opacity-50"
                >
                  <ImageIcon className="!w-6 !h-6" />
                  <span className="text-xs font-medium">
                    {t("hero.imageSearch.buttonText")}
                  </span>
                </Button>
              </div>

              {/* Error Display for Desktop */}
              {searchError && (
                <div className="w-full max-w-4xl px-4 sm:px-0">
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 text-center">
                      {searchError}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons - Centered */}
            <div className="pt-24 sm:pt-16 md:pt-0 flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0 w-full max-w-md sm:max-w-none">
              <Button
                size="lg"
                className="!px-8 py-6 sm:py-7 text-base sm:text-lg font-semibold border-2 border-primary min-h-[3.5rem] touch-manipulation w-full sm:w-auto"
                onClick={() => handleSmoothScroll("pricing")}
              >
                <Eye className="size-5" />
                {t("hero.viewPricing")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="!px-8 py-6 sm:py-7 text-base sm:text-lg font-semibold border-2 border-border hover:border-primary/50 min-h-[3.5rem] touch-manipulation w-full sm:w-auto"
                onClick={() => handleSmoothScroll("faq")}
              >
                <PhoneCall className="size-5" />
                {t("hero.contactUs")}
              </Button>
            </div>
          </div>
        </div>

        {/* Image Search Dialog */}
        <ImageSearchDialog
          open={isImageSearchOpen}
          onOpenChange={setIsImageSearchOpen}
          onImageUpload={(file) => {
            console.log("Image uploaded:", file.name);
            // Handle image upload logic here
          }}
        />
      </section>
      {/* Supported Platforms Section */}
      {isLoading ? (
        <SupportedPlatformsSkeleton />
      ) : (
        <section
          id="platforms"
          className="py-16 lg:py-20 lg:pb-28 bg-gradient-to-br from-secondary via-secondary/50 to-secondary relative overflow-hidden"
        >
          <div className="px-5 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight font-sans">
                {t("supportedPlatforms.title")}{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {t("supportedPlatforms.titleHighlight")}
                </span>
              </h2>
              <p
                className={`text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed ${isRTL && "font-medium"}`}
              >
                {t("supportedPlatforms.description")}
              </p>
            </div>
            {/* Tabbed Platforms Interface */}
            <div className="max-w-[1200px] mx-auto border border-primary/80 dark:border-primary/30 p-5 rounded-xl shadow-2xs">
              <Tabs defaultValue="imagesVectors" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger
                    value="imagesVectors"
                    className="text-sm sm:text-base"
                  >
                    {t("supportedPlatforms.tabs.imagesVectors")}
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="text-sm sm:text-base">
                    {t("supportedPlatforms.tabs.videos")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="soundEffects"
                    className="text-sm sm:text-base"
                  >
                    {t("supportedPlatforms.tabs.soundEffects")}
                  </TabsTrigger>
                </TabsList>

                <div className="max-h-[50vh] overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 scrollbar-thumb-rounded-full">
                  <TabsContent value="imagesVectors" className="mt-0">
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 py-5 sm:gap-4 w-full">
                      {platformsByCategory.imagesVectors.map((platform) => (
                        <PlatformCard key={platform.id} platform={platform} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="videos" className="mt-0">
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 py-5 sm:gap-4 w-full">
                      {platformsByCategory.videos.map((platform) => (
                        <PlatformCard key={platform.id} platform={platform} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="soundEffects" className="mt-0">
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 py-5 sm:gap-4 w-full">
                      {platformsByCategory.soundEffects.map((platform) => (
                        <PlatformCard key={platform.id} platform={platform} />
                      ))}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </section>
      )}
      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-16 bg-gradient-to-br from-secondary/10 via-secondary/20 to-secondary/10 relative overflow-hidden"
      >
        <div className="px-5 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {t("pricing.title")}{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t("pricing.titleHighlight")}
              </span>
            </h2>
            <p
              className={`text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed ${isRTL && "font-medium"}`}
            >
              {t("pricing.description")}
            </p>
          </div>
          {/* Loading State */}
          {isLoadingPricing ? (
            <div className="grid mx-auto max-w-[1700px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {[...Array(4)].map((_, index) => (
                <div
                  key={`pricing-skeleton-${index}`}
                  className="group relative dark:bg-card bg-background backdrop-blur-sm shadow-xs border border-border/50 rounded-2xl p-6 lg:p-8 transition-all duration-300 flex flex-col"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-xl animate-pulse"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-5 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-muted rounded animate-pulse w-1/2"></div>
                      <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-4 flex-1 mt-6">
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <div className="h-4 bg-muted rounded animate-pulse w-1/3"></div>
                          <div className="h-4 bg-muted rounded animate-pulse w-1/4"></div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-border">
                      <div className="h-4 bg-muted rounded animate-pulse w-1/2 mb-3"></div>
                      <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="h-4 bg-muted rounded animate-pulse"
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="h-12 bg-muted rounded-xl animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : pricingError ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("pricing.errors.title")}
              </h3>
              <p className="text-muted-foreground mb-4">{pricingError}</p>
              <Button
                onClick={loadPricingPlans}
                variant="outline"
                className="gap-2"
              >
                <Loader2 className="w-4 h-4" />
                {t("pricing.errors.retry")}
              </Button>
            </div>
          ) : pricingPlans.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("pricing.errors.noPlans")}
              </h3>
              <p className="text-muted-foreground">
                {t("pricing.errors.noPlansDescription")}
              </p>
            </div>
          ) : (
            <div className="grid mx-auto max-w-[1700px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {pricingPlans.map((plan, index) => {
                // Get supported sites for this plan
                const planSupportedSites =
                  plan.supportedSites?.map((siteName) => {
                    const matchingSite = sites.find(
                      (site) =>
                        site.name
                          .toLowerCase()
                          .includes(siteName.toLowerCase()) ||
                        site.url.includes(siteName.toLowerCase())
                    );
                    return matchingSite
                      ? {
                          id: matchingSite.name,
                          name: matchingSite.name,
                          icon:
                            matchingSite.url ||
                            `${matchingSite.url}/favicon.ico`,
                        }
                      : {
                          id: siteName,
                          name: siteName,
                          icon: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(siteName)}&sz=96`,
                        };
                  }) || [];

                // Determine icon based on plan name or index
                const PlanIcon =
                  index === 0
                    ? Zap
                    : index === 1
                      ? Crown
                      : index === 2
                        ? Globe
                        : Package;

                return (
                  <div
                    key={plan.id || index}
                    className="group relative dark:bg-card bg-background backdrop-blur-sm shadow-xs border border-border/50 rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:bg-background/80 hover:border-primary/30 flex flex-col"
                  >
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex flex-col h-full space-y-6">
                      {/* Plan Header */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <PlanIcon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {plan.name}
                            </h3>
                            <p
                              className={`text-sm text-muted-foreground ${isRTL && "!text-lg"}`}
                            >
                              {plan.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Plan Features */}
                      <div className="space-y-4 flex-1">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm text-muted-foreground ${isRTL && "!text-lg"}`}
                            >
                              {t("pricing.labels.credits")}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Coins className="w-4 h-4 text-primary" />
                              <span
                                className={`text-sm font-semibold text-foreground ${isRTL && "!text-lg"}`}
                              >
                                {plan.credits.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm text-muted-foreground ${isRTL && "!text-lg"}`}
                            >
                              {t("pricing.labels.validity")}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Timer className="w-4 h-4 text-primary" />
                              <span
                                className={`text-sm font-semibold text-foreground ${isRTL && "!text-lg"}`}
                              >
                                {plan.daysValidity} {t("pricing.labels.days")}
                              </span>
                            </div>
                          </div>
                          {planSupportedSites.length > 0 && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <div className="flex items-center justify-between cursor-pointer hover:bg-muted rounded-lg p-2 -m-2 transition-colors">
                                  <span
                                    className={`text-sm text-muted-foreground ${isRTL && "!text-lg"}`}
                                  >
                                    {t("pricing.labels.supportedSites")}
                                  </span>
                                  <span
                                    className={`text-sm font-semibold text-foreground ${isRTL && "!text-lg"}`}
                                  >
                                    {planSupportedSites.length}
                                  </span>
                                </div>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    {t(
                                      "pricing.labels.supportedSitesDialog.title"
                                    )}{" "}
                                    - {plan.name}
                                  </DialogTitle>
                                  <DialogDescription>
                                    {t(
                                      "pricing.labels.supportedSitesDialog.description"
                                    )}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                                  {planSupportedSites.map((site) => (
                                    <div
                                      key={site.id}
                                      className="flex flex-col items-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                    >
                                      <img
                                        src={site.icon}
                                        alt={`${site.name} icon`}
                                        width={96}
                                        height={96}
                                        className="w-24 h-24 rounded-lg mb-3 object-contain"
                                        onError={(e) => {
                                          e.currentTarget.src =
                                            "https://via.placeholder.com/96x96/6366f1/ffffff?text=" +
                                            site.name.charAt(0);
                                        }}
                                      />
                                      <span className="text-sm font-medium text-foreground text-center">
                                        {site.name}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                        <div className="pt-4 border-t border-border">
                          <h4
                            className={`text-sm font-medium text-foreground mb-3 ${isRTL && "!text-lg"}`}
                          >
                            {t("pricing.labels.featuresIncluded")}
                          </h4>
                          <ul className="space-y-2">
                            {(plan.features || []).map(
                              (feature: string, featureIndex: number) => (
                                <li
                                  key={featureIndex}
                                  className="flex items-center space-x-2"
                                >
                                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                  <span
                                    className={`text-sm text-muted-foreground  ${isRTL && "!text-base"}`}
                                  >
                                    {feature}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                      {/* CTA Button - Now at bottom */}
                      <div className="mt-auto pt-4">
                        <Button
                          className="w-full py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                          asChild
                        >
                          <a
                            href={
                              plan.contactUsUrl || "https://example.com/contact"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 stroke-3" />
                            {t(
                              "dashboard.packageManagement.planDetails.contactUsLabel"
                            )}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Additional Info */}
          <div className="pt-14 text-center">
            <p
              className={`text-sm text-muted-foreground mb-4 ${isRTL && "!text-lg"}`}
            >
              {t("pricing.features.main")}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className={`${isRTL && "text-base"}`}>
                  {t("pricing.features.moneyBack")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                <span className={`${isRTL && "text-base"}`}>
                  {t("pricing.features.cancelAnytime")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className={`${isRTL && "text-base"}`}>
                  {t("pricing.features.support24")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {isLoading ? (
        <TestimonialsSkeleton />
      ) : (
        <section className="py-16 bg-gradient-to-br from-secondary via-secondary/50 to-secondary relative overflow-hidden">
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
                    key={`testimonial-${row}-${col}`}
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

            {/* Top Right Star Icon */}
            <div
              className={`hidden lg:block absolute top-32 ${isRTL ? "left-20" : "right-20"} animate-float`}
            >
              <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* Bottom Left Heart Icon */}
            <div
              className={`hidden md:block absolute bottom-32 ${isRTL ? "right-16" : "left-16"} animate-bounce-slow`}
            >
              <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
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
                    key={`testimonial-bottom-${row}-${col}`}
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

          <div className="container mx-auto max-w-[1600px] px-5 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight font-sans">
                {t("testimonials.title")}{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {t("testimonials.titleHighlight")}
                </span>
              </h2>
              <p
                className={`text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed ${isRTL && "font-medium"}`}
              >
                {t("testimonials.description")}
              </p>
            </div>

            {/* Testimonials Carousel */}
            <div className="relative max-w-[1400px] mx-auto py-2">
              <Carousel
                setApi={setCarouselApi}
                opts={{
                  align: "start",
                  loop: true,
                  direction: isRTL ? "rtl" : "ltr",
                }}
                className="w-full py-2"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {(
                    t("testimonials.reviews", { returnObjects: true }) as any[]
                  ).map((testimonial: any, index: number) => (
                    <CarouselItem
                      key={index}
                      className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <div className="bg-card dark:bg-secondary border border-border rounded-2xl p-4 lg:p-6 transition-all duration-300 hover:shadow-sm hover:border-primary/50 h-full">
                        {/* Author Info at Top */}
                        <div
                          className={`flex items-center justify-between mb-4`}
                        >
                          <div className="flex items-center gap-2">
                                                      <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm">
                              {testimonial.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {testimonial.role}
                            </p>
                          </div>
                          </div>
                          {/* Rating Stars */}
                          <div className="flex items-center">
                            {Array.from(
                              { length: testimonial.rating },
                              (_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 text-yellow-500 fill-current"
                                />
                              )
                            )}
                          </div>
                        </div>

                        {/* Testimonial Content */}
                        <p
                          className={`text-muted-foreground leading-relaxed text-sm sm:text-base ${isRTL && "font-medium"}`}
                        >
                          <q> {testimonial.content} </q>
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation Buttons - Hidden on mobile, visible on sm+ */}
                <CarouselPrevious
                  className={`hidden sm:flex ${isRTL ? "!-right-14 !left-auto" : "!-left-14 !right-auto"} bg-background border-border hover:bg-muted hover:border-primary/50 transition-colors`}
                />
                <CarouselNext
                  className={`hidden sm:flex ${isRTL ? "!-left-14 !right-auto" : "!-right-14 !left-auto"} bg-background border-border hover:bg-muted hover:border-primary/50 transition-colors`}
                />
              </Carousel>

              {/* Dot Pagination - Visible only on mobile */}
              <div className="flex sm:hidden justify-center mt-6 space-x-2">
                {(
                  t("testimonials.reviews", { returnObjects: true }) as any[]
                ).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "bg-primary scale-125"
                        : "bg-primary/30 hover:bg-primary/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Statistics Section */}
      {isLoading ? (
        <StatisticsSkeleton />
      ) : (
        <div className="bg-gradient-to-br from-secondary/10 via-secondary/20 to-secondary/10">
          <section className="py-16 lg:py-20 relative overflow-hidden">
            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Top Left Dots Grid */}
              <svg
                className={`hidden md:block absolute top-16 ${isRTL ? "right-8" : "left-8"} w-28 h-20 opacity-50`}
                viewBox="0 0 120 80"
                fill="none"
              >
                {Array.from({ length: 4 }, (_, row) =>
                  Array.from({ length: 6 }, (_, col) => (
                    <circle
                      key={`stats-${row}-${col}`}
                      cx={8 + col * 18}
                      cy={8 + row * 16}
                      r="1.5"
                      fill="currentColor"
                      className="text-primary animate-pulse"
                      style={{
                        animationDelay: `${(row + col) * 0.2}s`,
                        animationDuration: "3s",
                      }}
                    />
                  ))
                )}
              </svg>

              {/* Top Right Chart Icon */}
              <div
                className={`hidden lg:block absolute top-24 ${isRTL ? "left-16" : "right-16"} animate-float`}
              >
                <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Top Center Download Icon */}
              <div
                className={`hidden xl:block absolute top-4 left-1/2 transform -translate-x-1/2 animate-bounce-slow`}
              >
                <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Middle Left Heart Icon */}
              <div
                className={`hidden lg:block absolute top-1/2 ${isRTL ? "right-4" : "left-4"} transform -translate-y-1/2 animate-pulse-slow`}
              >
                <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
              </div>

              {/* Middle Right Globe Icon */}
              <div
                className={`hidden lg:block absolute top-1/2 ${isRTL ? "left-4" : "right-4"} transform -translate-y-1/2 animate-float`}
              >
                <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
              </div>

              {/* Bottom Left Target Icon */}
              <div
                className={`hidden md:block absolute bottom-24 ${isRTL ? "right-12" : "left-12"} animate-bounce-slow`}
              >
                <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Bottom Center Package Icon */}
              <div
                className={`hidden xl:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-pulse-slow`}
              >
                <div className="w-9 h-9 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-primary" />
                </div>
              </div>

              {/* Bottom Right Dots Grid */}
              <svg
                className={`hidden md:block absolute bottom-16 ${isRTL ? "left-20" : "right-20"} w-32 h-24 opacity-50`}
                viewBox="0 0 140 100"
                fill="none"
              >
                {Array.from({ length: 5 }, (_, row) =>
                  Array.from({ length: 7 }, (_, col) => (
                    <circle
                      key={`stats-bottom-${row}-${col}`}
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

              {/* Additional Decorative Dots - Top Right Corner */}
              <svg
                className={`hidden md:block absolute top-8 ${isRTL ? "left-32" : "right-32"} w-20 h-16 opacity-50`}
                viewBox="0 0 80 64"
                fill="none"
              >
                {Array.from({ length: 3 }, (_, row) =>
                  Array.from({ length: 4 }, (_, col) => (
                    <circle
                      key={`stats-corner-${row}-${col}`}
                      cx={8 + col * 18}
                      cy={8 + row * 16}
                      r="1"
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

              {/* Additional Decorative Dots - Bottom Left Corner */}
              <svg
                className={`hidden md:block absolute bottom-8 ${isRTL ? "right-32" : "left-32"} w-24 h-18 opacity-50`}
                viewBox="0 0 96 72"
                fill="none"
              >
                {Array.from({ length: 3 }, (_, row) =>
                  Array.from({ length: 4 }, (_, col) => (
                    <circle
                      key={`stats-corner-bottom-${row}-${col}`}
                      cx={8 + col * 20}
                      cy={8 + row * 18}
                      r="1.5"
                      fill="currentColor"
                      className="text-primary animate-pulse"
                      style={{
                        animationDelay: `${(row + col) * 0.5}s`,
                        animationDuration: "6s",
                      }}
                    />
                  ))
                )}
              </svg>
            </div>

            <div className="container mx-auto max-w-[1400px] px-5 relative z-10">
              {/* Section Header */}
              <div className="text-center mb-12 lg:mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight font-sans">
                  {t("statistics.title")}{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {t("statistics.titleHighlight")}
                  </span>
                </h2>
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto px-2 sm:px-0">
                  {t("statistics.description")}
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {Object.entries(
                  t("testimonials.stats", { returnObjects: true }) as Record<
                    string,
                    any
                  >
                ).map(([key, stat], index) => {
                  // Define icons for each statistic
                  const getStatIcon = (statKey: string) => {
                    switch (statKey) {
                      case "totalDownloads":
                        return <Download className="w-6 h-6 text-primary" />;
                      case "customerSatisfaction":
                        return <Heart className="w-6 h-6 text-primary" />;
                      case "supportedPlatforms":
                        return <Globe className="w-6 h-6 text-primary" />;
                      case "totalResources":
                        return <Package className="w-6 h-6 text-primary" />;
                      default:
                        return <Star className="w-6 h-6 text-primary" />;
                    }
                  };

                  return (
                    <StatisticCard
                      key={key}
                      value={parseInt(stat.value)}
                      label={stat.label}
                      suffix={stat.suffix}
                      delay={index * 1500}
                      icon={getStatIcon(key)}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Features Section */}
      {isLoading ? (
        <FeaturesSkeleton />
      ) : (
        <section
          id="features"
          className="py-16 lg:py-20 bg-gradient-to-br from-secondary via-secondary/50 to-secondary relative overflow-hidden"
        >
          <div className="container mx-auto max-w-7xl px-5 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight font-sans">
                {t("features.title")}{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {t("features.titleHighlight")}
                </span>
              </h2>
              <p
                className={`text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed ${isRTL && "font-medium"}`}
              >
                {t("features.description")}
              </p>
            </div>
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Feature 1 - High Quality Resources */}
              <div className="group bg-card border border-border rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:border-primary/30 relative overflow-hidden">
                {/* Hover effect overlay - diagonal sweep */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl transform translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-primary/10 border border-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-125 transition-transform duration-150">
                    <Star className="w-7 h-7 text-primary" />
                  </div>
                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-3 font-sans">
                    {t("features.premiumQuality.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                    {t("features.premiumQuality.description")}
                  </p>
                </div>
              </div>
              {/* Feature 2 - Fast Downloads */}
              <div className="group bg-card border border-border rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:border-primary/30 relative overflow-hidden">
                {/* Hover effect overlay - diagonal sweep */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl transform translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-primary/10 border border-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-125 transition-transform duration-150">
                    <Download className="w-7 h-7 text-primary" />
                  </div>
                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-3 font-sans">
                    {t("features.instantDownloads.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                    {t("features.instantDownloads.description")}
                  </p>
                </div>
              </div>
              {/* Feature 3 - Multiple Platforms */}
              <div className="group bg-card border border-border rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:border-primary/30 relative overflow-hidden">
                {/* Hover effect overlay - diagonal sweep */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl transform translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-primary/10 border border-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-125 transition-transform duration-150">
                    <Globe className="w-7 h-7 text-primary" />
                  </div>
                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-3 font-sans">
                    {t("features.allPlatforms.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                    {t("features.allPlatforms.description")}
                  </p>
                </div>
              </div>
              {/* Feature 4 - Secure & Safe */}
              <div className="group bg-card border border-border rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:border-primary/30 relative overflow-hidden">
                {/* Hover effect overlay - diagonal sweep */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl transform translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-primary/10 border border-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-125 transition-transform duration-150">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-3 font-sans">
                    {t("features.secureAndSafe.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                    {t("features.secureAndSafe.description")}
                  </p>
                </div>
              </div>
              {/* Feature 5 - 24/7 Support */}
              <div className="group bg-card border border-border rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:border-primary/30 relative overflow-hidden">
                {/* Hover effect overlay - diagonal sweep */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl transform translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-primary/10 border border-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-125 transition-transform duration-150">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-3 font-sans">
                    {t("features.support24.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                    {t("features.support24.description")}
                  </p>
                </div>
              </div>
              {/* Feature 6 - Easy to Use */}
              <div className="group bg-card border border-border rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:border-primary/30 relative overflow-hidden">
                {/* Hover effect overlay - diagonal sweep */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl transform translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-primary/10 border border-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-125 transition-transform duration-150">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  {/* Content */}
                  <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-3 font-sans">
                    {t("features.easyToUse.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                    {t("features.easyToUse.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* FAQ Section */}
      <FAQSection />
      {/* Footer */}
      <Footer />
    </div>
  );
}
