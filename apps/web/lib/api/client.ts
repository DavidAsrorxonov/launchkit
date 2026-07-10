import type { LaunchKitConfig } from "@baseforge/schema";

import { getFriendlyApiErrorMessage } from "./errors";
import type { ApiErrorResponse, GenerateProjectResponse } from "./types";

export class GenerateProjectApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly issues?: unknown[];

  constructor(input: {
    code: string;
    message: string;
    status: number;
    issues?: unknown[];
  }) {
    super(input.message);
    this.name = "GenerateProjectApiError";
    this.code = input.code;
    this.status = input.status;
    this.issues = input.issues;
  }
}

export async function generateProjectRequest(
  config: LaunchKitConfig,
): Promise<GenerateProjectResponse> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(config),
  });

  const body = (await response.json()) as
    | GenerateProjectResponse
    | ApiErrorResponse;

  if (!response.ok) {
    const error = "error" in body ? body.error : undefined;

    throw new GenerateProjectApiError({
      status: response.status,
      code: error?.code ?? "request_failed",
      message: getFriendlyApiErrorMessage({
        code: error?.code ?? "request_failed",
        message: error?.message,
        issues: error?.issues,
      }),
      issues: error?.issues,
    });
  }

  return body as GenerateProjectResponse;
}
