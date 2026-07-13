import type { Metadata } from "next";

import { TermsPage } from "@/components/legal/terms-page";
import { ogImage, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The rules for using BaseForge, including the builder, CLI, documentation, and generated project output.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service",
    description:
      "The rules for using BaseForge, including the builder, CLI, documentation, and generated project output.",
    url: "/terms",
    siteName,
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service",
    description:
      "The rules for using BaseForge, including the builder, CLI, documentation, and generated project output.",
    images: [ogImage.url],
  },
};

export default function TermsRoute() {
  return <TermsPage />;
}
