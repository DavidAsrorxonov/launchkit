export type DocsNavItem = {
  id: string;
  label: string;
};

type DocsSidebarProps = {
  items: readonly DocsNavItem[];
};

export function DocsSidebar({ items }: DocsSidebarProps) {
  return (
    <nav
      aria-label="Documentation sections"
      className="rounded-lg border border-border bg-card p-3 text-sm text-card-foreground lg:sticky lg:top-5"
    >
      <p className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
        On this page
      </p>
      <ol className="grid gap-1 sm:grid-cols-2 lg:block">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block rounded-md px-3 py-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
