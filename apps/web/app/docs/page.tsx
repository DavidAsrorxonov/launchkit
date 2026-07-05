import type { Metadata } from "next";

import { DocsPage } from "@/components/docs/docs-page";

export const metadata: Metadata = {
  title: "LaunchKit Docs",
  description: "Documentation for the LaunchKit website builder and generated projects.",
};

export default function DocsRoute() {
  return <DocsPage />;
}
