"use client";

import Footer from "@/components/footer";
import { HeaderControls } from "@/components/header-controls";
import { useLanguage } from "@/components/i18n-provider";
import { useTranslation } from "react-i18next";
import {
  Shield,
  Lock,
  Eye,
  Users,
  Globe,
  Database,
  Settings,
  FileText,
  Zap,
  Star,
  Heart,
  Bookmark,
  Undo,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  Mail,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Loading skeleton component
function PrivacyPageSkeleton() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header Skeleton */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-5">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-1 sm:gap-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
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

      {/* Main Content Skeleton */}
      <div className="relative min-h-screen bg-gradient-to-br from-primary/20 via-primary/5 to-primary/20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-100"></div>
        <div className="relative z-10 container mx-auto max-w-5xl px-4 sm:px-5 py-12 lg:py-16">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <Skeleton className="h-12 w-80 mx-auto mb-12" />
              <Skeleton className="h-20 w-64 mx-auto" />
            </div>
            <div className="space-y-6">
              {Array.from({ length: 6 }, (_, i) => (
                <Card
                  key={i}
                  className="bg-card/80 backdrop-blur-sm border border-border/50"
                >
                  <CardHeader>
                    <Skeleton className="h-8 w-64" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
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

export default function PrivacyPage() {
  const { t } = useTranslation("common");
  const { isRTL, isLoading } = useLanguage();

  // Show loading skeletons while language data is loading
  if (isLoading) {
    return <PrivacyPageSkeleton />;
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

      {/* Main Content with Background */}
      <div className="relative min-h-screen bg-gradient-to-br from-primary/20 via-primary/5 to-primary/20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-100"></div>

        {/* Floating Decorative Elements */}
        {/* Shape 1 - Grid Dots Pattern (Top Left) */}
        <div
          className={`absolute hidden md:block top-20 ${isRTL ? "right-9/12" : "left-9/12"} transform -translate-x-1/2 md:top-32`}
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

        {/* Shape 2 - Floating Icon (Top Right) */}
        <div
          className={`absolute hidden md:block top-32 ${isRTL ? "left-1/4" : "right-1/4"} transform translate-x-1/2 md:top-40`}
        >
          <div className="w-16 h-16 bg-primary/10 border border-primary/10 rounded-2xl flex items-center justify-center animate-float">
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Shape 3 - Floating Icon (Bottom Left) */}
        <div
          className={`absolute hidden md:block bottom-40 ${isRTL ? "right-1/4" : "left-1/4"} transform -translate-x-1/2 md:bottom-48`}
        >
          <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center animate-bounce-slow">
            <Lock className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Shape 4 - Floating Icon (Bottom Right) */}
        <div
          className={`absolute hidden md:block bottom-60 ${isRTL ? "left-1/3" : "right-1/3"} transform translate-x-1/2 md:bottom-72`}
        >
          <div className="w-14 h-14 bg-primary/10 border border-primary/10 rounded-2xl flex items-center justify-center animate-pulse">
            <Eye className="w-7 h-7 text-primary" />
          </div>
        </div>

        {/* Shape 5 - Floating Icon (Middle Left) */}
        <div
          className={`absolute hidden md:block top-1/2 ${isRTL ? "right-10" : "left-10"} transform -translate-y-1/2`}
        >
          <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-float">
            <Users className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Shape 6 - Floating Icon (Middle Right) */}
        <div
          className={`absolute hidden md:block top-1/3 ${isRTL ? "left-10" : "right-10"} transform -translate-y-1/2`}
        >
          <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center animate-bounce-slow">
            <Globe className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Shape 7 - Floating Icon (Top Center) */}
        <div className="absolute hidden md:block top-16 left-1/4 transform -translate-x-1/2">
          <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-pulse-slow">
            <Database className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Shape 8 - Floating Icon (Bottom Center) */}
        <div className="absolute hidden md:block bottom-20 left-1/4 transform -translate-x-1/2">
          <div className="w-16 h-16 bg-primary/10 border border-primary/10 rounded-2xl flex items-center justify-center animate-float">
            <Settings className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Shape 9 - Small Floating Icon (Top Left Corner) */}
        <div
          className={`absolute hidden md:block top-24 ${isRTL ? "right-20" : "left-20"}`}
        >
          <div className="w-6 h-6 bg-primary/10 border border-primary/10 rounded-md flex items-center justify-center animate-bounce-slow">
            <FileText className="w-3 h-3 text-primary" />
          </div>
        </div>

        {/* Shape 10 - Small Floating Icon (Top Right Corner) */}
        <div
          className={`absolute hidden md:block top-28 ${isRTL ? "left-16" : "right-16"}`}
        >
          <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-pulse">
            <Zap className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Shape 11 - Medium Floating Icon (Bottom Left Corner) */}
        <div
          className={`absolute hidden md:block bottom-32 ${isRTL ? "right-16" : "left-16"}`}
        >
          <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center animate-float">
            <Star className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Shape 12 - Small Floating Icon (Bottom Right Corner) */}
        <div
          className={`absolute hidden md:block bottom-24 ${isRTL ? "left-20" : "right-20"}`}
        >
          <div className="w-6 h-6 bg-primary/10 border border-primary/10 rounded-md flex items-center justify-center animate-pulse-slow">
            <Heart className="w-3 h-3 text-primary" />
          </div>
        </div>

        {/* Shape 13 - Medium Floating Icon (Center Left) */}
        <div
          className={`absolute hidden md:block top-2/3 ${isRTL ? "right-8" : "left-8"} transform -translate-y-1/2`}
        >
          <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center animate-bounce-slow">
            <Bookmark className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto max-w-5xl px-4 sm:px-5 py-12 lg:py-16">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-12">
                {t("privacy.title")}
              </h1>

              {/* Last Updated Section with Amber Styling */}
              <div className="max-w-2xs mx-auto">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div
                    className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                        {isRTL ? "آخر تحديث" : "Last Updated"}
                      </h3>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        {t("privacy.lastUpdated")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Introduction Section */}
            <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card/90 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  {t("privacy.introduction.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {t("privacy.introduction.content")}
                </p>
              </CardContent>
            </Card>

            {/* Privacy Policy Sections */}
            <div className="space-y-6">
              {/* Information Collection Section */}
              <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card/90 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-primary" />
                    </div>
                    {t("privacy.sections.informationCollection.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {t("privacy.sections.informationCollection.content")}
                  </p>
                </CardContent>
              </Card>

              {/* Information Use Section */}
              <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card/90 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                      <Settings className="w-6 h-6 text-primary" />
                    </div>
                    {t("privacy.sections.informationUse.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {t("privacy.sections.informationUse.content")}
                  </p>
                </CardContent>
              </Card>

              {/* Data Sharing Section */}
              <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card/90 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    {t("privacy.sections.dataSharing.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {t("privacy.sections.dataSharing.content")}
                  </p>
                </CardContent>
              </Card>

              {/* Cookies and Tracking Section */}
              <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card/90 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-primary" />
                    </div>
                    {t("privacy.sections.cookiesTracking.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {t("privacy.sections.cookiesTracking.content")}
                  </p>
                </CardContent>
              </Card>

              {/* Data Security Section */}
              <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card/90 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    {t("privacy.sections.dataSecurity.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {t("privacy.sections.dataSecurity.content")}
                  </p>
                </CardContent>
              </Card>

              {/* User Rights Section */}
              <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card/90 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-primary" />
                    </div>
                    {t("privacy.sections.userRights.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {t("privacy.sections.userRights.content")}
                  </p>
                </CardContent>
              </Card>

              {/* International Transfers Section */}
              <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card/90 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                      <Globe className="w-6 h-6 text-primary" />
                    </div>
                    {t("privacy.sections.internationalTransfers.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {t("privacy.sections.internationalTransfers.content")}
                  </p>
                </CardContent>
              </Card>

              {/* Data Retention Section */}
              <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card/90 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    {t("privacy.sections.dataRetention.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {t("privacy.sections.dataRetention.content")}
                  </p>
                </CardContent>
              </Card>

              {/* Children's Privacy Section */}
              <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card/90 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-primary" />
                    </div>
                    {t("privacy.sections.childrensPrivacy.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {t("privacy.sections.childrensPrivacy.content")}
                  </p>
                </CardContent>
              </Card>

              {/* Third-Party Services Section */}
              <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card/90 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    {t("privacy.sections.thirdPartyServices.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {t("privacy.sections.thirdPartyServices.content")}
                  </p>
                </CardContent>
              </Card>

              {/* Policy Updates Section */}
              <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card/90 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 text-primary" />
                    </div>
                    {t("privacy.sections.policyUpdates.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {t("privacy.sections.policyUpdates.content")}
                  </p>
                </CardContent>
              </Card>

              {/* Contact Information Section */}
              <Card className="bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card/90 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    {t("privacy.sections.contactInformation.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {t("privacy.sections.contactInformation.content")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Back to Home Link */}
            <div className="text-center pt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Undo className="w-4 h-4" />
                {isRTL ? "العودة إلى الصفحة الرئيسية" : "Back to Home"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
