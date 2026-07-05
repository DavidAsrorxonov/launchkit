const nodes = [
  {
    label: "Schema",
    value: "validated config",
    className: "left-4 top-24 sm:left-8 lg:left-12",
  },
  {
    label: "Preview",
    value: "file tree first",
    className: "right-4 top-28 sm:right-10 lg:right-16",
  },
  {
    label: "Templates",
    value: "Next.js + TypeScript",
    className: "bottom-20 left-5 sm:left-14",
  },
  {
    label: "Download",
    value: "zip output",
    className: "bottom-16 right-5 sm:right-14",
  },
] as const;

export function HeroOrbitLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-0 right-0 top-1/4 h-px bg-border/50" />
      <div className="absolute bottom-1/4 left-0 right-0 h-px bg-border/40" />
      <div className="absolute bottom-12 left-1/2 top-28 w-px bg-border/40" />
      <div className="absolute bottom-16 left-[44%] top-44 hidden w-px bg-border/30 md:block" />
      <div className="absolute bottom-24 left-[56%] top-40 hidden w-px bg-border/30 md:block" />
      <div className="absolute left-0 top-1/4 hidden h-24 w-1/4 rounded-tr-full border-r border-t border-border/40 md:block" />
      <div className="absolute right-0 top-1/4 hidden h-24 w-1/4 rounded-tl-full border-l border-t border-border/40 md:block" />
      <div className="absolute bottom-1/4 left-0 hidden h-24 w-1/4 rounded-br-full border-b border-r border-border/40 md:block" />
      <div className="absolute bottom-1/4 right-0 hidden h-24 w-1/4 rounded-bl-full border-b border-l border-border/40 md:block" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      {nodes.map((node) => (
        <div
          key={node.label}
          className={`absolute hidden max-w-36 rounded-md border border-border/60 bg-card/60 px-3 py-2 text-card-foreground shadow-lg backdrop-blur sm:block ${node.className}`}
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <p className="text-sm font-medium text-foreground">{node.label}</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{node.value}</p>
        </div>
      ))}
    </div>
  );
}
