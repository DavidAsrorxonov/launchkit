import {
  mkdir,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import type { GeneratedProject } from "@launchkit/generator";

import {
  ensureSafeTargetDirectory,
  type ConfirmFunction,
} from "./directory-safety.js";
import { UnsafeGeneratedPathError, getSafeGeneratedFilePaths } from "./generate.js";

export type WriteProjectInput = {
  project: GeneratedProject;
  targetDir: string;
  cwd?: string;
  yes?: boolean;
  confirm?: ConfirmFunction;
};

export type CliProjectWriter = (
  input: WriteProjectInput,
) => Promise<WriteProjectResult>;

export type WriteProjectResult = {
  targetDir: string;
  filesWritten: string[];
};

export class ProjectWriteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectWriteError";
  }
}

export function resolveTargetDir(input: {
  targetDir?: string;
  projectName: string;
}): string {
  return input.targetDir ?? input.projectName;
}

export function formatTargetDirForDisplay(targetDir: string): string {
  if (targetDir === ".") {
    return ".";
  }

  if (path.isAbsolute(targetDir)) {
    return targetDir;
  }

  return targetDir.startsWith(".") ? targetDir : `.${path.sep}${targetDir}`;
}

export function formatNextSteps(input: {
  targetDir: string;
  packageManager: GeneratedProject["packageManager"];
  dependenciesInstalled?: boolean;
}): string[] {
  const installStep = input.dependenciesInstalled
    ? []
    : [`  ${input.packageManager} install`];

  if (input.targetDir === ".") {
    return [
      "Next steps:",
      ...installStep,
      input.packageManager === "pnpm" ? "  pnpm dev" : "  npm run dev",
    ];
  }

  return [
    "Next steps:",
    `  cd ${input.targetDir}`,
    ...installStep,
    input.packageManager === "pnpm" ? "  pnpm dev" : "  npm run dev",
  ];
}

export async function writeGeneratedProject(
  input: WriteProjectInput,
): Promise<WriteProjectResult> {
  const cwd = input.cwd ?? process.cwd();
  const targetRoot = path.resolve(cwd, input.targetDir);
  const safePaths = getSafeGeneratedFilePaths(input.project);

  await ensureSafeTargetDirectory({
    targetDir: targetRoot,
    generatedPaths: safePaths,
    yes: input.yes ?? true,
    confirm: input.confirm,
  });
  await mkdir(targetRoot, { recursive: true });

  const filesWritten: string[] = [];

  for (let index = 0; index < input.project.files.length; index += 1) {
    const file = input.project.files[index];
    const safePath = safePaths[index];

    if (!file || safePath === undefined) {
      throw new ProjectWriteError("Generated project contains an invalid file entry.");
    }

    const outputPath = resolveOutputPath(targetRoot, safePath);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, file.contents);
    filesWritten.push(safePath);
  }

  return {
    targetDir: targetRoot,
    filesWritten,
  };
}

function resolveOutputPath(targetRoot: string, safePath: string): string {
  const outputPath = path.resolve(targetRoot, safePath);
  const relativePath = path.relative(targetRoot, outputPath);

  if (
    relativePath.length === 0 ||
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new ProjectWriteError(
      `Generated path escapes the target directory: ${safePath}`,
    );
  }

  return outputPath;
}

export { UnsafeGeneratedPathError };
