import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CodeBlock } from "@/components/docs/code-block";
import { DocsSection } from "@/components/docs/docs-section";
import { DocsSidebar, type DocsNavItem } from "@/components/docs/docs-sidebar";
import { FeatureNotes } from "@/components/docs/feature-notes";
import { GeneratedFilesSection } from "@/components/docs/generated-files-section";
import { SupportedStackTable } from "@/components/docs/supported-stack-table";
import Image from "next/image";

const docsNavItems = [
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

const quickStartSteps = [
  "Open the builder.",
  "Enter a project name.",
  "Choose supported options.",
  "Preview the generated output.",
  "Download the zip.",
  "Unzip the project locally.",
  "Install dependencies.",
  "Start development.",
] as const;

const builderFlow = [
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

const builderReviewChecks = [
  "Confirm the package manager matches how you want to install and run the downloaded app.",
  "Use the preview step to check dependencies, scripts, env vars, and generated files before downloading.",
  "If Prisma or Docker is disabled, go back and select PostgreSQL first.",
  "Treat Auth.js credentials as a scaffold choice, not a complete login system.",
] as const;

const setupStages = [
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

const npmSetupCommands = `unzip my-app.zip
cd my-app
npm install
npm run dev
npm run typecheck
npm run build`;

const pnpmSetupCommands = `unzip my-app.zip
cd my-app
pnpm install
pnpm dev
pnpm typecheck
pnpm build`;

const envVars = [
  [
    "DATABASE_URL",
    "Appears when PostgreSQL is selected. Use a local or managed PostgreSQL connection string; BaseForge does not create the database.",
  ],
  [
    "AUTH_SECRET",
    "Appears when Auth.js credentials is selected. Replace the placeholder with a strong secret before testing auth flows.",
  ],
] as const;

const envExamples = [
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

const scripts = [
  ["dev", "Run the Next.js development server while editing the generated app."],
  ["build", "Build the generated Next.js app and catch production build issues."],
  ["start", "Start the already-built app after `build` succeeds."],
  ["typecheck", "Run TypeScript without emitting files before shipping changes."],
  ["db:generate", "Optional Prisma script for generating Prisma Client after schema edits."],
  [
    "db:push",
    "Optional Prisma script for syncing the schema to a development database after confirming `DATABASE_URL`.",
  ],
  ["db:studio", "Optional Prisma script for inspecting local data in Prisma Studio."],
] as const;

const scriptWorkflow = [
  "Use `dev` while editing UI, routes, and feature wiring.",
  "Use `typecheck` after changing TypeScript, Prisma helpers, Auth.js logic, or shared utilities.",
  "Use `build` before deployment because it catches errors that may not show during local development.",
  "Run Prisma scripts only when Prisma is selected and `DATABASE_URL` points at the intended development database.",
] as const;

const generatedProjectWorkflows = [
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

const compatibilityRules = [
  "Prisma requires PostgreSQL.",
  "PostgreSQL Docker Compose is only available when PostgreSQL is selected.",
  "Auth.js credentials can be generated without a database.",
  "Auth.js credentials with Prisma requires the Prisma/PostgreSQL combination.",
  "shadcn/ui requires Tailwind CSS. Because Tailwind is fixed in the MVP, shadcn/ui is normally compatible.",
] as const;

const limitations = [
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

const troubleshooting = [
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

const deploymentChecks = [
  "Run typecheck and build in the generated app before connecting it to hosting.",
  "Set production environment variables in the hosting provider, not only in `.env.local`.",
  "Use a real PostgreSQL provider for production when database features are selected.",
  "Replace Auth.js placeholder logic with real user lookup, password hashing, and verification before enabling sign-in.",
  "Review generated README notes for selected features before handing the app to another developer.",
] as const;

const deploymentEnvExample = `DATABASE_URL="postgresql://user:password@host:5432/production_db"
AUTH_SECRET="set-this-in-your-hosting-provider"`;

export function DocsPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border bg-card/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2 rounded-md transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="BaseForge home"
            >
              <Image
                src="/favicon/favicon-96x96.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 shrink-0 rounded-sm"
                priority
              />
              <span className="text-lg font-semibold leading-none">
                BaseForge
              </span>
            </Link>
            <nav
              aria-label="Primary documentation navigation"
              className="flex flex-wrap items-center justify-end gap-2 text-sm text-muted-foreground"
            >
              <Link
                href="/"
                className="rounded-md px-3 py-2 transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Landing
              </Link>
              <Link
                href="/builder"
                className="rounded-md px-3 py-2 transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Builder
              </Link>
              <Link
                href="/docs"
                aria-current="page"
                className="rounded-md bg-accent px-3 py-2 text-accent-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Docs
              </Link>
            </nav>
          </div>

          <div className="max-w-3xl py-6">
            <p className="text-sm font-medium text-primary">Documentation</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              BaseForge documentation
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Practical guidance for using the website builder, setting up the
              generated app, and understanding the web stack BaseForge creates.
            </p>
            <Link
              href="/builder"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Open Builder
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-8">
        <aside className="lg:order-first">
          <DocsSidebar items={docsNavItems} />
        </aside>

        <div className="min-w-0">
          <DocsSection id="overview" eyebrow="01" title="Overview">
            <p>
              BaseForge is a TypeScript-first developer project generator. The
              MVP is website-first: users choose options, preview generated
              output, and download a zip.
            </p>
            <p>
              The generated project is intended to be unzipped and edited
              locally. These docs are organized around the website builder flow
              and the generated web app that developers work with after
              download.
            </p>
            <p>
              Read the page in order when evaluating a new generated app:
              choose options in the builder, confirm the supported stack, set up
              the downloaded project, then review feature-specific work before
              deployment.
            </p>
          </DocsSection>

          <DocsSection
            id="web-builder-guide"
            eyebrow="02"
            title="Web Builder Guide"
          >
            <p>
              Start here to understand how the web builder turns project
              selections into a downloadable web app.
            </p>
            <dl className="grid gap-3">
              {builderFlow.map(([label, description]) => (
                <div
                  key={label}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <dt className="text-sm font-semibold text-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1">{description}</dd>
                </div>
              ))}
            </dl>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Before downloading
              </h3>
              <ul className="mt-3 grid gap-2">
                {builderReviewChecks.map((check) => (
                  <li
                    key={check}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    {check}
                  </li>
                ))}
              </ul>
            </div>
          </DocsSection>

          <DocsSection
            id="supported-stack"
            eyebrow="03"
            title="Supported Stack"
          >
            <p>
              These are the exact MVP option groups exposed by
              `@baseforge/schema`. Unsupported frameworks, languages, routers,
              databases, ORMs, auth providers, and package managers are not
              documented as available.
            </p>
            <SupportedStackTable />
          </DocsSection>

          <DocsSection
            id="generated-app-setup"
            eyebrow="04"
            title="Generated App Setup"
          >
            <p>
              The downloaded zip is a normal Next.js project. Set it up outside
              BaseForge, install dependencies locally, and run checks inside the
              generated app directory.
            </p>
            <dl className="grid gap-3">
              {setupStages.map(([stage, description]) => (
                <div
                  key={stage}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <dt className="text-sm font-semibold text-foreground">
                    {stage}
                  </dt>
                  <dd className="mt-1">{description}</dd>
                </div>
              ))}
            </dl>
            <ol className="grid gap-2">
              {quickStartSteps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="font-mono text-xs text-primary">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <CodeBlock>{npmSetupCommands}</CodeBlock>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                pnpm variant
              </h3>
              <p className="mt-1">
                The generated project supports pnpm guidance when pnpm is
                selected in the builder.
              </p>
            </div>
            <CodeBlock>{pnpmSetupCommands}</CodeBlock>
          </DocsSection>

          <DocsSection
            id="feature-guides"
            eyebrow="05"
            title="Feature Guides"
          >
            <p>
              Each optional feature changes the generated files, dependencies,
              environment variables, and setup work in the downloaded app.
            </p>
            <FeatureNotes />
          </DocsSection>

          <DocsSection
            id="generated-files"
            eyebrow="06"
            title="Generated Files"
          >
            <GeneratedFilesSection />
          </DocsSection>

          <DocsSection
            id="environment-variables"
            eyebrow="07"
            title="Environment Variables"
          >
            <p>
              `.env.example` is only an example. Replace placeholder secrets and
              keep production values out of source control.
            </p>
            <p>
              BaseForge only documents the variables needed by selected
              features. The generated app reads real values from your local
              `.env.local` file or from the environment configured by your
              deployment platform.
            </p>
            <dl className="grid gap-3 sm:grid-cols-2">
              {envVars.map(([name, description]) => (
                <div
                  key={name}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <dt className="font-mono text-sm font-semibold text-foreground">
                    {name}
                  </dt>
                  <dd className="mt-1">{description}</dd>
                </div>
              ))}
            </dl>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                `.env.local` examples
              </h3>
              <div className="mt-3 grid gap-3">
                {envExamples.map((example) => (
                  <div key={example.title}>
                    <h4 className="text-sm font-semibold text-foreground">
                      {example.title}
                    </h4>
                    <div className="mt-2">
                      <CodeBlock language="dotenv">{example.code}</CodeBlock>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DocsSection>

          <DocsSection
            id="scripts-and-checks"
            eyebrow="08"
            title="Scripts and Checks"
          >
            <p>
              Common scripts are generated for every project. Prisma scripts are
              added only when Prisma is selected.
            </p>
            <ul className="grid gap-2">
              {scriptWorkflow.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  {item}
                </li>
              ))}
            </ul>
            <dl className="grid gap-2">
              {scripts.map(([name, description]) => (
                <div
                  key={name}
                  className="grid gap-2 rounded-lg border border-border bg-card p-4 sm:grid-cols-[9rem_minmax(0,1fr)]"
                >
                  <dt className="font-mono text-sm font-semibold text-foreground">
                    {name}
                  </dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Command workflows
              </h3>
              <div className="mt-3 grid gap-3">
                {generatedProjectWorkflows.map((workflow) => (
                  <div key={workflow.title}>
                    <h4 className="text-sm font-semibold text-foreground">
                      {workflow.title}
                    </h4>
                    <div className="mt-2">
                      <CodeBlock>{workflow.code}</CodeBlock>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DocsSection>

          <DocsSection
            id="compatibility-rules"
            eyebrow="09"
            title="Compatibility Rules"
          >
            <ul className="grid gap-2">
              {compatibilityRules.map((rule) => (
                <li
                  key={rule}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  {rule}
                </li>
              ))}
            </ul>
          </DocsSection>

          <DocsSection
            id="troubleshooting"
            eyebrow="10"
            title="Troubleshooting"
          >
            <dl className="grid gap-3">
              {troubleshooting.map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <dt className="text-sm font-semibold text-foreground">
                    {title}
                  </dt>
                  <dd className="mt-1">{description}</dd>
                </div>
              ))}
            </dl>
          </DocsSection>

          <DocsSection
            id="deployment-notes"
            eyebrow="11"
            title="Deployment Notes"
          >
            <p>
              After download, unzip locally, install dependencies, copy
              `.env.example` to `.env.local` when selected features need env
              vars, configure values, and run checks before deployment.
            </p>
            <CodeBlock>{`cp .env.example .env.local
npm install
npm run dev
npm run typecheck
npm run build`}</CodeBlock>
            <p>
              The exact env setup depends on the selected optional features.
            </p>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Production environment example
              </h3>
              <div className="mt-2">
                <CodeBlock language="dotenv">{deploymentEnvExample}</CodeBlock>
              </div>
            </div>
            <ul className="grid gap-2">
              {deploymentChecks.map((check) => (
                <li
                  key={check}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  {check}
                </li>
              ))}
            </ul>
          </DocsSection>

          <DocsSection id="limitations" eyebrow="12" title="Limitations">
            <ul className="grid gap-2">
              {limitations.map((limitation) => (
                <li
                  key={limitation}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  {limitation}
                </li>
              ))}
            </ul>
          </DocsSection>
        </div>
      </div>
    </main>
  );
}
