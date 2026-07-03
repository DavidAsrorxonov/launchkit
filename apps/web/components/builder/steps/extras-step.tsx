"use client";

import {
  dockerMetadata,
  type DockerOption,
  type LaunchKitConfig,
  type OptionMetadata,
} from "@launchkit/schema";

import type { BuilderConfigPatch } from "@/lib/builder/builder-state";
import type { ExtrasStepValidation } from "@/lib/builder/validation";

type ExtrasStepProps = {
  config: LaunchKitConfig;
  validation: ExtrasStepValidation;
  onConfigChange: (patch: BuilderConfigPatch) => void;
};

function getDockerOptionLabel(option: OptionMetadata<DockerOption>): string {
  if (option.value === "none") {
    return "No Docker setup";
  }

  return option.label;
}

export function ExtrasStep({
  config,
  validation,
  onConfigChange,
}: ExtrasStepProps) {
  const errorMessages = Object.values(validation.errors).filter(Boolean);
  const hasPostgres = config.database === "postgres";
  const selectedDocker: DockerOption = hasPostgres ? config.docker : "none";

  function updateDocker(docker: DockerOption) {
    if (docker === "postgres" && !hasPostgres) {
      return;
    }

    onConfigChange({ docker });
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
        <legend className="text-sm font-medium text-foreground">Docker</legend>
        <div className="grid gap-3" role="radiogroup">
          {dockerMetadata.map((option) => {
            const isPostgresDocker = option.value === "postgres";
            const isDisabled = isPostgresDocker && !hasPostgres;
            const isSelected = selectedDocker === option.value;

            return (
              <label
                key={option.value}
                aria-disabled={isDisabled ? "true" : undefined}
                onClick={(event) => {
                  if (isDisabled) {
                    event.preventDefault();
                    return;
                  }

                  updateDocker(option.value);
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
                    {getDockerOptionLabel(option)}
                  </span>
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
                  name="docker"
                  value={option.value}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => updateDocker(option.value)}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="text-sm text-muted-foreground">
        Docker Compose is for local PostgreSQL development. README and
        `.env.example` are included by default.
      </p>
    </div>
  );
}
