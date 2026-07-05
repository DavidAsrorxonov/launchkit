import type { ReactNode } from "react";

type DocsSectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
};

export function DocsSection({ id, eyebrow, title, children }: DocsSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-24 border-b border-border py-9 last:border-b-0"
    >
      {eyebrow ? (
        <p className="text-sm font-medium text-primary">{eyebrow}</p>
      ) : null}
      <h2
        id={`${id}-heading`}
        className="mt-2 text-2xl font-semibold leading-tight text-foreground"
      >
        {title}
      </h2>
      <div className="mt-5 space-y-5 text-sm leading-6 text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
