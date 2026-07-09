import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CommandCard } from "@/components/landing/command-card";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden border-x border-b border-border bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--border)_78%,white)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border)_78%,white)_1px,transparent_1px)] bg-size-[40px_40px] opacity-55"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_88%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-150 max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:min-h-170 lg:px-10">
        <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-md border border-border bg-card/85 px-3 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="truncate">
            Website generator and CLI are live now.
          </span>
        </div>

        <h1 className="max-w-4xl text-4xl font-normal leading-tight text-foreground sm:text-5xl lg:text-6xl">
          One-click project generation for modern Next.js apps
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Choose your stack, preview the output, and download a ready-to-edit
          TypeScript project without running generated code on the server.
        </p>

        <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href="/builder"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Open Builder
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-background/80 px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Docs
          </Link>
        </div>

        <div className="mt-8 w-full max-w-md">
          <CommandCard />
        </div>
      </div>
    </section>
  );
}
