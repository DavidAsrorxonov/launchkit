import { describe, expect, it } from "vitest";

import { defaultLaunchKitConfig, type LaunchKitConfig } from "@launchkit/schema";

import {
  MAX_GENERATE_REQUEST_BYTES,
  handleGenerateProjectRequest,
  serializeGeneratedProject,
} from "./generate";

describe("generate API helpers", () => {
  it("returns generated project data for a valid config", async () => {
    const response = await handleGenerateProjectRequest(jsonRequest(defaultLaunchKitConfig));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body.project).toMatchObject({
      name: defaultLaunchKitConfig.name,
      packageManager: defaultLaunchKitConfig.packageManager,
    });
    expect(body.project!.files).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "app/layout.tsx",
          encoding: "utf8",
        }),
        expect.objectContaining({
          path: "package.json",
          encoding: "utf8",
        }),
      ]),
    );
  });

  it("returns 400 for invalid configs", async () => {
    const response = await handleGenerateProjectRequest(
      jsonRequest({
        ...defaultLaunchKitConfig,
        name: "Invalid Name",
      }),
    );
    const body = await readJson(response);

    expect(response.status).toBe(400);
    expect(body.error).toMatchObject({
      code: "invalid_config",
    });
    expect(body.error!.issues).toEqual(expect.any(Array));
  });

  it("returns 422 for incompatible configs", async () => {
    const response = await handleGenerateProjectRequest(
      jsonRequest({
        ...defaultLaunchKitConfig,
        database: "none",
        orm: "prisma",
      }),
    );
    const body = await readJson(response);

    expect(response.status).toBe(422);
    expect(body.error).toMatchObject({
      code: "incompatible_config",
    });
    expect(body.error!.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "prisma_requires_postgresql",
        }),
      ]),
    );
  });

  it("returns 400 for malformed JSON", async () => {
    const response = await handleGenerateProjectRequest(
      new Request("http://localhost/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: "{",
      }),
    );
    const body = await readJson(response);

    expect(response.status).toBe(400);
    expect(body.error).toMatchObject({
      code: "invalid_json",
    });
  });

  it("returns 400 for oversized request bodies", async () => {
    const response = await handleGenerateProjectRequest(
      new Request("http://localhost/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ...defaultLaunchKitConfig,
          extra: "x".repeat(MAX_GENERATE_REQUEST_BYTES),
        }),
      }),
    );
    const body = await readJson(response);

    expect(response.status).toBe(400);
    expect(body.error).toMatchObject({
      code: "request_too_large",
    });
  });

  it("returns 400 for non-JSON requests", async () => {
    const response = await handleGenerateProjectRequest(
      new Request("http://localhost/api/generate", {
        method: "POST",
        headers: {
          "content-type": "text/plain",
        },
        body: JSON.stringify(defaultLaunchKitConfig),
      }),
    );
    const body = await readJson(response);

    expect(response.status).toBe(400);
    expect(body.error).toMatchObject({
      code: "unsupported_content_type",
    });
  });

  it("rejects unsafe generated paths before response serialization", () => {
    expect(() =>
      serializeGeneratedProject({
        name: "unsafe",
        packageManager: "npm",
        files: [
          {
            path: "../outside.txt",
            contents: "bad",
          },
        ],
      }),
    ).toThrow("Unsafe generated path");
  });

  it("rejects generated src directory paths before response serialization", () => {
    expect(() =>
      serializeGeneratedProject({
        name: "unsafe",
        packageManager: "npm",
        files: [
          {
            path: "src/app/page.tsx",
            contents: "bad",
          },
        ],
      }),
    ).toThrow("Unsafe generated path");
  });

  it("returns structured 500 errors without stack traces", async () => {
    const response = await handleGenerateProjectRequest(
      jsonRequest(defaultLaunchKitConfig),
      {
        generate: async () => {
          throw new Error("/internal/path/secret.ts exploded");
        },
      },
    );
    const body = await readJson(response);

    expect(response.status).toBe(500);
    expect(body.error).toEqual({
      code: "generation_failed",
      message: "Project generation failed.",
    });
  });

  it("serializes binary file contents as base64", () => {
    const project = serializeGeneratedProject({
      name: "binary-demo",
      packageManager: "pnpm",
      files: [
        {
          path: "public/icon.bin",
          contents: new Uint8Array([1, 2, 3]),
        },
      ],
    });

    expect(project.files).toEqual([
      {
        path: "public/icon.bin",
        contents: "AQID",
        encoding: "base64",
      },
    ]);
  });
});

function jsonRequest(config: LaunchKitConfig | Record<string, unknown>): Request {
  return new Request("http://localhost/api/generate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(config),
  });
}

type TestJsonBody = {
  project?: {
    name?: string;
    packageManager?: string;
    files?: unknown[];
  };
  error?: {
    code?: string;
    message?: string;
    issues?: unknown[];
  };
};

async function readJson(response: Response): Promise<TestJsonBody> {
  return response.json();
}
