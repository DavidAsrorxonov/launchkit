import Link from "next/link";
import Image from "next/image";

import { GitHub } from "@/components/icons/github";
import { NPM } from "@/components/icons/npm";
import { Telegram } from "@/components/icons/telegram";

const githubUrl = "https://github.com/DavidAsrorxonov/launchkit";
const npmUrl = "https://www.npmjs.com/package/@baseforge/create";
const telegramUrl = "https://t.me/whoisdave02";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 text-foreground backdrop-blur">
      <div className="flex min-h-14 w-full flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
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
          <span className="text-lg font-semibold leading-none">BaseForge</span>
        </Link>

        <nav
          aria-label="Landing navigation"
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <Link
            href="/builder"
            className="transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Builder
          </Link>
          <a
            href="#supported-stack"
            className="transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Supported Stack
          </a>
          <Link
            href="/docs"
            className="transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Docs
          </Link>
        </nav>

        <nav
          aria-label="External links"
          className="flex items-center gap-5 text-sm text-muted-foreground"
        >
          <a
            href={npmUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-medium transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <NPM className="h-4 w-4 shrink-0 rounded-xs" aria-hidden="true" />
            <span>NPM</span>
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-medium transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <GitHub className="h-4 w-4 shrink-0" aria-hidden="true" />
            GitHub
          </a>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram"
            className="inline-flex items-center justify-center transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Telegram className="h-5 w-5" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
