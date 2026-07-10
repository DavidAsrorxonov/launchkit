import { defaultBaseForgeConfig } from "@baseforge/schema";
import { describe, expect, it, vi } from "vitest";

import {
  UnsafeGeneratedPathError,
  formatGeneratedProjectPreview,
  generateProjectForCli,
  getSafeGeneratedFilePaths,
  type CliProjectGenerator,
} from "../generate.js";

describe("generateProjectForCli", () => {
  it("calls the provided generator helper with a valid config", async () => {
    const project = createGeneratedProjectPreview({
      name: "custom-app",
      packageManager: "pnpm",
      files: ["package.json"],
    });
    const generator = vi.fn<CliProjectGenerator>().mockResolvedValue(project);

    await generateProjectForCli(
      {
        ...defaultBaseForgeConfig,
        name: "custom-app",
        packageManager: "pnpm",
      },
      generator,
    );

    expect(generator).toHaveBeenCalledWith({
      ...defaultBaseForgeConfig,
      name: "custom-app",
      packageManager: "pnpm",
    });
  });

  it("returns the generated project", async () => {
    const project = createGeneratedProjectPreview({
      name: "my-app",
      packageManager: "npm",
      files: ["package.json"],
    });

    await expect(
      generateProjectForCli(defaultBaseForgeConfig, async () => project),
    ).resolves.toBe(project);
  });

  it("rejects unsafe generated paths before output", async () => {
    const project = createGeneratedProjectPreview({
      name: "my-app",
      packageManager: "npm",
      files: ["src/app/page.tsx"],
    });

    await expect(
      generateProjectForCli(defaultBaseForgeConfig, async () => project),
    ).rejects.toThrow(UnsafeGeneratedPathError);
  });

  it("propagates generator errors", async () => {
    const error = new Error("Template loader failed.");

    await expect(
      generateProjectForCli(defaultBaseForgeConfig, async () => {
        throw error;
      }),
    ).rejects.toBe(error);
  });

  it("does not write files during generation preview", async () => {
    const project = createGeneratedProjectPreview({
      name: "my-app",
      packageManager: "npm",
      files: ["package.json"],
    });

    const generatedProject = await generateProjectForCli(
      defaultBaseForgeConfig,
      async () => project,
    );

    expect(generatedProject.files).toEqual([
      {
        path: "package.json",
        contents: "",
      },
    ]);
  });

  it("works with the real generator", async () => {
    const project = await generateProjectForCli(defaultBaseForgeConfig);

    expect(project).toMatchObject({
      name: defaultBaseForgeConfig.name,
      packageManager: defaultBaseForgeConfig.packageManager,
    });
    expect(project.files.length).toBeGreaterThan(0);
    expect(project.files.map((file) => file.path)).toEqual(
      expect.arrayContaining(["package.json", "app/page.tsx"]),
    );
  });

  it("uses real templates for the all-compatible MVP config", async () => {
    const project = await generateProjectForCli({
      ...defaultBaseForgeConfig,
      name: "full-app",
      ui: "shadcn",
      database: "postgres",
      orm: "prisma",
      auth: "authjs-credentials",
      docker: "postgres",
    });

    expect(project.files.map((file) => file.path)).toEqual(
      expect.arrayContaining([
        "components.json",
        "components/ui/button.tsx",
        "lib/utils.ts",
        "prisma/schema.prisma",
        "lib/db.ts",
        "auth.ts",
        "app/api/auth/[...nextauth]/route.ts",
        "docker-compose.yml",
        ".env.example",
        "package.json",
        "README.md",
      ]),
    );
  });
});

describe("formatGeneratedProjectPreview", () => {
  it("includes project name, package manager, and file count", () => {
    const project = createGeneratedProjectPreview({
      name: "summary-app",
      packageManager: "pnpm",
      files: ["package.json", "app/page.tsx"],
    });

    expect(formatGeneratedProjectPreview(project)).toEqual([
      "Generated project preview:",
      "- name: summary-app",
      "- package manager: pnpm",
      "- files: 2",
      "Files:",
      "- package.json",
      "- app/page.tsx",
    ]);
  });

  it("checks paths before formatting output", () => {
    const project = createGeneratedProjectPreview({
      name: "unsafe-app",
      packageManager: "npm",
      files: ["../package.json"],
    });

    expect(() => formatGeneratedProjectPreview(project)).toThrow(
      UnsafeGeneratedPathError,
    );
  });

  it("caps long file lists", () => {
    const project = createGeneratedProjectPreview({
      name: "many-files",
      packageManager: "npm",
      files: ["a.txt", "b.txt", "c.txt"],
    });

    expect(formatGeneratedProjectPreview(project, { maxFiles: 2 })).toEqual([
      "Generated project preview:",
      "- name: many-files",
      "- package manager: npm",
      "- files: 3",
      "Files:",
      "- a.txt",
      "- b.txt",
      "- ...and 1 more",
    ]);
  });
});

describe("getSafeGeneratedFilePaths", () => {
  it("normalizes paths for output", () => {
    const project = createGeneratedProjectPreview({
      name: "my-app",
      packageManager: "npm",
      files: ["app\\page.tsx"],
    });

    expect(getSafeGeneratedFilePaths(project)).toEqual(["app/page.tsx"]);
  });
});

function createGeneratedProjectPreview(input: {
  name: string;
  packageManager: "npm" | "pnpm";
  files: string[];
}) {
  return {
    name: input.name,
    packageManager: input.packageManager,
    files: input.files.map((path) => ({
      path,
      contents: "",
    })),
  };
}
