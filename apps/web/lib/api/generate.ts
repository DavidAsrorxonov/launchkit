import {
  createGenerationPlan,
  generateProject,
  normalizeGeneratedPath,
  type GeneratedProject,
} from "@launchkit/generator";
import {
  LaunchKitCompatibilityError,
  LaunchKitConfigSchema,
  validateCompatibility,
  type LaunchKitConfig,
} from "@launchkit/schema";

import { jsonErrorResponse, jsonResponse } from "./response";
import { createWebTemplateLoader } from "./template-loader";

export const MAX_GENERATE_REQUEST_BYTES = 64 * 1024;

export type GenerateProjectResponse = {
  project: {
    name: string;
    packageManager: "npm" | "pnpm";
    files: Array<{
      path: string;
      contents: string;
      encoding: "utf8" | "base64";
    }>;
  };
};

export type GenerateProjectHandlerOptions = {
  generate?: (config: LaunchKitConfig) => Promise<GeneratedProject>;
};

export async function handleGenerateProjectRequest(
  request: Request,
  options: GenerateProjectHandlerOptions = {},
): Promise<Response> {
  const parsedBody = await readJsonRequestBody(request);

  if (!parsedBody.ok) {
    return parsedBody.response;
  }

  const parsedConfig = LaunchKitConfigSchema.safeParse(parsedBody.value);

  if (!parsedConfig.success) {
    return jsonErrorResponse({
      status: 400,
      code: "invalid_config",
      message: "Request body must be a valid LaunchKit config.",
      issues: parsedConfig.error.issues,
    });
  }

  const compatibilityIssues = validateCompatibility(parsedConfig.data);

  if (compatibilityIssues.length > 0) {
    return jsonErrorResponse({
      status: 422,
      code: "incompatible_config",
      message: "Selected stack options are not compatible.",
      issues: compatibilityIssues,
    });
  }

  try {
    const project = await (options.generate ?? generateProjectFromConfig)(
      parsedConfig.data,
    );

    return jsonResponse<GenerateProjectResponse>(
      {
        project: serializeGeneratedProject(project),
      },
      200,
    );
  } catch (error) {
    if (error instanceof LaunchKitCompatibilityError) {
      return jsonErrorResponse({
        status: 422,
        code: "incompatible_config",
        message: "Selected stack options are not compatible.",
        issues: error.issues,
      });
    }

    if (isZodError(error)) {
      return jsonErrorResponse({
        status: 400,
        code: "invalid_config",
        message: "Request body must be a valid LaunchKit config.",
        issues: error.issues,
      });
    }

    if (error instanceof UnsafeGeneratedPathError) {
      return jsonErrorResponse({
        status: 500,
        code: "unsafe_generated_path",
        message: "Generated project contained unsafe file paths.",
      });
    }

    return jsonErrorResponse({
      status: 500,
      code: "generation_failed",
      message: "Project generation failed.",
    });
  }
}

export function methodNotAllowedResponse(): Response {
  return jsonErrorResponse({
    status: 405,
    code: "method_not_allowed",
    message: "Use POST to generate a project.",
  });
}

export async function generateProjectFromConfig(
  config: LaunchKitConfig,
): Promise<GeneratedProject> {
  const plan = createGenerationPlan(config);

  return generateProject(config, {
    templateLoader: createWebTemplateLoader(plan),
  });
}

export function serializeGeneratedProject(
  project: GeneratedProject,
): GenerateProjectResponse["project"] {
  return {
    name: project.name,
    packageManager: project.packageManager,
    files: project.files.map((file) => ({
      path: assertSafeGeneratedResponsePath(file.path),
      contents:
        typeof file.contents === "string"
          ? file.contents
          : Buffer.from(file.contents).toString("base64"),
      encoding: typeof file.contents === "string" ? "utf8" : "base64",
    })),
  };
}

function assertSafeGeneratedResponsePath(path: string): string {
  let normalizedPath: string;

  try {
    normalizedPath = normalizeGeneratedPath(path);
  } catch {
    throw new UnsafeGeneratedPathError(path);
  }

  const segments = normalizedPath.split("/");

  if (segments.includes("src")) {
    throw new UnsafeGeneratedPathError(path);
  }

  return normalizedPath;
}

async function readJsonRequestBody(
  request: Request,
): Promise<{ ok: true; value: unknown } | { ok: false; response: Response }> {
  const contentType = request.headers.get("content-type");

  if (!isJsonContentType(contentType)) {
    return {
      ok: false,
      response: jsonErrorResponse({
        status: 400,
        code: "unsupported_content_type",
        message: "Request body must use application/json.",
      }),
    };
  }

  const contentLength = request.headers.get("content-length");

  if (
    contentLength &&
    Number.isFinite(Number(contentLength)) &&
    Number(contentLength) > MAX_GENERATE_REQUEST_BYTES
  ) {
    return {
      ok: false,
      response: jsonErrorResponse({
        status: 400,
        code: "request_too_large",
        message: "Request body must be 64 KB or smaller.",
      }),
    };
  }

  const text = await request.text();

  if (new TextEncoder().encode(text).byteLength > MAX_GENERATE_REQUEST_BYTES) {
    return {
      ok: false,
      response: jsonErrorResponse({
        status: 400,
        code: "request_too_large",
        message: "Request body must be 64 KB or smaller.",
      }),
    };
  }

  try {
    return {
      ok: true,
      value: JSON.parse(text) as unknown,
    };
  } catch {
    return {
      ok: false,
      response: jsonErrorResponse({
        status: 400,
        code: "invalid_json",
        message: "Request body must be valid JSON.",
      }),
    };
  }
}

function isJsonContentType(contentType: string | null): boolean {
  if (!contentType) {
    return false;
  }

  const mediaType = contentType.split(";")[0]?.trim().toLowerCase();

  return mediaType === "application/json" || mediaType.endsWith("+json");
}

class UnsafeGeneratedPathError extends Error {
  constructor(path: string) {
    super(`Unsafe generated path: ${path}`);
    this.name = "UnsafeGeneratedPathError";
  }
}

function isZodError(error: unknown): error is { issues: unknown[] } {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "ZodError" &&
    "issues" in error &&
    Array.isArray(error.issues)
  );
}
