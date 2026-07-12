import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CodeBlock } from "@/components/docs/code-block";
import {
  builderFlow,
  builderReviewChecks,
  compatibilityRules,
  deploymentChecks,
  deploymentEnvExample,
  docsNavItems,
  envExamples,
  envVars,
  generatedProjectWorkflows,
  limitations,
  npmSetupCommands,
  pnpmSetupCommands,
  quickStartSteps,
  scripts,
  scriptWorkflow,
  setupStages,
  troubleshooting,
} from "@/components/docs/docs-content";
import { DocsSection } from "@/components/docs/docs-section";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { FeatureNotes } from "@/components/docs/feature-notes";
import { GeneratedFilesSection } from "@/components/docs/generated-files-section";
import { SupportedStackTable } from "@/components/docs/supported-stack-table";
import Image from "next/image";

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
              Read the page in order when evaluating a new generated app: choose
              options in the builder, confirm the supported stack, set up the
              downloaded project, then review feature-specific work before
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

          <DocsSection id="feature-guides" eyebrow="05" title="Feature Guides">
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
