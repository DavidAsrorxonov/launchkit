"use client";

import { useMemo, useState } from "react";

import type { LaunchKitConfig } from "@launchkit/schema";

import { DownloadButton } from "@/components/builder/download/download-button";
import { DownloadStatus } from "@/components/builder/download/download-status";
import {
  GenerateProjectApiError,
  generateProjectRequest,
} from "@/lib/api/client";
import { createBuilderPreview } from "@/lib/builder/preview";
import type { PreviewStepValidation } from "@/lib/builder/validation";
import { createProjectZip } from "@/lib/download/create-project-zip";

type DownloadStatusState = "idle" | "generating" | "success" | "error";

type DownloadStepProps = {
  config: LaunchKitConfig;
  validation: PreviewStepValidation;
};

export function DownloadStep({ config, validation }: DownloadStepProps) {
  const [status, setStatus] = useState<DownloadStatusState>("idle");
  const [message, setMessage] = useState<string | undefined>();
  const preview = useMemo(() => createBuilderPreview(config), [config]);
  const summaryItems = preview.stackSummary.filter((item) =>
    ["Framework", "UI", "Database", "ORM", "Auth", "Docker"].includes(
      item.label,
    ),
  );
  const isGenerating = status === "generating";

  async function downloadProject() {
    if (!validation.isValid) {
      setStatus("error");
      setMessage(getValidationMessage(validation.errors));
      return;
    }

    setStatus("generating");
    setMessage("Generating project...");

    try {
      const response = await generateProjectRequest(config);
      const zipBlob = await createProjectZip(response.project);

      triggerBrowserDownload(zipBlob, `${response.project.name}.zip`);
      setStatus("success");
      setMessage("Download started.");
    } catch (error) {
      setStatus("error");
      setMessage(getErrorMessage(error));
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-md border border-border bg-background p-4">
        <h3 className="text-sm font-semibold text-foreground">
          Project summary
        </h3>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-muted-foreground">
              Project name
            </dt>
            <dd className="mt-0.5 font-mono text-sm text-foreground">
              {config.name}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">
              Package manager
            </dt>
            <dd className="mt-0.5 font-mono text-sm text-foreground">
              {config.packageManager}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-md border border-border bg-background p-4">
        <h3 className="text-sm font-semibold text-foreground">Selected stack</h3>
        <dl className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
          {summaryItems.map((item) => (
            <div key={item.label} className="min-w-0">
              <dt className="text-xs font-medium text-muted-foreground">
                {item.label}
              </dt>
              <dd className="mt-0.5 truncate text-sm text-foreground">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Creates `{config.name}.zip` in your browser. Generated code is not run
          or installed.
        </p>
        <DownloadButton
          isGenerating={isGenerating}
          onClick={() => void downloadProject()}
        />
      </div>

      <DownloadStatus status={status} message={message} />
    </div>
  );
}

function getValidationMessage(
  errors: PreviewStepValidation["errors"],
): string {
  return (
    Object.values(errors).find((error): error is string => Boolean(error)) ??
    "Fix the selected stack before generating."
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof GenerateProjectApiError) {
    return error.message;
  }

  if (error instanceof Error && error.name === "UnsafeZipPathError") {
    return "Generated project contained unsafe file paths.";
  }

  return "Could not create the ZIP file.";
}

function triggerBrowserDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
