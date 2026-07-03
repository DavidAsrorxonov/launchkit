type WizardNavigationProps = {
  isFirstStep: boolean;
  isLastStep: boolean;
  isNextDisabled?: boolean;
  onBack: () => void;
  onNext: () => void;
};

export function WizardNavigation({
  isFirstStep,
  isLastStep,
  isNextDisabled = false,
  onBack,
  onNext,
}: WizardNavigationProps) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep}
        className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={isLastStep || isNextDisabled}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45"
      >
        Next
      </button>
    </div>
  );
}
