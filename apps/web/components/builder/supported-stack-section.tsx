const supportedStackGroups = [
  {
    title: "Core",
    items: [
      ["Framework", "Next.js"],
      ["Language", "TypeScript"],
      ["Router", "App Router"],
      ["Structure", "No src folder"],
      ["Styling", "Tailwind CSS"],
    ],
  },
  {
    title: "Optional Features",
    items: [
      ["UI", "none or shadcn/ui"],
      ["Database", "none or PostgreSQL"],
      ["ORM", "none or Prisma"],
      ["Auth", "none or Auth.js credentials scaffold"],
      ["Docker", "none or PostgreSQL Docker Compose"],
    ],
  },
  {
    title: "Project Use",
    items: [
      ["Package manager", "npm or pnpm"],
      ["Install", "Run dependencies locally after download"],
      ["Secrets", "Set real production environment values"],
      ["Server", "Generated code is not run by LaunchKit"],
    ],
  },
] as const;

const limitations = [
  "The CLI package is published as @baseforge/create.",
  "Only Next.js, TypeScript, App Router, no-src, and Tailwind CSS are supported.",
  "Auth.js credentials is a scaffold and needs real user lookup, password verification, and AUTH_SECRET.",
  "PostgreSQL Docker Compose is for local development only.",
  "LaunchKit does not install dependencies or run generated project code on the server.",
] as const;

const setupCommands = [
  "unzip my-app.zip",
  "cd my-app",
  "npm install",
  "npm run dev",
] as const;

export function SupportedStackSection() {
  return (
    <section
      aria-labelledby="supported-stack-heading"
      className="border-t border-border pt-5"
    >
      <div className="mb-4">
        <h2
          id="supported-stack-heading"
          className="text-base font-semibold text-foreground"
        >
          Supported stack
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          LaunchKit generates a TypeScript-first Next.js starter as a downloadable
          zip. The shared-generator CLI is published as @baseforge/create.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {supportedStackGroups.map((group) => (
          <div
            key={group.title}
            className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm"
          >
            <h3 className="text-sm font-semibold text-foreground">
              {group.title}
            </h3>
            <dl className="mt-3 space-y-2">
              {group.items.map(([label, value]) => (
                <div
                  key={label}
                  className="flex min-w-0 items-start justify-between gap-3"
                >
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="max-w-44 text-right text-sm font-medium text-foreground wrap-break-word">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">
            After download
          </h3>
          <pre className="mt-3 overflow-x-auto rounded-md bg-muted p-3 text-xs text-foreground">
            <code>{setupCommands.join("\n")}</code>
          </pre>
          <p className="mt-3 text-sm text-muted-foreground">
            Run `npm run typecheck` and `npm run build` before depending on the
            generated output. pnpm projects use the equivalent generated
            commands.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Limitations</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {limitations.map((limitation) => (
              <li key={limitation} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{limitation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
