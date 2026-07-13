import type { Metadata } from "next";

import { PrivacyPage } from "@/components/legal/privacy-page";
import { ogImage, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How BaseForge handles project generation requests, analytics, logs, and privacy choices.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy",
    description:
      "How BaseForge handles project generation requests, analytics, logs, and privacy choices.",
    url: "/privacy",
    siteName,
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy",
    description:
      "How BaseForge handles project generation requests, analytics, logs, and privacy choices.",
    images: [ogImage.url],
  },
};

export default function PrivacyRoute() {
  return <PrivacyPage />;
}
