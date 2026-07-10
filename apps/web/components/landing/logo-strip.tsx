const workflowItems = [
  "Configure",
  "Validate",
  "Preview",
  "Download",
  "Edit locally",
] as const;

export function LogoStrip() {
  return (
    <section
      aria-label="BaseForge workflow"
      className="grid gap-3 border-t border-border py-6 sm:grid-cols-5"
    >
      {workflowItems.map((item) => (
        <div
          key={item}
          className="rounded-lg border border-border bg-card px-4 py-3 text-center text-sm font-semibold text-muted-foreground shadow-sm"
        >
          {item}
        </div>
      ))}
    </section>
  );
}
