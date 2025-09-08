"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { AuthButtons } from "@/components/auth-buttons";
import { useLanguage } from "@/components/i18n-provider";
import { UserDropdown } from "@/components/user-dropdown";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { LanguageToggleButton } from "@/components/language-toggle-button";
import { DownloadStatusIndicator } from "@/components/download-status-indicator";
import { useHeaderControlsAnimations } from "@/hooks/use-header-controls-animations";

type HeaderControlsProps = {
  enabled?: boolean;
};

export function HeaderControls({ enabled = true }: HeaderControlsProps) {
  const { isRTL } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();
  
  const {
    controlsContainerRef,
    themeButtonRef,
    languageButtonRef,
    downloadIndicatorRef,
    mobileControlsRef,
    authControlsRef,
  } = useHeaderControlsAnimations(enabled); // Enable animations with stagger

  return (
    <div
      ref={controlsContainerRef}
      className={`flex items-center gap-1 sm:gap-2 ${isRTL ? "flex-row" : ""}`}
    >
      {/* Theme Toggle Button */}
      <div ref={themeButtonRef} className="hidden xs:block">
        <ThemeToggleButton />
      </div>
      {/* Language Toggle Button */}
      <div ref={languageButtonRef} className="hidden xs:block">
        <LanguageToggleButton />
      </div>
      {/* Download Status Indicator */}
      <div ref={downloadIndicatorRef}>
        <DownloadStatusIndicator />
      </div>
      {/* Mobile Controls - Show only on very small screens */}
      <div ref={mobileControlsRef} className="flex items-center gap-1 xs:hidden">
        <ThemeToggleButton />
        <LanguageToggleButton />
      </div>
      {/* Authentication Controls */}
      <div ref={authControlsRef}>
        {isLoading ? (
          <div className="flex items-center justify-center w-8 h-8">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        ) : isAuthenticated ? (
          <UserDropdown />
        ) : (
          <AuthButtons />
        )}
      </div>
    </div>
  );
}
