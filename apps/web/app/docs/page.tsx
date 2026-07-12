import type { Metadata } from "next";

import { DocsPage } from "@/components/docs/docs-page";
import { ogImage, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "BaseForge Docs",
  description:
    "Use the BaseForge web builder, configure generated projects, and understand supported web app options.",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "BaseForge Docs",
    description:
      "Use the BaseForge web builder, configure generated projects, and understand supported web app options.",
    url: "/docs",
    siteName,
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "BaseForge Docs",
    description:
      "Use the BaseForge web builder, configure generated projects, and understand supported web app options.",
    images: [ogImage.url],
  },
};

export default function DocsRoute() {
  return <DocsPage />;
}
