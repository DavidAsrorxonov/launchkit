import {
  frameworkMetadata,
  languageMetadata,
  projectStructureMetadata,
  routerMetadata,
  type LaunchKitConfig,
  type OptionMetadata,
} from "@launchkit/schema";

import type { FrameworkStepValidation } from "@/lib/builder/validation";

type FrameworkStepProps = {
  config: LaunchKitConfig;
  validation: FrameworkStepValidation;
};

type FrameworkSummaryItem = {
  label: string;
  value: string;
  metadata: OptionMetadata;
};

function findMetadata<TValue extends string>(
  metadata: readonly OptionMetadata<TValue>[],
  value: TValue,
): OptionMetadata<TValue> {
  return metadata.find((item) => item.value === value) ?? metadata[0];
}

export function FrameworkStep({ config, validation }: FrameworkStepProps) {
  const summaryItems: FrameworkSummaryItem[] = [
    {
      label: "Framework",
      value: config.framework,
      metadata: findMetadata(frameworkMetadata, config.framework),
    },
    {
      label: "Language",
      value: config.language,
      metadata: findMetadata(languageMetadata, config.language),
    },
    {
      label: "Router",
      value: config.router,
      metadata: findMetadata(routerMetadata, config.router),
    },
    {
      label: "Project structure",
      value: config.projectStructure,
      metadata: findMetadata(projectStructureMetadata, config.projectStructure),
    },
  ];

  const errorMessages = Object.values(validation.errors).filter(Boolean);

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-border bg-muted p-4">
        <h2 className="text-base font-semibold text-foreground">
          Fixed MVP foundation
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Generated projects start from one supported Next.js TypeScript setup.
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

      <div className="grid gap-3 sm:grid-cols-2">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="rounded-md border border-primary bg-accent p-4 text-accent-foreground"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
                <h3 className="mt-1 text-base font-semibold">
                  {item.metadata.label}
                </h3>
              </div>
              <span className="rounded-md border border-border bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground">
                Selected
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {item.metadata.description}
            </p>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Additional foundations can be added after the MVP.
      </p>
    </div>
  );
}
