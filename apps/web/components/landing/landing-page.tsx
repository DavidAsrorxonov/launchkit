import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { LandingHero } from "@/components/landing/landing-hero";
import { LandingNav } from "@/components/landing/landing-nav";
import { LogoStrip } from "@/components/landing/logo-strip";

const supportedStack = [
  "Next.js",
  "TypeScript",
  "App Router",
  "No src folder",
  "Tailwind CSS",
  "shadcn/ui optional",
  "PostgreSQL optional",
  "Prisma optional",
  "Auth.js credentials scaffold optional",
  "Docker PostgreSQL optional",
] as const;

export function LandingPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <LandingNav />

      <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <LandingHero />
        <LogoStrip />

        <section
          id="supported-stack"
          aria-labelledby="supported-stack-heading"
          className="grid gap-6 border-t border-border py-10 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div>
            <p className="text-sm font-medium text-primary">Supported MVP</p>
            <h2
              id="supported-stack-heading"
              className="mt-2 max-w-xl text-3xl font-semibold leading-tight text-foreground"
            >
              A narrow stack surface so generated projects stay predictable.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              BaseForge does not expose every framework or provider yet. The MVP
              focuses on a TypeScript-first Next.js starter that can be previewed
              and downloaded from the website.
            </p>
            <Link
              href="/builder"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Open Builder
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {supportedStack.map((item) => (
              <div
                key={item}
                className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
