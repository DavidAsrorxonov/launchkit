export const productionSiteUrl = "https://baseforge.dovudkhon.com";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = (
  configuredSiteUrl && configuredSiteUrl.length > 0
    ? configuredSiteUrl
    : productionSiteUrl
).replace(/\/+$/, "");

export const siteName = "BaseForge";

export const defaultSiteDescription =
  "Generate modern TypeScript-first Next.js projects with Tailwind, shadcn/ui, PostgreSQL, Prisma, Auth.js, and Docker options.";

export const socialSiteDescription =
  "Generate modern TypeScript-first Next.js projects from a builder UI or CLI.";

export const ogImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "BaseForge project generator",
};
