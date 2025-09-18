"use client";

import {
  ArrowLeft,
  Globe,
  Timer,
  Coins,
  Shield,
  Users,
  Headphones,
  Download,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Award,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/components/i18n-provider";
import { HeaderControls } from "@/components/header-controls";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data structure matching the API response
interface PlanData {
  id: string;
  name: string;
  price: string | null;
  days: string;
  description: string;
  contact: string;
  credits: string;
  sites: string[];
  recommended: boolean;
}

// Mock data with enhanced features
const mockPlansData: PlanData[] = [
  {
    id: "1",
    name: "Bronze",
    price: null,
    days: "30",
    description:
      "Perfect for individuals and small projects. Get started with essential creative resources.",
    contact: "https://example.com/contact",
    credits: "500",
    sites: [
      "freepik.com",
      "shutterstock.com",
      "stock.adobe.com",
      "gettyimages.com",
      "unsplash.com",
      "storyblocks.com",
      "elements.envato.com",
      "vexels.com",
      "vectory.com",
      "ui8.net",
      "rawpixel.com",
      "pngtree.com",
      "pikbest.com",
      "creativefabrica.com",
      "iconscout.com",
      "vecteezy.com",
      "lovepik.com",
      "epidemicsound.com",
      "flaticon.com",
      "mockupcloud.com",
      "soundstripe.com",
      "motionarray.com",
      "motionelements.com",
      "pixelbuddha.net",
      "deeezy.com",
      "123rf.com",
      "pixeden.com",
      "artlist.io",
      "designi.com.br",
      "uihut.com",
      "depositphotos.com",
      "pixelsquid.com",
      "productioncrate.com",
      "graphics.crate.com",
      "vectorstock.com",
      "dreamstime.com",
      "uplabs.com",
      "craftwork.design",
      "istockphoto.com",
      "artgrid.io",
      "yellowimages.com",
      "alamy.com",
    ],
    recommended: false,
  },
  {
    id: "2",
    name: "Special",
    price: null,
    days: "30",
    description:
      "Most popular choice for professionals and growing businesses. Unlock premium features.",
    contact: "https://example.com/contact",
    credits: "1500",
    sites: [
      "vecteezy.com",
      "rawpixel.com",
      "shutterstock.com",
      "adobe.com",
      "unsplash.com",
    ],
    recommended: true,
  },
  {
    id: "3",
    name: "Silver",
    price: "$49",
    days: "30",
    description:
      "Great value for regular users who need consistent access to quality resources.",
    contact: "https://example.com/contact",
    credits: "1000",
    sites: ["freepik.com", "elements.envato.com", "pexels.com", "pixabay.com"],
    recommended: false,
  },
  {
    id: "4",
    name: "Gold",
    price: "$99",
    days: "60",
    description:
      "Premium plan for power users and creative teams with extended validity.",
    contact: "https://example.com/contact",
    credits: "3000",
    sites: [
      "vecteezy.com",
      "freepik.com",
      "shutterstock.com",
      "adobe.com",
      "rawpixel.com",
      "unsplash.com",
      "pexels.com",
    ],
    recommended: false,
  },
];

export default function PlanDetailsPage() {
  const { t } = useTranslation("common");
  const { language, isRTL } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Refs for header elements
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPlanData = async () => {
      setIsLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const planId = params.planId as string;
      const foundPlan = mockPlansData.find((plan) => plan.id === planId);

      if (foundPlan) {
        setPlanData(foundPlan);
      } else {
        setNotFound(true);
      }

      setIsLoading(false);
    };

    loadPlanData();
  }, [params.planId]);

  // 6 permanent features that will always be shown (not dependent on plan type)
  const permanentFeatures = [
    {
      icon: Download,
      key: "unlimitedDownloads",
    },
    {
      icon: Shield,
      key: "secureDownloads",
    },
    {
      icon: Headphones,
      key: "support24",
    },
    {
      icon: RefreshCw,
      key: "autoRenewal",
    },
    {
      icon: Users,
      key: "multiUser",
    },
    {
      icon: Award,
      key: "premiumQuality",
    },
  ];

  // 404 Error Page
  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
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
              {/* Header Controls */}
              <div ref={controlsRef}>
                <HeaderControls enabled={!isLoading} />
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-24 h-24 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">404</h1>
              <h2
                className={`text-xl font-semibold text-foreground ${isRTL ? "font-tajawal" : ""}`}
              >
                {t("planDetails.errors.notFound")}
              </h2>
              <p
                className={`text-muted-foreground ${isRTL ? "font-tajawal" : ""}`}
              >
                {t("planDetails.errors.notFoundDescription")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className={`gap-2 ${isRTL ? "font-tajawal" : ""}`}
              >
                <ArrowLeft className="w-4 h-4" />
                {t("planDetails.actions.goBack")}
              </Button>
              <Button asChild>
                <Link
                  href="/#pricing"
                  className={`gap-2 ${isRTL ? "font-tajawal" : ""}`}
                >
                  {t("planDetails.actions.viewAllPlans")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-primary/5 to-primary/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-100"></div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Shape 1 - Grid Dots Pattern */}
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
                      animationDelay: `${(row + col) * 0.05}s`,
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
                      animationDelay: `${(row + col) * 0.04}s`,
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
                      animationDelay: `${(row + col) * 0.075}s`,
                      opacity: Math.random() * 0.4 + 0.4,
                    }}
                  />
                ))
              )}
            </svg>
          </div>

          {/* Floating blur elements */}
          <div
            className={`absolute top-20 ${isRTL ? "right-8" : "left-8"} w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse`}
          />
          <div
            className={`absolute bottom-20 ${isRTL ? "left-8" : "right-8"} w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse`}
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Full Width Container with max-width 1600px */}
        <div className="w-full px-4 md:px-0 pb-12 relative z-10">
          {/* Header */}
          <header
            ref={headerRef}
            className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 h-16 min-h-[4rem] max-h-[4rem]"
          >
            {/* Header particle effects container */}
            <div className="header-particles"></div>

            <div className="container mx-auto max-w-7xl px-4 sm:px-5">
              <div className="flex items-center justify-between h-16">
                {/* Logo Skeleton */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <Skeleton className="w-44 sm:w-48 h-12 rounded-md" />
                </div>
                {/* Header Controls Skeleton */}
                <div className="flex items-center gap-2">
                  <Skeleton className="w-10 h-10 rounded-md" />
                  <Skeleton className="w-10 h-10 rounded-md" />
                  <Skeleton className="w-20 h-10 rounded-md" />
                </div>
              </div>
            </div>
          </header>

          <div className="w-full max-w-[1600px] mx-auto pt-20">
            {/* Hero Section Skeleton - Plan Overview */}
            <div className="max-w-3xl mx-auto mb-12">
              <Card className="relative overflow-hidden bg-gradient-to-br from-secondary/80 via-secondary/50 to-muted">
                <CardContent className="p-4 sm:p-8">
                  <div className="text-center space-y-6">
                    {/* Plan Name and Badge */}
                    <div className="flex items-center justify-center gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-12 w-32 mx-auto" />
                        <Skeleton className="h-6 w-24 mx-auto" />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-full max-w-lg mx-auto" />
                      <Skeleton className="h-6 w-3/4 mx-auto" />
                    </div>

                    {/* 3 Cards Layout Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <Card
                          key={i}
                          className="p-4 text-center bg-background/50"
                        >
                          <Skeleton className="w-16 h-16 rounded-lg mx-auto mb-2" />
                          <Skeleton className="h-8 w-16 mx-auto mb-1" />
                          <Skeleton className="h-4 w-20 mx-auto" />
                        </Card>
                      ))}
                    </div>

                    {/* Contact Button Skeleton */}
                    <Skeleton className="h-14 w-full rounded-md" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Supported Sites Section Skeleton */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <Skeleton className="h-8 w-48" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-6">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center p-6 bg-muted/30 rounded-xl border border-border"
                    >
                      <Skeleton className="w-20 h-20 mb-4 rounded-lg" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Plan Features Section Skeleton */}
            <div className="mb-12">
              {/* Section Header Skeleton */}
              <div className="text-center mb-8">
                <Skeleton className="h-10 w-64 mx-auto mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
                  <Skeleton className="h-6 w-3/4 max-w-xl mx-auto" />
                </div>
              </div>

              {/* Features Grid Skeleton - 6 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {Array.from({ length: 6 }, (_, i) => (
                  <Card
                    key={i}
                    className="p-6 text-center bg-gradient-to-br from-green-500/20 to-green-200/30 dark:from-green-950/20 dark:to-green-900/10 border border-green-200/50 dark:border-green-800/30"
                  >
                    <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24 mx-auto" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4 mx-auto" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (!planData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-primary/5 to-primary/20">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-100"></div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Shape 1 - Grid Dots Pattern */}
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
                    animationDelay: `${(row + col) * 0.05}s`,
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
                    animationDelay: `${(row + col) * 0.04}s`,
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
                    animationDelay: `${(row + col) * 0.075}s`,
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
            {Array.from({ length: 3 }, (_, row) =>
              Array.from({ length: 5 }, (_, col) => (
                <circle
                  key={`top-dot-${row}-${col}`}
                  cx={8 + col * 12}
                  cy={8 + row * 12}
                  r="1.5"
                  fill="currentColor"
                  className="animate-pulse-slow"
                  style={{
                    animationDelay: `${(row + col) * 0.1}s`,
                    opacity: Math.random() * 0.6 + 0.2,
                  }}
                />
              ))
            )}
          </svg>
        </div>

        {/* Shape 5 - Top Right Squares */}
        <div className="absolute top-20 right-8 md:top-24 md:right-16 opacity-25">
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            fill="none"
            className="text-primary/50"
          >
            {Array.from({ length: 4 }, (_, row) =>
              Array.from({ length: 4 }, (_, col) => (
                <rect
                  key={`top-square-${row}-${col}`}
                  x={5 + col * 12}
                  y={5 + row * 12}
                  width="2"
                  height="2"
                  fill="currentColor"
                  className="animate-pulse-slow"
                  style={{
                    animationDelay: `${(row + col) * 0.08}s`,
                    opacity: Math.random() * 0.5 + 0.3,
                  }}
                />
              ))
            )}
          </svg>
        </div>

        {/* Floating blur elements */}
        <div
          className={`absolute top-20 ${isRTL ? "right-8" : "left-8"} w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse`}
        />
        <div
          className={`absolute bottom-20 ${isRTL ? "left-8" : "right-8"} w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Full Width Container with max-width 1600px */}
      <div className="w-full md:px-0 pb-12 relative z-10">
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
              {/* Header Controls */}
              <div ref={controlsRef}>
                <HeaderControls enabled={!isLoading} />
              </div>
            </div>
          </div>
        </header>
        <div className="w-full max-w-[1600px] mx-auto px-5 pt-20">
          {/* Hero Section - Plan Overview */}
          <div className="max-w-3xl mx-auto mb-12">
            <Card
              className={`relative overflow-hidden ${
                planData.recommended
                  ? "bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-primary/30 ring-2 ring-primary/20"
                  : "bg-gradient-to-br from-secondary/80 via-secondary/50 to-muted"
              }`}
            >
              <CardContent className="p-4 sm:p-8">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-4">
                    <div>
                      <h2
                        className={`text-4xl font-bold ${isRTL ? "font-tajawal" : ""}`}
                      >
                        {planData.name}
                      </h2>
                      {planData.recommended && (
                        <Badge
                          variant="default"
                          className={`mt-10 ${planData.recommended && "text-lg"} ${isRTL ? "text-base font-tajawal" : ""}`}
                        >
                          {t("pricing.mostPopular")}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p
                    className={`text-lg text-muted-foreground leading-relaxed ${isRTL ? "text-xl font-tajawal" : ""}`}
                  >
                    {planData.description}
                  </p>

                  {/* 3 Cards Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="p-4 text-center bg-background/50">
                      <div className="w-16 h-16 rounded-lg bg-primary/20 border border-primary/20 flex items-center justify-center mx-auto mb-2">
                        <Coins className="w-9 h-9 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {parseInt(planData.credits).toLocaleString()}
                      </div>
                      <div
                        className={`text-base text-muted-foreground ${isRTL ? "text-lg font-tajawal" : ""}`}
                      >
                        {t("pricing.labels.credits")}
                      </div>
                    </Card>

                    <Card className="p-4 text-center bg-background/50">
                      <div className="w-16 h-16 rounded-lg bg-primary/20 border border-primary/20 flex items-center justify-center mx-auto mb-2">
                        <Timer className="w-9 h-9 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {planData.days}
                      </div>
                      <div
                        className={`text-base text-muted-foreground ${isRTL ? "text-lg font-tajawal" : ""}`}
                      >
                        {t("pricing.labels.days")}
                      </div>
                    </Card>

                    <Card className="p-4 text-center bg-background/50">
                      <div className="w-16 h-16 rounded-lg bg-primary/20 border border-primary/20 flex items-center justify-center mx-auto mb-2">
                        <Globe className="w-9 h-9 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {planData.sites.length}
                      </div>
                      <div
                        className={`text-base text-muted-foreground ${isRTL ? "text-lg font-tajawal" : ""}`}
                      >
                        {t("planDetails.sites")}
                      </div>
                    </Card>
                  </div>

                  {/* Contact Button */}
                  <Button
                    className={`w-full px-8 py-4 text-lg ${isRTL ? "text-xl font-medium font-tajawal" : ""}`}
                    size="lg"
                    asChild
                  >
                    <Link href={planData.contact} target="_blank">
                      <ExternalLink className="w-5 h-5" />
                      <span className={isRTL ? "text-xl" : ""}>
                        {planData.price
                          ? t("planDetails.actions.subscribe")
                          : t("planDetails.actions.contactUs")}
                      </span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Full Width Supported Sites Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/20 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <span
                  className={`text-lg sm:text-2xl ${isRTL ? "font-tajawal" : ""}`}
                >
                  {t("planDetails.supportedSites.title")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-6">
                {planData.sites.map((site, index) => (
                  <a
                    key={index}
                    href={`https://${site}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center p-6 bg-muted/30 rounded-xl border border-border hover:bg-muted/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-20 h-20 mb-4 rounded-lg overflow-hidden bg-white/20 border border-white/20 shadow-sm backdrop-blur-sm">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${site}&sz=128`}
                        alt={`${site} icon`}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/80x80/6366f1/ffffff?text=" +
                            site.charAt(0).toUpperCase();
                        }}
                      />
                    </div>
                    <span
                      className={`text-center font-medium text-foreground group-hover:text-primary transition-colors ${isRTL ? "text-lg font-tajawal" : ""}`}
                    >
                      {site.replace(".com", "").replace(".", " ").toUpperCase()}
                    </span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plan Features Section */}
          <div className="mb-12">
            {/* Section Header */}
            <div className="text-center mb-8">
              <h2
                className={`text-3xl font-bold text-foreground mb-4 ${isRTL ? "font-tajawal" : ""}`}
              >
                {t("planDetails.planFeatures.title")}
              </h2>
              <p
                className={`text-lg text-muted-foreground max-w-2xl mx-auto ${isRTL ? "text-xl font-tajawal" : ""}`}
              >
                {t("planDetails.planFeatures.description")}
              </p>
            </div>

            {/* Features Grid - 6 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {permanentFeatures.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <Card
                    key={feature.key}
                    className="p-6 text-center bg-gradient-to-br from-green-500/20 to-green-200/30 dark:from-green-950/20 dark:to-green-900/10 border border-green-200/50 dark:border-green-800/30 transition-all hover:shadow-lg hover:scale-105 duration-300"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-600/20 dark:bg-green-900/20 border border-green-200/20 dark:border-green-800/20 backdrop-blur-sm mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="space-y-2">
                      <h3
                        className={`font-semibold text-foreground ${isRTL ? "text-lg font-tajawal" : "text-base"}`}
                      >
                        {t(`planDetails.features.${feature.key}.title`)}
                      </h3>
                      <p
                        className={`text-sm text-muted-foreground leading-relaxed ${isRTL ? "text-base font-tajawal" : ""}`}
                      >
                        {t(`planDetails.features.${feature.key}.description`)}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
