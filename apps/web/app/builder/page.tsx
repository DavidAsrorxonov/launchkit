import type { Metadata } from "next";

import { BuilderShell } from "@/components/builder/builder-shell";
import { ogImage, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "BaseForge Builder",
  description:
    "Choose your stack, preview generated output, and download a ready-to-edit project.",
  alternates: {
    canonical: "/builder",
  },
  openGraph: {
    title: "BaseForge Builder",
    description:
      "Choose your stack, preview generated output, and download a ready-to-edit project.",
    url: "/builder",
    siteName,
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "BaseForge Builder",
    description:
      "Choose your stack, preview generated output, and download a ready-to-edit project.",
    images: [ogImage.url],
  },
};

export default function BuilderPage() {
  return <BuilderShell />;
}
