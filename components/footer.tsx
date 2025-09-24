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

  // Animation setup - Optimized for Speed and Smoothness
  useEffect(() => {
    if (!footerRef.current) return;

    // Only run animations on desktop devices (768px and above)
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    
    // If on mobile, immediately reset all elements to their natural state
    if (!isDesktop()) {
      const allElements = [
        logoRef.current,
        descriptionRef.current,
        contactInfoRef.current,
        copyrightRef.current,
      ].filter(Boolean);

      if (allElements.length > 0) {
        gsap.set(allElements, {
          opacity: 1,
          y: 0,
          clearProps: "all"
        });
      }

      // Reset footer sections
      const footerSections = document.querySelectorAll(".footer-section");
      if (footerSections.length > 0) {
        gsap.set(footerSections, {
          opacity: 1,
          y: 0,
          clearProps: "all"
        });
      }

      // Reset footer links
      const footerLinks = document.querySelectorAll(".footer-link");
      if (footerLinks.length > 0) {
        gsap.set(footerLinks, {
          opacity: 1,
          y: 0,
          clearProps: "all"
        });
      }

      // Reset social icons
      const socialIcons = document.querySelectorAll(".social-icon");
      if (socialIcons.length > 0) {
        gsap.set(socialIcons, {
          opacity: 1,
          y: 0,
          clearProps: "all"
        });
      }

      return;
    }

    const ctx = gsap.context(() => {
      // Set initial states - Reduced movement distances for smoother feel
      gsap.set(logoRef.current, { opacity: 0, y: 15 }); // Reduced from 30px to 15px
      gsap.set(descriptionRef.current, { opacity: 0, y: 10 }); // Reduced from 20px to 10px
      gsap.set(contactInfoRef.current, { opacity: 0, y: 12 }); // Reduced from 25px to 12px
      gsap.set(".footer-section", { opacity: 0, y: 20 }); // Reduced from 40px to 20px
      gsap.set(".footer-link", { opacity: 0, y: 8 }); // Reduced from 15px to 8px
      gsap.set(".social-icon", { opacity: 0, y: 10 }); // Reduced from 20px to 10px
      gsap.set(copyrightRef.current, { opacity: 0, y: 8 }); // Reduced from 15px to 8px

      // Logo animation - Faster and earlier activation
      gsap.to(logoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3, // Reduced from 0.8s to 0.3s (62% faster)
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%", // Changed from "top 85%" to "top 95%" for earlier activation
          toggleActions: "play none none reverse",
        },
      });

      // Description animation - Faster timing
      gsap.to(descriptionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.25, // Reduced from 0.7s to 0.25s (64% faster)
        delay: 0.1, // Reduced from 0.2s to 0.1s
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%", // Changed from "top 85%" to "top 95%" for earlier activation
          toggleActions: "play none none reverse",
        },
      });

      // Contact info animation - Faster and tighter timing
      gsap.to(contactInfoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.2, // Reduced from 0.6s to 0.2s (67% faster)
        delay: 0.2, // Reduced from 0.4s to 0.2s
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%", // Changed from "top 85%" to "top 95%" for earlier activation
          toggleActions: "play none none reverse",
        },
      });

      // Footer sections staggered animation - Faster and earlier
      gsap.to(".footer-section", {
        opacity: 1,
        y: 0,
        duration: 0.25, // Reduced from 0.7s to 0.25s (64% faster)
        stagger: 0.06, // Reduced from 0.15s to 0.06s (60% faster)
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%", // Changed from "top 80%" to "top 90%" for earlier activation
          toggleActions: "play none none reverse",
        },
      });

      // Footer links staggered animation - Much faster
      gsap.to(".footer-link", {
        opacity: 1,
        y: 0,
        duration: 0.2, // Reduced from 0.5s to 0.2s (60% faster)
        stagger: 0.02, // Reduced from 0.05s to 0.02s (60% faster)
        ease: "power1.out",
        delay: 0.15, // Reduced from 0.3s to 0.15s
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%", // Changed from "top 75%" to "top 85%" for earlier activation
          toggleActions: "play none none reverse",
        },
      });

      // Social icons animation - Faster entrance
      gsap.to(".social-icon", {
        opacity: 1,
        y: 0,
        duration: 0.25, // Reduced from 0.6s to 0.25s (58% faster)
        stagger: 0.04, // Reduced from 0.1s to 0.04s (60% faster)
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: socialSectionRef.current,
          start: "top 95%", // Changed from "top 85%" to "top 95%" for earlier activation
          toggleActions: "play none none reverse",
        },
      });

      // Copyright animation - Faster and tighter timing
      gsap.to(copyrightRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.25, // Reduced from 0.6s to 0.25s (58% faster)
        delay: 0.3, // Reduced from 0.8s to 0.3s (62% faster)
        ease: "power2.out",
        scrollTrigger: {
          trigger: socialSectionRef.current,
          start: "top 95%", // Changed from "top 85%" to "top 95%" for earlier activation
          toggleActions: "play none none reverse",
        },
      });
    }, footerRef);

    // Handle responsive changes
    const onResize = () => {
      if (!isDesktop()) {
        // Reset elements to their natural state on mobile
        const allElements = [
          logoRef.current,
          descriptionRef.current,
          contactInfoRef.current,
          copyrightRef.current,
        ].filter(Boolean);

        if (allElements.length > 0) {
          gsap.set(allElements, {
            opacity: 1,
            y: 0,
            clearProps: "all"
          });
        }

        // Reset footer sections
        const footerSections = document.querySelectorAll(".footer-section");
        if (footerSections.length > 0) {
          gsap.set(footerSections, {
            opacity: 1,
            y: 0,
            clearProps: "all"
          });
        }

        // Reset footer links
        const footerLinks = document.querySelectorAll(".footer-link");
        if (footerLinks.length > 0) {
          gsap.set(footerLinks, {
            opacity: 1,
            y: 0,
            clearProps: "all"
          });
        }

        // Reset social icons
        const socialIcons = document.querySelectorAll(".social-icon");
        if (socialIcons.length > 0) {
          gsap.set(socialIcons, {
            opacity: 1,
            y: 0,
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
  }, []);

  return (
    <footer
      ref={footerRef}
      className="bg-foreground dark:bg-muted border-t border-border py-16 lg:py-20 relative overflow-hidden"
    >
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
                { name: t("footer.links.pricing"), href: "/#pricing" },
                {
                  name: t("footer.links.testimonials"),
                  href: "/#testimonials",
                },
                { name: t("footer.links.features"), href: "/#features" },
                { name: t("footer.links.faq"), href: "/#faq" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`footer-link text-background/80 dark:text-muted-foreground hover:text-primary dark:hover:text-primary hover:underline transition-all duration-100 text-sm lg:text-base ${isRTL ? "font-tajawal" : "font-sans"}`}
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
                    className={`footer-link text-background/80 dark:text-muted-foreground hover:text-primary dark:hover:text-primary hover:underline transition-all duration-100 text-sm lg:text-base ${isRTL ? "font-tajawal" : "font-sans"}`}
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
                    className={`footer-link text-background/80 dark:text-muted-foreground hover:text-primary dark:hover:text-primary hover:underline transition-all duration-100 text-sm lg:text-base ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Social Media & Bottom Section */}
        <div
          ref={socialSectionRef}
          className="mt-12 pt-8 border-t border-background/10 dark:border-border"
        >
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
                    className="social-icon w-9 h-9 bg-muted/15 dark:bg-background/20 hover:bg-primary/10 border border-transparent hover:border-primary/30 rounded-lg flex items-center justify-center transition-all duration-150 group"
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
