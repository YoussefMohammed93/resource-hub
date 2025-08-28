"use client";

import {
  BarChart3,
  Users,
  Globe,
  DollarSign,
  LogOut,
  X,
  User,
  Cookie,
  Radio,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/components/i18n-provider";
import { useAuth } from "@/components/auth-provider";

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const Sidebar = ({ isOpen = false, onToggle }: SidebarProps) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation("common");
  const { isRTL } = useLanguage();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLinkClick = () => {
    if (isMobile && onToggle) {
      onToggle();
    }
  };

  const handleSectionScroll = (sectionId: string) => {
    if (pathname === "/dashboard") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    handleLinkClick();
  };

  const handleSignOut = async () => {
    if (isAuthenticated) {
      await logout();
    }
    handleLinkClick();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      {/* Sidebar */}
      <aside
        className={cn(
          `fixed ${isRTL ? "right-0 border-l" : "left-0 border-r"} top-0 w-72 h-screen bg-background border-border z-50 transition-transform duration-300 ease-in-out ${isRTL ? "font-tajawal" : "font-sans"}`,
          isMobile
            ? isOpen
              ? "translate-x-0"
              : isRTL
                ? "translate-x-full"
                : "-translate-x-full"
            : "translate-x-0"
        )}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Mobile Close Button */}
          {isMobile && (
            <div
              className={`absolute ${isRTL ? "left-6" : "right-6"} top-2 lg:hidden`}
            >
              <button
                onClick={onToggle}
                className="cursor-pointer p-2 hover:bg-muted rounded-lg transition-colors min-h-[33px] min-w-[33px] flex items-center justify-center"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          )}
          <div className="space-y-6">
            <div>
              <div
                className={`flex items-center ${isRTL ? "space-x-reverse !space-x-2" : "space-x-2"} text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3`}
              >
                <div className="size-3 bg-primary rounded-full"></div>
                <span className="text-sm">
                  {t("sidebar.sections.overview")}
                </span>
              </div>
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  onClick={handleLinkClick}
                  className={cn(
                    `flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"} px-3 py-2 rounded-lg transition-colors`,
                    pathname === "/dashboard"
                      ? "bg-secondary text-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  <div className="size-8 bg-blue-500 flex items-center justify-center">
                    <BarChart3 className="size-4 text-white" />
                  </div>
                  <span
                    className={cn(
                      "text-base font-medium",
                      pathname === "/dashboard"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {t("sidebar.navigation.dashboard")}
                  </span>
                </Link>
                <Link
                  href="/broadcast"
                  onClick={handleLinkClick}
                  className={cn(
                    `flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"} px-3 py-2 rounded-lg transition-colors`,
                    pathname === "/broadcast"
                      ? "bg-secondary text-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  <div className="size-8 bg-orange-500 flex items-center justify-center">
                    <Radio className="size-4 text-white" />
                  </div>
                  <span
                    className={cn(
                      "text-base font-medium",
                      pathname === "/broadcast"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {t("sidebar.navigation.broadcast")}
                  </span>
                </Link>
              </div>
            </div>
            <div>
              <div
                className={`flex items-center ${isRTL ? "space-x-reverse !space-x-2" : "space-x-2"} text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3`}
              >
                <div className="size-3 bg-primary rounded-full"></div>
                <span className="text-sm">
                  {t("sidebar.sections.management")}
                </span>
              </div>
              <div className="space-y-1">
                {pathname === "/dashboard" ? (
                  <>
                    <button
                      onClick={() => handleSectionScroll("users-management")}
                      className={cn(
                        `cursor-pointer flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"} px-3 py-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground w-full ${isRTL ? "text-right" : "text-left"}`
                      )}
                    >
                      <div className="size-8 bg-green-500 flex items-center justify-center">
                        <Users className="size-4 text-white" />
                      </div>
                      <span className="text-base text-muted-foreground">
                        {t("sidebar.navigation.usersManagement")}
                      </span>
                    </button>
                    <button
                      onClick={() => handleSectionScroll("sites-management")}
                      className={cn(
                        `cursor-pointer flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"} px-3 py-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground w-full ${isRTL ? "text-right" : "text-left"}`
                      )}
                    >
                      <div className="size-8 bg-orange-500 flex items-center justify-center">
                        <Globe className="size-4 text-white" />
                      </div>
                      <span className="text-base text-muted-foreground">
                        {t("sidebar.navigation.sitesManagement")}
                      </span>
                    </button>
                    <button
                      onClick={() => handleSectionScroll("pricing-management")}
                      className={cn(
                        `cursor-pointer flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"} px-3 py-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground w-full ${isRTL ? "text-right" : "text-left"}`
                      )}
                    >
                      <div className="size-8 bg-yellow-500 flex items-center justify-center">
                        <DollarSign className="size-4 text-white" />
                      </div>
                      <span className="text-base text-muted-foreground">
                        {t("sidebar.navigation.pricingManagement")}
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/users"
                      onClick={handleLinkClick}
                      className={cn(
                        `flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"} px-3 py-2 rounded-lg transition-colors`,
                        pathname === "/users"
                          ? "bg-secondary text-foreground"
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <div className="size-8 bg-green-500 flex items-center justify-center">
                        <Users className="size-4 text-white" />
                      </div>
                      <span
                        className={cn(
                          "text-base",
                          pathname === "/users"
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {t("sidebar.navigation.usersManagement")}
                      </span>
                    </Link>
                    <Link
                      href="/sites"
                      onClick={handleLinkClick}
                      className={cn(
                        `flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"} px-3 py-2 rounded-lg transition-colors`,
                        pathname === "/sites"
                          ? "bg-secondary text-foreground"
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <div className="size-8 bg-orange-500 flex items-center justify-center">
                        <Globe className="size-4 text-white" />
                      </div>
                      <span
                        className={cn(
                          "text-base",
                          pathname === "/sites"
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {t("sidebar.navigation.sitesManagement")}
                      </span>
                    </Link>
                    <Link
                      href="/pricing"
                      onClick={handleLinkClick}
                      className={cn(
                        `flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"} px-3 py-2 rounded-lg transition-colors`,
                        pathname === "/pricing"
                          ? "bg-secondary text-foreground"
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <div className="size-8 bg-yellow-500 flex items-center justify-center">
                        <DollarSign className="size-4 text-white" />
                      </div>
                      <span
                        className={cn(
                          "text-base",
                          pathname === "/pricing"
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {t("sidebar.navigation.pricingManagement")}
                      </span>
                    </Link>
                  </>
                )}
                <Link
                  href="/cookies"
                  onClick={handleLinkClick}
                  className={cn(
                    `flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"} px-3 py-2 rounded-lg transition-colors`,
                    pathname === "/cookies"
                      ? "bg-secondary text-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  <div className="size-8 bg-purple-500 flex items-center justify-center">
                    <Cookie className="size-4 text-white" />
                  </div>
                  <span
                    className={cn(
                      "text-base",
                      pathname === "/cookies"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {t("sidebar.navigation.cookiesManagement")}
                  </span>
                </Link>
              </div>
            </div>
            <div>
              <div
                className={`flex items-center ${isRTL ? "space-x-reverse !space-x-2" : "space-x-2"} text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3`}
              >
                <div className="size-3 bg-primary rounded-full"></div>
                <span className="text-sm">{t("sidebar.sections.account")}</span>
              </div>
              <div className="space-y-1">
                <Link
                  href="/profile"
                  onClick={handleLinkClick}
                  className={cn(
                    `flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"} px-3 py-2 rounded-lg transition-colors`,
                    pathname === "/profile"
                      ? "bg-secondary text-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  <div className="size-8 bg-purple-500 flex items-center justify-center">
                    <User className="size-4 text-white" />
                  </div>
                  <span
                    className={cn(
                      "text-base",
                      pathname === "/profile"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {t("sidebar.navigation.profile")}
                  </span>
                </Link>
                {isAuthenticated && (
                  <button
                    onClick={handleSignOut}
                    className={`cursor-pointer flex items-center ${isRTL ? "space-x-reverse !space-x-3" : "space-x-3"} px-3 py-2 rounded-lg hover:bg-muted w-full ${isRTL ? "text-right" : "text-left"}`}
                  >
                    <div className="size-8 bg-pink-500 flex items-center justify-center">
                      <LogOut className="size-4 text-white" />
                    </div>
                    <span className="text-base text-muted-foreground">
                      {t("sidebar.navigation.signOut")}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
