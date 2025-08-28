import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - ResourceHub | Data Protection & Privacy Rights",
  description:
    "Learn how ResourceHub protects your privacy and personal data. Comprehensive privacy policy covering data collection, usage, sharing, security measures, and your rights under GDPR and other privacy laws.",
  keywords: [
    "privacy policy",
    "data protection",
    "GDPR compliance",
    "personal information",
    "data security",
    "user rights",
    "privacy rights",
    "data collection",
    "ResourceHub privacy",
    "cookie policy",
    "data sharing",
    "international data transfers",
    "children's privacy",
    "data retention",
  ],
  authors: [{ name: "ResourceHub Privacy Team" }],
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
    url: "https://resourcehub.com/privacy",
    title: "Privacy Policy - ResourceHub | Data Protection & Privacy Rights",
    description:
      "Learn how ResourceHub protects your privacy and personal data. Comprehensive privacy policy covering data collection, usage, sharing, security measures, and your rights.",
    siteName: "ResourceHub",
    images: [
      {
        url: "/og-privacy-policy.jpg",
        width: 1200,
        height: 630,
        alt: "ResourceHub Privacy Policy - Data Protection & Privacy Rights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - ResourceHub | Data Protection & Privacy Rights",
    description:
      "Learn how ResourceHub protects your privacy and personal data. Comprehensive privacy policy covering data collection, usage, sharing, security measures, and your rights.",
    images: ["/og-privacy-policy.jpg"],
    creator: "@resourcehub",
  },
  alternates: {
    canonical: "https://resourcehub.com/privacy",
    languages: {
      "en-US": "https://resourcehub.com/privacy",
      "ar-SA": "https://resourcehub.com/ar/privacy",
    },
  },
  category: "Legal",
  other: {
    "privacy-policy-version": "1.0",
    "last-updated": "2025-01-15",
    "effective-date": "2025-01-15",
    "gdpr-compliant": "true",
    "ccpa-compliant": "true",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Structured Data for Privacy Policy */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://resourcehub.com/privacy",
            url: "https://resourcehub.com/privacy",
            name: "Privacy Policy - ResourceHub",
            description:
              "Learn how ResourceHub protects your privacy and personal data. Comprehensive privacy policy covering data collection, usage, sharing, security measures, and your rights under GDPR and other privacy laws.",
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
              },
            },
            mainEntity: {
              "@type": "Article",
              "@id": "https://resourcehub.com/privacy#article",
              headline: "Privacy Policy - ResourceHub",
              description:
                "Comprehensive privacy policy covering data collection, usage, sharing, security measures, and user rights under GDPR and other privacy laws.",
              datePublished: "2025-01-15T00:00:00+00:00",
              dateModified: "2025-01-15T00:00:00+00:00",
              author: {
                "@type": "Organization",
                "@id": "https://resourcehub.com/#organization",
              },
              publisher: {
                "@type": "Organization",
                "@id": "https://resourcehub.com/#organization",
              },
              articleSection: "Legal",
              keywords: [
                "privacy policy",
                "data protection",
                "GDPR compliance",
                "personal information",
                "data security",
                "user rights",
                "privacy rights",
                "data collection",
                "ResourceHub privacy",
                "cookie policy",
                "data sharing",
                "international data transfers",
                "children's privacy",
                "data retention",
              ],
              about: [
                {
                  "@type": "Thing",
                  name: "Data Protection",
                  description:
                    "Measures and practices to protect personal data from unauthorized access, use, or disclosure",
                },
                {
                  "@type": "Thing",
                  name: "GDPR Compliance",
                  description:
                    "Adherence to the General Data Protection Regulation requirements for data processing",
                },
                {
                  "@type": "Thing",
                  name: "Privacy Rights",
                  description:
                    "Individual rights regarding the collection, use, and protection of personal information",
                },
                {
                  "@type": "Thing",
                  name: "Data Security",
                  description:
                    "Technical and organizational measures to protect data from breaches and unauthorized access",
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
                  name: "Privacy Policy",
                  item: "https://resourcehub.com/privacy",
                },
              ],
            },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", "h2", ".privacy-section"],
            },
          }),
        }}
      />
      {children}
    </>
  );
}
