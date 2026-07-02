import type { ScriptPreviewItem } from "@/lib/builder/preview";

type ScriptListProps = {
  scripts: ScriptPreviewItem[];
};

export function ScriptList({ scripts }: ScriptListProps) {
  return (
    <section className="rounded-md border border-border bg-background p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">Scripts</h3>
      {scripts.length > 0 ? (
        <dl className="space-y-2">
          {scripts.map((script) => (
            <div key={script.name} className="min-w-0 text-sm">
              <dt className="font-mono text-foreground">{script.name}</dt>
              <dd className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xs text-muted-foreground">
                {script.command}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-muted-foreground">None</p>
      )}
    </section>
  );
}
