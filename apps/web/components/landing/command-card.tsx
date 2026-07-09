import { CheckCircle2, Copy, Terminal } from "lucide-react";

export function CommandCard() {
  return (
    <div className="w-full max-w-lg rounded-lg border border-border bg-card/95 p-4 text-card-foreground shadow-2xl shadow-primary/10 backdrop-blur">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Terminal className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              CLI available
            </p>
            <p className="text-xs text-muted-foreground">
              Published as @baseforge/create
            </p>
          </div>
        </div>
        <Copy className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </div>

      <div className="mt-4 overflow-x-auto rounded-md bg-muted p-3">
        <code className="whitespace-nowrap font-mono text-sm text-foreground">
          <span className="text-muted-foreground">$</span> npx
          @baseforge/create@latest
        </code>
      </div>

      <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        {["Website builder works today", "CLI package is published"].map((item) => (
          <li key={item} className="flex min-w-0 items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
