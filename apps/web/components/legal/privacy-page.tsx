import Image from "next/image";
import Link from "next/link";

const lastUpdated = "July 12, 2026";
const contactUrl = "https://t.me/whoisdave02";

const summaryItems = [
  "BaseForge does not provide user accounts, checkout, payment processing, newsletters, or hosted project storage in the current product.",
  "The builder sends your selected project configuration to BaseForge so the server can generate project files.",
  "The generated ZIP is assembled in your browser after the server returns generated file data.",
  "BaseForge uses Vercel Web Analytics and normal hosting infrastructure to understand traffic and operate the service.",
];

const collectedItems = [
  {
    title: "Project generation configuration",
    body: "When you use the builder, BaseForge processes the project name and stack choices you selected, such as framework, package manager, UI option, database option, ORM option, auth scaffold option, and Docker option. This information is used to validate the request and return generated project files.",
  },
  {
    title: "Analytics and usage data",
    body: "BaseForge uses Vercel Web Analytics. Vercel describes this product as privacy-focused analytics that uses aggregated data and does not use third-party cookies. Analytics data may include page views, URLs, referrers, approximate location, device type, operating system, browser, and timestamps.",
  },
  {
    title: "Hosting and security logs",
    body: "Like most websites, BaseForge and its hosting providers may process technical information such as IP address, user agent, request path, timestamps, error details, and security signals to deliver the site, diagnose issues, prevent abuse, and keep the service reliable.",
  },
  {
    title: "Browser features",
    body: "BaseForge uses browser APIs for copy buttons and ZIP downloads. Copy buttons write the visible command or code snippet to your clipboard only when you click them. ZIP creation and download use browser Blob and object URL APIs.",
  },
  {
    title: "Messages you send",
    body: "If you contact BaseForge through Telegram, GitHub, NPM, or another external channel, the information you provide is handled by that third-party service and by us only as needed to respond.",
  },
];

const notCollectedItems = [
  "BaseForge does not ask for account passwords, payment card details, billing addresses, or government identifiers.",
  "BaseForge does not intentionally collect database URLs, auth secrets, API keys, or production environment variables from the website builder.",
  "BaseForge does not run, install, deploy, or host the generated project code for you.",
  "BaseForge does not intentionally store generated ZIP files or generated projects for later retrieval.",
];

const useItems = [
  "Generate, preview, validate, and deliver project files requested through the builder.",
  "Operate, secure, debug, and improve the website and API.",
  "Understand aggregate traffic and product usage.",
  "Prevent abuse, excessive automated requests, unsafe generated paths, and service misuse.",
  "Respond to support, security, legal, or product messages you send.",
];

const sharingItems = [
  {
    title: "Vercel",
    body: "BaseForge is built for deployment on Vercel and uses Vercel Web Analytics. Vercel may process analytics, hosting, logging, security, and infrastructure data as a service provider.",
  },
  {
    title: "External services you choose to open",
    body: "The website links to GitHub, NPM, and Telegram. If you open those links, those services process your activity under their own policies.",
  },
  {
    title: "Legal and safety needs",
    body: "We may disclose information if required by law, to protect rights and safety, to investigate abuse, or to respond to valid legal process.",
  },
];

const rightsItems = [
  "ask what personal information we have about you;",
  "ask us to delete or correct information you provided;",
  "object to or restrict certain processing where applicable;",
  "contact the relevant privacy regulator if you believe your rights were violated.",
];

export function PrivacyPage() {
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
              aria-label="Privacy page navigation"
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
              Privacy Policy
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              This policy explains how BaseForge handles information when you
              use the website, builder, documentation, and related project
              generation features.
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
            aria-label="Privacy sections"
            className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground lg:sticky lg:top-24"
          >
            <p className="font-medium text-foreground">On this page</p>
            <div className="mt-3 grid gap-2">
              {privacyNavItems.map((item) => (
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
              BaseForge is a developer tool for generating TypeScript-first
              Next.js project starters. The current product is intentionally
              lightweight: you choose project options, BaseForge generates files
              from those choices, and your browser downloads a ZIP.
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

          <LegalSection
            id="information-collected"
            eyebrow="02"
            title="Information We Collect"
          >
            <p>
              We collect and process only the information needed to operate the
              site, generate projects, understand aggregate usage, and protect
              the service.
            </p>
            <dl className="grid gap-3">
              {collectedItems.map((item) => (
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
            id="information-not-collected"
            eyebrow="03"
            title="Information We Do Not Intentionally Collect"
          >
            <p>
              Do not enter secrets, credentials, tokens, or sensitive personal
              information into project names or generated-project configuration.
            </p>
            <ul className="grid gap-3">
              {notCollectedItems.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  {item}
                </li>
              ))}
            </ul>
          </LegalSection>

          <LegalSection id="how-we-use" eyebrow="04" title="How We Use Information">
            <ul className="grid gap-3">
              {useItems.map((item) => (
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
            id="cookies-analytics"
            eyebrow="05"
            title="Cookies and Analytics"
          >
            <p>
              BaseForge uses Vercel Web Analytics to understand aggregate site
              traffic and page usage. Vercel states that Web Analytics does not
              use third-party cookies and is designed around aggregated data
              rather than personal tracking across websites.
            </p>
            <p>
              BaseForge does not currently use advertising pixels, behavioral ad
              targeting, newsletter tracking, or account-based analytics in the
              website code.
            </p>
            <p>
              You can use browser settings, content blockers, or privacy tools
              to limit analytics requests where supported by your browser.
            </p>
          </LegalSection>

          <LegalSection
            id="sharing"
            eyebrow="06"
            title="How Information Is Shared"
          >
            <p>
              We do not sell personal information. We share or make information
              available only in the limited situations below.
            </p>
            <dl className="grid gap-3">
              {sharingItems.map((item) => (
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
            id="retention"
            eyebrow="07"
            title="Retention"
          >
            <p>
              BaseForge does not currently maintain user accounts or a database
              of generated projects. Project generation requests are processed
              to return generated files and are not intentionally stored by the
              application for later retrieval.
            </p>
            <p>
              Analytics, logs, security data, and external support messages may
              be retained by BaseForge or its service providers for the periods
              needed to operate, secure, debug, comply with legal obligations,
              and improve the service.
            </p>
          </LegalSection>

          <LegalSection
            id="security"
            eyebrow="08"
            title="Security"
          >
            <p>
              BaseForge uses validation, request size limits, generated-path
              safety checks, browser-side ZIP safety checks, and hosting
              platform protections to reduce operational and security risk.
            </p>
            <p>
              No internet service can be guaranteed completely secure. You are
              responsible for protecting any generated project after download,
              including replacing placeholder secrets, configuring production
              environment variables, and reviewing generated auth and database
              code before deployment.
            </p>
          </LegalSection>

          <LegalSection
            id="international-users"
            eyebrow="09"
            title="International Users"
          >
            <p>
              BaseForge is available on the web, so your information may be
              processed in countries other than the one where you live. Those
              countries may have data protection laws different from your local
              laws.
            </p>
          </LegalSection>

          <LegalSection
            id="children"
            eyebrow="10"
            title="Children's Privacy"
          >
            <p>
              BaseForge is a developer tool and is not directed to children. We
              do not knowingly collect personal information from children. If you
              believe a child provided personal information to BaseForge, contact
              us and we will take appropriate steps.
            </p>
          </LegalSection>

          <LegalSection
            id="rights"
            eyebrow="11"
            title="Your Rights and Choices"
          >
            <p>
              Depending on where you live, you may have privacy rights under
              applicable law. These may include the right to:
            </p>
            <ul className="grid gap-3">
              {rightsItems.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p>
              Because BaseForge currently does not provide accounts or stored
              generated projects, we may need enough information from you to
              understand and verify your request.
            </p>
          </LegalSection>

          <LegalSection
            id="changes"
            eyebrow="12"
            title="Changes to This Policy"
          >
            <p>
              We may update this Privacy Policy as BaseForge changes. The
              updated version will be posted on this page with a new last
              updated date. If changes are material, we will provide a more
              prominent notice where appropriate.
            </p>
          </LegalSection>

          <LegalSection id="contact" eyebrow="13" title="Contact">
            <p>
              For privacy questions or requests, contact BaseForge through the
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

const privacyNavItems = [
  { id: "overview", label: "Overview" },
  { id: "information-collected", label: "Information We Collect" },
  { id: "information-not-collected", label: "What We Do Not Collect" },
  { id: "how-we-use", label: "How We Use Information" },
  { id: "cookies-analytics", label: "Cookies and Analytics" },
  { id: "sharing", label: "Sharing" },
  { id: "retention", label: "Retention" },
  { id: "security", label: "Security" },
  { id: "international-users", label: "International Users" },
  { id: "children", label: "Children's Privacy" },
  { id: "rights", label: "Your Rights" },
  { id: "changes", label: "Changes" },
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
