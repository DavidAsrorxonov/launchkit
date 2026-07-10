import type { Metadata } from "next";

import { DocsPage } from "@/components/docs/docs-page";
import { ogImage, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "BaseForge Docs",
  description:
    "Learn how BaseForge generates projects, which options are supported, and how to use the CLI.",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "BaseForge Docs",
    description:
      "Learn how BaseForge generates projects, which options are supported, and how to use the CLI.",
    url: "/docs",
    siteName,
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "BaseForge Docs",
    description:
      "Learn how BaseForge generates projects, which options are supported, and how to use the CLI.",
    images: [ogImage.url],
  },
};

export default function DocsRoute() {
  return <DocsPage />;
}
