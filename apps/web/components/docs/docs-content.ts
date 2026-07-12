import type { DocsNavItem } from "@/components/docs/docs-sidebar";

export const docsNavItems = [
  { id: "overview", label: "Overview" },
  { id: "web-builder-guide", label: "Web Builder Guide" },
  { id: "supported-stack", label: "Supported Stack" },
  { id: "generated-app-setup", label: "Generated App Setup" },
  { id: "feature-guides", label: "Feature Guides" },
  { id: "generated-files", label: "Generated Files" },
  { id: "environment-variables", label: "Environment Variables" },
  { id: "scripts-and-checks", label: "Scripts and Checks" },
  { id: "compatibility-rules", label: "Compatibility Rules" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "deployment-notes", label: "Deployment Notes" },
  { id: "limitations", label: "Limitations" },
] as const satisfies readonly DocsNavItem[];

export const quickStartSteps = [
  "Open the builder.",
  "Enter a project name.",
  "Choose supported options.",
  "Preview the generated output.",
  "Download the zip.",
  "Unzip the project locally.",
  "Install dependencies.",
  "Start development.",
] as const;

export const builderFlow = [
  ["Project", "Project name and package manager."],
  [
    "Framework",
    "Fixed MVP foundation: Next.js, TypeScript, App Router, and no `src/` folder.",
  ],
  ["Styling and UI", "Tailwind CSS is fixed on. shadcn/ui is optional."],
  ["Database", "Choose no database setup or PostgreSQL."],
  ["ORM", "Choose no ORM or Prisma. Prisma requires PostgreSQL."],
  ["Auth", "Choose no auth or the Auth.js credentials scaffold."],
  [
    "Extras",
    "Optional PostgreSQL Docker Compose plus always-generated README and `.env.example`.",
  ],
  [
    "Preview",
    "Review stack, dependencies, env vars, scripts, and generated file tree.",
  ],
  ["Download", "Generate and download the project zip."],
] as const;

export const builderReviewChecks = [
  "Confirm the package manager matches how you want to install and run the downloaded app.",
  "Use the preview step to check dependencies, scripts, env vars, and generated files before downloading.",
  "If Prisma or Docker is disabled, go back and select PostgreSQL first.",
  "Treat Auth.js credentials as a scaffold choice, not a complete login system.",
] as const;

export const setupStages = [
  [
    "Prepare the project folder",
    "Unzip the download, enter the generated directory, and keep the generated files together before installing dependencies.",
  ],
  [
    "Install dependencies",
    "Run the install command for the package manager selected in the builder. Do not mix npm and pnpm lockfiles in the same generated app.",
  ],
  [
    "Configure runtime values",
    "Copy `.env.example` to `.env.local` when the selected features need environment variables, then replace placeholders before running feature code.",
  ],
  [
    "Run local checks",
    "Start the dev server for manual QA, then run typecheck and build before treating the generated app as deployable.",
  ],
] as const;

export const npmSetupCommands = `unzip my-app.zip
cd my-app
npm install
npm run dev
npm run typecheck
npm run build`;

export const pnpmSetupCommands = `unzip my-app.zip
cd my-app
pnpm install
pnpm dev
pnpm typecheck
pnpm build`;

export const envVars = [
  [
    "DATABASE_URL",
    "Appears when PostgreSQL is selected. Use a local or managed PostgreSQL connection string; BaseForge does not create the database.",
  ],
  [
    "AUTH_SECRET",
    "Appears when Auth.js credentials is selected. Replace the placeholder with a strong secret before testing auth flows.",
  ],
] as const;

export const envExamples = [
  {
    title: "PostgreSQL only",
    code: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/my_app"`,
  },
  {
    title: "PostgreSQL plus Auth.js credentials",
    code: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/my_app"
AUTH_SECRET="replace-with-a-long-random-secret"`,
  },
] as const;

export const scripts = [
  ["dev", "Run the Next.js development server while editing the generated app."],
  ["build", "Build the generated Next.js app and catch production build issues."],
  ["start", "Start the already-built app after `build` succeeds."],
  ["typecheck", "Run TypeScript without emitting files before shipping changes."],
  [
    "db:generate",
    "Optional Prisma script for generating Prisma Client after schema edits.",
  ],
  [
    "db:push",
    "Optional Prisma script for syncing the schema to a development database after confirming `DATABASE_URL`.",
  ],
  [
    "db:studio",
    "Optional Prisma script for inspecting local data in Prisma Studio.",
  ],
] as const;

export const scriptWorkflow = [
  "Use `dev` while editing UI, routes, and feature wiring.",
  "Use `typecheck` after changing TypeScript, Prisma helpers, Auth.js logic, or shared utilities.",
  "Use `build` before deployment because it catches errors that may not show during local development.",
  "Run Prisma scripts only when Prisma is selected and `DATABASE_URL` points at the intended development database.",
] as const;

export const generatedProjectWorkflows = [
  {
    title: "Basic generated app checks",
    code: `npm run dev
npm run typecheck
npm run build`,
  },
  {
    title: "Prisma local database workflow",
    code: `npm run db:generate
npm run db:push
npm run db:studio`,
  },
  {
    title: "Docker PostgreSQL plus Prisma",
    code: `docker compose up -d
npm run db:generate
npm run db:push`,
  },
] as const;

export const compatibilityRules = [
  "Prisma requires PostgreSQL.",
  "PostgreSQL Docker Compose is only available when PostgreSQL is selected.",
  "Auth.js credentials can be generated without a database.",
  "Auth.js credentials with Prisma requires the Prisma/PostgreSQL combination.",
  "shadcn/ui requires Tailwind CSS. Because Tailwind is fixed in the MVP, shadcn/ui is normally compatible.",
] as const;

export const limitations = [
  "Only Next.js is supported.",
  "Only TypeScript is supported.",
  "Only App Router is supported.",
  "Generated projects do not use `src/`.",
  "Only Tailwind CSS is supported.",
  "Only PostgreSQL is supported as a database option.",
  "Only Prisma is supported as an ORM option.",
  "Auth.js credentials is a scaffold, not complete production auth.",
  "BaseForge does not host databases.",
  "BaseForge does not install generated dependencies.",
  "BaseForge does not run generated project code on the server.",
  "BaseForge does not save project presets.",
  "BaseForge does not provide user accounts in the MVP.",
] as const;

export const troubleshooting = [
  ["Invalid project name", "Use lowercase letters, numbers, and hyphens only."],
  ["Prisma option is disabled", "Select PostgreSQL first."],
  ["Docker PostgreSQL is disabled", "Select PostgreSQL first."],
  ["Download failed", "Check selected options and try again."],
  ["npm install fails", "Check Node.js version and network access."],
  ["Build fails after download", "Verify env vars and optional feature setup."],
  [
    "Auth does not work out of the box",
    "Auth.js credentials output is a scaffold; implement real user lookup and password verification.",
  ],
] as const;

export const deploymentChecks = [
  "Run typecheck and build in the generated app before connecting it to hosting.",
  "Set production environment variables in the hosting provider, not only in `.env.local`.",
  "Use a real PostgreSQL provider for production when database features are selected.",
  "Replace Auth.js placeholder logic with real user lookup, password hashing, and verification before enabling sign-in.",
  "Review generated README notes for selected features before handing the app to another developer.",
] as const;

export const deploymentEnvExample = `DATABASE_URL="postgresql://user:password@host:5432/production_db"
AUTH_SECRET="set-this-in-your-hosting-provider"`;
