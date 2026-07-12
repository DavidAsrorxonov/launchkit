export const baseStructure = `app/
  layout.tsx
  page.tsx
  globals.css
components/
lib/
package.json
tsconfig.json
next.config.ts
postcss.config.mjs
.env.example
.gitignore
README.md`;

export const coreFiles = [
  [
    "app/layout.tsx",
    "Owns the root HTML shell, app metadata, and shared layout wrapper.",
  ],
  [
    "app/page.tsx",
    "Starts as the editable home page for the generated product.",
  ],
  [
    "app/globals.css",
    "Holds global styles and Tailwind imports for the generated app.",
  ],
  [
    "package.json",
    "Defines generated dependencies and scripts for development, checks, and production builds.",
  ],
  [
    ".env.example",
    "Documents required environment variables when selected features need runtime configuration.",
  ],
] as const;

export const optionalFiles = [
  {
    title: "shadcn/ui",
    purpose: "Component-system starter files.",
    files: ["components.json", "lib/utils.ts", "components/ui/button.tsx"],
  },
  {
    title: "PostgreSQL",
    purpose: "Database connection placeholder.",
    files: ["DATABASE_URL in .env.example"],
  },
  {
    title: "Prisma",
    purpose: "Typed database schema and client helper.",
    files: ["prisma/schema.prisma", "prisma.config.ts", "lib/db.ts"],
  },
  {
    title: "Auth.js credentials",
    purpose: "Credentials auth route and shared Auth.js options.",
    files: [
      "auth.ts",
      "app/api/auth/[...nextauth]/route.ts",
      "AUTH_SECRET in .env.example",
    ],
  },
  {
    title: "Docker PostgreSQL",
    purpose: "Local development database service.",
    files: ["docker-compose.yml"],
  },
] as const;
