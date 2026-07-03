"use client";

import type { LaunchKitConfig } from "@launchkit/schema";

import { DependencyList } from "@/components/builder/preview/dependency-list";
import { EnvVarList } from "@/components/builder/preview/env-var-list";
import { FileTreePreview } from "@/components/builder/preview/file-tree-preview";
import { ScriptList } from "@/components/builder/preview/script-list";
import { StackSummary } from "@/components/builder/preview/stack-summary";
import { createBuilderPreview } from "@/lib/builder/preview";
import type { PreviewStepValidation } from "@/lib/builder/validation";

type PreviewStepProps = {
  config: LaunchKitConfig;
  validation: PreviewStepValidation;
};

export function PreviewStep({ config, validation }: PreviewStepProps) {
  const errorMessages = Object.values(validation.errors).filter(Boolean);

  if (!validation.isValid) {
    return (
      <div
        role="alert"
        className="rounded-md border border-destructive bg-background p-4 text-sm text-destructive"
      >
        {errorMessages[0] ?? "Fix the selected stack before previewing."}
      </div>
    );
  }

  const preview = createBuilderPreview(config);

  return (
    <div className="space-y-4">
      <StackSummary items={preview.stackSummary} />
      <div className="grid gap-4 xl:grid-cols-2">
        <DependencyList
          title="Dependencies"
          dependencies={preview.dependencies}
        />
        <DependencyList
          title="Dev dependencies"
          dependencies={preview.devDependencies}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <ScriptList scripts={preview.scripts} />
        <EnvVarList envVars={preview.envVars} />
      </div>
      <FileTreePreview
        projectName={config.name}
        filePaths={preview.filePaths}
      />
    </div>
  );
}
