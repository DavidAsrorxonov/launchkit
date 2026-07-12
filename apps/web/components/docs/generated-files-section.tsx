import { CodeBlock } from "@/components/docs/code-block";

const baseStructure = `app/
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

const optionalFiles = [
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

const coreFiles = [
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

export function GeneratedFilesSection() {
  return (
    <div className="space-y-5">
      <p>
        The generated project keeps `app/`, `components/`, and `lib/` at the
        project root. Generated projects do not use a `src/` directory.
      </p>
      <CodeBlock language="txt">{baseStructure}</CodeBlock>
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Core files to edit first
        </h3>
        <dl className="mt-3 grid gap-2">
          {coreFiles.map(([file, purpose]) => (
            <div
              key={file}
              className="grid gap-2 rounded-lg border border-border bg-card p-4 sm:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <dt className="font-mono text-xs font-semibold text-foreground">
                {file}
              </dt>
              <dd>{purpose}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {optionalFiles.map((group) => (
          <div
            key={group.title}
            className="rounded-lg border border-border bg-card p-4"
          >
            <h3 className="text-sm font-semibold text-foreground">
              {group.title}
            </h3>
            <p className="mt-2">{group.purpose}</p>
            <ul className="mt-3 space-y-2 font-mono text-xs text-muted-foreground">
              {group.files.map((file) => (
                <li key={file} className="break-all">
                  {file}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
