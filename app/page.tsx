/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  Search,
  Image as ImageIcon,
  Eye,
  PhoneCall,
  Menu,
  Zap,
  Crown,
  Globe,
  Timer,
  Coins,
  Download,
  Sparkles,
  Users,
  Star,
  Palette,
  Camera,
  File,
  AlertCircle,
  Loader2,
  Heart,
  User,
  TrendingUp,
  Target,
  X,
  Shield,
  Package,
} from "lucide-react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Configure GSAP to handle null targets gracefully
if (typeof window !== "undefined") {
  gsap.config({
    nullTargetWarn: false,
  });
}

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
import { useState, useEffect, useRef } from "react";
import Footer from "@/components/footer";
import FAQSection from "@/components/faq-section";
import {
  HeaderSkeleton,
  HeroSkeleton,
  FeaturesSkeleton,
  FooterSkeleton,
  FAQSkeleton,
  TestimonialsSkeleton,
  StatisticsSkeleton,
} from "@/components/home-page-skeletons";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { usePricingAnimations } from "@/hooks/use-pricing-animations";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/i18n-provider";
import { HeaderControls } from "@/components/header-controls";
import { DownloadVerificationSheet } from "@/components/download-verification-sheet";
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
import { useMobileMenuAnimations } from "@/hooks/use-mobile-menu-animations";
import { useEnhancedHeaderEffects } from "@/hooks/use-enhanced-header-effects";
import { useHeaderAnimations } from "@/hooks/use-header-animations";
import { useHeroAnimations } from "@/hooks/use-hero-animations";
import { useTestimonialsAnimations } from "@/hooks/use-testimonials-animations";
import { FloatingDotsAnimation } from "@/components/floating-dots-animation";

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
    duration: 2000 + delay,
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
      className="statistic-card group bg-card border border-border rounded-2xl p-6 lg:p-8 transition-all duration-200 hover:border-primary/30 hover:shadow-lg relative overflow-hidden flex flex-col items-center justify-center min-h-[200px]"
    >
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl transform scale-0 group-hover:scale-100 transition-transform duration-200 ease-out"></div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
        {/* Icon */}
        {icon && (
          <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-150">
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

// Credit-based supported sites with pricing/variants
type SiteVariant = {
  label: string; // e.g. "EPS/JPG", "HD", "4K", "Icon", "Package"
  points: number; // allow fractional values like 1.5
};

type CreditSite = {
  id: string;
  name: string;
  url: string;
  variants: SiteVariant[]; // one or more variants per site
};

const creditSites: CreditSite[] = [
  {
    id: "adobe-stock",
    name: "Adobe Stock",
    url: "https://stock.adobe.com",
    variants: [
      { label: "EPS/JPG", points: 1 },
      { label: "HD", points: 30 },
      { label: "4K", points: 35 },
    ],
  },
  {
    id: "shutterstock",
    name: "Shutterstock",
    url: "https://www.shutterstock.com",
    variants: [
      { label: "EPS/JPG", points: 2 },
      { label: "HD", points: 30 },
      { label: "4K", points: 40 },
    ],
  },
  {
    id: "freepik",
    name: "Freepik",
    url: "https://www.freepik.com",
    variants: [
      { label: "Graphics", points: 1 },
      { label: "Video", points: 30 },
    ],
  },
  {
    id: "pikbest",
    name: "Pikbest",
    url: "https://www.pikbest.com",
    variants: [{ label: "All", points: 1 }],
  },
  {
    id: "creativefabrica",
    name: "Creative Fabrica",
    url: "https://www.creativefabrica.com",
    variants: [{ label: "All", points: 1 }],
  },
  {
    id: "iconscout",
    name: "Iconscout",
    url: "https://iconscout.com",
    variants: [{ label: "All", points: 1 }],
  },
  {
    id: "vecteezy",
    name: "Vecteezy",
    url: "https://www.vecteezy.com",
    variants: [{ label: "All", points: 1 }],
  },
  {
    id: "rawpixel",
    name: "Rawpixel",
    url: "https://www.rawpixel.com",
    variants: [{ label: "All", points: 1 }],
  },
  {
    id: "lovepik",
    name: "Lovepik",
    url: "https://www.lovepik.com",
    variants: [{ label: "All", points: 1 }],
  },
  {
    id: "epidemicsound",
    name: "Epidemic Sound",
    url: "https://www.epidemicsound.com",
    variants: [{ label: "All", points: 1 }],
  },
  {
    id: "pngtree",
    name: "PNGTree",
    url: "https://pngtree.com",
    variants: [{ label: "All", points: 1 }],
  },
  {
    id: "flaticon",
    name: "Flaticon",
    url: "https://www.flaticon.com",
    variants: [
      { label: "Icon", points: 1 },
      { label: "Package", points: 5 },
    ],
  },
  {
    id: "mockupcloud",
    name: "Mockup Cloud",
    url: "https://www.mockupcloud.com",
    variants: [{ label: "All", points: 1.5 }],
  },
  {
    id: "envato-elements",
    name: "Envato Elements",
    url: "https://elements.envato.com",
    variants: [{ label: "All", points: 2 }],
  },
  {
    id: "storyblocks",
    name: "Storyblocks",
    url: "https://www.storyblocks.com",
    variants: [{ label: "All", points: 2 }],
  },
  {
    id: "soundstripe",
    name: "Soundstripe",
    url: "https://www.soundstripe.com",
    variants: [{ label: "All", points: 2 }],
  },
  {
    id: "motionarray",
    name: "Motion Array",
    url: "https://motionarray.com",
    variants: [{ label: "All", points: 2 }],
  },
  {
    id: "motionelements",
    name: "MotionElements",
    url: "https://www.motionelements.com",
    variants: [{ label: "All", points: 2 }],
  },
  {
    id: "pixelbuddha",
    name: "Pixelbuddha",
    url: "https://pixelbuddha.net",
    variants: [{ label: "All", points: 2 }],
  },
  {
    id: "deeezy",
    name: "Deeezy",
    url: "https://www.deeezy.com",
    variants: [{ label: "All", points: 2 }],
  },
  {
    id: "123rf",
    name: "123RF",
    url: "https://www.123rf.com",
    variants: [{ label: "EPS/JPG", points: 2 }],
  },
  {
    id: "pixeden",
    name: "Pixeden",
    url: "https://www.pixeden.com",
    variants: [{ label: "All", points: 2 }],
  },
  {
    id: "artlist",
    name: "Artlist",
    url: "https://artlist.io",
    variants: [{ label: "All", points: 2 }],
  },
  {
    id: "designi",
    name: "Designi",
    url: "https://www.designi.com.br",
    variants: [{ label: "All", points: 2 }],
  },
  {
    id: "uihut",
    name: "UIHUT",
    url: "https://www.uihut.com",
    variants: [{ label: "All", points: 2 }],
  },
  {
    id: "depositphotos",
    name: "Depositphotos",
    url: "https://depositphotos.com",
    variants: [{ label: "EPS/JPG", points: 3 }],
  },
  {
    id: "pixelsquid",
    name: "PixelSquid",
    url: "https://www.pixelsquid.com",
    variants: [{ label: "All", points: 3 }],
  },
  {
    id: "productioncrate",
    name: "ProductionCrate",
    url: "https://www.productioncrate.com",
    variants: [{ label: "All", points: 3 }],
  },
  {
    id: "graphicscrate",
    name: "GraphicsCrate",
    url: "https://graphics.crate.com",
    variants: [{ label: "All", points: 3 }],
  },
  {
    id: "vectorstock",
    name: "VectorStock",
    url: "https://www.vectorstock.com",
    variants: [{ label: "All", points: 3 }],
  },
  {
    id: "ui8",
    name: "UI8",
    url: "https://ui8.net",
    variants: [{ label: "All", points: 4 }],
  },
  {
    id: "dreamstime",
    name: "Dreamstime",
    url: "https://www.dreamstime.com",
    variants: [{ label: "EPS/JPG", points: 4 }],
  },
  {
    id: "uplabs",
    name: "UpLabs",
    url: "https://www.uplabs.com",
    variants: [{ label: "All", points: 3 }],
  },
  {
    id: "craftwork",
    name: "Craftwork",
    url: "https://craftwork.design",
    variants: [{ label: "All", points: 5 }],
  },
  {
    id: "istockphoto",
    name: "iStockphoto",
    url: "https://www.istockphoto.com",
    variants: [
      { label: "EPS/JPG", points: 5 },
      { label: "FHD", points: 65 },
    ],
  },
  {
    id: "artgrid",
    name: "Artgrid",
    url: "https://artgrid.io",
    variants: [
      { label: "HD", points: 2 },
      { label: "4K", points: 15 },
    ],
  },
  {
    id: "yellowimages",
    name: "Yellow Images (Mockup)",
    url: "https://yellowimages.com",
    variants: [{ label: "All", points: 22 }],
  },

  {
    id: "alamy",
    name: "Alamy",
    url: "https://www.alamy.com",
    variants: [{ label: "All", points: 32 }],
  },
];

// Helper to get high-quality icon URL for specific sites with poor favicons
const getSiteIconUrl = (siteId: string, url: string) => {
  const iconMap: Record<string, string> = {
    "adobe-stock":
      "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@v9/icons/adobe.svg",
    pikbest: "https://logo.clearbit.com/pikbest.com",
    creativefabrica: "https://logo.clearbit.com/creativefabrica.com",
    storyblocks: "https://logo.clearbit.com/storyblocks.com",
    craftwork: "https://logo.clearbit.com/craftwork.design",
    vecteezy: "https://logo.clearbit.com/vecteezy.com",
    lovepik: "https://logo.clearbit.com/lovepik.com",
    pngtree: "https://logo.clearbit.com/pngtree.com",
    uplabs: "https://logo.clearbit.com/uplabs.com",
    graphicscrate: "https://logo.clearbit.com/graphics.crate.com",
  };

  return (
    iconMap[siteId] ||
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=128`
  );
};

export default function HomePage() {
  const { t } = useTranslation("common");
  const { language, isRTL, isLoading } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchType, setSearchType] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isDownloadSheetOpen, setIsDownloadSheetOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

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

  // GSAP Animation refs for testimonials section
  const testimonialsRef = useRef<HTMLElement>(null);
  const testimonialsTitleRef = useRef<HTMLHeadingElement>(null);
  const testimonialsHighlightRef = useRef<HTMLSpanElement>(null);
  const testimonialsDescRef = useRef<HTMLParagraphElement>(null);
  const dotsGridTopRef = useRef<SVGSVGElement>(null);
  const dotsGridBottomRef = useRef<SVGSVGElement>(null);
  const starIconRef = useRef<HTMLDivElement>(null);
  const heartIconRef = useRef<HTMLDivElement>(null);

  // GSAP Animation refs for statistics section
  const statisticsSectionRef = useRef<HTMLElement>(null);
  const statsDotsTopLeftRef = useRef<SVGSVGElement>(null);
  const statsDotsBottomRightRef = useRef<SVGSVGElement>(null);
  const statsDotsTopRightRef = useRef<SVGSVGElement>(null);
  const statsDotsBottomLeftRef = useRef<SVGSVGElement>(null);
  const statsChartIconRef = useRef<HTMLDivElement>(null);
  const statsDownloadIconRef = useRef<HTMLDivElement>(null);
  const statsHeartIconRef = useRef<HTMLDivElement>(null);
  const statsGlobeIconRef = useRef<HTMLDivElement>(null);
  const statsTargetIconRef = useRef<HTMLDivElement>(null);
  const statsPackageIconRef = useRef<HTMLDivElement>(null);
  const statsFloatingElementsRef = useRef<HTMLDivElement>(null);
  const statsTitleRef = useRef<HTMLHeadingElement>(null);
  const statsDescriptionRef = useRef<HTMLParagraphElement>(null);
  const statsCardsContainerRef = useRef<HTMLDivElement>(null);

  // GSAP Animation refs for features section
  const featuresSectionRef = useRef<HTMLElement>(null);
  const featuresTitleRef = useRef<HTMLHeadingElement>(null);
  const featuresHighlightRef = useRef<HTMLSpanElement>(null);
  const featuresDescriptionRef = useRef<HTMLParagraphElement>(null);
  const featuresGridRef = useRef<HTMLDivElement>(null);

  // Header animations (run only when not loading)
  const { headerRef, logoRef, navRef, controlsRef, mobileButtonRef } =
    useHeaderAnimations(!isLoading);

  // Mobile menu animations
  const { overlayRef, menuRef, addToRefs } =
    useMobileMenuAnimations(isMobileMenuOpen);

  // Enhanced header effects (run only when not loading)
  useEnhancedHeaderEffects(headerRef, !isLoading);

  // Pricing animations
  const pricingAnimations = usePricingAnimations({
    isLoading: isLoadingPricing,
    hasError: !!pricingError,
    cardsCount: pricingPlans.length,
  });

  // Hero animations (run only when not loading)
  const {
    heroSectionRef,
    titleRef,
    titleHighlightRef,
    descriptionRef,
    searchContainerRef,
    mobileSearchTypeRef,
    mobileSearchInputRef,
    mobileSearchButtonRef,
    errorDisplayRef,
    squareGridRef,
    diamondGridRef,
    topCenterDotsRef,
    topRightSquaresRef,
    ctaButtonsRef,
  } = useHeroAnimations({ enabled: !isLoading });

  // Testimonials animations (run only when not loading)
  const {
    testimonialsRef: testimonialsAnimRef,
    testimonialsTitleRef: testimonialsTitleAnimRef,
    testimonialsHighlightRef: testimonialsHighlightAnimRef,
    testimonialsDescRef: testimonialsDescAnimRef,
    carouselContainerRef: carouselContainerAnimRef,
    dotsGridTopRef: dotsGridTopAnimRef,
    dotsGridBottomRef: dotsGridBottomAnimRef,
    starIconRef: starIconAnimRef,
    heartIconRef: heartIconAnimRef,
  } = useTestimonialsAnimations(!isLoading);

  // URL validation regex patterns
  const urlRegex =
    /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/ \w \.-]*)*\/?$/i;
  const domainRegex =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

  // Enhanced URL detection for supported platforms
  const detectSupportedUrl = (query: string): boolean => {
    const trimmedQuery = query.trim();

    // Check for common URL patterns
    const urlPatterns = [
      /^https?:\/\//i, // Starts with http:// or https://
      /^www\./i, // Starts with www.
      /\.(com|org|net|edu|gov|io|co|uk|de|fr|es|it|jp|cn|ru|br|in|au|ca|mx|nl|se|no|dk|fi|pl|cz|hu|ro|bg|hr|si|sk|ee|lv|lt|mt|cy|lu|be|at|ch|li|mc|sm|va|ad|is|fo|gl|sj|bv|hm|cc|tv|tk|ml|ga|cf|gq|st|td|ne|bf|ml|sn|gm|gw|cv|mr|dz|tn|ly|eg|sd|ss|er|et|so|dj|ke|ug|tz|rw|bi|mw|zm|zw|bw|na|sz|ls|za|mg|mu|sc|km|yt|re|sh|ac|ta|fk|gs|pn|ck|nu|nf|tv|ki|nr|pw|fm|mh|mp|gu|as|pr|vi|vg|ai|ms|kn|ag|dm|lc|vc|gd|bb|tt|gy|sr|gf|br|uy|py|bo|pe|ec|co|ve|cl|ar|fj|sb|vu|nc|pf|wf|ws|to|tv|tk|nu|ck|ki|nr|pw|fm|mh|mp|gu|as|pr|vi|vg|ai|ms|kn|ag|dm|lc|vc|gd|bb|tt|gy|sr|gf)$/i,
      /freepik\.com/i,
      /shutterstock\.com/i,
      /adobe\.com/i,
      /stock\.adobe\.com/i,
      /gettyimages\.com/i,
      /unsplash\.com/i,
      /pexels\.com/i,
      /pixabay\.com/i,
      /vecteezy\.com/i,
      /dreamstime\.com/i,
      /123rf\.com/i,
      /depositphotos\.com/i,
      /istockphoto\.com/i,
      /elements\.envato\.com/i,
      /creativemarket\.com/i,
      /canva\.com/i,
      /figma\.com/i,
      /flaticon\.com/i,
      /icons8\.com/i,
      /thenounproject\.com/i,
      /storyset\.com/i,
    ];

    return (
      urlPatterns.some((pattern) => pattern.test(trimmedQuery)) ||
      urlRegex.test(trimmedQuery) ||
      domainRegex.test(trimmedQuery)
    );
  };

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

    // URLs are now handled separately in handleSearch, so we don't need to block them here
    // This validation is only for regular text searches

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

  const clearSearch = () => {
    setSearchQuery("");
    if (searchError) setSearchError(null);
  };

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setSearchError(t("search.errors.emptyQuery"));
      return;
    }

    // Check if the input is a URL from supported platforms
    if (detectSupportedUrl(trimmedQuery)) {
      // Open download verification sheet for URLs
      let processedUrl = trimmedQuery;

      // Add https:// if no protocol is specified
      if (!processedUrl.match(/^https?:\/\//i)) {
        processedUrl = `https://${processedUrl}`;
      }

      setDownloadUrl(processedUrl);
      setIsDownloadSheetOpen(true);
      setSearchError(null);
      return;
    }

    // For regular text searches, validate and proceed normally
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
        }

        // Transform API pricing plans to frontend format
        const transformedPlans: PricingPlan[] = apiPlans.map(
          (plan: unknown, index: number) => {
            const planObj = plan as Record<string, unknown>;
            return {
              // Use actual ID from API response, fallback to index-based ID for backward compatibility
              id:
                typeof planObj.id === "string"
                  ? planObj.id
                  : typeof planObj.Id === "string"
                    ? planObj.Id
                    : index + 1,
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
                parseFloat(
                  typeof planObj.price === "string"
                    ? planObj.price
                    : typeof planObj.PlanPrice === "string"
                      ? planObj.PlanPrice
                      : "0"
                ) || 0,
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
              // Use the recommended field from API response
              recommended:
                planObj.recommended === true || planObj.recommended === "true",
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

  // GSAP Testimonials Animations
  useEffect(() => {
    if (isLoading || !testimonialsRef.current) return;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Filter out null elements before setting initial states
      const titleElements = [
        testimonialsTitleRef.current,
        testimonialsHighlightRef.current,
        testimonialsDescRef.current,
      ].filter(Boolean);

      if (titleElements.length > 0) {
        gsap.set(titleElements, {
          opacity: 0,
          y: 50,
        });
      }

      // Prepare clipPath for title reveal (typewriter-like)
      if (testimonialsTitleRef.current) {
        gsap.set(testimonialsTitleRef.current, {
          clipPath: "inset(0% 100% 0% 0%)",
        });
      }

      const dotsElements = [
        dotsGridTopRef.current,
        dotsGridBottomRef.current,
      ].filter(Boolean);
      if (dotsElements.length > 0) {
        gsap.set(dotsElements, {
          opacity: 0,
          scale: 0.8,
        });
      }

      const iconElements = [starIconRef.current, heartIconRef.current].filter(
        Boolean
      );
      if (iconElements.length > 0) {
        gsap.set(iconElements, {
          opacity: 0,
          scale: 0,
          rotation: -180,
        });
      }

      gsap.set(".testimonial-card", {
        opacity: 0,
        y: 100,
        scale: 0.9,
      });

      // Main timeline for scroll-triggered animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate title with faster reveal effect (preserves gradient)
      if (testimonialsTitleRef.current) {
        tl.to(testimonialsTitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power3.out",
        }).to(
          testimonialsTitleRef.current,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.8,
            ease: "power2.inOut",
          },
          "-=0.1"
        );
      }

      // Animate highlight span
      tl.to(
        testimonialsHighlightRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        },
        "-=0.6"
      );

      // Animate description
      tl.to(
        testimonialsDescRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        },
        "-=0.2"
      );

      // Animate background elements
      if (dotsElements.length > 0) {
        tl.to(
          dotsElements,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.2)",
            stagger: 0.1,
          },
          "-=0.4"
        );
      }

      if (iconElements.length > 0) {
        tl.to(
          iconElements,
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)",
            stagger: 0.15,
          },
          "-=0.3"
        );
      }

      // Animate testimonial cards with faster stagger
      tl.to(
        ".testimonial-card",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: {
            amount: 0.6,
            from: "start",
          },
        },
        "-=0.2"
      );

      // Faster continuous floating animations for icons
      if (starIconRef.current) {
        gsap.to(starIconRef.current, {
          y: -8,
          rotation: 3,
          duration: 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      if (heartIconRef.current) {
        gsap.to(heartIconRef.current, {
          y: -6,
          rotation: -2,
          duration: 1.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 0.3,
        });
      }

      // Faster animate dots with wave effect
      gsap.to(".testimonial-dot", {
        scale: 1.15,
        opacity: 0.9,
        duration: 1.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: {
          amount: 1.2,
          from: "random",
        },
      });

      gsap.to(".testimonial-bottom-dot", {
        scale: 1.1,
        opacity: 0.95,
        duration: 1.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: {
          amount: 1.5,
          from: "random",
        },
      });

      // Gradient text hover animations for testimonial cards
      gsap.utils.toArray(".testimonial-card").forEach((card: any) => {
        const testimonialText = card.querySelector(".testimonial-text");
        const authorName = card.querySelector(".author-name");

        if (testimonialText && authorName) {
          const hoverTl = gsap.timeline({ paused: true });

          hoverTl.to([testimonialText, authorName], {
            backgroundImage:
              "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary))/0.7 100%)",
            webkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            duration: 0.3,
            ease: "power2.out",
          });

          card.addEventListener("mouseenter", () => hoverTl.play());
          card.addEventListener("mouseleave", () => hoverTl.reverse());
        }
      });
    }, testimonialsRef);

    return () => ctx.revert();
  }, [isLoading]);

  // Auto-play functionality for mobile only
  useEffect(() => {
    if (!carouselApi || !isMobile) return;

    const autoPlay = setInterval(() => {
      carouselApi.scrollNext();
    }, 4000); // Auto-advance every 4 seconds

    return () => clearInterval(autoPlay);
  }, [carouselApi, isMobile]);

  // GSAP Statistics Section Animations
  useEffect(() => {
    if (isLoading || !statisticsSectionRef.current) return;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Set initial states for all animated elements
      gsap.set(
        [
          statsChartIconRef.current,
          statsDownloadIconRef.current,
          statsHeartIconRef.current,
          statsGlobeIconRef.current,
          statsTargetIconRef.current,
          statsPackageIconRef.current,
        ],
        {
          scale: 0,
          rotation: -180,
          opacity: 0,
        }
      );

      // Set initial states for dot grids
      gsap.set(
        [
          statsDotsTopLeftRef.current,
          statsDotsBottomRightRef.current,
          statsDotsTopRightRef.current,
          statsDotsBottomLeftRef.current,
        ],
        {
          opacity: 0,
          scale: 0.5,
        }
      );

      // Set initial states for title and description
      gsap.set([statsTitleRef.current, statsDescriptionRef.current], {
        y: 25,
        opacity: 0,
      });

      // Set initial state for cards container
      gsap.set(statsCardsContainerRef.current, {
        y: 40,
        opacity: 0,
      });

      // Main timeline for statistics section entrance
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: statisticsSectionRef.current,
          start: "top 95%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate title and description first
      mainTl
        .to(
          statsTitleRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power3.out",
          },
          0
        )
        .to(
          statsDescriptionRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power3.out",
          },
          0.1
        );

      // Animate statistics cards with individual staggered entrance
      if (statsCardsContainerRef.current) {
        const cards =
          statsCardsContainerRef.current.querySelectorAll(".statistic-card");

        // Set initial state for individual cards
        gsap.set(cards, {
          opacity: 0,
          scale: 0.9,
        });

        // Animate cards container first
        mainTl
          .to(
            statsCardsContainerRef.current,
            {
              opacity: 1,
              duration: 0.05,
            },
            0.2
          )
          // Then animate individual cards with stagger
          .to(
            cards,
            {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
              stagger: {
                amount: 0.2,
                from: "start",
              },
            },
            0.25
          );
      }

      // Animate floating icons with staggered entrance
      mainTl.to(
        [
          statsChartIconRef.current,
          statsDownloadIconRef.current,
          statsHeartIconRef.current,
          statsGlobeIconRef.current,
          statsTargetIconRef.current,
          statsPackageIconRef.current,
        ],
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.05,
        },
        0.3
      );

      // Animate dot grids with staggered entrance
      mainTl.to(
        [
          statsDotsTopLeftRef.current,
          statsDotsBottomRightRef.current,
          statsDotsTopRightRef.current,
          statsDotsBottomLeftRef.current,
        ],
        {
          opacity: 0.5,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.03,
        },
        0.2
      );

      // Continuous floating animations for icons
      const floatingIcons = [
        { ref: statsChartIconRef.current, y: -7, duration: 1.2, delay: 0 },
        {
          ref: statsDownloadIconRef.current,
          y: -6,
          duration: 1.0,
          delay: 0.1,
        },
        { ref: statsHeartIconRef.current, y: -5, duration: 1.1, delay: 0.2 },
        { ref: statsGlobeIconRef.current, y: -7, duration: 1.3, delay: 0.3 },
        { ref: statsTargetIconRef.current, y: -5, duration: 1.1, delay: 0.4 },
        { ref: statsPackageIconRef.current, y: -6, duration: 1.2, delay: 0.5 },
      ];

      floatingIcons.forEach(({ ref, y, duration, delay }) => {
        if (ref) {
          gsap.to(ref, {
            y: y,
            duration: duration,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: delay,
          });
        }
      });

      // Rotation animations for icons
      const rotatingIcons = [
        { ref: statsChartIconRef.current, rotation: 2, duration: 1.8 },
        { ref: statsGlobeIconRef.current, rotation: -2, duration: 2.0 },
        { ref: statsTargetIconRef.current, rotation: 2, duration: 1.6 },
      ];

      rotatingIcons.forEach(({ ref, rotation, duration }) => {
        if (ref) {
          gsap.to(ref, {
            rotation: rotation,
            duration: duration,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        }
      });

      // Animate individual dots in grids with wave effect
      const animateDotsGrid = (
        gridRef: React.RefObject<SVGSVGElement | null>
      ) => {
        if (!gridRef.current) return;

        const dots = gridRef.current.querySelectorAll("circle");

        gsap.fromTo(
          dots,
          {
            scale: 0.8,
            opacity: 0.4,
          },
          {
            scale: 1.1,
            opacity: 0.7,
            duration: 0.3,
            ease: "power2.out",
            stagger: {
              amount: 0.5,
              grid: "auto",
              from: "random",
            },
            repeat: -1,
            yoyo: true,
            repeatDelay: 1,
          }
        );
      };

      // Apply wave animations to all dot grids
      [
        statsDotsTopLeftRef,
        statsDotsBottomRightRef,
        statsDotsTopRightRef,
        statsDotsBottomLeftRef,
      ].forEach((gridRef) => {
        setTimeout(() => animateDotsGrid(gridRef), Math.random() * 300);
      });

      // Pulse animation for icons on hover
      const icons = [
        statsChartIconRef.current,
        statsDownloadIconRef.current,
        statsHeartIconRef.current,
        statsGlobeIconRef.current,
        statsTargetIconRef.current,
        statsPackageIconRef.current,
      ];

      icons.forEach((icon) => {
        if (icon) {
          const hoverTl = gsap.timeline({ paused: true });
          hoverTl.to(icon, {
            scale: 1.1,
            duration: 0.15,
            ease: "power2.out",
          });

          icon.addEventListener("mouseenter", () => hoverTl.play());
          icon.addEventListener("mouseleave", () => hoverTl.reverse());
        }
      });

      // Add hover animations for statistics cards
      if (statsCardsContainerRef.current) {
        const cards =
          statsCardsContainerRef.current.querySelectorAll(".statistic-card");

        cards.forEach((card) => {
          const cardHoverTl = gsap.timeline({ paused: true });

          cardHoverTl.to(card, {
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            duration: 0.2,
            ease: "power2.out",
          });

          card.addEventListener("mouseenter", () => cardHoverTl.play());
          card.addEventListener("mouseleave", () => cardHoverTl.reverse());
        });
      }
    }, statisticsSectionRef);

    return () => ctx.revert();
  }, [isLoading]);

  // GSAP Features Section Animations - Optimized for Speed and Smoothness
  useEffect(() => {
    if (isLoading || !featuresSectionRef.current) return;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Set initial states for title and description - Reduced movement distances
      gsap.set([featuresTitleRef.current, featuresHighlightRef.current], {
        y: 20, // Reduced from 40px to 20px
        opacity: 0,
      });

      gsap.set(featuresDescriptionRef.current, {
        y: 15, // Reduced from 30px to 15px
        opacity: 0,
      });

      // Set initial state for feature cards - Reduced movement and scale
      if (featuresGridRef.current) {
        const featureCards = featuresGridRef.current.querySelectorAll(".group");
        gsap.set(featureCards, {
          y: 30, // Reduced from 60px to 30px
          opacity: 0,
          scale: 0.95, // Reduced from 0.9 to 0.95 for subtler effect
        });
      }

      // Main timeline for features section entrance - Earlier activation
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: featuresSectionRef.current,
          start: "top 95%", // Changed from "top 80%" to "top 95%" for earlier activation
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate title first with faster, smoother animations - Reduced durations
      mainTl
        .to(
          featuresTitleRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.25, // Reduced from 0.6s to 0.25s (58% faster)
            ease: "back.out(1.7)",
          },
          0
        )
        .to(
          featuresHighlightRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.25, // Reduced from 0.6s to 0.25s (58% faster)
            ease: "back.out(1.7)",
          },
          0.02 // Reduced from 0.05s to 0.02s
        )
        .to(
          featuresDescriptionRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.2, // Reduced from 0.5s to 0.2s (60% faster)
            ease: "power4.out",
          },
          0.1 // Reduced from 0.2s to 0.1s
        );

      // Animate feature cards with staggered entrance - Faster timing
      if (featuresGridRef.current) {
        const featureCards = featuresGridRef.current.querySelectorAll(".group");

        mainTl.to(
          featureCards,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.3, // Reduced from 0.6s to 0.3s (50% faster)
            ease: "back.out(1.7)",
            stagger: {
              amount: 0.15, // Reduced from 0.4s to 0.15s (62% faster)
              from: "start",
            },
          },
          0.2 // Reduced from 0.4s to 0.2s
        );

        // Add hover animations for feature cards - Faster hover effects
        featureCards.forEach((card) => {
          const icon = card.querySelector(".w-14.h-14");
          const overlay = card.querySelector(".absolute.inset-0");

          if (icon && overlay) {
            const hoverTl = gsap.timeline({ paused: true });

            hoverTl
              .to(
                icon,
                {
                  scale: 1.15, // Reduced from 1.2 to 1.15 for subtler effect
                  rotation: 5, // Reduced from 8 to 5 degrees
                  duration: 0.15, // Reduced from 0.3s to 0.15s (50% faster)
                  ease: "back.out(2.5)",
                },
                0
              )
              .to(
                overlay,
                {
                  opacity: 1,
                  duration: 0.15, // Reduced from 0.3s to 0.15s (50% faster)
                  ease: "power3.out",
                },
                0
              );

            card.addEventListener("mouseenter", () => hoverTl.play());
            card.addEventListener("mouseleave", () => hoverTl.reverse());
          }
        });

        // Add continuous floating animation for icons - Faster and smoother
        featureCards.forEach((card, index) => {
          const icon = card.querySelector(".w-14.h-14");
          if (icon) {
            gsap.to(icon, {
              y: -4, // Reduced from -8px to -4px for subtler movement
              duration: 0.8 + index * 0.1, // Reduced from 1.5 + index * 0.2 (47% faster)
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: index * 0.05, // Reduced from index * 0.15 (67% faster)
            });

            // Add subtle rotation animation - Faster cycles
            gsap.to(icon, {
              rotation: 2, // Reduced from 3 to 2 degrees
              duration: 1.2 + index * 0.15, // Reduced from 2.5 + index * 0.3 (52% faster)
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: index * 0.03, // Reduced from index * 0.1 (70% faster)
            });
          }
        });
      }
    }, featuresSectionRef);

    return () => ctx.revert();
  }, [isLoading]);

  // Show loading skeletons while language data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <HeaderSkeleton />
        <HeroSkeleton />
        <TestimonialsSkeleton />
        <StatisticsSkeleton />
        <FeaturesSkeleton />
        <FAQSkeleton />
        <FooterSkeleton />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header
        ref={headerRef}
        className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 h-16 min-h-[4rem] max-h-[4rem]"
      >
        {/* Header particle effects container */}
        <div className="header-particles"></div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-5">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile Menu Button */}
              <button
                ref={mobileButtonRef}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="cursor-pointer md:hidden p-2 hover:bg-muted rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
              <div ref={logoRef}>
                <Link
                  href="/"
                  aria-label={t("header.logo")}
                  className="flex items-center"
                >
                  <div className="relative w-44 sm:w-48 h-12">
                    {/* Light mode logos */}
                    <Image
                      src={
                        language === "ar"
                          ? "/logo-black-ar.png"
                          : "/logo-black-en.png"
                      }
                      alt={t("header.logo")}
                      fill
                      className="block dark:hidden"
                      priority
                    />
                    {/* Dark mode logos */}
                    <Image
                      src={
                        language === "ar"
                          ? "/logo-white-ar.png"
                          : "/logo-white-en.png"
                      }
                      alt={t("header.logo")}
                      fill
                      className="hidden dark:block"
                      priority
                    />
                  </div>
                </Link>
              </div>
            </div>
            {/* Desktop Navigation Links */}
            <nav ref={navRef} className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => handleSmoothScroll("home")}
                className={`hover:bg-primary hover:text-white ${isRTL && "text-base"}`}
              >
                {t("header.navigation.home")}
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
                onClick={() => handleSmoothScroll("testimonials")}
                className={`hover:bg-primary hover:text-white ${isRTL && "text-base"}`}
              >
                {t("header.navigation.testimonials")}
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
            <div ref={controlsRef}>
              <HeaderControls enabled={!isLoading} />
            </div>
          </div>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Mobile Navigation Menu */}
      <aside
        ref={menuRef}
        className={`fixed left-0 top-0 w-72 h-screen bg-background border-r border-border z-50 md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="space-y-6">
            {/* Navigation Links */}
            <div className="space-y-1">
              <div ref={addToRefs}>
                <button
                  onClick={() => handleSmoothScroll("home")}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                >
                  <span className="text-base">
                    {t("header.navigation.home")}
                  </span>
                </button>
              </div>
              <div ref={addToRefs}>
                <button
                  onClick={() => handleSmoothScroll("pricing")}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                >
                  <span className="text-base">
                    {t("header.navigation.pricing")}
                  </span>
                </button>
              </div>
              <div ref={addToRefs}>
                <button
                  onClick={() => handleSmoothScroll("testimonials")}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                >
                  <span className="text-base">
                    {t("header.navigation.testimonials")}
                  </span>
                </button>
              </div>
              <div ref={addToRefs}>
                <button
                  onClick={() => handleSmoothScroll("features")}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                >
                  <span className="text-base">
                    {t("header.navigation.features")}
                  </span>
                </button>
              </div>
              <div ref={addToRefs}>
                <button
                  onClick={() => handleSmoothScroll("faq")}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                >
                  <span className="text-base">
                    {t("header.navigation.faq")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
      {/* Hero Section */}
      <section
        ref={heroSectionRef}
        id="home"
        className="relative min-h-screen bg-gradient-to-br from-primary/20 via-primary/5 to-primary/20 py-12 md:pb-20 md:pt-8 overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-100"></div>
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
                    animationDelay: `${(row + col) * 0.005}s`,
                    opacity: Math.random() * 0.5 + 0.3,
                  }}
                />
              ))
            )}
          </svg>
        </div>
        {/* Shape 2 - Square Grid Pattern (Left Side) */}
        <div
          ref={squareGridRef}
          className="hidden md:block absolute top-1/3 left-4 md:left-8"
        >
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
                    animationDelay: `${(row + col) * 0.004}s`,
                    opacity: Math.random() * 0.5 + 0.25,
                  }}
                />
              ))
            )}
          </svg>
        </div>
        {/* Shape 3 - Diamond Grid Pattern (Bottom Right) */}
        <div
          ref={diamondGridRef}
          className="absolute bottom-20 right-12 md:bottom-32 md:right-20"
        >
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
                    animationDelay: `${(row + col) * 0.007}s`,
                    opacity: Math.random() * 0.4 + 0.4,
                  }}
                />
              ))
            )}
          </svg>
        </div>
        {/* Shape 4 - Top Center Left Dots */}
        <div
          ref={topCenterDotsRef}
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
                    animationDelay: `${(row + col) * 0.01}s`,
                    opacity: Math.random() * 0.5 + 0.4,
                  }}
                />
              ))
            )}
          </svg>
        </div>
        {/* Shape 6 - Top Center Right Small Squares */}
        <div
          ref={topRightSquaresRef}
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
                    animationDelay: `${(row + col) * 0.007}s`,
                    opacity: Math.random() * 0.5 + 0.3,
                  }}
                />
              ))
            )}
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col items-center justify-center min-h-[85vh] sm:min-h-[80vh] text-center space-y-6 sm:space-y-8 lg:space-y-12 py-8 sm:py-0">
            {/* Centered Content */}
            <div className="space-y-4 sm:space-y-6 max-w-4xl px-2 sm:px-0">
              <h1
                ref={titleRef}
                className="text-4xl md:text-4xl 2xl:text-6xl font-bold tracking-tight font-sans leading-tight sm:leading-tight bg-gradient-to-r from-yellow-400 dark:from-yellow-300 via-primary to-amber-600 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]"
              >
                {t("hero.title")}{" "}
                <span ref={titleHighlightRef} className="inline">
                  {t("hero.titleHighlight")}
                </span>
              </h1>
              <p
                ref={descriptionRef}
                className="text-base 2xl:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto px-2 sm:px-0"
              >
                {t("hero.description")}
              </p>
            </div>
            {/* Centered Search Bar */}
            <div
              ref={searchContainerRef}
              className="w-full max-w-5xl px-4 sm:px-0"
            >
              {/* Mobile Layout */}
              <div className="sm:hidden">
                <div className="flex gap-2 w-full">
                  {/* Search Type Dropdown for Mobile - Icon Only */}
                  <div ref={mobileSearchTypeRef} className="flex-shrink-0">
                    <Select value={searchType} onValueChange={setSearchType}>
                      <SelectTrigger className="w-16 !h-12 border-2 border-border focus:border-primary rounded-xl bg-background/80 backdrop-blur-sm transition-fast p-0 flex items-center justify-center">
                        <SelectValue>
                          {searchType === "all" && (
                            <Search className="w-5 h-5" />
                          )}
                          {searchType === "images" && (
                            <ImageIcon className="w-5 h-5" />
                          )}
                          {searchType === "vectors" && (
                            <Palette className="w-5 h-5" />
                          )}
                          {searchType === "videos" && (
                            <Camera className="w-5 h-5" />
                          )}
                          {searchType === "templates" && (
                            <File className="w-5 h-5" />
                          )}
                        </SelectValue>
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
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search Input - Flexible width */}
                  <div
                    ref={mobileSearchInputRef}
                    className="relative flex-1 min-w-0"
                  >
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
                      className={`${isRTL ? "pr-4" : "pl-4"} ${searchQuery ? (isRTL ? "pl-10" : "pr-10") : isRTL ? "pl-4" : "pr-4"} h-12 text-base border-2 ${
                        searchError
                          ? "border-red-500 focus:border-red-500"
                          : "border-border focus:border-primary"
                      } rounded-xl bg-background/80 backdrop-blur-sm w-full ${isSearching ? "opacity-50" : ""} placeholder:text-muted-foreground/70 transition-fast`}
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className={`absolute ${isRTL ? "left-2" : "right-2"} top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-super-fast`}
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Search Button - Icon Only */}
                  <div ref={mobileSearchButtonRef} className="flex-shrink-0">
                    <Button
                      onClick={handleSearch}
                      disabled={isSearching || !searchQuery.trim()}
                      className="w-12 h-12 p-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSearching ? (
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin-fast" />
                      ) : (
                        <Search className="w-5 h-5 stroke-2" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Error Message */}
                {searchError && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {searchError}
                    </p>
                  </div>
                )}
              </div>
              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center gap-5">
                <div className="w-full relative flex items-center">
                  {/* Search Type Dropdown */}
                  <div
                    className={`absolute ${isRTL ? "right-2" : "left-2"} top-1/2 transform -translate-y-1/2 z-10`}
                  >
                    <Select value={searchType} onValueChange={setSearchType}>
                      <SelectTrigger className="w-44 !h-12 2xl:!h-16 border-0 bg-secondary hover:bg-secondary/70 dark:hover:bg-muted/50 focus:ring-0 focus:ring-offset-0 transition-fast">
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
                    className={`${isRTL ? "pr-48" : "pl-48"} ${searchQuery ? (isRTL ? "pl-20" : "pr-20") : isRTL ? "pl-32" : "pr-32"} py-8 h-12 2xl:h-20 text-xl border-2 ${
                      searchError
                        ? "border-red-500 focus:border-red-500"
                        : "border-border focus:border-primary"
                    } rounded-xl bg-background/80 backdrop-blur-sm placeholder:text-base 2xl:placeholder:text-xl ${isRTL && "placeholder:text-base 2xl:placeholder:text-lg"} ${isSearching ? "opacity-50" : ""} placeholder:text-muted-foreground/70 transition-fast`}
                  />

                  {/* Clear Button */}
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className={`cursor-pointer absolute ${
                        isSearching
                          ? isRTL
                            ? "left-44"
                            : "right-44"
                          : isRTL
                            ? "left-32"
                            : "right-36"
                      } top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-super-fast z-10`}
                      type="button"
                    >
                      <X className="w-5 h-5 2xl:w-6 2xl:h-6" />
                    </button>
                  )}

                  {/* Search Button */}
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    className={`absolute ${isRTL ? "left-2" : "right-2"} top-1/2 transform -translate-y-1/2 !px-6 h-12 2xl:!h-16 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL && "text-base"}`}
                  >
                    {isSearching ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin-fast" />
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
              </div>

              {/* Error Display for Desktop */}
              {searchError && (
                <div
                  ref={errorDisplayRef}
                  className="w-full max-w-4xl px-4 sm:px-0"
                >
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 text-center">
                      {searchError}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons - Centered */}
            <div
              ref={ctaButtonsRef}
              className="pt-16 sm:pt-12 flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0 w-full max-w-md sm:max-w-none"
            >
              <Button
                size="lg"
                className="!px-5 2xl:px-8 py-5 2xl:py-7 text-base 2xl:text-lg font-semibold border-2 border-primary min-h-[3.5rem] touch-manipulation w-full sm:w-auto"
                onClick={() => handleSmoothScroll("pricing")}
              >
                <Eye className="size-5" />
                {t("hero.viewPricing")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="!px-5 2xl:px-8 py-5 2xl:py-7 text-base 2xl:text-lg font-semibold border-2 border-border hover:border-primary/50 min-h-[3.5rem] touch-manipulation w-full sm:w-auto"
                onClick={() => handleSmoothScroll("faq")}
              >
                <PhoneCall className="size-5" />
                {t("hero.contactUs")}
              </Button>
            </div>

            {/* Supported Platforms Infinite Scroll - Integrated */}
            <div className="w-full mt-16 sm:mt-12">
              <div className="text-center mb-8 px-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 leading-tight font-sans">
                  {t("supportedPlatforms.title")}{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {t("supportedPlatforms.titleHighlight")}
                  </span>
                </h2>
              </div>

              {/* First Row - All Cards Scrolling Left */}
              <div className="relative overflow-hidden mb-6 w-screen left-1/2 -translate-x-1/2">
                <div
                  className={`flex animate-scroll-left-mobile sm:animate-scroll-left ${isRTL ? "flex-row-reverse" : ""}`}
                  style={
                    {
                      "--card-count": creditSites.length,
                    } as React.CSSProperties
                  }
                >
                  {/* All platforms - complete set */}
                  {creditSites.map((site) => {
                    const iconUrl = getSiteIconUrl(site.id, site.url);
                    return (
                      <div
                        key={`row1-${site.id}`}
                        className="flex-shrink-0 mx-3 bg-background/80 dark:bg-muted/80 backdrop-blur-sm border border-border/50 rounded-xl p-3 sm:p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-lg w-auto sm:w-64 h-32 platform-card"
                      >
                        <div
                          className={`flex items-center gap-3 h-full ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <img
                              src={iconUrl}
                              alt={`${site.name} icon`}
                              width={40}
                              height={40}
                              loading="lazy"
                              className="w-10 h-10 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const fallback = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(site.url)}&sz=128`;
                                if (target.src !== fallback) {
                                  target.src = fallback;
                                }
                              }}
                            />
                          </div>
                          <div className="sm:flex-1 sm:min-w-0">
                            <h3
                              className={`font-semibold text-base text-foreground truncate mb-1 ${isRTL ? "text-right" : "text-left"}`}
                            >
                              {site.name}
                            </h3>
                            <div
                              className={`flex flex-wrap gap-1 ${isRTL ? "justify-start" : "justify-start"}`}
                            >
                              {site.variants.map((variant, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                                >
                                  {isRTL
                                    ? `${variant.points} نقطة - ${variant.label}`
                                    : `${variant.label}: ${variant.points} Credit`}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {/* Duplicate for seamless loop */}
                  {creditSites.map((site) => {
                    const iconUrl = getSiteIconUrl(site.id, site.url);
                    return (
                      <div
                        key={`row1-dup-${site.id}`}
                        className="flex-shrink-0 mx-3 bg-background/80 dark:bg-muted/80 backdrop-blur-sm border border-border/50 rounded-xl p-3 sm:p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-lg w-auto sm:w-64 h-32 platform-card"
                      >
                        <div
                          className={`flex items-center gap-3 h-full ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <img
                              src={iconUrl}
                              alt={`${site.name} icon`}
                              width={40}
                              height={40}
                              loading="lazy"
                              className="w-10 h-10 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const fallback = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(site.url)}&sz=128`;
                                if (target.src !== fallback) {
                                  target.src = fallback;
                                }
                              }}
                            />
                          </div>
                          <div className="sm:flex-1 sm:min-w-0">
                            <h3
                              className={`font-semibold text-base text-foreground truncate mb-1 ${isRTL ? "text-right" : "text-left"}`}
                            >
                              {site.name}
                            </h3>
                            <div
                              className={`flex flex-wrap gap-1 ${isRTL ? "justify-start" : "justify-start"}`}
                            >
                              {site.variants.map((variant, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                                >
                                  {isRTL
                                    ? `${variant.points} نقطة - ${variant.label}`
                                    : `${variant.label}: ${variant.points} Credit`}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Second Row - All Cards Scrolling Right */}
              <div className="relative overflow-hidden w-screen left-1/2 -translate-x-1/2">
                <div
                  className={`flex animate-scroll-right-mobile sm:animate-scroll-right ${isRTL ? "flex-row-reverse" : ""}`}
                  style={
                    {
                      "--card-count": creditSites.length,
                    } as React.CSSProperties
                  }
                >
                  {/* All platforms - complete set in reverse order for visual variety */}
                  {[...creditSites].reverse().map((site) => {
                    const iconUrl = getSiteIconUrl(site.id, site.url);
                    return (
                      <div
                        key={`row2-${site.id}`}
                        className="flex-shrink-0 mx-3 bg-background/80 dark:bg-muted/80 backdrop-blur-sm border border-border/50 rounded-xl p-3 sm:p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-lg w-auto sm:w-64 h-32 platform-card"
                      >
                        <div
                          className={`flex items-center gap-3 h-full ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <img
                              src={iconUrl}
                              alt={`${site.name} icon`}
                              width={40}
                              height={40}
                              loading="lazy"
                              className="w-10 h-10 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const fallback = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(site.url)}&sz=128`;
                                if (target.src !== fallback) {
                                  target.src = fallback;
                                }
                              }}
                            />
                          </div>
                          <div className="sm:flex-1 sm:min-w-0">
                            <h3
                              className={`font-semibold text-base text-foreground truncate mb-1 ${isRTL ? "text-right" : "text-left"}`}
                            >
                              {site.name}
                            </h3>
                            <div
                              className={`flex flex-wrap gap-1 ${isRTL ? "justify-start" : "justify-start"}`}
                            >
                              {site.variants.map((variant, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                                >
                                  {isRTL
                                    ? `${variant.points} نقطة - ${variant.label}`
                                    : `${variant.label}: ${variant.points} Credit`}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {/* Duplicate for seamless loop */}
                  {[...creditSites].reverse().map((site) => {
                    const iconUrl = getSiteIconUrl(site.id, site.url);
                    return (
                      <div
                        key={`row2-dup-${site.id}`}
                        className="flex-shrink-0 mx-3 bg-background/80 dark:bg-muted/80 backdrop-blur-sm border border-border/50 rounded-xl p-3 sm:p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-lg w-auto sm:w-64 h-32 platform-card"
                      >
                        <div
                          className={`flex items-center gap-3 h-full ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <img
                              src={iconUrl}
                              alt={`${site.name} icon`}
                              width={40}
                              height={40}
                              loading="lazy"
                              className="w-10 h-10 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const fallback = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(site.url)}&sz=128`;
                                if (target.src !== fallback) {
                                  target.src = fallback;
                                }
                              }}
                            />
                          </div>
                          <div className="sm:flex-1 sm:min-w-0">
                            <h3
                              className={`font-semibold text-base text-foreground truncate mb-1 ${isRTL ? "text-right" : "text-left"}`}
                            >
                              {site.name}
                            </h3>
                            <div
                              className={`flex flex-wrap gap-1 ${isRTL ? "justify-start" : "justify-start"}`}
                            >
                              {site.variants.map((variant, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                                >
                                  {isRTL
                                    ? `${variant.points} نقطة - ${variant.label}`
                                    : `${variant.label}: ${variant.points} Credit`}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Verification Sheet */}
        <DownloadVerificationSheet
          isOpen={isDownloadSheetOpen}
          onClose={() => setIsDownloadSheetOpen(false)}
          downloadUrl={downloadUrl}
        />
      </section>
      {/* Pricing Section */}
      <section
        ref={pricingAnimations.sectionRef}
        id="pricing"
        className="py-16 bg-gradient-to-br from-secondary/10 via-secondary/20 to-secondary/10 relative overflow-hidden"
      >
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top Left Dots Grid */}
          <svg
            className={`absolute top-16 ${isRTL ? "right-8" : "left-8"} w-36 h-28 opacity-20`}
            viewBox="0 0 160 120"
            fill="none"
          >
            {Array.from({ length: 6 }, (_, row) =>
              Array.from({ length: 8 }, (_, col) => (
                <circle
                  key={`pricing-dots-${row}-${col}`}
                  cx={12 + col * 18}
                  cy={12 + row * 18}
                  r="2.5"
                  fill="currentColor"
                  className="text-primary animate-pulse"
                  style={{
                    animationDelay: `${(row + col) * 0.05}s`,
                    animationDuration: "1.5s",
                  }}
                />
              ))
            )}
          </svg>

          {/* Top Right Floating Credit Icon */}
          <div
            className={`hidden lg:block absolute top-24 ${isRTL ? "left-16" : "right-16"} animate-float`}
          >
            <div className="w-14 h-14 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center">
              <Coins className="w-7 h-7 text-primary" />
            </div>
          </div>

          {/* Bottom Left Crown Icon */}
          <div
            className={`hidden md:block absolute bottom-32 ${isRTL ? "right-12" : "left-12"} animate-bounce-slow`}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="w-13 h-13 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* Bottom Right Dots Grid */}
          <svg
            className={`absolute bottom-16 ${isRTL ? "left-12" : "right-12"} w-32 h-24 opacity-15`}
            viewBox="0 0 140 100"
            fill="none"
          >
            {Array.from({ length: 5 }, (_, row) =>
              Array.from({ length: 7 }, (_, col) => (
                <circle
                  key={`pricing-bottom-dots-${row}-${col}`}
                  cx={10 + col * 18}
                  cy={10 + row * 16}
                  r="2"
                  fill="currentColor"
                  className="text-primary animate-pulse"
                  style={{
                    animationDelay: `${(row + col) * 0.08}s`,
                    animationDuration: "2s",
                  }}
                />
              ))
            )}
          </svg>

          {/* Bottom Center Zap Icon */}
          <div
            className={`hidden lg:block absolute bottom-24 left-1/2 -translate-x-1/2 animate-float`}
            style={{ animationDelay: "0.3s" }}
          >
            <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="px-5 relative z-10">
          <div className="text-center mb-12">
            <h2
              ref={pricingAnimations.titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                {t("pricing.title")}
              </span>{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                {t("pricing.titleHighlight")}
              </span>
            </h2>
            <p
              ref={pricingAnimations.descriptionRef}
              className={`text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed ${isRTL && "font-medium"}`}
            >
              {t("pricing.description")}
            </p>
          </div>
          {/* Loading State */}
          {isLoadingPricing ? (
            <div
              ref={pricingAnimations.cardsContainerRef}
              className="grid mx-auto max-w-[1700px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5"
            >
              {[...Array(4)].map((_, index) => (
                <div
                  key={`pricing-skeleton-${index}`}
                  data-skeleton
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
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-4 bg-muted rounded animate-pulse"
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="h-12 bg-muted rounded-xl animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : pricingError ? (
            <div data-error className="text-center py-12">
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
            <div className="grid mx-auto max-w-[1700px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-5">
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

                return (
                  <div
                    key={plan.id || index}
                    ref={(el) => pricingAnimations.setCardRef(el, index)}
                    className={`relative group border transition-all hover:shadow-2xl duration-500 ${
                      plan.recommended
                        ? "bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-primary/20 border-primary/30 dark:border-primary/20 shadow-2xl shadow-primary/20 dark:shadow-primary/30 ring-2 ring-primary/20 ring-offset-2 ring-offset-background transform hover:scale-[1.05] hover:shadow-3xl hover:shadow-primary/30 dark:hover:shadow-primary/40"
                        : "bg-gradient-to-br from-secondary/20 dark:from-secondary via-accent/20 to-muted border-border text-foreground shadow-xl shadow-foreground/10"
                    } rounded-2xl p-6.5`}
                  >
                    <div className="pricing-card-content relative z-10 flex flex-col h-full space-y-6">
                      {/* Plan Header */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3
                              className={`text-2xl font-bold transition-colors duration-200 ${
                                plan.recommended
                                  ? "text-primary dark:text-primary"
                                  : "text-foreground group-hover:text-primary"
                              }`}
                            >
                              {plan.name}
                            </h3>
                            {plan.recommended && (
                              <span
                                className={`bg-primary/50 text-primary-foreground px-2 py-0.5 rounded-full text-xs font-medium ${isRTL ? "text-sm" : ""}`}
                              >
                                {t("pricing.mostPopular")}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm ${
                              plan.recommended
                                ? "text-foreground/70 dark:text-foreground/60"
                                : "text-muted-foreground"
                            } ${isRTL && "!text-lg"}`}
                          >
                            {plan.description}
                          </p>
                        </div>
                      </div>
                      {/* Plan Features */}
                      <div className="space-y-4 flex-1">
                        <div className="space-y-3">
                          <div
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              plan.recommended
                                ? "bg-primary/5 dark:bg-primary-foreground/5 border border-primary/20 dark:border-primary-foreground/20"
                                : "bg-muted-foreground/5 border border-foreground/10"
                            }`}
                          >
                            <span
                              className={`text-base ${
                                plan.recommended
                                  ? "text-primary/80 dark:text-primary-foreground/80"
                                  : "text-muted-foreground"
                              } ${isRTL && "!text-lg"}`}
                            >
                              {t("pricing.labels.credits")}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Coins
                                className={`w-5 h-5 ${
                                  plan.recommended
                                    ? "text-primary dark:text-primary-foreground"
                                    : "text-primary"
                                }`}
                              />
                              <span
                                className={`text-lg font-semibold ${
                                  plan.recommended
                                    ? "text-primary dark:text-primary-foreground"
                                    : "text-foreground"
                                } ${isRTL && "!text-lg"}`}
                              >
                                {plan.credits.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              plan.recommended
                                ? "bg-primary/5 dark:bg-primary-foreground/5 border border-primary/20 dark:border-primary-foreground/20"
                                : "bg-muted-foreground/5 border border-foreground/10"
                            }`}
                          >
                            <span
                              className={`text-base ${
                                plan.recommended
                                  ? "text-primary/80 dark:text-primary-foreground/80"
                                  : "text-muted-foreground"
                              } ${isRTL && "!text-lg"}`}
                            >
                              {t("pricing.labels.validity")}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Timer
                                className={`w-5 h-5 ${
                                  plan.recommended
                                    ? "text-primary dark:text-primary-foreground"
                                    : "text-primary"
                                }`}
                              />
                              <span
                                className={`text-lg font-semibold ${
                                  plan.recommended
                                    ? "text-primary dark:text-primary-foreground"
                                    : "text-foreground"
                                } ${isRTL && "!text-lg"}`}
                              >
                                {plan.daysValidity} {t("pricing.labels.days")}
                              </span>
                            </div>
                          </div>
                          {planSupportedSites.length > 0 && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <div
                                  className={`flex items-center justify-between cursor-pointer p-3 rounded-lg transition-colors ${
                                    plan.recommended
                                      ? "bg-primary/5 dark:bg-primary-foreground/5 border border-primary/20 dark:border-primary-foreground/20 hover:bg-primary/15 dark:hover:bg-primary-foreground/15"
                                      : "bg-muted-foreground/5 border border-foreground/10 hover:bg-foreground/10"
                                  }`}
                                >
                                  <span
                                    className={`text-base ${
                                      plan.recommended
                                        ? "text-primary/80 dark:text-primary-foreground/80"
                                        : "text-muted-foreground"
                                    } ${isRTL && "!text-lg"}`}
                                  >
                                    {t("pricing.labels.supportedSites")}
                                  </span>
                                  <div className="flex items-center space-x-1">
                                    <Globe
                                      className={`w-5 h-5 ${
                                        plan.recommended
                                          ? "text-primary dark:text-primary-foreground"
                                          : "text-primary"
                                      }`}
                                    />
                                    <span
                                      className={`text-lg font-semibold ${
                                        plan.recommended
                                          ? "text-primary dark:text-primary-foreground"
                                          : "text-foreground"
                                      } ${isRTL && "!text-lg"}`}
                                    >
                                      {planSupportedSites.length}
                                    </span>
                                  </div>
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
                                      className="flex flex-col items-center p-4 rounded-lg bg-muted-foreground/5 dark:bg-muted/30 hover:bg-muted/50 transition-colors"
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
                          {/* Always-visible quick preview of supported sites for better discoverability */}
                          {planSupportedSites.length > 0 && (
                            <div className="mt-4">
                              <div className="grid grid-cols-3 gap-2">
                                {planSupportedSites.slice(0, 3).map((site) => (
                                  <div
                                    key={`preview-${site.id}`}
                                    className={`flex items-center justify-center gap-2 ${plan.recommended ? "bg-primary/10 border-primary/20" : "bg-muted-foreground/5 dark:bg-foreground/5"} border border-foreground/10 rounded-md p-2 overflow-hidden`}
                                    title={site.name}
                                  >
                                    <img
                                      src={site.icon}
                                      alt={`${site.name} icon`}
                                      width={48}
                                      height={48}
                                      className="w-12 h-12 rounded object-contain"
                                      onError={(e) => {
                                        e.currentTarget.src =
                                          "https://via.placeholder.com/48x48/6366f1/ffffff?text=" +
                                          site.name.charAt(0);
                                      }}
                                    />
                                  </div>
                                ))}
                                {planSupportedSites.length > 5 && (
                                  <div className="col-span-2 flex items-center justify-center bg-muted-foreground/5 dark:bg-foreground/5 border border-foreground/10 rounded-md p-2 text-xs text-muted-foreground">
                                    {isRTL
                                      ? `+${planSupportedSites.length - 5} المزيد`
                                      : `+${planSupportedSites.length - 5} more`}
                                  </div>
                                )}
                              </div>
                              {/* Helper text to guide users to open the full list */}
                              <p
                                className={`mt-4 text-[12px] ${plan.recommended ? "text-foreground/70 dark:text-foreground/60" : "text-muted-foreground"} ${isRTL && "!text-sm"}`}
                              >
                                {isRTL
                                  ? 'انقر على "المواقع المدعومة" أعلاه لعرض المواقع.'
                                  : 'Click on "Supported Sites" above to view websites.'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* CTA Button - Enhanced styling for recommended cards */}
                      <div className="mt-auto">
                        <Button
                          variant={plan.recommended ? "default" : "outline"}
                          className={`w-full ${plan.recommended ? "" : "bg-muted-foreground/5 dark:bg-foreground/5 border border-foreground/10"} ${isRTL ? "text-base font-medium" : ""}`}
                          onClick={() => {
                            const slug = (plan.name || "")
                              .toLowerCase()
                              .trim()
                              .replace(/\s+/g, "-");
                            const target =
                              plan.id != null ? String(plan.id) : slug;
                            window.location.href = `/plans/${encodeURIComponent(target)}`;
                          }}
                        >
                          <span className={isRTL ? "text-base" : ""}>
                            {t("pricing.showPlanDetails")}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Additional Info */}
          <div
            ref={pricingAnimations.additionalInfoRef}
            className="pt-14 text-center"
          >
            <p
              className={`text-base text-muted-foreground mb-4 ${isRTL && "!text-lg"}`}
            >
              {t("pricing.features.main")}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className={`text-base ${isRTL && "text-base"}`}>
                  {t("pricing.features.moneyBack")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                <span className={`text-base ${isRTL && "text-base"}`}>
                  {t("pricing.features.cancelAnytime")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className={`text-base ${isRTL && "text-base"}`}>
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
        <section
          ref={testimonialsAnimRef}
          id="testimonials"
          className="py-16 bg-gradient-to-br from-secondary via-secondary/50 to-secondary relative overflow-hidden"
        >
          {/* Floating Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Top Left Dots Grid */}
            <svg
              ref={dotsGridTopAnimRef}
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
                    className="text-primary testimonial-dot"
                  />
                ))
              )}
            </svg>

            {/* Top Right Star Icon */}
            <div
              ref={starIconAnimRef}
              className={`hidden lg:block absolute top-32 ${isRTL ? "left-20" : "right-20"}`}
            >
              <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* Bottom Left Heart Icon */}
            <div
              ref={heartIconAnimRef}
              className={`hidden md:block absolute bottom-32 ${isRTL ? "right-16" : "left-16"}`}
            >
              <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Bottom Right Dots Grid */}
            <svg
              ref={dotsGridBottomAnimRef}
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
                    className="text-primary testimonial-bottom-dot"
                  />
                ))
              )}
            </svg>
          </div>

          <div className="container mx-auto max-w-[1600px] px-5 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-8">
              <h2
                ref={testimonialsTitleAnimRef}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight font-sans"
              >
                <span className="inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {t("testimonials.title")}
                </span>{" "}
                <span
                  ref={testimonialsHighlightAnimRef}
                  className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                >
                  {t("testimonials.titleHighlight")}
                </span>
              </h2>
              <p
                ref={testimonialsDescAnimRef}
                className={`text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed ${isRTL && "font-medium"}`}
              >
                {t("testimonials.description")}
              </p>
            </div>

            {/* Testimonials Carousel */}
            <div
              ref={carouselContainerAnimRef}
              className="relative max-w-[1400px] mx-auto py-2"
            >
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
                      <div className="testimonial-card bg-card dark:bg-secondary border border-border rounded-2xl p-4 lg:p-6 transition-all duration-150 hover:shadow-sm hover:border-primary/50 h-full will-change-transform">
                        {/* Author Info at Top */}
                        <div
                          className={`flex items-center justify-between mb-4`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="author-name font-semibold text-foreground text-sm transition-all duration-150">
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
                          className={`testimonial-text text-muted-foreground leading-relaxed text-sm sm:text-base transition-all duration-150 ${isRTL && "font-medium"}`}
                        >
                          <q> {testimonial.content} </q>
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation Buttons - Hidden on mobile, visible on sm+ */}
                <CarouselPrevious
                  className={`hidden sm:flex ${isRTL ? "!-right-14 !left-auto" : "!-left-14 !right-auto"} bg-background border-border hover:bg-muted hover:border-primary/50 transition-colors duration-150 will-change-transform`}
                />
                <CarouselNext
                  className={`hidden sm:flex ${isRTL ? "!-left-14 !right-auto" : "!-right-14 !left-auto"} bg-background border-border hover:bg-muted hover:border-primary/50 transition-colors duration-150 will-change-transform`}
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
                    className={`w-2 h-2 rounded-full transition-all duration-150 ${
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
          <section
            ref={statisticsSectionRef}
            className="py-16 lg:pt-20 lg:pb-4 relative overflow-hidden"
          >
            {/* Floating Background Elements */}
            <div
              ref={statsFloatingElementsRef}
              className="absolute inset-0 overflow-hidden pointer-events-none"
            >
              {/* Top Left Dots Grid */}
              <svg
                ref={statsDotsTopLeftRef}
                className={`hidden md:block absolute top-16 ${isRTL ? "right-8" : "left-8"} w-28 h-20`}
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
                      className="text-primary"
                    />
                  ))
                )}
              </svg>

              {/* Top Right Chart Icon */}
              <div
                ref={statsChartIconRef}
                className={`hidden lg:block absolute top-24 ${isRTL ? "left-16" : "right-16"}`}
              >
                <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Top Center Download Icon */}
              <div
                ref={statsDownloadIconRef}
                className={`hidden xl:block absolute top-4 left-1/2 transform -translate-x-1/2`}
              >
                <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Middle Left Heart Icon */}
              <div
                ref={statsHeartIconRef}
                className={`hidden lg:block absolute top-1/2 ${isRTL ? "right-4" : "left-4"} transform -translate-y-1/2`}
              >
                <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
              </div>

              {/* Middle Right Globe Icon */}
              <div
                ref={statsGlobeIconRef}
                className={`hidden lg:block absolute top-1/2 ${isRTL ? "left-4" : "right-4"} transform -translate-y-1/2`}
              >
                <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
              </div>

              {/* Bottom Left Target Icon */}
              <div
                ref={statsTargetIconRef}
                className={`hidden md:block absolute bottom-24 ${isRTL ? "right-12" : "left-12"}`}
              >
                <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Bottom Center Package Icon */}
              <div
                ref={statsPackageIconRef}
                className={`hidden xl:block absolute bottom-8 left-1/2 transform -translate-x-1/2`}
              >
                <div className="w-9 h-9 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-primary" />
                </div>
              </div>

              {/* Bottom Right Dots Grid */}
              <svg
                ref={statsDotsBottomRightRef}
                className={`hidden md:block absolute bottom-16 ${isRTL ? "left-20" : "right-20"} w-32 h-24`}
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
                      className="text-primary"
                    />
                  ))
                )}
              </svg>

              {/* Additional Decorative Dots - Top Right Corner */}
              <svg
                ref={statsDotsTopRightRef}
                className={`hidden md:block absolute top-8 ${isRTL ? "left-32" : "right-32"} w-20 h-16`}
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
                      className="text-primary"
                    />
                  ))
                )}
              </svg>

              {/* Additional Decorative Dots - Bottom Left Corner */}
              <svg
                ref={statsDotsBottomLeftRef}
                className={`hidden md:block absolute bottom-8 ${isRTL ? "right-32" : "left-32"} w-24 h-18`}
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
                      className="text-primary"
                    />
                  ))
                )}
              </svg>
            </div>

            <div className="container mx-auto max-w-[1400px] px-5 relative z-10">
              {/* Section Header */}
              <div className="text-center">
                <h2
                  ref={statsTitleRef}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight font-sans"
                >
                  {t("statistics.title")}{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {t("statistics.titleHighlight")}
                  </span>
                </h2>
                <p
                  ref={statsDescriptionRef}
                  className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto px-2 sm:px-0"
                >
                  {t("statistics.description")}
                </p>
              </div>

              {/* Statistics Grid */}
              <div
                ref={statsCardsContainerRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pb-32"
              >
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
                      delay={index * 200}
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
          ref={featuresSectionRef}
          id="features"
          className="py-16 lg:py-20 bg-gradient-to-br from-secondary via-secondary/50 to-secondary relative overflow-hidden"
        >
          {/* Floating Circles Background Animation - Optimized */}
          <FloatingDotsAnimation
            className="absolute inset-0 z-0"
            dotCount={80} // Reduced from 120 to 80 for better performance
            dotSize={3} // Reduced from 4 to 3 for lighter rendering
            animationDuration={8} // Reduced from 15 to 8 for faster cycles
          />
          <div className="container mx-auto max-w-7xl px-5 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12 lg:mb-16">
              <h2
                ref={featuresTitleRef}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight font-sans"
              >
                {t("features.title")}{" "}
                <span
                  ref={featuresHighlightRef}
                  className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                >
                  {t("features.titleHighlight")}
                </span>
              </h2>
              <p
                ref={featuresDescriptionRef}
                className={`text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed ${isRTL && "font-medium"}`}
              >
                {t("features.description")}
              </p>
            </div>
            {/* Features Grid */}
            <div
              ref={featuresGridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {/* Feature 1 - High Quality Resources */}
              <div className="group bg-card border border-border rounded-2xl p-6 lg:p-8 transition-all duration-200 hover:border-primary/30 relative overflow-hidden">
                {/* Hover effect overlay - diagonal sweep - Optimized */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl transform translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-primary/10 border border-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-100">
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
    </main>
  );
}
