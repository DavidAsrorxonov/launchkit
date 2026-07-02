import { builderSteps, type BuilderStepId } from "@/lib/builder/steps";

type WizardProgressProps = {
  currentStepId: BuilderStepId;
};

export function WizardProgress({ currentStepId }: WizardProgressProps) {
  const currentIndex = builderSteps.findIndex((step) => step.id === currentStepId);

  return (
    <nav aria-label="Builder progress" className="min-w-0">
      <ol className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
        {builderSteps.map((step, index) => {
          const isCurrent = step.id === currentStepId;
          const isComplete = index < currentIndex;

          return (
            <li key={step.id} className="min-w-0">
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={[
                  "flex min-h-14 flex-col justify-center rounded-md border px-3 py-2 text-left transition-colors",
                  isCurrent
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border bg-card text-foreground",
                  isComplete ? "text-muted-foreground" : "",
                ].join(" ")}
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="truncate text-sm font-semibold">
                  <span className="hidden sm:inline lg:hidden">
                    {step.shortLabel}
                  </span>
                  <span className="sm:hidden lg:inline">{step.label}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
