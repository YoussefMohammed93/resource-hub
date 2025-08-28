"use client";

import { useTranslation } from "react-i18next";
import { useLanguage } from "@/components/i18n-provider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HelpCircle,
  Sparkles,
  Download,
  Shield,
  Users,
  Zap,
  Music,
  Ban,
} from "lucide-react";

// FAQ Skeleton Component
function FAQSkeleton() {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-100"></div>
      <div className="container mx-auto max-w-4xl px-4 sm:px-5 relative z-10">
        {/* Section Header Skeleton */}
        <div className="text-center mb-12 lg:mb-16">
          <Skeleton className="h-12 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* FAQ Items Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6"
            >
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FAQSection() {
  const { t } = useTranslation("common");
  const { isRTL, isLoading } = useLanguage();

  // Show loading skeleton while language data is loading
  if (isLoading) {
    return <FAQSkeleton />;
  }

  return (
    <section
      id="faq"
      className="py-16 lg:py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-100"></div>

      {/* Floating Decorative Elements */}
      {/* Top Left/Right Corner */}
      <div
        className={`absolute top-20 ${isRTL ? "right-8" : "left-8"} opacity-40`}
      >
        <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center animate-float">
          <HelpCircle className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Top Center Right/Left */}
      <div
        className={`absolute top-32 ${isRTL ? "left-1/4" : "right-1/4"} opacity-30`}
      >
        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-bounce-slow">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Bottom Right/Left Corner */}
      <div
        className={`absolute bottom-20 ${isRTL ? "left-12" : "right-12"} opacity-35`}
      >
        <div className="w-14 h-14 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center animate-float-delayed">
          <Download className="w-7 h-7 text-primary" />
        </div>
      </div>

      {/* Additional Decorative Elements */}
      {/* Top Center */}
      <div
        className={`absolute top-16 ${isRTL ? "right-1/3" : "left-1/3"} opacity-25`}
      >
        <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-float">
          <Shield className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* Middle Left/Right */}
      <div
        className={`absolute top-1/2 ${isRTL ? "right-4" : "left-4"} opacity-20`}
      >
        <div className="w-6 h-6 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center animate-bounce-slow">
          <Users className="w-3 h-3 text-primary" />
        </div>
      </div>

      {/* Middle Right/Left */}
      <div
        className={`absolute top-1/2 ${isRTL ? "left-8" : "right-8"} opacity-30`}
      >
        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center animate-float-delayed">
          <Zap className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Bottom Left/Right */}
      <div
        className={`absolute bottom-32 ${isRTL ? "right-1/4" : "left-1/4"} opacity-25`}
      >
        <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-float">
          <HelpCircle className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* Dot Patterns */}
      {/* Top Right/Left Dots Pattern */}
      <div
        className={`absolute top-24 ${isRTL ? "left-1/5" : "right-1/5"} opacity-20`}
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          className="text-primary/40"
        >
          {Array.from({ length: 4 }, (_, row) =>
            Array.from({ length: 4 }, (_, col) => (
              <circle
                key={`top-dots-${row}-${col}`}
                cx={8 + col * 12}
                cy={8 + row * 12}
                r="2"
                fill="currentColor"
                className="animate-pulse-slow"
                style={{
                  animationDelay: `${(row + col) * 0.2}s`,
                  opacity: Math.random() * 0.5 + 0.3,
                }}
              />
            ))
          )}
        </svg>
      </div>

      {/* Bottom Center Dots Pattern */}
      <div
        className={`absolute bottom-16 ${isRTL ? "right-1/3" : "left-1/3"} opacity-15`}
      >
        <svg
          width="80"
          height="40"
          viewBox="0 0 80 40"
          fill="none"
          className="text-primary/30"
        >
          {Array.from({ length: 3 }, (_, row) =>
            Array.from({ length: 6 }, (_, col) => (
              <circle
                key={`bottom-dots-${row}-${col}`}
                cx={8 + col * 12}
                cy={8 + row * 12}
                r="1.5"
                fill="currentColor"
                className="animate-pulse-slow"
                style={{
                  animationDelay: `${(row + col) * 0.15}s`,
                  opacity: Math.random() * 0.4 + 0.2,
                }}
              />
            ))
          )}
        </svg>
      </div>

      {/* Diamond Pattern - Top */}
      <div
        className={`absolute top-40 ${isRTL ? "left-1/6" : "right-1/6"} opacity-20`}
      >
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          className="text-primary/35"
        >
          {Array.from({ length: 3 }, (_, row) =>
            Array.from({ length: 3 }, (_, col) => (
              <rect
                key={`diamond-top-${row}-${col}`}
                x={8 + col * 14}
                y={8 + row * 14}
                width="3"
                height="3"
                transform={`rotate(45 ${9.5 + col * 14} ${9.5 + row * 14})`}
                fill="currentColor"
                className="animate-pulse-slow"
                style={{
                  animationDelay: `${(row + col) * 0.25}s`,
                  opacity: Math.random() * 0.4 + 0.3,
                }}
              />
            ))
          )}
        </svg>
      </div>

      {/* Square Pattern - Middle */}
      <div
        className={`absolute top-1/3 ${isRTL ? "right-1/6" : "left-1/6"} opacity-15`}
      >
        <svg
          width="40"
          height="60"
          viewBox="0 0 40 60"
          fill="none"
          className="text-primary/25"
        >
          {Array.from({ length: 4 }, (_, row) =>
            Array.from({ length: 2 }, (_, col) => (
              <rect
                key={`square-middle-${row}-${col}`}
                x={8 + col * 16}
                y={8 + row * 12}
                width="2.5"
                height="2.5"
                fill="currentColor"
                className="animate-pulse-slow"
                style={{
                  animationDelay: `${(row + col) * 0.18}s`,
                  opacity: Math.random() * 0.3 + 0.2,
                }}
              />
            ))
          )}
        </svg>
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-5 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight font-sans">
            {t("faq.title")}{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t("faq.titleHighlight")}
            </span>
          </h2>
          <p
            className={`text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed ${isRTL && "font-medium"}`}
          >
            {t("faq.description")}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full space-y-5">
            {/* Question 1: What is Resource Hub? */}
            <AccordionItem value="what-is-resource-hub" className="border-none">
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <span
                      className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-start" : "font-sans"}`}
                    >
                      {t("faq.questions.whatIsResourceHub.question")}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pl-14">
                    <p
                      className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-start" : "font-sans"}`}
                    >
                      {t("faq.questions.whatIsResourceHub.answer")}
                    </p>
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>

            {/* Question 2: How do credits work? */}
            <AccordionItem value="how-credits-work" className="border-none">
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <span
                      className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-start" : "font-sans"}`}
                    >
                      {t("faq.questions.howCreditsWork.question")}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pl-14">
                    <p
                      className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-start" : "font-sans"}`}
                    >
                      {t("faq.questions.howCreditsWork.answer")}
                    </p>
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>

            {/* Question 3: Which platforms are supported? */}
            <AccordionItem value="supported-platforms" className="border-none">
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <span
                      className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-start" : "font-sans"}`}
                    >
                      {t("faq.questions.supportedPlatforms.question")}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pl-14">
                    <p
                      className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-start" : "font-sans"}`}
                    >
                      {t("faq.questions.supportedPlatforms.answer")}
                    </p>
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>

            {/* Question 4: How to download resources? */}
            <AccordionItem value="how-to-download" className="border-none">
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Download className="w-5 h-5 text-primary" />
                    </div>
                    <span
                      className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-start" : "font-sans"}`}
                    >
                      {t("faq.questions.howToDownload.question")}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pl-14">
                    <p
                      className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-start" : "font-sans"}`}
                    >
                      {t("faq.questions.howToDownload.answer")}
                    </p>
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>

            {/* Question 5: Is it safe and legal? */}
            <AccordionItem value="safety-legal" className="border-none">
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <span
                      className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
                    >
                      {t("faq.questions.safetyLegal.question")}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pl-14">
                    <p
                      className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal" : "font-sans"}`}
                    >
                      {t("faq.questions.safetyLegal.answer")}
                    </p>
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>

            {/* Question 6: Music Download Restrictions */}
            <AccordionItem value="music-restrictions" className="border-none">
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                  <div className="flex items-center gap-4 text-left">
                    <div className="relative w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Music className="w-5 h-5 text-primary" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Ban className="w-2.5 h-2.5 text-primary-foreground" />
                      </div>
                    </div>
                    <span
                      className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-start" : "font-sans"}`}
                    >
                      {t("faq.questions.musicRestrictions.question")}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pl-14">
                    <p
                      className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-start" : "font-sans"}`}
                    >
                      {t("faq.questions.musicRestrictions.answer")}
                    </p>
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
