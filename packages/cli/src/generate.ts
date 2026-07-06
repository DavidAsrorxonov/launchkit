import {
  generateProject,
  normalizeGeneratedPath,
  type GeneratedProject,
} from "@launchkit/generator";
import type { LaunchKitConfig } from "@launchkit/schema";

export type CliProjectGenerator = (
  config: LaunchKitConfig,
) => Promise<GeneratedProject>;

export type GeneratedProjectPreviewOptions = {
  maxFiles?: number;
};

export class UnsafeGeneratedPathError extends Error {
  constructor(public readonly path: string) {
    super(`Generated project contains an unsafe file path: ${path}`);
    this.name = "UnsafeGeneratedPathError";
  }
}

export async function generateProjectForCli(
  config: LaunchKitConfig,
  projectGenerator: CliProjectGenerator = generateProject,
): Promise<GeneratedProject> {
  const project = await projectGenerator(config);
  assertGeneratedProjectPathsSafe(project);

  return project;
}

export function formatGeneratedProjectPreview(
  project: GeneratedProject,
  options: GeneratedProjectPreviewOptions = {},
): string[] {
  const safePaths = getSafeGeneratedFilePaths(project);
  const maxFiles = options.maxFiles ?? 10;
  const visiblePaths = safePaths.slice(0, maxFiles);
  const hiddenFileCount = Math.max(0, safePaths.length - visiblePaths.length);

  return [
    "Generated project preview:",
    `- name: ${project.name}`,
    `- package manager: ${project.packageManager}`,
    `- files: ${safePaths.length}`,
    ...(visiblePaths.length > 0
      ? ["Files:", ...visiblePaths.map((path) => `- ${path}`)]
      : []),
    ...(hiddenFileCount > 0 ? [`- ...and ${hiddenFileCount} more`] : []),
  ];
}

export function assertGeneratedProjectPathsSafe(project: GeneratedProject): void {
  getSafeGeneratedFilePaths(project);
}

export function getSafeGeneratedFilePaths(project: GeneratedProject): string[] {
  return project.files.map((file) => {
    let normalizedPath: string;

    try {
      normalizedPath = normalizeGeneratedPath(file.path);
    } catch {
      throw new UnsafeGeneratedPathError(file.path);
    }

    if (normalizedPath.split("/").includes("src")) {
      throw new UnsafeGeneratedPathError(file.path);
    }

    return normalizedPath;
  });
}
