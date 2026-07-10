import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/landing-page";
import { ogImage, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "BaseForge - Next.js project generator",
  description: "Generate modern TypeScript-first Next.js projects with BaseForge.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BaseForge - Next.js project generator",
    description:
      "Generate modern TypeScript-first Next.js projects with BaseForge.",
    url: "/",
    siteName,
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "BaseForge - Next.js project generator",
    description:
      "Generate modern TypeScript-first Next.js projects with BaseForge.",
    images: [ogImage.url],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BaseForge",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: siteUrl,
  description:
    "Generate modern TypeScript-first Next.js projects with optional shadcn/ui, PostgreSQL, Prisma, Auth.js, and Docker setup.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
