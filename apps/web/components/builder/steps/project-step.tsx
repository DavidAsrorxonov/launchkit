"use client";

import { useState } from "react";

import {
  packageManagerMetadata,
  type LaunchKitConfig,
  type PackageManagerOption,
} from "@baseforge/schema";

import type { BuilderConfigPatch } from "@/lib/builder/builder-state";
import type { ProjectStepValidation } from "@/lib/builder/validation";

type ProjectStepProps = {
  config: LaunchKitConfig;
  validation: ProjectStepValidation;
  onConfigChange: (patch: BuilderConfigPatch) => void;
};

export function ProjectStep({
  config,
  validation,
  onConfigChange,
}: ProjectStepProps) {
  const [nameTouched, setNameTouched] = useState(false);
  const showNameError = nameTouched && validation.errors.name;

  function updateProjectName(name: string) {
    setNameTouched(true);
    onConfigChange({ name });
  }

  function updatePackageManager(packageManager: PackageManagerOption) {
    onConfigChange({ packageManager });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="project-name" className="text-sm font-medium">
          Project name
        </label>
        <input
          id="project-name"
          name="project-name"
          type="text"
          value={config.name}
          onBlur={() => setNameTouched(true)}
          onChange={(event) => updateProjectName(event.target.value)}
          aria-invalid={showNameError ? "true" : "false"}
          aria-describedby={
            showNameError
              ? "project-name-help project-name-error"
              : "project-name-help"
          }
          className={[
            "h-10 w-full rounded-md border bg-background px-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            showNameError ? "border-destructive" : "border-input",
          ].join(" ")}
          placeholder="my-app"
        />
        <p id="project-name-help" className="text-sm text-muted-foreground">
          Use lowercase letters, numbers, and hyphen-separated words.
        </p>
        <p
          id="project-name-error"
          role={showNameError ? "alert" : undefined}
          aria-live="polite"
          className="min-h-5 text-sm text-destructive"
        >
          {showNameError ? validation.errors.name : ""}
        </p>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Package manager</legend>
        <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
          {packageManagerMetadata.map((option) => {
            const isSelected = config.packageManager === option.value;

            return (
              <label
                key={option.value}
                className={[
                  "flex cursor-pointer flex-col gap-1 rounded-md border p-4 transition-colors",
                  isSelected
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted",
                ].join(" ")}
              >
                <span className="flex flex-wrap items-start justify-between gap-2">
                  <span className="text-sm font-semibold">{option.label}</span>
                  {option.recommended ? (
                    <span className="rounded-md border border-border bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      Recommended
                    </span>
                  ) : null}
                </span>
                <span className="text-sm text-muted-foreground">
                  {option.description}
                </span>
                <input
                  type="radio"
                  name="package-manager"
                  value={option.value}
                  checked={isSelected}
                  onChange={() =>
                    updatePackageManager(option.value as PackageManagerOption)
                  }
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
