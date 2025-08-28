import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | ResourceHub",
  description:
    "Find answers to the most common questions about ResourceHub platform, downloads, pricing, supported sites, account management, and more.",
  keywords: [
    "FAQ",
    "frequently asked questions",
    "ResourceHub help",
    "platform support",
    "download questions",
    "pricing help",
    "account management",
    "technical support",
    "creative resources",
    "stock photos",
    "vectors",
    "design assets",
  ],
  openGraph: {
    title: "FAQ - Frequently Asked Questions | ResourceHub",
    description:
      "Find answers to the most common questions about ResourceHub platform, downloads, pricing, supported sites, account management, and more.",
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - Frequently Asked Questions | ResourceHub",
    description:
      "Find answers to the most common questions about ResourceHub platform, downloads, pricing, supported sites, account management, and more.",
  },
  alternates: {
    languages: {
      en: "/faq",
      ar: "/faq",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
