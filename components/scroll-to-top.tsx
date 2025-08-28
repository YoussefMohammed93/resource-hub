"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/components/i18n-provider";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation("common");
  const { isRTL } = useLanguage();

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", toggleVisibility);

    // Clean up
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 z-50 transition-all duration-300 ease-in-out",
        isRTL ? "left-6" : "right-6",
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-2 pointer-events-none"
      )}
    >
      <Button
        onClick={scrollToTop}
        size="icon"
        className={cn(
          "h-12 w-12 rounded-full bg-primary/20 border border-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 ease-in-out font-sans",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "active:scale-95",
          // Mobile optimizations
          "touch-manipulation",
          // Ensure proper touch target size on mobile
          "min-h-[44px] min-w-[44px]"
        )}
        aria-label={t("common.scrollToTop")}
        title={t("common.scrollToTop")}
      >
        <ChevronUp className="h-5 w-5 !stroke-3" />
      </Button>
    </div>
  );
}
