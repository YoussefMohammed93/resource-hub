"use client";

import Footer from "@/components/footer";
import { HeaderControls } from "@/components/header-controls";
import { useLanguage } from "@/components/i18n-provider";
import { useTranslation } from "react-i18next";
import {
  Menu,
  Star,
  ArrowLeft,
  ArrowRight,
  Clock,
  Shield,
  Users,
  CheckCircle,
  Download,
  Sparkles,
  ImageIcon,
  Globe,
  Zap,
  Crown,
  Timer,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, use } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Counter } from "@/components/ui/counter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

interface ServicePageProps {
  params: Promise<{
    serviceId: string;
  }>;
}

// Service Page Skeleton Components
function ServicePageHeaderSkeleton({ isRTL }: { isRTL: boolean }) {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-5">
        <div className="flex items-center justify-between h-16">
          <div
            className={`flex items-center gap-1 sm:gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Skeleton className="w-8 h-8 rounded-lg lg:hidden" />
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
            </div>
            <Skeleton className="w-32 h-6" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
        </div>
      </div>
    </header>
  );
}

function ServicePageMainSkeleton({ isRTL }: { isRTL: boolean }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary/20 via-primary/5 to-primary/20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-100"></div>

      <main className="container mx-auto max-w-7xl px-4 sm:px-5 py-8 lg:py-12 relative z-10">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6">
          <div
            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-1" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Back Button Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-9 w-24" />
        </div>

        {/* Service Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Service Image Skeleton */}
          <div className="relative">
            <Card className="overflow-hidden py-0 shadow-xs">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <Skeleton className="w-full h-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Info Skeleton */}
          <div className="space-y-6">
            <div>
              {/* Sales Time Badge Skeleton */}
              <div className="mb-4">
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>

              {/* Title Skeleton */}
              <Skeleton className="h-10 w-3/4 mb-4" />

              {/* Rating and Reviews Skeleton */}
              <div
                className={`flex items-center gap-4 mb-6 ${isRTL ? "flex-row" : ""}`}
              >
                <div
                  className={`flex items-center gap-1 ${isRTL ? "flex-row" : ""}`}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <Skeleton key={i} className="w-5 h-5 rounded-sm" />
                  ))}
                </div>
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Pricing Skeleton */}
              <div className="mb-6 p-4 bg-background shadow-xs border dark:bg-muted/50 rounded-lg">
                <div
                  className={`flex items-baseline gap-2 mb-2 ${isRTL ? "flex-row" : ""}`}
                >
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div
                  className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>

              {/* Subscription Period Skeleton */}
              <div className="space-y-4 mb-6">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Quantity Skeleton */}
              <div className="space-y-4 mb-6">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-32 rounded-md" />
              </div>

              {/* Action Buttons Skeleton */}
              <div
                className={`flex flex-col sm:flex-row gap-4 ${isRTL ? "sm:flex-row-reverse" : ""}`}
              >
                <Skeleton className="h-12 flex-1 rounded-md" />
                <Skeleton className="h-12 flex-1 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Sections Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Specifications Skeleton */}
          <Card className="shadow-xs dark:bg-muted/50">
            <CardHeader>
              <div
                className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""}`}
              >
                <Skeleton className="w-12 h-12 rounded-xl" />
                <Skeleton className="h-6 w-32" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 ${isRTL ? "flex-row" : ""}`}
                    >
                      <Skeleton className="w-4 h-4 rounded-sm mt-0.5 flex-shrink-0" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Skeleton className="h-5 w-28 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div>
                <Skeleton className="h-5 w-20 mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>

          {/* Customer Reviews Skeleton */}
          <Card className="shadow-xs dark:bg-muted/50">
            <CardHeader>
              <div
                className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""}`}
              >
                <Skeleton className="w-12 h-12 rounded-xl" />
                <Skeleton className="h-6 w-32" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <Skeleton className="h-12 w-16 mx-auto mb-2" />
                <div
                  className={`flex items-center justify-center gap-1 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <Skeleton key={i} className="w-4 h-4 rounded-sm" />
                  ))}
                </div>
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 2 }, (_, i) => (
                  <div
                    key={i}
                    className={`border-primary/20 ${isRTL ? "border-r-4 pr-4" : "border-l-4 pl-4"}`}
                  >
                    <div
                      className={`flex items-center gap-2 mb-1 ${isRTL ? "flex-row" : ""}`}
                    >
                      <div
                        className={`flex items-center gap-1 ${isRTL ? "flex-row" : ""}`}
                      >
                        {Array.from({ length: 5 }, (_, j) => (
                          <Skeleton key={j} className="w-3 h-3 rounded-sm" />
                        ))}
                      </div>
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function ServicePageFooterSkeleton() {
  return (
    <footer className="bg-foreground dark:bg-muted py-12 lg:py-16">
      <div className="container mx-auto max-w-7xl px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-32 bg-muted-foreground/20" />
              <div className="space-y-2">
                {Array.from({ length: 4 }, (_, j) => (
                  <Skeleton
                    key={j}
                    className="h-4 w-24 bg-muted-foreground/20"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center">
          <Skeleton className="h-4 w-64 mx-auto bg-muted-foreground/20" />
        </div>
      </div>
    </footer>
  );
}

function ServicePageSkeleton() {
  const isRTL = false; // Default to false for skeleton, will be handled by actual component

  return (
    <div
      className={`min-h-screen bg-background font-sans ${isRTL ? "font-tajawal" : ""}`}
    >
      <ServicePageHeaderSkeleton isRTL={isRTL} />
      <ServicePageMainSkeleton isRTL={isRTL} />
      <ServicePageFooterSkeleton />
    </div>
  );
}

export default function ServicePage({ params }: ServicePageProps) {
  const { t } = useTranslation("common");
  const { isRTL, isLoading } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [subscriptionPeriod, setSubscriptionPeriod] = useState("1year");

  // Unwrap params using React.use()
  const resolvedParams = use(params);

  // Show loading skeletons while language data is loading
  if (isLoading) {
    return <ServicePageSkeleton />;
  }

  // Get service data from translations
  const serviceData = t(`services.items.${resolvedParams.serviceId}`, {
    returnObjects: true,
  }) as {
    title: string;
    description: string;
    price: string;
    rating: string;
    salesTime: string;
    totalReviews: string;
    features: string[];
    compatibility: string;
    support: string;
  };

  // Calculate pricing based on subscription period
  const basePrice = parseFloat(serviceData.price);
  const yearlyPrice = basePrice * 12;
  const twoYearPrice = yearlyPrice * 2;
  const twoYearDiscountedPrice = twoYearPrice * 0.85; // 15% discount for 2 years

  const currentPrice =
    subscriptionPeriod === "2years" ? twoYearDiscountedPrice : yearlyPrice;
  const originalPrice =
    subscriptionPeriod === "2years" ? twoYearPrice : yearlyPrice;
  const savings =
    subscriptionPeriod === "2years" ? twoYearPrice - twoYearDiscountedPrice : 0;

  // If service doesn't exist, show 404-like message
  if (!serviceData || typeof serviceData !== "object") {
    return (
      <div
        className={`min-h-screen bg-background font-sans ${isRTL ? "font-tajawal" : ""}`}
      >
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-5">
            <div className="flex items-center justify-between h-16">
              <div
                className={`flex items-center gap-1 sm:gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="cursor-pointer lg:hidden p-2 hover:bg-muted rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                  aria-label={t("search.toggleFilters")}
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
              <HeaderControls />
            </div>
          </div>
        </header>

        {/* 404 Content with Background */}
        <div className="relative min-h-screen bg-gradient-to-br from-primary/20 via-primary/5 to-primary/20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-100"></div>

          {/* Floating Decorative Elements for 404 */}
          <div className="hidden md:block absolute top-20 left-1/4 animate-float">
            <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="hidden sm:block absolute bottom-32 right-1/4 animate-float-delayed">
            <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
          </div>

          <div className="container mx-auto max-w-7xl px-4 sm:px-5 py-16 text-center relative z-10">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Service Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The service you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link href="/services">
              <Button>Back to Services</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-background font-sans ${isRTL ? "font-tajawal" : ""}`}
    >
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-5">
          <div className="flex items-center justify-between h-16">
            <div
              className={`flex items-center gap-1 sm:gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="cursor-pointer lg:hidden p-2 hover:bg-muted rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label={t("search.toggleFilters")}
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
            <HeaderControls />
          </div>
        </div>
      </header>

      {/* Main Content with Background */}
      <div className="relative min-h-screen bg-gradient-to-br from-primary/20 via-primary/5 to-primary/20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-100"></div>

        {/* Floating Decorative Elements */}
        {/* Shape 1 - Grid Dots Pattern (Top Left) */}
        <div
          className={`absolute top-20 ${isRTL ? "right-5/12" : "left-5/12"} transform -translate-x-1/2 md:top-32`}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            className="text-primary/30"
          >
            {Array.from({ length: 6 }, (_, row) =>
              Array.from({ length: 6 }, (_, col) => (
                <circle
                  key={`dot-${row}-${col}`}
                  cx={10 + col * 18}
                  cy={10 + row * 18}
                  r="2"
                  fill="currentColor"
                  className="animate-pulse-slow"
                  style={{
                    animationDelay: `${(row + col) * 0.1}s`,
                    opacity: Math.random() * 0.6 + 0.3,
                  }}
                />
              ))
            )}
          </svg>
        </div>

        {/* Shape 2 - Diamond Grid Pattern (Bottom Right) */}
        <div className="absolute bottom-20 right-12 md:bottom-32 md:right-20">
          <svg
            width="90"
            height="90"
            viewBox="0 0 90 90"
            fill="none"
            className="text-primary/45"
          >
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

        {/* Floating Icon 1 - Top Right */}
        <div
          className={`hidden md:block absolute top-8 ${isRTL ? "left-1/3 md:left-2/12" : "right-1/3 md:right-2/5"} md:top-12`}
        >
          <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-float">
            <Shield className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Floating Icon 2 - Top Left */}
        <div className="hidden sm:block absolute top-32 left-20 animate-float-delayed">
          <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Floating Icon 3 - Middle Right */}
        <div className="hidden md:block absolute top-64 right-32 animate-float">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Floating Icon 4 - Bottom Left */}
        <div className="hidden sm:block absolute bottom-40 left-32 animate-float-delayed">
          <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Floating Icon 5 - Middle Left */}
        <div className="hidden md:block absolute top-1/2 left-16 transform -translate-y-1/2 animate-float-delayed">
          <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Floating Icon 6 - Bottom Center */}
        <div className="hidden lg:block absolute bottom-32 left-1/3 animate-float">
          <div className="w-9 h-9 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Floating Icon 7 - Top Right Corner */}
        <div className="hidden md:block absolute top-40 right-16 animate-float-delayed">
          <div className="w-11 h-11 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Floating Icon 8 - Bottom Right */}
        <div className="hidden sm:block absolute bottom-20 right-1/4 animate-float">
          <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Floating Icon 9 - Middle Center */}
        <div className="hidden lg:block absolute top-1/3 right-1/3 animate-float-delayed">
          <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
            <Timer className="w-5 h-5 text-primary" />
          </div>
        </div>

        <main className="container mx-auto max-w-7xl px-4 sm:px-5 py-8 lg:py-12 relative z-10">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList className={isRTL ? "flex-row-reverse" : ""}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">{t("services.breadcrumb.home")}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className={isRTL ? "rotate-180" : ""} />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/services">
                      {t("services.breadcrumb.services")}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className={isRTL ? "rotate-180" : ""} />
                <BreadcrumbItem>
                  <BreadcrumbPage>{serviceData.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Back Button */}
          <div className="mb-8">
            <Link href="/services">
              <Button
                variant="ghost"
                className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                {isRTL ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <ArrowLeft className="w-4 h-4" />
                )}
                {t("common.back")}
              </Button>
            </Link>
          </div>

          {/* Service Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Service Image */}
            <div className="relative">
              <Card className="overflow-hidden py-0 shadow-xs">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src="/office.webp"
                      alt={serviceData.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Info */}
            <div className="space-y-6">
              <div>
                {/* Sales Time Badge */}
                <div className="mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {serviceData.salesTime}
                  </Badge>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {serviceData.title}
                </h1>

                {/* Rating and Reviews */}
                <div
                  className={`flex items-center gap-4 mb-6 ${isRTL ? "flex-row" : ""}`}
                >
                  <div
                    className={`flex items-center gap-1 ${isRTL ? "flex-row" : ""}`}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(parseFloat(serviceData.rating))
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {serviceData.rating} ({serviceData.totalReviews}{" "}
                    {t("services.details.reviews.totalReviews")})
                  </span>
                </div>

                {/* Pricing */}
                <div className="mb-6 p-4 bg-background shadow-xs border dark:bg-muted/50 rounded-lg">
                  <div
                    className={`flex items-baseline gap-2 mb-2 ${isRTL ? "flex-row" : ""}`}
                  >
                    <span className="text-3xl font-bold text-primary">
                      {isRTL ? "ج.م" : "$"}
                      {currentPrice.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">
                      {t("services.details.pricing.perYear")}
                    </span>
                  </div>
                  {savings > 0 && (
                    <div
                      className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <span className="text-sm text-muted-foreground line-through">
                        {isRTL ? "ر.س" : "$"}
                        {originalPrice.toFixed(2)}
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        {t("services.details.pricing.save")}{" "}
                        {isRTL ? "ر.س" : "$"}
                        {savings.toFixed(2)}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {serviceData.description}
                </p>

                {/* Subscription Period Selection */}
                <div className="space-y-4 mb-6">
                  <label className="text-sm font-medium text-foreground">
                    {t("services.details.subscriptionPeriod")}
                  </label>
                  <Select
                    value={subscriptionPeriod}
                    onValueChange={setSubscriptionPeriod}
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1year">
                        {t("services.details.subscriptionOptions.1year")}
                      </SelectItem>
                      <SelectItem value="2years">
                        {t("services.details.subscriptionOptions.2years")} - 15%{" "}
                        {t("services.details.pricing.save")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity Selection */}
                <div className="space-y-4 mb-6">
                  <label className="text-sm font-medium text-foreground">
                    {t("services.details.quantity")}
                  </label>
                  <Counter
                    value={quantity}
                    onChange={setQuantity}
                    min={1}
                    max={10}
                    className="w-32"
                  />
                </div>

                {/* Action Button */}
                <div>
                  <Button className="w-full !h-12">
                    {t("services.details.contactUs")} <MessageCircle />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Specifications */}
            <Card className="shadow-xs dark:bg-muted/50">
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""}`}
                >
                  <div className="flex items-center justify-center bg-primary/10 w-12 h-12 border border-primary/10 rounded-xl">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  {t("services.details.specifications.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    {t("services.details.specifications.features")}
                  </h4>
                  <ul className="space-y-2">
                    {serviceData.features?.map((feature, index) => (
                      <li
                        key={index}
                        className={`flex items-start gap-2 ${isRTL ? "flex-row" : ""}`}
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    {t("services.details.specifications.compatibility")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {serviceData.compatibility}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    {t("services.details.specifications.support")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {serviceData.support}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Reviews */}
            <Card className="shadow-xs dark:bg-muted/50">
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""}`}
                >
                  <div className="flex items-center justify-center bg-primary/10 border border-primary/10 w-12 h-12 rounded-xl">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  {t("services.details.reviews.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {serviceData.rating}
                  </div>
                  <div
                    className={`flex items-center justify-center gap-1 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(parseFloat(serviceData.rating))
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("services.details.reviews.averageRating")} •{" "}
                    {serviceData.totalReviews}{" "}
                    {t("services.details.reviews.totalReviews")}
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Sample reviews */}
                  <div
                    className={`border-primary/20 ${isRTL ? "border-r-4 pr-4" : "border-l-4 pl-4"}`}
                  >
                    <div
                      className={`flex items-center gap-2 mb-1 ${isRTL ? "flex-row" : ""}`}
                    >
                      <div
                        className={`flex items-center gap-1 ${isRTL ? "flex-row" : ""}`}
                      >
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Youssef.M
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      &ldquo;Excellent service with great features. Highly
                      recommended!&rdquo;
                    </p>
                  </div>

                  <div
                    className={`border-primary/20 ${isRTL ? "border-r-4 pr-4" : "border-l-4 pl-4"}`}
                  >
                    <div
                      className={`flex items-center gap-2 mb-1 ${isRTL ? "flex-row" : ""}`}
                    >
                      <div
                        className={`flex items-center gap-1 ${isRTL ? "flex-row" : ""}`}
                      >
                        {Array.from({ length: 4 }, (_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <Star className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Marawan.M
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      &ldquo;Good value for money. Easy to use and
                      reliable.&rdquo;
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
