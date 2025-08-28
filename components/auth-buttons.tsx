"use client";

import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/i18n-provider";

export function AuthButtons() {
  const { isRTL } = useLanguage();
  const { t } = useTranslation("common");

  return (
    <div
      className={`flex items-center gap-1 sm:gap-2 ${isRTL ? "flex-row-reverse font-tajawal" : ""}`}
    >
      {/* Login Button */}
      <Link href="/login">
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-1.5 text-sm font-medium hover:bg-muted/75 transition-colors px-2 sm:px-3 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <LogIn className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">{t("auth.login") || "Login"}</span>
        </Button>
      </Link>
      {/* Register Button */}
      <Link href="/register">
        <Button
          size="sm"
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-2 sm:px-3 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <UserPlus className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">
            {t("auth.register") || "Register"}
          </span>
        </Button>
      </Link>
    </div>
  );
}
