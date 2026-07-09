import Link from "next/link";
import { GitBranch } from "lucide-react";

const githubUrl = "https://github.com/DavidAsrorxonov/launchkit";

export function LandingNav() {
  return (
    <header className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/90 px-4 py-3 text-card-foreground shadow-xl shadow-primary/5 backdrop-blur">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="BaseForge home"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            BF
          </span>
          <span className="text-sm font-semibold text-foreground">BaseForge</span>
        </Link>

        <nav
          aria-label="Landing navigation"
          className="flex flex-wrap items-center justify-end gap-2 text-sm text-muted-foreground"
        >
          <Link
            href="/builder"
            className="rounded-md px-3 py-2 transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Builder
          </Link>
          <a
            href="#supported-stack"
            className="rounded-md px-3 py-2 transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Supported Stack
          </a>
          <Link
            href="/docs"
            className="rounded-md px-3 py-2 transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Docs
          </Link>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <GitBranch className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
