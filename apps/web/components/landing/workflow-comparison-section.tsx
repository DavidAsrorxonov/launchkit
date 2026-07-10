import Link from "next/link";
import {
  ArrowRight,
  Check,
  Code2,
  FileText,
  LayoutPanelLeft,
  Terminal,
} from "lucide-react";

const builderOptions = [
  "Next.js",
  "Tailwind CSS",
  "Prisma",
  "Auth.js",
] as const;

const previewFiles = [
  "app/page.tsx",
  "components/ui/button.tsx",
  "lib/db.ts",
  "auth.ts",
] as const;

const terminalLines = [
  "npx @baseforge/create@latest my-app",
  "? UI library shadcn/ui",
  "? Database PostgreSQL",
  "? ORM Prisma",
  "Project generated in ./my-app",
] as const;

export function WorkflowComparisonSection() {
  return (
    <section
      aria-labelledby="workflow-comparison-heading"
      className="relative overflow-hidden border-t border-border py-16"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-96 max-w-5xl bg-[linear-gradient(to_right,color-mix(in_oklch,var(--border)_72%,white)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border)_72%,white)_1px,transparent_1px)] bg-size-[44px_44px] opacity-30 mask-[radial-gradient(ellipse_at_center,black_0%,transparent_72%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 text-center">
        <h2
          id="workflow-comparison-heading"
          className="text-3xl font-normal leading-tight text-foreground sm:text-4xl"
        >
          Build from the browser or from your terminal.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Use the visual builder when you want to inspect the stack first. Use
          the CLI when you already know what you want.
        </p>
      </div>

      <div className="relative z-10 mt-10 overflow-hidden rounded-lg border border-border bg-card/70 text-card-foreground backdrop-blur">
        <div className="flex flex-col gap-3 border-b border-border bg-background/55 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-black text-blue-300">
              <Code2 className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">
                Same generator, same project output
              </p>
              <p className="text-xs text-muted-foreground">
                Pick the interface that matches how you want to start.
              </p>
            </div>
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span className="rounded-md border border-border bg-black px-2 py-1">
              shared schema
            </span>
            <span className="rounded-md border border-border bg-black px-2 py-1">
              local files
            </span>
          </div>
        </div>

        <div className="grid gap-px bg-border lg:grid-cols-2">
          <div className="bg-card/85 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground">
                  <LayoutPanelLeft className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Web Builder
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Explore before downloading
                  </p>
                </div>
              </div>
              <span className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
                visual
              </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-border bg-black/80">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                <span className="h-2 w-2 rounded-full bg-blue-400/80" />
                <span className="ml-2 text-xs text-muted-foreground">
                  stack preview
                </span>
              </div>
              <div className="grid gap-4 p-4 sm:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Selected stack
                  </p>
                  <div className="mt-3 grid gap-2">
                    {builderOptions.map((option) => (
                      <div
                        key={option}
                        className="flex items-center gap-2 rounded-md border border-border bg-card/70 px-3 py-2 text-sm text-foreground"
                      >
                        <Check
                          className="h-3.5 w-3.5 text-blue-300"
                          aria-hidden="true"
                        />
                        {option}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Files before download
                  </p>
                  <div className="mt-3 grid gap-2">
                    {previewFiles.map((file) => (
                      <div
                        key={file}
                        className="flex min-w-0 items-center gap-2 rounded-md bg-card/60 px-3 py-2 font-mono text-xs text-muted-foreground"
                      >
                        <FileText
                          className="h-3.5 w-3.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="truncate">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/builder"
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Open Builder
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="bg-card/85 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground">
                  <Terminal className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">CLI</p>
                  <p className="text-xs text-muted-foreground">
                    Scaffold directly where you work
                  </p>
                </div>
              </div>
              <span className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
                fast
              </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-neutral-800 bg-black text-white">
              <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-950 px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-neutral-600" />
                <span className="h-2 w-2 rounded-full bg-neutral-500" />
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="ml-2 text-xs text-white/60">terminal</span>
              </div>
              <div className="space-y-2 px-4 py-4 font-mono text-xs leading-6 sm:text-sm">
                {terminalLines.map((line, index) => (
                  <p
                    key={line}
                    className={
                      index === terminalLines.length - 1
                        ? "text-white"
                        : "text-white/75"
                    }
                  >
                    <span className="text-blue-400">
                      {index === 0
                        ? ">"
                        : index === terminalLines.length - 1
                          ? "-"
                          : "?"}
                    </span>{" "}
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-md border border-border bg-background p-3">
              <p className="text-xs font-medium text-muted-foreground">
                Run directly
              </p>
              <code className="mt-2 block overflow-x-auto whitespace-nowrap font-mono text-sm text-foreground">
                npx @baseforge/create@latest my-app
              </code>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Code2 className="h-4 w-4 text-blue-300" aria-hidden="true" />
              Same schema and generator as the web builder.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
