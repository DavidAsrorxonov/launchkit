import { describe, expect, it } from "vitest";

import { defaultLaunchKitConfig, type LaunchKitConfig } from "@launchkit/schema";

import { GET, POST } from "../../app/api/generate/route";
import {
  MAX_GENERATE_REQUEST_BYTES,
  handleGenerateProjectRequest,
  methodNotAllowedResponse,
  serializeGeneratedProject,
} from "./generate";

describe("generate API helpers", () => {
  it("routes POST requests through the generate handler", async () => {
    const response = await POST(jsonRequest(defaultLaunchKitConfig));
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body.project).toMatchObject({
      name: defaultLaunchKitConfig.name,
      packageManager: defaultLaunchKitConfig.packageManager,
    });
  });

  it("returns structured errors for GET requests", async () => {
    const response = GET();
    const body = await readJson(response);

    expect(response.status).toBe(405);
    expect(body.error).toEqual({
      code: "method_not_allowed",
      message: "Use POST to generate a project.",
    });
  });

  it("returns structured errors for explicit method-not-allowed responses", async () => {
    const response = methodNotAllowedResponse();
    const body = await readJson(response);

    expect(response.status).toBe(405);
    expect(body.error).toEqual({
      code: "method_not_allowed",
      message: "Use POST to generate a project.",
    });
  });

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

  it("returns 422 when Prisma is selected without PostgreSQL", async () => {
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

  it("returns 422 when Docker PostgreSQL is selected without PostgreSQL", async () => {
    const response = await handleGenerateProjectRequest(
      jsonRequest({
        ...defaultLaunchKitConfig,
        database: "none",
        docker: "postgres",
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
          code: "docker_postgres_requires_postgresql",
          message: "PostgreSQL Docker Compose is only available when PostgreSQL is selected.",
        }),
      ]),
    );
  });

  it("allows Auth.js credentials without a database", async () => {
    const response = await handleGenerateProjectRequest(
      jsonRequest({
        ...defaultLaunchKitConfig,
        auth: "authjs-credentials",
        database: "none",
        orm: "none",
      }),
    );
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body.project?.files).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "auth.ts",
          encoding: "utf8",
        }),
      ]),
    );
  });

  it("rejects unsupported non-Tailwind styling before shadcn compatibility can run", async () => {
    const response = await handleGenerateProjectRequest(
      jsonRequest({
        ...defaultLaunchKitConfig,
        ui: "shadcn",
        styling: "css",
      }),
    );
    const body = await readJson(response);

    expect(response.status).toBe(400);
    expect(body.error).toMatchObject({
      code: "invalid_config",
    });
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

    expect(response.status).toBe(413);
    expect(body.error).toMatchObject({
      code: "request_too_large",
    });
  });

  it("returns 413 for oversized bodies declared by content-length", async () => {
    const response = await handleGenerateProjectRequest(
      new Request("http://localhost/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "content-length": String(MAX_GENERATE_REQUEST_BYTES + 1),
        },
        body: JSON.stringify(defaultLaunchKitConfig),
      }),
    );
    const body = await readJson(response);

    expect(response.status).toBe(413);
    expect(body.error).toMatchObject({
      code: "request_too_large",
    });
  });

  it("returns 415 for non-JSON requests", async () => {
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

    expect(response.status).toBe(415);
    expect(body.error).toMatchObject({
      code: "invalid_content_type",
    });
  });

  it("accepts JSON requests with charset parameters", async () => {
    const response = await handleGenerateProjectRequest(
      new Request("http://localhost/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(defaultLaunchKitConfig),
      }),
    );

    expect(response.status).toBe(200);
  });

  it.each([
    "../outside.txt",
    "/absolute.txt",
    "app//page.tsx",
    ".",
    "..",
    "app/./page.tsx",
    "src/app/page.tsx",
    "app/src/page.tsx",
  ])("rejects unsafe generated path %s before response serialization", (path) => {
    expect(() => serializeUnsafePath(path)).toThrow("Unsafe generated path");
  });

  it("returns structured 500 errors for unsafe generated output", async () => {
    const response = await handleGenerateProjectRequest(
      jsonRequest(defaultLaunchKitConfig),
      {
        generate: async () => ({
          name: "unsafe",
          packageManager: "npm",
          files: [
            {
              path: "src/app/page.tsx",
              contents: "bad",
            },
          ],
        }),
      },
    );
    const body = await readJson(response);

    expect(response.status).toBe(500);
    expect(body.error).toEqual({
      code: "unsafe_generated_output",
      message: "Generated project contained unsafe file paths.",
    });
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
    expect(project.files[0]?.contents).toEqual(expect.any(String));
  });
});

function serializeUnsafePath(path: string): void {
  serializeGeneratedProject({
    name: "unsafe",
    packageManager: "npm",
    files: [
      {
        path,
        contents: "bad",
      },
    ],
  });
}

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
