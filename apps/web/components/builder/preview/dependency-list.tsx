type DependencyEntry = {
  name: string;
  version: string;
};

type DependencyListProps = {
  title: string;
  dependencies: DependencyEntry[];
};

export function DependencyList({ title, dependencies }: DependencyListProps) {
  return (
    <section className="rounded-md border border-border bg-background p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {dependencies.length}
        </span>
      </div>
      {dependencies.length > 0 ? (
        <ul className="space-y-2">
          {dependencies.map((dependency) => (
            <li
              key={dependency.name}
              className="flex min-w-0 items-start justify-between gap-3 text-sm"
            >
              <span className="min-w-0 font-mono text-foreground break-all">
                {dependency.name}
              </span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {dependency.version}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          {title === "Dependencies"
            ? "No optional dependencies added."
            : "No optional dev dependencies added."}
        </p>
      )}
    </section>
  );
}
