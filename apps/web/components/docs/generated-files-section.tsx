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
    files: ["components.json", "lib/utils.ts", "components/ui/button.tsx"],
  },
  {
    title: "PostgreSQL",
    files: ["DATABASE_URL in .env.example"],
  },
  {
    title: "Prisma",
    files: ["prisma/schema.prisma", "prisma.config.ts", "lib/db.ts"],
  },
  {
    title: "Auth.js credentials",
    files: [
      "auth.ts",
      "app/api/auth/[...nextauth]/route.ts",
      "AUTH_SECRET in .env.example",
    ],
  },
  {
    title: "Docker PostgreSQL",
    files: ["docker-compose.yml"],
  },
] as const;

export function GeneratedFilesSection() {
  return (
    <div className="space-y-5">
      <p>
        The generated project keeps `app/`, `components/`, and `lib/` at the
        project root. Generated projects do not use a `src/` directory.
      </p>
      <CodeBlock language="txt">{baseStructure}</CodeBlock>
      <div className="grid gap-3 md:grid-cols-2">
        {optionalFiles.map((group) => (
          <div key={group.title} className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
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
