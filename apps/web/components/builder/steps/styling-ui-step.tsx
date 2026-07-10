"use client";

import {
  stylingMetadata,
  uiMetadata,
  type BaseForgeConfig,
  type OptionMetadata,
  type UiOption,
} from "@baseforge/schema";

import type { BuilderConfigPatch } from "@/lib/builder/builder-state";
import type { StylingUiStepValidation } from "@/lib/builder/validation";

type StylingUiStepProps = {
  config: BaseForgeConfig;
  validation: StylingUiStepValidation;
  onConfigChange: (patch: BuilderConfigPatch) => void;
};

function findMetadata<TValue extends string>(
  metadata: readonly OptionMetadata<TValue>[],
  value: TValue,
): OptionMetadata<TValue> {
  return metadata.find((item) => item.value === value) ?? metadata[0];
}

function getUiOptionLabel(option: OptionMetadata<UiOption>): string {
  if (option.value === "none") {
    return "No component library";
  }

  return option.label;
}

export function StylingUiStep({
  config,
  validation,
  onConfigChange,
}: StylingUiStepProps) {
  const styling = findMetadata(stylingMetadata, config.styling);
  const errorMessages = Object.values(validation.errors).filter(Boolean);

  function updateUi(ui: UiOption) {
    onConfigChange({ styling: "tailwind", ui });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-primary bg-accent p-4 text-accent-foreground">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Fixed styling
            </p>
            <h2 className="mt-1 text-base font-semibold">{styling.label}</h2>
          </div>
          <span className="rounded-md border border-border bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground">
            Selected
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {styling.description}
        </p>
      </div>

      {errorMessages.length > 0 ? (
        <div
          role="alert"
          className="rounded-md border border-destructive bg-background p-4 text-sm text-destructive"
        >
          {errorMessages[0]}
        </div>
      ) : null}

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-foreground">
          UI library
        </legend>
        <div className="grid gap-3" role="radiogroup">
          {uiMetadata.map((option) => {
            const isSelected = config.ui === option.value;

            return (
              <label
                key={option.value}
                className={[
                  "flex cursor-pointer flex-col gap-2 rounded-md border p-4 transition-colors",
                  isSelected
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted",
                ].join(" ")}
              >
                <span className="flex flex-wrap items-start justify-between gap-3">
                  <span className="text-sm font-semibold">
                    {getUiOptionLabel(option)}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {option.recommended ? (
                      <span className="rounded-md border border-border bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        Recommended
                      </span>
                    ) : null}
                    <span
                      className={[
                        "grid size-4 place-items-center rounded-full border",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-border bg-background",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      {isSelected ? (
                        <span className="size-1.5 rounded-full bg-primary-foreground" />
                      ) : null}
                    </span>
                  </span>
                </span>
                <span className="text-sm text-muted-foreground">
                  {option.description}
                </span>
                <input
                  type="radio"
                  name="ui-library"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => updateUi(option.value)}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
