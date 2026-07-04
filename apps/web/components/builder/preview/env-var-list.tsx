import type { EnvVarPreviewItem } from "@/lib/builder/preview";

type EnvVarListProps = {
  envVars: EnvVarPreviewItem[];
};

export function EnvVarList({ envVars }: EnvVarListProps) {
  return (
    <section className="rounded-md border border-border bg-background p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">
        Environment variables
      </h3>
      {envVars.length > 0 ? (
        <ul className="space-y-3">
          {envVars.map((envVar) => (
            <li key={envVar.name} className="min-w-0">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="font-mono text-sm text-foreground break-all">
                  {envVar.name}
                </span>
                {envVar.required ? (
                  <span className="shrink-0 rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    Required
                  </span>
                ) : null}
              </div>
              {envVar.description ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {envVar.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          No environment variables for this selection.
        </p>
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        Values are placeholders in `.env.example`; set real secrets yourself.
      </p>
    </section>
  );
}
