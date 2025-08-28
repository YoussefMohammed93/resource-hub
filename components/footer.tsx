import {
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/components/i18n-provider";

export default function Footer() {
  const { t } = useTranslation("common");
  const { isRTL } = useLanguage();

  return (
    <footer className="bg-foreground dark:bg-muted border-t border-border py-16 lg:py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      <div className="container mx-auto max-w-7xl px-5 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-primary-foreground rounded-sm"></div>
                </div>
                <span
                  className={`text-xl font-bold text-background dark:text-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
                >
                  {t("header.logo")}
                </span>
              </div>
              <p
                className={`text-background/80 dark:text-muted-foreground leading-relaxed text-sm lg:text-base ${isRTL ? "font-tajawal font-medium" : "font-sans"}`}
              >
                {t("footer.description")}
              </p>
            </div>
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span
                  className={`text-background/80 dark:text-muted-foreground text-sm ${isRTL ? "font-tajawal" : "font-sans"}`}
                >
                  support@resourcehub.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span
                  className={`text-background/80 dark:text-muted-foreground text-sm ${isRTL ? "font-tajawal" : "font-sans"}`}
                >
                  123 Creative Street, Design City
                </span>
              </div>
            </div>
          </div>
          {/* Quick Links */}
          <div className="space-y-6">
            <h3
              className={`text-lg font-semibold text-background dark:text-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
            >
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-3">
              {[
                { name: t("footer.links.home"), href: "/" },
                { name: t("footer.links.categories"), href: "/categories" },
                { name: t("footer.links.pricing"), href: "/pricing" },
                { name: t("footer.links.about"), href: "/about" },
                { name: t("footer.links.contactSupport"), href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-background/80 dark:text-muted-foreground hover:text-primary dark:hover:text-primary hover:underline transition-all duration-200 text-sm lg:text-base ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Resources */}
          <div className="space-y-6">
            <h3
              className={`text-lg font-semibold text-background dark:text-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
            >
              {t("footer.resources")}
            </h3>
            <ul className="space-y-3">
              {[
                {
                  name: t("footer.links.stockPhotos"),
                  href: "/search?q=photos",
                },
                { name: t("footer.links.vectors"), href: "/search?q=vectors" },
                {
                  name: t("footer.links.illustrations"),
                  href: "/search?q=illustrations",
                },
                { name: t("footer.links.videos"), href: "/search?q=videos" },
                {
                  name: t("footer.links.templates"),
                  href: "/search?q=templates",
                },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-background/80 dark:text-muted-foreground hover:text-primary dark:hover:text-primary hover:underline transition-all duration-200 text-sm lg:text-base ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Support & Legal */}
          <div className="space-y-6">
            <h3
              className={`text-lg font-semibold text-background dark:text-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
            >
              {t("footer.support")} & {t("footer.legal")}
            </h3>
            <ul className="space-y-3">
              {[
                { name: t("footer.links.helpCenter"), href: "/help" },
                { name: t("footer.links.termsOfService"), href: "/terms" },
                { name: t("footer.links.privacyPolicy"), href: "/privacy" },
                { name: t("footer.links.cookiePolicy"), href: "/cookie-policy" },
                { name: t("footer.links.faq"), href: "/faq" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-background/80 dark:text-muted-foreground hover:text-primary dark:hover:text-primary hover:underline transition-all duration-200 text-sm lg:text-base ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Social Media & Bottom Section */}
        <div className="mt-12 pt-8 border-t border-background/10 dark:border-border">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              <span
                className={`text-background/80 dark:text-muted-foreground text-sm font-medium ${isRTL ? "font-tajawal" : "font-sans"}`}
              >
                {t("footer.followUs")}:
              </span>
              <div className="flex items-center space-x-3">
                {[
                  {
                    icon: Facebook,
                    href: "https://facebook.com",
                    label: "Facebook",
                  },
                  {
                    icon: Twitter,
                    href: "https://twitter.com",
                    label: "Twitter",
                  },
                  {
                    icon: Instagram,
                    href: "https://instagram.com",
                    label: "Instagram",
                  },
                  {
                    icon: Linkedin,
                    href: "https://linkedin.com",
                    label: "LinkedIn",
                  },
                  {
                    icon: Github,
                    href: "https://github.com",
                    label: "GitHub",
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-muted/15 dark:bg-background/20 hover:bg-primary/10 border border-transparent hover:border-primary/30 rounded-lg flex items-center justify-center transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4 text-background/70 dark:text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>
            {/* Copyright */}
            <div
              className={`flex items-center space-x-2 text-background/80 dark:text-muted-foreground text-sm ${isRTL ? "font-tajawal" : "font-sans"}`}
            >
              <span>
                ©{new Date().getFullYear()} {t("header.logo")},{" "}
                {t("footer.allRightsReserved")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
