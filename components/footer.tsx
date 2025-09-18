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
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const { t } = useTranslation("common");
  const { isRTL, language } = useLanguage();
  
  // Refs for animations
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const quickLinksRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);
  const socialSectionRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);

  // Animation setup
  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states - only opacity and y position, no scale/transform
      gsap.set(logoRef.current, { opacity: 0, y: 30 });
      gsap.set(descriptionRef.current, { opacity: 0, y: 20 });
      gsap.set(contactInfoRef.current, { opacity: 0, y: 25 });
      gsap.set(".footer-section", { opacity: 0, y: 40 });
      gsap.set(".footer-link", { opacity: 0, y: 15 });
      gsap.set(".social-icon", { opacity: 0, y: 20 });
      gsap.set(copyrightRef.current, { opacity: 0, y: 15 });

      // Logo animation
      gsap.to(logoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      // Description animation
      gsap.to(descriptionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      // Contact info animation
      gsap.to(contactInfoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      // Footer sections staggered animation
      gsap.to(".footer-section", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Footer links staggered animation
      gsap.to(".footer-link", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power1.out",
        delay: 0.3,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });

      // Social icons animation
      gsap.to(".social-icon", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: socialSectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      // Copyright animation
      gsap.to(copyrightRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: socialSectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });


    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-foreground dark:bg-muted border-t border-border py-16 lg:py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      <div className="container mx-auto max-w-7xl px-5 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <div ref={logoRef} className="flex items-center space-x-3">
                <Link
                  href="/"
                  aria-label={t("header.logo")}
                  className="flex items-center"
                >
                  <div className="relative w-44 sm:w-48 h-12">
                    {language === "ar" ? (
                      <Image
                        src="/logo-white-ar.png"
                        alt={t("header.logo")}
                        fill
                        priority
                      />
                    ) : (
                      <Image
                        src="/logo-white-en.png"
                        alt={t("header.logo")}
                        fill
                        priority
                      />
                    )}
                  </div>
                </Link>
              </div>
              <p
                ref={descriptionRef}
                className={`text-background/80 dark:text-muted-foreground leading-relaxed text-sm lg:text-base ${isRTL ? "font-tajawal font-medium" : "font-sans"}`}
              >
                {t("footer.description")}
              </p>
            </div>
            {/* Contact Info */}
            <div ref={contactInfoRef} className="space-y-3">
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
          <div ref={quickLinksRef} className="space-y-6 footer-section">
            <h3
              className={`text-lg font-semibold text-background dark:text-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
            >
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-3">
              {[
                { name: t("footer.links.home"), href: "/#home" },
                { name: t("footer.links.categories"), href: "/#platforms" },
                { name: t("footer.links.pricing"), href: "/#pricing" },
                { name: t("footer.links.about"), href: "/#features" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`footer-link text-background/80 dark:text-muted-foreground hover:text-primary dark:hover:text-primary hover:underline transition-all duration-200 text-sm lg:text-base ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Resources */}
          <div ref={resourcesRef} className="space-y-6 footer-section">
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
                { name: t("footer.links.videos"), href: "/search?q=videos" },
                {
                  name: t("footer.links.templates"),
                  href: "/search?q=templates",
                },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`footer-link text-background/80 dark:text-muted-foreground hover:text-primary dark:hover:text-primary hover:underline transition-all duration-200 text-sm lg:text-base ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Support & Legal */}
          <div ref={supportRef} className="space-y-6 footer-section">
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
                {
                  name: t("footer.links.cookiePolicy"),
                  href: "/cookie-policy",
                },
                { name: t("footer.links.faq"), href: "/faq" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`footer-link text-background/80 dark:text-muted-foreground hover:text-primary dark:hover:text-primary hover:underline transition-all duration-200 text-sm lg:text-base ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Social Media & Bottom Section */}
        <div ref={socialSectionRef} className="mt-12 pt-8 border-t border-background/10 dark:border-border">
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
                    className="social-icon w-9 h-9 bg-muted/15 dark:bg-background/20 hover:bg-primary/10 border border-transparent hover:border-primary/30 rounded-lg flex items-center justify-center transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4 text-background/70 dark:text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>
            {/* Copyright */}
            <div
              ref={copyrightRef}
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
