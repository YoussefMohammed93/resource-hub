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
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// FAQ Skeleton Component
function FAQSkeleton() {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-15 dark:opacity-100"></div>
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

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  // Animation setup - Optimized for Speed and Smoothness
  useEffect(() => {
    if (isLoading || !sectionRef.current) return;

    // Only run animations on desktop devices (768px and above)
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    
    // If on mobile, immediately reset all elements to their natural state
    if (!isDesktop()) {
      const allElements = [
        titleRef.current,
        descriptionRef.current,
      ].filter(Boolean);

      if (allElements.length > 0) {
        gsap.set(allElements, {
          opacity: 1,
          y: 0,
          clearProps: "all"
        });
      }

      // Reset FAQ items
      const faqItems = document.querySelectorAll(".faq-item");
      if (faqItems.length > 0) {
        gsap.set(faqItems, {
          opacity: 1,
          y: 0,
          clearProps: "all"
        });
      }

      // Reset floating icons
      const floatingIcons = document.querySelectorAll(".floating-icon");
      if (floatingIcons.length > 0) {
        gsap.set(floatingIcons, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          y: 0,
          clearProps: "all"
        });
      }

      // Reset decorative patterns
      const decorativePatterns = document.querySelectorAll(".decorative-pattern");
      if (decorativePatterns.length > 0) {
        gsap.set(decorativePatterns, {
          opacity: 1,
          scale: 1,
          clearProps: "all"
        });
      }

      // Reset pulse dots
      const pulseDots = document.querySelectorAll(".pulse-dot");
      if (pulseDots.length > 0) {
        gsap.set(pulseDots, {
          opacity: 1,
          scale: 1,
          clearProps: "all"
        });
      }

      // Reset rotate continuous elements
      const rotateContinuous = document.querySelectorAll(".rotate-continuous");
      if (rotateContinuous.length > 0) {
        gsap.set(rotateContinuous, {
          rotation: 0,
          clearProps: "all"
        });
      }

      return;
    }

    const ctx = gsap.context(() => {
      // Set initial states - Reduced movement distances
      gsap.set(titleRef.current, { y: 25, opacity: 0 }); // Reduced from 50px to 25px
      gsap.set(descriptionRef.current, { y: 15, opacity: 0 }); // Reduced from 30px to 15px
      gsap.set(".faq-item", { y: 20, opacity: 0 }); // Reduced from 40px to 20px
      gsap.set(".floating-icon", { scale: 0, rotation: -90, opacity: 0 }); // Reduced rotation from -180 to -90
      gsap.set(".decorative-pattern", { scale: 0, opacity: 0 });

      // Title animation - Faster and earlier activation
      gsap.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.4, // Reduced from 1s to 0.4s (60% faster)
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 95%", // Changed from "top 85%" to "top 95%" for earlier activation
          toggleActions: "play none none reverse",
        },
      });

      // Description animation - Faster timing
      gsap.to(descriptionRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.3, // Reduced from 0.8s to 0.3s (62% faster)
        delay: 0.1, // Reduced from 0.2s to 0.1s
        ease: "power3.out",
        scrollTrigger: {
          trigger: descriptionRef.current,
          start: "top 95%", // Changed from "top 85%" to "top 95%" for earlier activation
          toggleActions: "play none none reverse",
        },
      });

      // FAQ items staggered animation - Faster and earlier
      gsap.to(".faq-item", {
        y: 0,
        opacity: 1,
        duration: 0.25, // Reduced from 0.6s to 0.25s (58% faster)
        stagger: 0.04, // Reduced from 0.1s to 0.04s (60% faster)
        ease: "power2.out",
        scrollTrigger: {
          trigger: accordionRef.current,
          start: "top 90%", // Changed from "top 80%" to "top 90%" for earlier activation
          toggleActions: "play none none reverse",
        },
      });

      // Floating icons animation - Faster entrance
      gsap.to(".floating-icon", {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.3, // Reduced from 0.8s to 0.3s (62% faster)
        stagger: 0.05, // Reduced from 0.15s to 0.05s (67% faster)
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 95%", // Changed from "top 90%" to "top 95%" for earlier activation
          toggleActions: "play none none reverse",
        },
      });

      // Decorative patterns animation - Faster and smoother
      gsap.to(".decorative-pattern", {
        scale: 1,
        opacity: 1,
        duration: 0.4, // Reduced from 1s to 0.4s (60% faster)
        stagger: 0.08, // Reduced from 0.2s to 0.08s (60% faster)
        ease: "back.out(1.2)", // Changed from elastic for smoother performance
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 95%", // Changed from "top 85%" to "top 95%" for earlier activation
          toggleActions: "play none none reverse",
        },
      });

      // Continuous floating animation for icons - Faster and subtler
      gsap.to(".floating-icon", {
        y: "-5px", // Reduced from -10px to -5px for subtler movement
        duration: 1, // Reduced from 2s to 1s (50% faster)
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.1, // Reduced from 0.3s to 0.1s (67% faster)
          from: "random",
        },
      });

      // Continuous rotation for some decorative elements - Faster cycles
      gsap.to(".rotate-continuous", {
        rotation: 360,
        duration: 8, // Reduced from 20s to 8s (60% faster)
        ease: "none",
        repeat: -1,
      });

      // Pulse animation for dots - Faster and more responsive
      gsap.to(".pulse-dot", {
        scale: 1.1, // Reduced from 1.2 to 1.1 for subtler effect
        opacity: 0.9, // Increased from 0.8 to 0.9 for better visibility
        duration: 0.8, // Reduced from 1.5s to 0.8s (47% faster)
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.08, // Reduced from 0.2s to 0.08s (60% faster)
          from: "random",
        },
      });
    }, sectionRef);

    // Handle responsive changes
    const onResize = () => {
      if (!isDesktop()) {
        // Reset elements to their natural state on mobile
        const allElements = [
          titleRef.current,
          descriptionRef.current,
        ].filter(Boolean);

        if (allElements.length > 0) {
          gsap.set(allElements, {
            opacity: 1,
            y: 0,
            clearProps: "all"
          });
        }

        // Reset FAQ items
        const faqItems = document.querySelectorAll(".faq-item");
        if (faqItems.length > 0) {
          gsap.set(faqItems, {
            opacity: 1,
            y: 0,
            clearProps: "all"
          });
        }

        // Reset floating icons
        const floatingIcons = document.querySelectorAll(".floating-icon");
        if (floatingIcons.length > 0) {
          gsap.set(floatingIcons, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            y: 0,
            clearProps: "all"
          });
        }

        // Reset decorative patterns
        const decorativePatterns = document.querySelectorAll(".decorative-pattern");
        if (decorativePatterns.length > 0) {
          gsap.set(decorativePatterns, {
            opacity: 1,
            scale: 1,
            clearProps: "all"
          });
        }

        // Reset pulse dots
        const pulseDots = document.querySelectorAll(".pulse-dot");
        if (pulseDots.length > 0) {
          gsap.set(pulseDots, {
            opacity: 1,
            scale: 1,
            clearProps: "all"
          });
        }

        // Reset rotate continuous elements
        const rotateContinuous = document.querySelectorAll(".rotate-continuous");
        if (rotateContinuous.length > 0) {
          gsap.set(rotateContinuous, {
            rotation: 0,
            clearProps: "all"
          });
        }
      }
    };
    
    window.addEventListener('resize', onResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', onResize);
    };
  }, [isLoading]);

  // Show loading skeleton while language data is loading
  if (isLoading) {
    return <FAQSkeleton />;
  }

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="py-16 lg:py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 dark:opacity-100"></div>

      {/* Floating Decorative Elements */}
      {/* Top Left/Right Corner */}
      <div
        className={`hidden sm:block absolute top-20 ${isRTL ? "right-8" : "left-8"} opacity-40 floating-icon`}
      >
        <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center">
          <HelpCircle className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Top Center Right/Left */}
      <div
        className={`hidden sm:block absolute top-32 ${isRTL ? "left-1/4" : "right-1/4"} opacity-30 floating-icon`}
      >
        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Bottom Right/Left Corner */}
      <div
        className={`hidden sm:block absolute bottom-20 ${isRTL ? "left-12" : "right-12"} opacity-35 floating-icon`}
      >
        <div className="w-14 h-14 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center">
          <Download className="w-7 h-7 text-primary" />
        </div>
      </div>

      {/* Additional Decorative Elements */}
      {/* Top Center */}
      <div
        className={`hidden sm:block absolute top-16 ${isRTL ? "right-1/3" : "left-1/3"} opacity-25 floating-icon`}
      >
        <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
          <Shield className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* Middle Left/Right */}
      <div
        className={`hidden sm:block absolute top-1/2 ${isRTL ? "right-4" : "left-4"} opacity-20 floating-icon`}
      >
        <div className="w-6 h-6 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center">
          <Users className="w-3 h-3 text-primary" />
        </div>
      </div>

      {/* Middle Right/Left */}
      <div
        className={`hidden sm:block absolute top-1/2 ${isRTL ? "left-8" : "right-8"} opacity-30 floating-icon`}
      >
        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Bottom Left/Right */}
      <div
        className={`hidden sm:block absolute bottom-32 ${isRTL ? "right-1/4" : "left-1/4"} opacity-25 floating-icon`}
      >
        <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* Dot Patterns */}
      {/* Top Right/Left Dots Pattern */}
      <div
        className={`hidden sm:block absolute top-24 ${isRTL ? "left-1/5" : "right-1/5"} opacity-20 decorative-pattern rotate-continuous`}
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
                className="pulse-dot"
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
        className={`hidden sm:block absolute bottom-16 ${isRTL ? "right-1/3" : "left-1/3"} opacity-15 decorative-pattern`}
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
                className="pulse-dot"
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
        className={`hidden sm:block absolute top-40 ${isRTL ? "left-1/6" : "right-1/6"} opacity-20 decorative-pattern`}
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
                className="pulse-dot"
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
        className={`hidden sm:block absolute top-1/3 ${isRTL ? "right-1/6" : "left-1/6"} opacity-15 decorative-pattern`}
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
                className="pulse-dot"
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
          <h2
            ref={titleRef}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight font-sans"
          >
            {t("faq.title")}{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t("faq.titleHighlight")}
            </span>
          </h2>
          <p
            ref={descriptionRef}
            className={`text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed ${isRTL && "font-medium"}`}
          >
            {t("faq.description")}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div ref={accordionRef} className="space-y-4">
          <Accordion type="single" collapsible className="w-full space-y-5">
            {/* Question 1: What is Resource Hub? */}
            <AccordionItem
              value="what-is-resource-hub"
              className="border-none faq-item"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-150 overflow-hidden hover:shadow-lg hover:scale-[1.01]">
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
            <AccordionItem
              value="how-credits-work"
              className="border-none faq-item"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-150 overflow-hidden hover:shadow-lg hover:scale-[1.01]">
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
            <AccordionItem
              value="supported-platforms"
              className="border-none faq-item"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-150 overflow-hidden hover:shadow-lg hover:scale-[1.01]">
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
            <AccordionItem
              value="how-to-download"
              className="border-none faq-item"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-150 overflow-hidden hover:shadow-lg hover:scale-[1.01]">
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
            <AccordionItem
              value="safety-legal"
              className="border-none faq-item"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-150 overflow-hidden hover:shadow-lg hover:scale-[1.01]">
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
            <AccordionItem
              value="music-restrictions"
              className="border-none faq-item"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-150 overflow-hidden hover:shadow-lg hover:scale-[1.01]">
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
