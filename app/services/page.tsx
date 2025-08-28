"use client";

import Footer from "@/components/footer";
import { HeaderControls } from "@/components/header-controls";
import { useLanguage } from "@/components/i18n-provider";
import { useTranslation } from "react-i18next";
import {
  Star,
  ArrowRight,
  Shield,
  Download,
  Sparkles,
  ImageIcon,
  Globe,
  Zap,
  Crown,
  Users,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Services Page Skeleton Components
function ServicesHeaderSkeleton({ }: { isRTL: boolean }) {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-5">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Menu Button */}
            <Skeleton className="w-8 h-8 rounded-lg md:hidden" />
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
            </div>
            <Skeleton className="w-32 h-6" />
          </div>
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
          </nav>
          {/* Header Controls */}
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

function ServicesMainSkeleton({ isRTL }: { isRTL: boolean }) {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-primary/20 via-primary/5 to-primary/20 py-12 lg:py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-100"></div>

      <div className="container mx-auto max-w-7xl px-5 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="space-y-4">
            <Skeleton className="h-12 w-80 mx-auto" />
            <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {Array.from({ length: 4 }, (_, i) => (
            <Card
              key={i}
              className="group relative dark:bg-secondary bg-card py-0 border border-border rounded-2xl"
            >
              <div className="relative z-10">
                {/* Service Image */}
                <div className="relative w-full h-[250px] mb-4">
                  <Skeleton className="w-full h-full rounded-t-2xl" />
                </div>

                <CardContent className="p-6 pt-0 space-y-4">
                  {/* Service Title */}
                  <Skeleton className="h-6 w-3/4" />

                  {/* Rating */}
                  <div
                    className={`flex items-center gap-2 ${isRTL ? "!flex-row" : ""}`}
                  >
                    <div
                      className={`flex items-center gap-1 ${isRTL ? "!flex-row" : ""}`}
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <Skeleton key={i} className="w-4 h-4 rounded-sm" />
                      ))}
                    </div>
                    <Skeleton className="h-4 w-8" />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>

                  {/* Price */}
                  <div
                    className={`flex items-baseline gap-2 ${isRTL ? "flex-row" : ""}`}
                  >
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Skeleton className="h-10 w-full rounded-md" />
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

function ServicesFooterSkeleton() {
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

function ServicesPageSkeleton() {
  const isRTL = false; // Default to false for skeleton, will be handled by actual component

  return (
    <div
      className={`min-h-screen bg-background font-sans ${isRTL ? "font-tajawal" : ""}`}
    >
      <ServicesHeaderSkeleton isRTL={isRTL} />
      <ServicesMainSkeleton isRTL={isRTL} />
      <ServicesFooterSkeleton />
    </div>
  );
}

export default function ServicesPage() {
  const { t } = useTranslation("common");
  const { isRTL, isLoading } = useLanguage();

  // Show loading skeletons while language data is loading
  if (isLoading) {
    return <ServicesPageSkeleton />;
  }

  // Services data from translations
  const services = [
    { id: "youtube", color: "bg-red-500" },
    { id: "adobe", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { id: "microsoft", color: "bg-blue-500" },
    { id: "canva", color: "bg-gradient-to-r from-blue-400 to-purple-500" },
  ];

  return (
    <div
      className={`min-h-screen bg-background font-sans ${isRTL ? "font-tajawal" : ""}`}
    >
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-5">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center gap-1 sm:gap-2">
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
            {/* Header Controls */}
            <HeaderControls />
          </div>
        </div>
      </header>
      {/* Services Section */}
      <main className="relative min-h-screen bg-gradient-to-br from-primary/20 via-primary/5 to-primary/20 py-12 lg:py-16 overflow-hidden">
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

        <div className="container mx-auto max-w-7xl px-5 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                {t("services.title")}
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t("services.subtitle")}
              </p>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {services.map((service) => {
              const serviceData = t(`services.items.${service.id}`, {
                returnObjects: true,
              }) as {
                title: string;
                description: string;
                price: string;
                rating: string;
              };

              return (
                <Card
                  key={service.id}
                  className="group relative dark:bg-secondary bg-card py-0 border border-border rounded-2xl transition-all duration-500 hover:border-primary/30 overflow-hidden cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/services/${service.id}`)
                  }
                >
                  {/* Hover effect overlay - diagonal sweep */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl transform translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>

                  <div className="relative z-10">
                    {/* Service Image */}
                    <div className="relative w-full h-[250px] mb-4">
                      <Image
                        src="/office.webp"
                        alt={serviceData.title}
                        fill
                        className="object-fill rounded-t-2xl mix-blend-overlay opacity-80"
                      />
                    </div>

                    <CardContent className="p-6 pt-0 space-y-4">
                      {/* Service Title */}
                      <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {serviceData.title}
                      </CardTitle>

                      {/* Rating */}
                      <div
                        className={`flex items-center gap-2 ${isRTL ? "!flex-row" : ""}`}
                      >
                        <div
                          className={`flex items-center gap-1 ${isRTL ? "!flex-row" : ""}`}
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
                        <span className="text-sm text-muted-foreground">
                          {serviceData.rating}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {serviceData.description}
                      </p>

                      {/* Price */}
                      <div
                        className={`flex items-baseline gap-2 ${isRTL ? "flex-row" : ""}`}
                      >
                        <span className="text-2xl font-bold text-primary">
                          {isRTL ? "ج.م" : "$"}
                          {serviceData.price}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          / {t("common.month")}
                        </span>
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0">
                      <Button className="w-full">
                        <span
                          className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          {t("services.viewService")}
                          {isRTL ? (
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform" />
                          ) : (
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-[2px] transition-transform" />
                          )}
                        </span>
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
