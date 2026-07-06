import { writeFile } from "node:fs/promises";

import { defaultLaunchKitConfig } from "@launchkit/schema";
import { describe, expect, it, vi } from "vitest";

import {
  UnsafeGeneratedPathError,
  formatGeneratedProjectPreview,
  generateProjectForCli,
  getSafeGeneratedFilePaths,
  type CliProjectGenerator,
} from "./generate.js";

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
        ...defaultLaunchKitConfig,
        name: "custom-app",
        packageManager: "pnpm",
      },
      generator,
    );

    expect(generator).toHaveBeenCalledWith({
      ...defaultLaunchKitConfig,
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
      generateProjectForCli(defaultLaunchKitConfig, async () => project),
    ).resolves.toBe(project);
  });

  it("rejects unsafe generated paths before output", async () => {
    const project = createGeneratedProjectPreview({
      name: "my-app",
      packageManager: "npm",
      files: ["src/app/page.tsx"],
    });

    await expect(
      generateProjectForCli(defaultLaunchKitConfig, async () => project),
    ).rejects.toThrow(UnsafeGeneratedPathError);
  });

  it("propagates generator errors", async () => {
    const error = new Error("Template loader failed.");

    await expect(
      generateProjectForCli(defaultLaunchKitConfig, async () => {
        throw error;
      }),
    ).rejects.toBe(error);
  });

  it("does not write files during generation preview", async () => {
    const writeFileSpy = vi.mocked(writeFile);
    const project = createGeneratedProjectPreview({
      name: "my-app",
      packageManager: "npm",
      files: ["package.json"],
    });

    await generateProjectForCli(defaultLaunchKitConfig, async () => project);

    expect(writeFileSpy).not.toHaveBeenCalled();
  });

  it("works with the real generator", async () => {
    const project = await generateProjectForCli(defaultLaunchKitConfig);

    expect(project).toMatchObject({
      name: defaultLaunchKitConfig.name,
      packageManager: defaultLaunchKitConfig.packageManager,
    });
    expect(project.files.length).toBeGreaterThan(0);
    expect(project.files.map((file) => file.path)).toContain("package.json");
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

vi.mock("node:fs/promises", () => ({
  writeFile: vi.fn(),
}));

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
