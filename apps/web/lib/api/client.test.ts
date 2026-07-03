import { afterEach, describe, expect, it, vi } from "vitest";

import { defaultLaunchKitConfig } from "@launchkit/schema";

import {
  GenerateProjectApiError,
  generateProjectRequest,
} from "./client";

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

  it("throws structured API errors for non-2xx responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json(
          {
            error: {
              code: "invalid_config",
              message: "Request body must be a valid LaunchKit config.",
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
      message: "Request body must be a valid LaunchKit config.",
      issues: [{ path: ["name"] }],
    } satisfies Partial<GenerateProjectApiError>);
  });
});
