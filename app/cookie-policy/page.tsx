"use client";

import Footer from "@/components/footer";
import { HeaderControls } from "@/components/header-controls";
import { useLanguage } from "@/components/i18n-provider";
import { useTranslation } from "react-i18next";
import {
  Cookie,
  Shield,
  BarChart3,
  Target,
  Globe,
  Settings,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  UserCheck,
  RefreshCw,
  Mail,
  Database,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// Cookie Policy Page Skeleton Component
function CookiePolicyPageSkeleton({ isRTL }: { isRTL: boolean }) {
  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? "font-tajawal" : "font-sans"}`}
    >
      {/* Header Skeleton */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-5">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-1 sm:gap-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/50 to-background dark:from-orange-950/20 dark:via-orange-900/10 dark:to-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-5 py-16 sm:py-20">
          <div
            className={`text-center space-y-6 ${isRTL ? "font-tajawal" : "font-sans"}`}
          >
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-5 py-12 sm:py-16">
        <div className="space-y-12">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <Skeleton className="h-8 w-64" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function CookiePolicyPage() {
  const { t } = useTranslation("common");
  const { isRTL, isLoading } = useLanguage();

  // Show loading skeletons while language data is loading
  if (isLoading) {
    return <CookiePolicyPageSkeleton isRTL={isRTL} />;
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-5">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/"
                className="flex items-center gap-1 sm:gap-2 cursor-pointer"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
                </div>
                <span className="text-base sm:text-xl font-semibold text-foreground">
                  {t("header.logo")}
                </span>
              </Link>
            </div>
            <HeaderControls />
          </div>
        </div>
      </header>

      {/* Hero Section with Gradient Background and Floating Elements */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/50 to-background dark:from-orange-950/20 dark:via-orange-900/10 dark:to-background">
        {/* Floating Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Cookies */}
          <div className="absolute top-20 left-10 w-6 h-6 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <Cookie className="w-3 h-3 text-primary" />
          </div>
          <div className="absolute top-32 right-16 w-8 h-8 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center animate-pulse delay-300">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div className="absolute top-48 left-1/4 w-5 h-5 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center animate-pulse delay-700">
            <Settings className="w-3 h-3 text-primary" />
          </div>
          <div className="absolute top-16 right-1/3 w-7 h-7 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center animate-pulse delay-500">
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <div className="absolute top-40 right-8 w-6 h-6 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center animate-pulse delay-1000">
            <Globe className="w-3 h-3 text-primary" />
          </div>
          <div className="absolute top-24 left-1/2 w-5 h-5 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center animate-pulse delay-200">
            <Eye className="w-3 h-3 text-primary" />
          </div>
          <div className="absolute top-52 right-1/4 w-6 h-6 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center animate-pulse delay-800">
            <Target className="w-3 h-3 text-primary" />
          </div>
          <div className="absolute top-36 left-20 w-4 h-4 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center animate-pulse delay-600">
            <Clock className="w-2 h-2 text-primary" />
          </div>
          <div className="absolute top-44 right-12 w-5 h-5 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center animate-pulse delay-400">
            <Database className="w-3 h-3 text-primary" />
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-5 py-16 sm:py-20 relative">
          <div
            className={`text-center space-y-6 ${isRTL ? "font-tajawal text-right" : "font-sans"}`}
          >
            <h1
              className={`text-center text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
            >
              {t("cookiePolicy.title")}
            </h1>
            <p
              className={`text-center text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed ${isRTL ? "font-tajawal" : "font-sans"}`}
            >
              {t("cookiePolicy.description")}
            </p>
            <div
              className={`flex items-center justify-center gap-2 text-sm text-muted-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
            >
              <Clock className="w-4 h-4" />
              <span>{t("cookiePolicy.lastUpdated")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Timeline Layout */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-5 py-12 sm:py-16">
        {/* Introduction Section */}
        <div className={`mb-16 ${isRTL ? "text-right" : "text-left"}`}>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p
              className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal" : "font-sans"}`}
            >
              {t("cookiePolicy.introduction.content")}
            </p>
          </div>
        </div>

        {/* Timeline-based Cookie Sections */}
        <div className="relative">

          {/* Essential Cookies Section */}
          <div
            className={`relative flex items-start gap-3 sm:gap-5 md:gap-8 mb-16`}
          >
            {/* Timeline Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center relative z-10">
                <Shield className="w-6 h-6 text-primary" />
                <div
                  className={`absolute ${isRTL ? "left-full ml-2" : "right-full mr-2"} top-1/2 -translate-y-1/2 w-4 h-0.5 bg-primary/30`}
                ></div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              <div className="cookie-section">
                <h2
                  className={`text-2xl font-bold text-foreground mb-4 ${isRTL ? "font-tajawal" : "font-sans"}`}
                >
                  {t("cookiePolicy.sections.essential.title")}
                </h2>
                <div className="space-y-4">
                  <p
                    className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("cookiePolicy.sections.essential.content")}
                  </p>
                  <div className={`bg-muted/50 rounded-lg p-4 border-primary ${isRTL ? "border-r-4" : "border-l-4"}`}>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4
                          className={`font-semibold text-foreground mb-2 ${isRTL ? "font-tajawal" : "font-sans"}`}
                        >
                          {t("cookiePolicy.sections.essential.examples.title")}
                        </h4>
                        <ul
                          className={`text-sm text-muted-foreground space-y-1 ${isRTL ? "font-tajawal" : "font-sans"}`}
                        >
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.essential.examples.sessionCookies"
                            )}
                          </li>
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.essential.examples.securityCookies"
                            )}
                          </li>
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.essential.examples.loadBalancing"
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Cookies Section */}
          <div
            className={`relative flex items-start gap-3 sm:gap-5 md:gap-8 mb-16`}
          >
            {/* Timeline Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center relative z-10">
                <BarChart3 className="w-6 h-6 text-primary" />
                <div
                  className={`absolute ${isRTL ? "left-full ml-2" : "right-full mr-2"} top-1/2 -translate-y-1/2 w-4 h-0.5 bg-primary/30`}
                ></div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              <div className="cookie-section">
                <h2
                  className={`text-2xl font-bold text-foreground mb-4 ${isRTL ? "font-tajawal" : "font-sans"}`}
                >
                  {t("cookiePolicy.sections.analytics.title")}
                </h2>
                <div className="space-y-4">
                  <p
                    className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("cookiePolicy.sections.analytics.content")}
                  </p>
                  <div className={`bg-blue-50 rounded-lg p-4 border-blue-500 dark:bg-blue-950/20 ${isRTL ? "border-r-4" : "border-l-4"}`}>
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4
                          className={`font-semibold text-foreground mb-2 ${isRTL ? "font-tajawal" : "font-sans"}`}
                        >
                          {t("cookiePolicy.sections.analytics.examples.title")}
                        </h4>
                        <ul
                          className={`text-sm text-muted-foreground space-y-1 ${isRTL ? "font-tajawal" : "font-sans"}`}
                        >
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.analytics.examples.googleAnalytics"
                            )}
                          </li>
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.analytics.examples.pageViews"
                            )}
                          </li>
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.analytics.examples.userBehavior"
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Marketing Cookies Section */}
          <div
            className={`relative flex items-start gap-3 sm:gap-5 md:gap-8 mb-16`}
          >
            {/* Timeline Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center relative z-10">
                <Target className="w-6 h-6 text-primary" />
                <div
                  className={`absolute ${isRTL ? "left-full ml-2" : "right-full mr-2"} top-1/2 -translate-y-1/2 w-4 h-0.5 bg-primary/30`}
                ></div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              <div className="cookie-section">
                <h2
                  className={`text-2xl font-bold text-foreground mb-4 ${isRTL ? "font-tajawal" : "font-sans"}`}
                >
                  {t("cookiePolicy.sections.marketing.title")}
                </h2>
                <div className="space-y-4">
                  <p
                    className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("cookiePolicy.sections.marketing.content")}
                  </p>
                  <div className={`bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 ${isRTL ? "border-r-4" : "border-l-4"} border-orange-500`}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4
                          className={`font-semibold text-foreground mb-2 ${isRTL ? "font-tajawal" : "font-sans"}`}
                        >
                          {t("cookiePolicy.sections.marketing.examples.title")}
                        </h4>
                        <ul
                          className={`text-sm text-muted-foreground space-y-1 ${isRTL ? "font-tajawal" : "font-sans"}`}
                        >
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.marketing.examples.advertising"
                            )}
                          </li>
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.marketing.examples.retargeting"
                            )}
                          </li>
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.marketing.examples.socialMedia"
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Third-Party Cookies Section */}
          <div
            className={`relative flex items-start gap-3 sm:gap-5 md:gap-8 mb-16`}
          >
            {/* Timeline Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center relative z-10">
                <Globe className="w-6 h-6 text-primary" />
                <div
                  className={`absolute ${isRTL ? "left-full ml-2" : "right-full mr-2"} top-1/2 -translate-y-1/2 w-4 h-0.5 bg-primary/30`}
                ></div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              <div className="cookie-section">
                <h2
                  className={`text-2xl font-bold text-foreground mb-4 ${isRTL ? "font-tajawal" : "font-sans"}`}
                >
                  {t("cookiePolicy.sections.thirdParty.title")}
                </h2>
                <div className="space-y-4">
                  <p
                    className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("cookiePolicy.sections.thirdParty.content")}
                  </p>
                  <div className={`bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 ${isRTL ? "border-r-4" : "border-l-4"} border-purple-500`}>
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4
                          className={`font-semibold text-foreground mb-2 ${isRTL ? "font-tajawal" : "font-sans"}`}
                        >
                          {t("cookiePolicy.sections.thirdParty.examples.title")}
                        </h4>
                        <ul
                          className={`text-sm text-muted-foreground space-y-1 ${isRTL ? "font-tajawal" : "font-sans"}`}
                        >
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.thirdParty.examples.socialPlugins"
                            )}
                          </li>
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.thirdParty.examples.embeddedContent"
                            )}
                          </li>
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.thirdParty.examples.paymentProcessors"
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cookie Management Section */}
          <div
            className={`relative flex items-start gap-3 sm:gap-5 md:gap-8 mb-16`}
          >
            {/* Timeline Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center relative z-10">
                <Settings className="w-6 h-6 text-primary" />
                <div
                  className={`absolute ${isRTL ? "left-full ml-2" : "right-full mr-2"} top-1/2 -translate-y-1/2 w-4 h-0.5 bg-primary/30`}
                ></div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              <div className="cookie-section">
                <h2
                  className={`text-2xl font-bold text-foreground mb-4 ${isRTL ? "font-tajawal" : "font-sans"}`}
                >
                  {t("cookiePolicy.sections.management.title")}
                </h2>
                <div className="space-y-4">
                  <p
                    className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("cookiePolicy.sections.management.content")}
                  </p>
                  <div className={`bg-green-50 dark:bg-green-950/20 rounded-lg p-4 ${isRTL ? "border-r-4" : "border-l-4"} border-green-500`}>
                    <div className="flex items-start gap-3">
                      <Settings className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4
                          className={`font-semibold text-foreground mb-2 ${isRTL ? "font-tajawal" : "font-sans"}`}
                        >
                          {t("cookiePolicy.sections.management.options.title")}
                        </h4>
                        <ul
                          className={`text-sm text-muted-foreground space-y-1 ${isRTL ? "font-tajawal" : "font-sans"}`}
                        >
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.management.options.browserSettings"
                            )}
                          </li>
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.management.options.cookiePreferences"
                            )}
                          </li>
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.management.options.optOut"
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Rights Section */}
          <div
            className={`relative flex items-start gap-3 sm:gap-5 md:gap-8 mb-16`}
          >
            {/* Timeline Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center relative z-10">
                <UserCheck className="w-6 h-6 text-primary" />
                <div
                  className={`absolute ${isRTL ? "left-full ml-2" : "right-full mr-2"} top-1/2 -translate-y-1/2 w-4 h-0.5 bg-primary/30`}
                ></div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              <div className="cookie-section">
                <h2
                  className={`text-2xl font-bold text-foreground mb-4 ${isRTL ? "font-tajawal" : "font-sans"}`}
                >
                  {t("cookiePolicy.sections.userRights.title")}
                </h2>
                <div className="space-y-4">
                  <p
                    className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("cookiePolicy.sections.userRights.content")}
                  </p>
                  <div className={`bg-indigo-50 dark:bg-indigo-950/20 rounded-lg p-4 ${isRTL ? "border-r-4" : "border-l-4"} border-indigo-500`}>
                    <div className="flex items-start gap-3">
                      <UserCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4
                          className={`font-semibold text-foreground mb-2 ${isRTL ? "font-tajawal" : "font-sans"}`}
                        >
                          {t("cookiePolicy.sections.userRights.rights.title")}
                        </h4>
                        <ul
                          className={`text-sm text-muted-foreground space-y-1 ${isRTL ? "font-tajawal" : "font-sans"}`}
                        >
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.userRights.rights.consent"
                            )}
                          </li>
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.userRights.rights.withdraw"
                            )}
                          </li>
                          <li>
                            •{" "}
                            {t(
                              "cookiePolicy.sections.userRights.rights.information"
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div
            className={`relative flex items-start gap-3 sm:gap-5 md:gap-8 mb-8`}
          >
            {/* Timeline Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center relative z-10">
                <Mail className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              <div className="cookie-section">
                <h2
                  className={`text-2xl font-bold text-foreground mb-4 ${isRTL ? "font-tajawal" : "font-sans"}`}
                >
                  {t("cookiePolicy.sections.contact.title")}
                </h2>
                <div className="space-y-4">
                  <p
                    className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("cookiePolicy.sections.contact.content")}
                  </p>
                  <div className={`bg-muted/50 rounded-lg p-4 ${isRTL ? "border-r-4" : "border-l-4"} border-primary}`}>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4
                          className={`font-semibold text-foreground mb-2 ${isRTL ? "font-tajawal" : "font-sans"}`}
                        >
                          {t("cookiePolicy.sections.contact.info.title")}
                        </h4>
                        <div
                          className={`text-sm text-muted-foreground space-y-1 ${isRTL ? "font-tajawal" : "font-sans"}`}
                        >
                          <p>
                            • {t("cookiePolicy.sections.contact.info.email")}
                          </p>
                          <p>
                            • {t("cookiePolicy.sections.contact.info.phone")}
                          </p>
                          <p>
                            • {t("cookiePolicy.sections.contact.info.address")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Updates Notice */}
        <div
          className={`mt-16 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 ${isRTL ? "text-right" : "text-left"}`}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3
                className={`text-lg font-semibold text-foreground mb-2 ${isRTL ? "font-tajawal" : "font-sans"}`}
              >
                {t("cookiePolicy.updates.title")}
              </h3>
              <p
                className={`text-muted-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
              >
                {t("cookiePolicy.updates.content")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
