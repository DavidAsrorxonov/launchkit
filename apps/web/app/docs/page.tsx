import type { Metadata } from "next";

import { DocsPage } from "@/components/docs/docs-page";

export const metadata: Metadata = {
  title: "BaseForge Docs",
  description: "Documentation for the BaseForge website builder and generated projects.",
};

export default function DocsRoute() {
  return <DocsPage />;
}
