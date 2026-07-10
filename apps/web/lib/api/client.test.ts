import { afterEach, describe, expect, it, vi } from "vitest";

import { defaultLaunchKitConfig } from "@baseforge/schema";

import {
  GenerateProjectApiError,
  generateProjectRequest,
} from "./client";
import { getFriendlyApiErrorMessage } from "./errors";

describe("generateProjectRequest", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns generated project data from a successful response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({
          project: {
            name: "my-app",
            packageManager: "npm",
            files: [],
          },
        }),
      ),
    );

    await expect(generateProjectRequest(defaultLaunchKitConfig)).resolves.toEqual({
      project: {
        name: "my-app",
        packageManager: "npm",
        files: [],
      },
    });
    expect(fetch).toHaveBeenCalledWith(
      "/api/generate",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(defaultLaunchKitConfig),
      }),
    );
  });

  it("throws friendly structured API errors for non-2xx responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json(
          {
            error: {
              code: "invalid_config",
              message: "Request body must be a valid BaseForge config.",
              issues: [{ path: ["name"] }],
            },
          },
          { status: 400 },
        ),
      ),
    );

    await expect(generateProjectRequest(defaultLaunchKitConfig)).rejects.toMatchObject({
      code: "invalid_config",
      status: 400,
      message: "Check the project settings before generating.",
      issues: [{ path: ["name"] }],
    } satisfies Partial<GenerateProjectApiError>);
  });

  it.each([
    [
      "invalid_content_type",
      "The generation request could not be sent. Refresh and try again.",
    ],
    [
      "request_too_large",
      "The generation request is too large. Review the selected project and try again.",
    ],
    ["invalid_json", "The generation request was malformed. Refresh and try again."],
    ["invalid_config", "Check the project settings before generating."],
    ["generation_failed", "Project generation failed. Retry in a moment."],
    [
      "unsafe_generated_output",
      "Generated files did not pass safety checks. Review the selection and try again.",
    ],
  ])("maps %s to a friendly message", (code, message) => {
    expect(getFriendlyApiErrorMessage({ code })).toBe(message);
  });

  it("uses compatibility issue messages when available", () => {
    expect(
      getFriendlyApiErrorMessage({
        code: "incompatible_config",
        issues: [
          {
            code: "prisma_requires_postgresql",
            message: "Prisma requires PostgreSQL.",
          },
        ],
      }),
    ).toBe("Prisma requires PostgreSQL.");
  });
});
