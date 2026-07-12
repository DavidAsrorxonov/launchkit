import Image from "next/image";
import Link from "next/link";

const lastUpdated = "July 12, 2026";
const contactUrl = "https://t.me/whoisdave02";

const summaryItems = [
  "BaseForge is a free developer tool for generating TypeScript-first Next.js project starters.",
  "You may use, copy, modify, and deploy project files generated for you, subject to any third-party license terms that apply to included packages or tools.",
  "Generated authentication, database, Docker, and deployment files are scaffolds. You are responsible for reviewing and securing them before production use.",
  "BaseForge is provided as is and may change, fail, or be unavailable.",
];

const serviceItems = [
  {
    title: "Website builder",
    body: "The website builder lets you choose supported stack options, preview generated output, and download project files as a ZIP.",
  },
  {
    title: "Generation API",
    body: "The builder sends selected project configuration to BaseForge so the server can validate the request and return generated file data.",
  },
  {
    title: "CLI",
    body: "The CLI package is published as @baseforge/create. Depending on the options you choose, the CLI can write generated files locally and optionally run the selected package manager's install command.",
  },
  {
    title: "Documentation",
    body: "The documentation explains supported options, setup steps, limitations, and feature-specific follow-up work for generated projects.",
  },
];

const responsibilityItems = [
  "review generated files before using, publishing, deploying, or sharing them;",
  "replace placeholder secrets and configure real environment variables;",
  "implement real user lookup, password hashing, access control, and security checks before using generated authentication scaffolds;",
  "configure your own database, hosting, deployment, logging, backups, and monitoring;",
  "run dependency installation, type checks, builds, tests, audits, and security reviews in your own environment;",
  "comply with laws, regulations, third-party terms, and open-source licenses that apply to your project.",
];

const acceptableUseItems = [
  "do not attack, overload, probe, disrupt, or attempt to bypass security controls for BaseForge or its hosting providers;",
  "do not use BaseForge to generate, distribute, or support unlawful, harmful, infringing, or abusive activity;",
  "do not send secrets, API keys, passwords, production database URLs, payment information, or sensitive personal information as project names or builder inputs;",
  "do not use automated traffic, scraping, or repeated generation requests in a way that degrades the service for others;",
  "do not misrepresent your relationship with BaseForge or imply that BaseForge endorses your generated project.",
];

const thirdPartyItems = [
  "Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, Prisma, Auth.js, PostgreSQL, Docker, npm, pnpm, and other generated-project dependencies or tools may have their own licenses, security advisories, documentation, and terms.",
  "External links to GitHub, NPM, Telegram, and other services are provided for convenience. Those services are operated by third parties and are governed by their own terms and policies.",
  "If you use the CLI with dependency installation enabled, your package manager may contact registries such as npm and download third-party packages into your local project.",
];

const warrantyItems = [
  "BaseForge may contain bugs, incomplete output, outdated dependency guidance, or compatibility issues.",
  "Generated projects may require manual changes before they build, deploy, pass audits, or satisfy your production requirements.",
  "BaseForge does not provide legal, security, compliance, deployment, database, or authentication advice.",
  "BaseForge does not guarantee that generated output is secure, compliant, uninterrupted, error-free, or fit for a particular purpose.",
];

export function TermsPage() {
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
              aria-label="Terms page navigation"
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
                className="rounded-md px-3 py-2 transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Docs
              </Link>
            </nav>
          </div>

          <div className="max-w-3xl py-6">
            <p className="text-sm font-medium text-primary">Legal</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              These Terms explain the rules for using BaseForge, including the
              website builder, documentation, CLI, and generated project output.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-8">
        <aside className="lg:order-first">
          <nav
            aria-label="Terms sections"
            className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground lg:sticky lg:top-24"
          >
            <p className="font-medium text-foreground">On this page</p>
            <div className="mt-3 grid gap-2">
              {termsNavItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="rounded-md px-2 py-1 transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </aside>

        <div className="min-w-0 space-y-8">
          <LegalSection id="overview" eyebrow="01" title="Overview">
            <p>
              By accessing or using BaseForge, you agree to these Terms. If you
              do not agree, do not use the website, builder, CLI, documentation,
              generated output, or related services.
            </p>
            <ul className="grid gap-3">
              {summaryItems.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  {item}
                </li>
              ))}
            </ul>
          </LegalSection>

          <LegalSection id="service" eyebrow="02" title="What BaseForge Provides">
            <p>
              BaseForge provides tools that generate starter project files from
              supported stack choices. BaseForge does not currently provide
              hosted user accounts, managed deployments, payment processing,
              production databases, or hosted generated-project storage.
            </p>
            <dl className="grid gap-3">
              {serviceItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <dt className="text-sm font-semibold text-foreground">
                    {item.title}
                  </dt>
                  <dd className="mt-1">{item.body}</dd>
                </div>
              ))}
            </dl>
          </LegalSection>

          <LegalSection
            id="generated-output"
            eyebrow="03"
            title="Generated Project Output"
          >
            <p>
              You may use, copy, modify, distribute, and deploy project files
              generated for you by BaseForge for personal or commercial
              projects, subject to these Terms and any third-party license terms
              that apply to included dependencies, frameworks, libraries, or
              tools.
            </p>
            <p>
              BaseForge does not claim ownership over the original products,
              applications, content, business logic, or modifications you build
              on top of generated project output.
            </p>
            <p>
              You are responsible for reviewing generated files, dependency
              licenses, security posture, configuration, and production
              readiness before using generated output.
            </p>
          </LegalSection>

          <LegalSection
            id="your-responsibilities"
            eyebrow="04"
            title="Your Responsibilities"
          >
            <p>When using BaseForge or generated output, you must:</p>
            <ul className="grid gap-3">
              {responsibilityItems.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  {item}
                </li>
              ))}
            </ul>
          </LegalSection>

          <LegalSection
            id="scaffold-disclaimers"
            eyebrow="05"
            title="Scaffold and Security Disclaimers"
          >
            <p>
              BaseForge generates starter code, not complete production systems.
              Generated Auth.js credentials output is a scaffold and intentionally
              requires real user lookup, password hashing, password verification,
              authorization rules, session review, and secret configuration.
            </p>
            <p>
              Generated database, Prisma, Docker Compose, and environment files
              are setup aids. They do not replace production database hosting,
              migrations strategy, backups, monitoring, access control, secret
              management, or infrastructure review.
            </p>
            <p>
              Do not treat generated output as audited, hardened, compliant, or
              production-ready until you have reviewed and tested it for your
              own use case.
            </p>
          </LegalSection>

          <LegalSection
            id="acceptable-use"
            eyebrow="06"
            title="Acceptable Use"
          >
            <p>You agree to use BaseForge responsibly. In particular:</p>
            <ul className="grid gap-3">
              {acceptableUseItems.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  {item}
                </li>
              ))}
            </ul>
          </LegalSection>

          <LegalSection
            id="third-party-services"
            eyebrow="07"
            title="Third-Party Services and Software"
          >
            <ul className="grid gap-3">
              {thirdPartyItems.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  {item}
                </li>
              ))}
            </ul>
          </LegalSection>

          <LegalSection id="intellectual-property" eyebrow="08" title="Ownership">
            <p>
              BaseForge, including its name, website, design, documentation,
              source code, templates, and branding, is protected by intellectual
              property laws. Except for generated project output as described in
              these Terms, these Terms do not grant you ownership of BaseForge
              itself or permission to use BaseForge branding in a way that
              implies endorsement.
            </p>
            <p>
              If you send feedback, suggestions, or ideas about BaseForge, you
              allow us to use them without restriction or obligation to you.
            </p>
          </LegalSection>

          <LegalSection
            id="privacy"
            eyebrow="09"
            title="Privacy"
          >
            <p>
              The BaseForge Privacy Policy explains how information is handled
              when you use the website, builder, and related features.
            </p>
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Read the Privacy Policy
            </Link>
          </LegalSection>

          <LegalSection
            id="changes-availability"
            eyebrow="10"
            title="Changes and Availability"
          >
            <p>
              BaseForge may change, suspend, remove, limit, or discontinue any
              part of the service at any time. Supported stack options,
              generated files, dependency versions, documentation, CLI behavior,
              and API behavior may change over time.
            </p>
            <p>
              We may update these Terms as BaseForge changes. The updated
              version will be posted on this page with a new last updated date.
              Continued use of BaseForge after changes become effective means
              you accept the updated Terms.
            </p>
          </LegalSection>

          <LegalSection id="disclaimers" eyebrow="11" title="Disclaimers">
            <p>
              BaseForge is provided on an as-is and as-available basis. To the
              maximum extent permitted by law, BaseForge disclaims all warranties
              and conditions, whether express, implied, statutory, or otherwise.
            </p>
            <ul className="grid gap-3">
              {warrantyItems.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  {item}
                </li>
              ))}
            </ul>
          </LegalSection>

          <LegalSection
            id="liability"
            eyebrow="12"
            title="Limitation of Liability"
          >
            <p>
              To the maximum extent permitted by law, BaseForge and its
              maintainers will not be liable for indirect, incidental, special,
              consequential, exemplary, or punitive damages, or for lost profits,
              lost revenue, lost data, business interruption, security incidents,
              deployment failures, dependency issues, or claims arising from
              generated output or your use of BaseForge.
            </p>
            <p>
              To the maximum extent permitted by law, the total liability of
              BaseForge and its maintainers for any claim relating to the service
              is limited to the greater of the amount you paid to use BaseForge
              in the three months before the claim or 100 USD. Because BaseForge
              is currently free, this limitation is intended to reflect the
              free, starter-tool nature of the service.
            </p>
          </LegalSection>

          <LegalSection id="indemnity" eyebrow="13" title="Indemnity">
            <p>
              To the extent permitted by law, you agree to defend, indemnify,
              and hold harmless BaseForge and its maintainers from claims,
              damages, liabilities, costs, and expenses arising from your use of
              BaseForge, generated output, your projects, your violation of
              these Terms, or your violation of applicable law or third-party
              rights.
            </p>
          </LegalSection>

          <LegalSection
            id="governing-law"
            eyebrow="14"
            title="Governing Law"
          >
            <p>
              Unless applicable law requires otherwise, these Terms are governed
              by the laws of the jurisdiction where BaseForge is operated,
              without regard to conflict-of-law rules. Some jurisdictions do not
              allow certain limitations or exclusions, so parts of these Terms
              may not apply to you.
            </p>
          </LegalSection>

          <LegalSection id="contact" eyebrow="15" title="Contact">
            <p>
              For questions about these Terms, contact BaseForge through the
              public Telegram contact currently linked on the website.
            </p>
            <Link
              href={contactUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Contact BaseForge
            </Link>
          </LegalSection>
        </div>
      </div>
    </main>
  );
}

const termsNavItems = [
  { id: "overview", label: "Overview" },
  { id: "service", label: "What BaseForge Provides" },
  { id: "generated-output", label: "Generated Output" },
  { id: "your-responsibilities", label: "Your Responsibilities" },
  { id: "scaffold-disclaimers", label: "Scaffold Disclaimers" },
  { id: "acceptable-use", label: "Acceptable Use" },
  { id: "third-party-services", label: "Third-Party Services" },
  { id: "intellectual-property", label: "Ownership" },
  { id: "privacy", label: "Privacy" },
  { id: "changes-availability", label: "Changes" },
  { id: "disclaimers", label: "Disclaimers" },
  { id: "liability", label: "Liability" },
  { id: "indemnity", label: "Indemnity" },
  { id: "governing-law", label: "Governing Law" },
  { id: "contact", label: "Contact" },
];

function LegalSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-lg border border-border bg-background p-5 text-sm leading-7 text-muted-foreground shadow-sm sm:p-6"
    >
      <div className="mb-4">
        <p className="font-mono text-xs font-medium text-primary">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight text-foreground">
          {title}
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
