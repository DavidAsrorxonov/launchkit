"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const command = "npx @baseforge/create@latest";

export function CommandCard() {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex w-full items-center gap-3 rounded-md border border-border bg-card/90 p-2 text-card-foreground backdrop-blur">
      <div className="min-w-0 flex-1 overflow-x-auto px-3 py-2 text-left">
        <code className="whitespace-nowrap font-mono text-sm text-foreground">
          {command}
        </code>
      </div>
      <button
        type="button"
        onClick={copyCommand}
        aria-label={copied ? "Copied command" : "Copy command"}
        title={copied ? "Copied" : "Copy command"}
        className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="hidden text-xs font-medium text-foreground sm:inline">
              Copied
            </span>
          </>
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
