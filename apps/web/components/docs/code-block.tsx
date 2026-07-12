"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CodeBlockProps = {
  children: string;
  language?: string;
};

export function CodeBlock({ children, language = "bash" }: CodeBlockProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const copyChildContent = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative w-full max-w-full min-w-0">
      <button
        type="button"
        aria-label={copied ? "Copied command" : "Copy command"}
        title={copied ? "Copied" : "Copy command"}
        className="absolute right-3 top-3 inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={copyChildContent}
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
      <pre className="w-full max-w-full min-w-0 overflow-x-auto rounded-md border border-border bg-muted p-3 pr-14 text-xs leading-6 text-foreground sm:rounded-lg sm:p-4 sm:pr-16 sm:text-sm">
        <code className="font-mono" data-language={language}>
          {children}
        </code>
      </pre>
    </div>
  );
}
