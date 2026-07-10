"use client";

import {
  ormMetadata,
  type BaseForgeConfig,
  type OptionMetadata,
  type OrmOption,
} from "@baseforge/schema";

import type { BuilderConfigPatch } from "@/lib/builder/builder-state";
import type { OrmStepValidation } from "@/lib/builder/validation";

type OrmStepProps = {
  config: BaseForgeConfig;
  validation: OrmStepValidation;
  onConfigChange: (patch: BuilderConfigPatch) => void;
};

function getOrmOptionLabel(option: OptionMetadata<OrmOption>): string {
  if (option.value === "none") {
    return "No ORM";
  }

  return option.label;
}

export function OrmStep({
  config,
  validation,
  onConfigChange,
}: OrmStepProps) {
  const errorMessages = Object.values(validation.errors).filter(Boolean);
  const hasPostgres = config.database === "postgres";
  const selectedOrm: OrmOption = hasPostgres ? config.orm : "none";

  function updateOrm(orm: OrmOption) {
    if (orm === "prisma" && !hasPostgres) {
      return;
    }

    onConfigChange({ orm });
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
        <legend className="text-sm font-medium text-foreground">ORM</legend>
        <div className="grid gap-3" role="radiogroup">
          {ormMetadata.map((option) => {
            const isPrisma = option.value === "prisma";
            const isDisabled = isPrisma && !hasPostgres;
            const isSelected = selectedOrm === option.value;

            return (
              <label
                key={option.value}
                aria-disabled={isDisabled ? "true" : undefined}
                onClick={(event) => {
                  if (isDisabled) {
                    event.preventDefault();
                    return;
                  }

                  updateOrm(option.value);
                }}
                className={[
                  "flex flex-col gap-2 rounded-md border p-4 transition-colors",
                  isDisabled
                    ? "cursor-not-allowed border-border bg-muted text-muted-foreground opacity-70"
                    : "cursor-pointer",
                  isSelected
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border bg-background text-foreground",
                  !isSelected && !isDisabled ? "hover:bg-muted" : "",
                ].join(" ")}
              >
                <span className="flex flex-wrap items-start justify-between gap-3">
                  <span className="text-sm font-semibold">
                    {getOrmOptionLabel(option)}
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
                {isDisabled ? (
                  <span className="text-sm font-medium text-muted-foreground">
                    Requires PostgreSQL
                  </span>
                ) : null}
                <input
                  type="radio"
                  name="orm"
                  value={option.value}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => updateOrm(option.value)}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="text-sm text-muted-foreground">
        Prisma is available after PostgreSQL is selected in the Database step.
      </p>
    </div>
  );
}
