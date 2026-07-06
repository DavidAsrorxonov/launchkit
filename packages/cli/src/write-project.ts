import {
  mkdir,
  readdir,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import type { GeneratedProject } from "@launchkit/generator";

import { UnsafeGeneratedPathError, getSafeGeneratedFilePaths } from "./generate.js";

export type WriteProjectInput = {
  project: GeneratedProject;
  targetDir: string;
  cwd?: string;
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
}): string[] {
  const cdTarget = input.targetDir === "." ? "." : input.targetDir;

  return [
    "Next steps:",
    `  cd ${cdTarget}`,
    `  ${input.packageManager} install`,
    input.packageManager === "pnpm" ? "  pnpm dev" : "  npm run dev",
  ];
}

export async function writeGeneratedProject(
  input: WriteProjectInput,
): Promise<WriteProjectResult> {
  const cwd = input.cwd ?? process.cwd();
  const targetRoot = path.resolve(cwd, input.targetDir);
  const safePaths = getSafeGeneratedFilePaths(input.project);

  await prepareTargetDirectory(targetRoot);

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

async function prepareTargetDirectory(targetRoot: string): Promise<void> {
  const targetStatus = await readTargetStatus(targetRoot);

  if (targetStatus === "missing") {
    await mkdir(targetRoot, { recursive: true });
    return;
  }

  if (targetStatus === "file") {
    throw new ProjectWriteError(
      `Target path exists and is not a directory: ${targetRoot}`,
    );
  }

  const entries = await readdir(targetRoot);

  if (entries.length > 0) {
    throw new ProjectWriteError(
      `Target directory is not empty: ${targetRoot}`,
    );
  }
}

async function readTargetStatus(targetRoot: string): Promise<"directory" | "file" | "missing"> {
  try {
    const targetStat = await stat(targetRoot);
    return targetStat.isDirectory() ? "directory" : "file";
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return "missing";
    }

    throw error;
  }
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

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

export { UnsafeGeneratedPathError };
