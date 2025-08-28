"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { AuthButtons } from "@/components/auth-buttons";
import { useLanguage } from "@/components/i18n-provider";
import { UserDropdown } from "@/components/user-dropdown";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { LanguageToggleButton } from "@/components/language-toggle-button";

export function HeaderControls() {
  const { isRTL } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div
      className={`flex items-center gap-1 sm:gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
    >
      {/* Theme Toggle Button */}
      <div className="hidden xs:block">
        <ThemeToggleButton />
      </div>
      {/* Language Toggle Button */}
      <div className="hidden xs:block">
        <LanguageToggleButton />
      </div>
      {/* Mobile Controls - Show only on very small screens */}
      <div className="flex items-center gap-1 xs:hidden">
        <ThemeToggleButton />
        <LanguageToggleButton />
      </div>
      {/* Authentication Controls */}
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
  );
}
