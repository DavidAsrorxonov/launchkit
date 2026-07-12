import Image from "next/image";
import Link from "next/link";

import { GitHub } from "@/components/icons/github";
import { NPM } from "@/components/icons/npm";

const npmUrl = "https://www.npmjs.com/package/@baseforge/create";
const githubUrl = "https://github.com/DavidAsrorxonov/baseforge";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-black py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={npmUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-black px-5 py-3 text-sm font-medium text-foreground transition hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <NPM className="h-4 w-4" aria-hidden="true" />
            NPM
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-black px-5 py-3 text-sm font-medium text-foreground transition hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <GitHub className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
        </div>

        <nav
          aria-label="Legal links"
          className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
        >
          <Link
            href="/privacy"
            className="rounded-md transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Privacy
          </Link>
        </nav>

        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <Image
            src="/favicon/favicon.svg"
            alt=""
            width={192}
            height={192}
            className="h-[clamp(4rem,11vw,12rem)] w-[clamp(4rem,11vw,12rem)] shrink-0"
            aria-hidden="true"
          />
          <p className="min-w-0 text-[clamp(3.2rem,14vw,11rem)] font-semibold leading-none tracking-tight text-foreground">
            BaseForge
          </p>
        </div>
      </div>
    </footer>
  );
}
