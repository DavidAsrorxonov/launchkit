import type { BuilderStep } from "@/lib/builder/steps";
import type { ReactNode } from "react";

type WizardStepPanelProps = {
  step: BuilderStep;
  stepNumber: number;
  totalSteps: number;
  children?: ReactNode;
};

export function WizardStepPanel({
  step,
  stepNumber,
  totalSteps,
  children,
}: WizardStepPanelProps) {
  return (
    <section
      aria-labelledby="builder-step-title"
      className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6"
    >
      <div className="mb-8 flex items-start justify-between gap-4 sm:mb-10">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            Step {stepNumber} of {totalSteps}
          </p>
          <h1
            id="builder-step-title"
            className="mt-2 text-2xl font-semibold text-foreground"
          >
            {step.label}
          </h1>
        </div>
        <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {step.shortLabel}
        </span>
      </div>
      {children ?? (
        <p className="text-sm text-muted-foreground">{step.placeholder}</p>
      )}
    </section>
  );
}
