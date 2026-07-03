import type { StackSummaryItem } from "@/lib/builder/preview";

type StackSummaryProps = {
  items: StackSummaryItem[];
};

export function StackSummary({ items }: StackSummaryProps) {
  return (
    <section className="rounded-md border border-border bg-background p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">
          Selected stack summary
        </h3>
      </div>
      <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className="text-xs font-medium text-muted-foreground">
              {item.label}
            </dt>
            <dd className="mt-0.5 text-sm text-foreground break-words">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
