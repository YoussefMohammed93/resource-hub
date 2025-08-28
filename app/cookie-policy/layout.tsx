import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - ResourceHub | Cookie Usage & Management",
  description:
    "Learn about how ResourceHub uses cookies to enhance your browsing experience. Comprehensive cookie policy covering essential cookies, analytics cookies, marketing cookies, third-party cookies, and your cookie management options.",
  keywords: [
    "cookie policy",
    "cookies",
    "web cookies",
    "tracking cookies",
    "essential cookies",
    "analytics cookies",
    "marketing cookies",
    "third-party cookies",
    "cookie management",
    "browser cookies",
    "ResourceHub cookies",
    "cookie consent",
    "cookie preferences",
    "data tracking",
    "website functionality",
    "user experience",
    "privacy settings",
    "cookie types",
    "cookie duration",
    "cookie control",
  ],
  authors: [
    {
      name: "ResourceHub Legal Team",
      url: "https://resourcehub.com/legal",
    },
  ],
  creator: "ResourceHub",
  publisher: "ResourceHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://resourcehub.com"),
  alternates: {
    canonical: "https://resourcehub.com/cookie-policy",
    languages: {
      "en-US": "https://resourcehub.com/cookie-policy",
      "ar-SA": "https://resourcehub.com/ar/cookie-policy",
    },
  },
  openGraph: {
    title: "Cookie Policy - ResourceHub | Cookie Usage & Management",
    description:
      "Learn about how ResourceHub uses cookies to enhance your browsing experience. Comprehensive cookie policy covering essential cookies, analytics cookies, marketing cookies, and your cookie management options.",
    url: "https://resourcehub.com/cookie-policy",
    siteName: "ResourceHub",
    images: [
      {
        url: "/og-cookie-policy.jpg",
        width: 1200,
        height: 630,
        alt: "ResourceHub Cookie Policy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy - ResourceHub | Cookie Usage & Management",
    description:
      "Learn about how ResourceHub uses cookies to enhance your browsing experience. Comprehensive cookie policy covering essential cookies, analytics cookies, marketing cookies, and your cookie management options.",
    images: ["/og-cookie-policy.jpg"],
    creator: "@resourcehub",
  },
  category: "Legal",
  other: {
    "cookie-policy-version": "1.0",
    "last-updated": "2025-01-15",
    "effective-date": "2025-01-15",
    "gdpr-compliant": "true",
    "ccpa-compliant": "true",
  },
};

export default function CookiePolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Structured Data for Cookie Policy */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://resourcehub.com/cookie-policy",
            url: "https://resourcehub.com/cookie-policy",
            name: "Cookie Policy - ResourceHub",
            description:
              "Learn about how ResourceHub uses cookies to enhance your browsing experience. Comprehensive cookie policy covering essential cookies, analytics cookies, marketing cookies, third-party cookies, and your cookie management options.",
            isPartOf: {
              "@type": "WebSite",
              "@id": "https://resourcehub.com/#website",
              url: "https://resourcehub.com/",
              name: "ResourceHub",
              description:
                "Your ultimate destination for premium creative resources. Access millions of high-quality images, vectors, and videos from top platforms worldwide.",
              publisher: {
                "@type": "Organization",
                "@id": "https://resourcehub.com/#organization",
                name: "ResourceHub",
                url: "https://resourcehub.com/",
                logo: {
                  "@type": "ImageObject",
                  url: "https://resourcehub.com/logo.png",
                  width: 512,
                  height: 512,
                },
                sameAs: [
                  "https://twitter.com/resourcehub",
                  "https://facebook.com/resourcehub",
                  "https://linkedin.com/company/resourcehub",
                ],
              },
            },
            mainEntity: {
              "@type": "Article",
              "@id": "https://resourcehub.com/cookie-policy#article",
              headline: "Cookie Policy - ResourceHub",
              description:
                "Learn about how ResourceHub uses cookies to enhance your browsing experience. Comprehensive cookie policy covering essential cookies, analytics cookies, marketing cookies, third-party cookies, and your cookie management options.",
              datePublished: "2025-01-15T00:00:00Z",
              dateModified: "2025-01-15T00:00:00Z",
              author: {
                "@type": "Organization",
                "@id": "https://resourcehub.com/#organization",
              },
              publisher: {
                "@type": "Organization",
                "@id": "https://resourcehub.com/#organization",
              },
              inLanguage: ["en-US", "ar-SA"],
              about: [
                {
                  "@type": "Thing",
                  name: "Cookie Policy",
                  description: "Legal document explaining cookie usage",
                },
                {
                  "@type": "Thing",
                  name: "Web Cookies",
                  description: "Small data files stored by websites",
                },
                {
                  "@type": "Thing",
                  name: "Privacy Rights",
                  description: "User rights regarding data and privacy",
                },
              ],
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://resourcehub.com/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Cookie Policy",
                  item: "https://resourcehub.com/cookie-policy",
                },
              ],
            },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", "h2", ".cookie-section"],
            },
          }),
        }}
      />
      {children}
    </>
  );
}
