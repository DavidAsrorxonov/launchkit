import Link from "next/link";
import { ArrowRight, Download, FolderTree, Layers3 } from "lucide-react";

import { CommandCard } from "@/components/landing/command-card";
import { HeroOrbitLines } from "@/components/landing/hero-orbit-lines";

const stats = [
  {
    label: "Stack",
    value: "Next.js",
    icon: Layers3,
  },
  {
    label: "Preview",
    value: "File tree",
    icon: FolderTree,
  },
  {
    label: "Output",
    value: "ZIP",
    icon: Download,
  },
] as const;

export function LandingHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-2xl shadow-primary/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,var(--accent),transparent_34%),radial-gradient(circle_at_16%_82%,var(--secondary),transparent_30%),linear-gradient(115deg,var(--background)_0%,var(--card)_46%,var(--secondary)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--card)_0%,transparent_50%,var(--background)_100%)] opacity-75" />
      <HeroOrbitLines />

      <div className="relative z-10 mx-auto flex min-h-160 max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:min-h-180 lg:px-10">
        <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-md border border-border bg-card/85 px-3 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="truncate">
            Website generator and CLI are live now.
          </span>
        </div>

        <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-7xl">
          One-click project generation for modern Next.js apps
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Choose your stack, preview the output, and download a ready-to-edit
          TypeScript project without running generated code on the server.
        </p>

        <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href="/builder"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Open Builder
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href="#supported-stack"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-card/90 px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View Supported Stack
          </a>
        </div>

        <div className="mt-10 w-full max-w-lg">
          <CommandCard />
        </div>

        <div className="mt-10 grid w-full max-w-3xl gap-3 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-lg border border-border bg-card/80 p-4 text-left shadow-sm backdrop-blur"
              >
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                <p className="mt-3 text-xs uppercase text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
