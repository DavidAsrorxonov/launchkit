"use client";

import { useMemo, useState } from "react";

import { createInitialBuilderState } from "@/lib/builder/builder-state";
import { builderSteps } from "@/lib/builder/steps";
import { WizardNavigation } from "./wizard-navigation";
import { WizardProgress } from "./wizard-progress";
import { WizardStepPanel } from "./wizard-step-panel";

export function BuilderShell() {
  const [builderState] = useState(createInitialBuilderState);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = builderSteps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === builderSteps.length - 1;

  const selectedStack = useMemo(
    () => [
      ["Framework", builderState.config.framework],
      ["Language", builderState.config.language],
      ["Styling", builderState.config.styling],
      ["UI", builderState.config.ui],
      ["Database", builderState.config.database],
      ["ORM", builderState.config.orm],
      ["Auth", builderState.config.auth],
      ["Docker", builderState.config.docker],
      ["Package manager", builderState.config.packageManager],
    ],
    [builderState.config],
  );

  function goBack() {
    setCurrentStepIndex((stepIndex) => Math.max(stepIndex - 1, 0));
  }

  function goNext() {
    setCurrentStepIndex((stepIndex) =>
      Math.min(stepIndex + 1, builderSteps.length - 1),
    );
  }

  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              LaunchKit
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">
              Project builder
            </h1>
          </div>
          <div className="rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
            {builderState.config.name}
          </div>
        </header>

        <div className="space-y-5">
          <WizardProgress currentStepId={currentStep.id} />

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="space-y-5">
              <WizardStepPanel
                step={currentStep}
                stepNumber={currentStepIndex + 1}
                totalSteps={builderSteps.length}
              />
              <WizardNavigation
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                onBack={goBack}
                onNext={goNext}
              />
            </div>

            <aside className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-foreground">
                  Current selection
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Starting configuration for this project.
                </p>
              </div>
              <dl className="space-y-3">
                {selectedStack.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0"
                  >
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
