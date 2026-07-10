# BaseForge SEO and Indexing Setup for Vercel Deployment

You are working on BaseForge.

Production domain:

```txt
https://baseforge.dovudkhon.com
```

Deployment target:

```txt
Vercel
```

Deployed app root:

```txt
apps/web
```

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm the website app lives in `apps/web`.
4. Confirm Vercel will import the whole GitHub repo but use `apps/web` as the Root Directory.
5. Implement only SEO/indexing/deployment-prep changes for the web app.

Do not change CLI package publishing behavior.
Do not change generator behavior.
Do not add new product options.
Do not move the app out of `apps/web`.
Use npm.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Prepare the deployed BaseForge website for indexing and sharing.

This step should add or verify:

- canonical production URL
- Next.js metadata
- route-specific SEO metadata
- `sitemap.ts`
- `robots.ts`
- Open Graph/Twitter preview image support
- basic structured data
- indexability checks
- Vercel environment variable guidance

All implementation work should happen in:

```txt
apps/web
```

because that is the app Vercel deploys.

## Canonical Site URL

Use this exact production URL:

```txt
https://baseforge.dovudkhon.com
```

Add or update:

```txt
apps/web/.env.example
```

with:

```env
NEXT_PUBLIC_SITE_URL="https://baseforge.dovudkhon.com"
```

In Vercel, the user must set:

```txt
NEXT_PUBLIC_SITE_URL=https://baseforge.dovudkhon.com
```

for Production.

Preview deployments may still use the production canonical URL.

## Required Files

Create or update:

```txt
apps/web/app/layout.tsx
apps/web/app/sitemap.ts
apps/web/app/robots.ts
apps/web/app/page.tsx
apps/web/app/builder/page.tsx
apps/web/app/docs/page.tsx
apps/web/public/og-image.png, if missing or if an existing image is unsuitable
apps/web/.env.example
```

Adjust paths if the existing app structure differs.

## 1. Global Metadata

In:

```txt
apps/web/app/layout.tsx
```

add or verify App Router metadata.

Required:

- `metadataBase`
- default title
- title template
- description
- canonical URL
- Open Graph metadata
- Twitter metadata
- robots/indexing metadata

Recommended metadata shape:

```ts
import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://baseforge.dovudkhon.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BaseForge",
    template: "%s | BaseForge",
  },
  description:
    "Generate modern TypeScript-first Next.js projects with Tailwind, shadcn/ui, PostgreSQL, Prisma, Auth.js, and Docker options.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BaseForge",
    description:
      "Generate modern TypeScript-first Next.js projects from a builder UI or CLI.",
    url: "/",
    siteName: "BaseForge",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BaseForge project generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BaseForge",
    description:
      "Generate modern TypeScript-first Next.js projects from a builder UI or CLI.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

Adapt copy to match existing product language, but keep it accurate.

Do not mention unsupported features.

## 2. Route-Specific Metadata

Add route-specific metadata where supported by the current app structure.

Recommended:

```txt
/        BaseForge - Next.js project generator
/builder BaseForge Builder
/docs    BaseForge Docs
```

Descriptions:

```txt
/:
  Generate modern TypeScript-first Next.js projects with BaseForge.

/builder:
  Choose your stack, preview generated output, and download a ready-to-edit project.

/docs:
  Learn how BaseForge generates projects, which options are supported, and how to use the CLI.
```

If a page is a client component and cannot export metadata directly, use a parent server page wrapper or metadata-capable route file.

Do not break existing client components.

## 3. sitemap.ts

Create:

```txt
apps/web/app/sitemap.ts
```

Use:

```ts
import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://baseforge.dovudkhon.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/builder`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/docs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
```

After deployment, it must be available at:

```txt
https://baseforge.dovudkhon.com/sitemap.xml
```

## 4. robots.ts

Create:

```txt
apps/web/app/robots.ts
```

Use:

```ts
import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://baseforge.dovudkhon.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

After deployment, it must be available at:

```txt
https://baseforge.dovudkhon.com/robots.txt
```

## 5. Open Graph Image

Ensure a social preview image exists at:

```txt
apps/web/public/og-image.png
```

Recommended size:

```txt
1200x630
```

It should be visually aligned with the landing page:

- dark background
- green accent
- BaseForge name
- short project-generator message

If no suitable image exists, create a simple static asset or document that a design asset is needed.

Do not use broken metadata image references.

## 6. Icons

Check whether the app has icons:

```txt
apps/web/app/icon.png
apps/web/app/apple-icon.png
```

or:

```txt
apps/web/public/icon.png
apps/web/public/apple-icon.png
```

Add only if the current app does not already have acceptable icons.

Keep the icon simple and brand-consistent.

## 7. Structured Data

Add JSON-LD to the landing page if it fits the current page architecture.

Use accurate `SoftwareApplication` structured data:

```tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BaseForge",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: "https://baseforge.dovudkhon.com",
  description:
    "Generate modern TypeScript-first Next.js projects with optional shadcn/ui, PostgreSQL, Prisma, Auth.js, and Docker setup.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};
```

Render:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

Do not claim:

- ratings
- reviews
- organization details
- pricing
- unsupported features

unless they are real.

## 8. Heading And Content Checks

Verify each public page has a clear primary heading.

Recommended:

```txt
/        BaseForge
/builder Build your Next.js project
/docs    BaseForge documentation
```

Avoid multiple unrelated `h1` headings on one page.

Page content should naturally include relevant terms:

```txt
Next.js project generator
TypeScript project generator
Tailwind starter
shadcn/ui starter
Prisma starter
PostgreSQL starter
Auth.js scaffold
Docker Compose
```

Do not keyword-stuff.

## 9. Indexability Check

Search:

```bash
rg "noindex|nofollow|robots" apps/web
```

Confirm there is no accidental production `noindex`.

`robots.ts` should allow:

```txt
/
```

and reference:

```txt
https://baseforge.dovudkhon.com/sitemap.xml
```

## 10. Vercel Configuration Notes

Do not move code for Vercel.

The correct Vercel setup is:

```txt
Import GitHub repo: whole repo
Root Directory: apps/web
Framework Preset: Next.js
Environment Variable:
  NEXT_PUBLIC_SITE_URL=https://baseforge.dovudkhon.com
```

Vercel custom domain:

```txt
baseforge.dovudkhon.com
```

The user must configure DNS in the domain provider according to Vercel's instructions for this subdomain.

Do not hardcode Vercel preview URLs as canonical URLs.

## 11. Verification Commands

Run:

```bash
npm run typecheck -w apps/web
npm run build -w apps/web
```

If available:

```bash
npm test -w apps/web
npm run lint -w apps/web
```

Also run broader checks if practical:

```bash
npm run typecheck
npm test
npm run build
```

Use actual workspace command names from the repo.

If commands do not exist, record that clearly in `progress-tracker.md`.

## 12. Local Verification

If possible, start the built app:

```bash
npm run start -w apps/web
```

or run the dev server:

```bash
npm run dev -w apps/web
```

Check:

```txt
http://localhost:3000/sitemap.xml
http://localhost:3000/robots.txt
```

The local sitemap may use `https://baseforge.dovudkhon.com`, which is expected because canonical production URL is fixed through `NEXT_PUBLIC_SITE_URL`.

## 13. Post-Deployment Verification

After Vercel deployment and domain connection, verify:

```txt
https://baseforge.dovudkhon.com
https://baseforge.dovudkhon.com/builder
https://baseforge.dovudkhon.com/docs
https://baseforge.dovudkhon.com/sitemap.xml
https://baseforge.dovudkhon.com/robots.txt
https://baseforge.dovudkhon.com/og-image.png
```

Confirm:

- pages load with 200 status
- sitemap uses `https://baseforge.dovudkhon.com`
- robots.txt points to `https://baseforge.dovudkhon.com/sitemap.xml`
- metadata title/description are correct
- OG image loads
- no accidental `noindex`
- landing, builder, and docs links work

## 14. Search Console Follow-Up

After production domain is live, the user should:

1. Open Google Search Console.
2. Add the property:

```txt
baseforge.dovudkhon.com
```

or a domain-level property for:

```txt
dovudkhon.com
```

3. Verify ownership.
4. Submit:

```txt
https://baseforge.dovudkhon.com/sitemap.xml
```

5. Inspect:

```txt
https://baseforge.dovudkhon.com
```

and request indexing if needed.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
SEO/deployment prep completed for BaseForge web app

Production URL:
- https://baseforge.dovudkhon.com

Changes made:
- Added or verified NEXT_PUBLIC_SITE_URL example.
- Added or verified App Router metadata.
- Added or verified route-specific metadata.
- Added sitemap.ts.
- Added robots.ts.
- Added or verified Open Graph image.
- Added or verified structured data.
- Checked indexability.
- Documented Vercel root directory and environment variable.

Files changed:
- apps/web/app/layout.tsx
- apps/web/app/sitemap.ts
- apps/web/app/robots.ts
- apps/web/app/page.tsx, if changed
- apps/web/app/builder/page.tsx, if changed
- apps/web/app/docs/page.tsx, if changed
- apps/web/public/og-image.png, if added
- apps/web/.env.example
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Post-deployment checks:
- Verify https://baseforge.dovudkhon.com/sitemap.xml
- Verify https://baseforge.dovudkhon.com/robots.txt
- Submit sitemap to Google Search Console
```

## Completion Criteria

This step is complete when:

- canonical production URL is `https://baseforge.dovudkhon.com`
- `NEXT_PUBLIC_SITE_URL` is documented
- `sitemap.ts` exists
- `robots.ts` exists
- metadata is set
- important routes have metadata
- Open Graph image is present or blocker is documented
- structured data is added or intentionally skipped with reason
- no accidental `noindex` exists
- Vercel setup notes use `apps/web` as Root Directory
- build passes, or unrelated failures are documented
- `progress-tracker.md` is updated

Then stop.
