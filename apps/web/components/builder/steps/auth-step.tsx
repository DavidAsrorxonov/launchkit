"use client";

import {
  authMetadata,
  type AuthOption,
  type LaunchKitConfig,
  type OptionMetadata,
} from "@baseforge/schema";

import type { BuilderConfigPatch } from "@/lib/builder/builder-state";
import type { AuthStepValidation } from "@/lib/builder/validation";

type AuthStepProps = {
  config: LaunchKitConfig;
  validation: AuthStepValidation;
  onConfigChange: (patch: BuilderConfigPatch) => void;
};

function getAuthOptionLabel(option: OptionMetadata<AuthOption>): string {
  if (option.value === "none") {
    return "No auth";
  }

  return option.label;
}

export function AuthStep({
  config,
  validation,
  onConfigChange,
}: AuthStepProps) {
  const errorMessages = Object.values(validation.errors).filter(Boolean);

  function updateAuth(auth: AuthOption) {
    onConfigChange({ auth });
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
        <legend className="text-sm font-medium text-foreground">Auth</legend>
        <div className="grid gap-3" role="radiogroup">
          {authMetadata.map((option) => {
            const isSelected = config.auth === option.value;
            const isAuthJsCredentials = option.value === "authjs-credentials";
            const isRecommended =
              "recommended" in option && option.recommended;

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
                    {getAuthOptionLabel(option)}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {isRecommended ? (
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
                {isAuthJsCredentials ? (
                  <span className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
                    Scaffold only: connect this to your user model and password
                    verification.
                  </span>
                ) : null}
                <input
                  type="radio"
                  name="auth"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => updateAuth(option.value)}
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
