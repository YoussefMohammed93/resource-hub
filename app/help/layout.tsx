import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center - ResourceHub | Support & Documentation",
  description:
    "Find answers to your questions, learn how to use our platform, and get the support you need. Comprehensive help center with guides, tutorials, and FAQs.",
  keywords: [
    "help center",
    "support",
    "documentation",
    "tutorials",
    "guides",
    "FAQ",
    "ResourceHub help",
    "customer support",
    "troubleshooting",
    "how to use",
    "getting started",
    "account management",
    "billing support",
    "download help",
    "platform support",
    "API documentation",
  ],
  authors: [{ name: "ResourceHub Team" }],
  creator: "ResourceHub",
  publisher: "ResourceHub",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resourcehub.com/help",
    title: "Help Center - ResourceHub | Support & Documentation",
    description:
      "Find answers to your questions, learn how to use our platform, and get the support you need. Comprehensive help center with guides, tutorials, and FAQs.",
    siteName: "ResourceHub",
    images: [
      {
        url: "/og-help-center.jpg",
        width: 1200,
        height: 630,
        alt: "ResourceHub Help Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Center - ResourceHub | Support & Documentation",
    description:
      "Find answers to your questions, learn how to use our platform, and get the support you need.",
    images: ["/og-help-center.jpg"],
    creator: "@resourcehub",
  },
  alternates: {
    canonical: "https://resourcehub.com/help",
    languages: {
      "en-US": "https://resourcehub.com/help",
      "ar-SA": "https://resourcehub.com/ar/help",
    },
  },
  category: "Support",
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
