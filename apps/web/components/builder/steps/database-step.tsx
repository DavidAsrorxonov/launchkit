"use client";

import {
  databaseMetadata,
  type DatabaseOption,
  type LaunchKitConfig,
  type OptionMetadata,
} from "@launchkit/schema";

import type { BuilderConfigPatch } from "@/lib/builder/builder-state";
import type { DatabaseStepValidation } from "@/lib/builder/validation";

type DatabaseStepProps = {
  config: LaunchKitConfig;
  validation: DatabaseStepValidation;
  onConfigChange: (patch: BuilderConfigPatch) => void;
};

function getDatabaseOptionLabel(option: OptionMetadata<DatabaseOption>): string {
  if (option.value === "none") {
    return "No database";
  }

  return option.label;
}

export function DatabaseStep({
  config,
  validation,
  onConfigChange,
}: DatabaseStepProps) {
  const errorMessages = Object.values(validation.errors).filter(Boolean);

  function updateDatabase(database: DatabaseOption) {
    const patch: BuilderConfigPatch = { database };

    if (database === "none") {
      if (config.orm === "prisma") {
        patch.orm = "none";
      }

      if (config.docker === "postgres") {
        patch.docker = "none";
      }
    }

    onConfigChange(patch);
  }

  return (
    <div className="space-y-5">
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
          Database
        </legend>
        <div className="grid gap-3" role="radiogroup">
          {databaseMetadata.map((option) => {
            const isSelected = config.database === option.value;

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
                    {getDatabaseOptionLabel(option)}
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
                  name="database"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => updateDatabase(option.value)}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="text-sm text-muted-foreground">
        Prisma and Docker are configured in later steps.
      </p>
    </div>
  );
}
