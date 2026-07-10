"use client";

import { useMemo, useState } from "react";

import type { BaseForgeConfig } from "@baseforge/schema";

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
  config: BaseForgeConfig;
  validation: PreviewStepValidation;
};

export function DownloadStep({ config, validation }: DownloadStepProps) {
  const [status, setStatus] = useState<DownloadStatusState>("idle");
  const [message, setMessage] = useState<string | undefined>();
  const previewState = useMemo(() => {
    try {
      return {
        preview: createBuilderPreview(config),
        error: undefined,
      };
    } catch {
      return {
        preview: undefined,
        error: "Preview is unavailable for this selection.",
      };
    }
  }, [config]);
  const summaryItems =
    previewState.preview?.stackSummary.filter((item) =>
      ["Framework", "UI", "Database", "ORM", "Auth", "Docker"].includes(
        item.label,
      ),
    ) ?? [];
  const isGenerating = status === "generating";

  async function downloadProject() {
    if (!validation.isValid) {
      setStatus("error");
      setMessage(getValidationMessage(validation.errors));
      return;
    }

    if (previewState.error) {
      setStatus("error");
      setMessage("Review the selected stack before generating.");
      return;
    }

    setStatus("generating");
    setMessage("Preparing project zip...");

    try {
      const response = await generateProjectRequest(config);
      const zipBlob = await createProjectZip(response.project);

      triggerBrowserDownload(zipBlob, `${response.project.name}.zip`);
      setStatus("success");
      setMessage("ZIP download prepared.");
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
            <dd className="mt-0.5 font-mono text-sm text-foreground break-all">
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
        <h3 className="text-sm font-semibold text-foreground">
          Selected stack
        </h3>
        <dl className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
          {summaryItems.length > 0 ? (
            summaryItems.map((item) => (
              <div key={item.label} className="min-w-0">
                <dt className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </dt>
                <dd className="mt-0.5 text-sm text-foreground wrap-break-word">
                  {item.value}
                </dd>
              </div>
            ))
          ) : (
            <div className="min-w-0">
              <dt className="sr-only">Selected stack status</dt>
              <dd className="text-sm text-muted-foreground">
                Review the selected stack before generating.
              </dd>
            </div>
          )}
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

function getValidationMessage(errors: PreviewStepValidation["errors"]): string {
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
    return "Generated files did not pass safety checks. Review the selection and try again.";
  }

  return "Could not create the ZIP file. Retry in a moment.";
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
