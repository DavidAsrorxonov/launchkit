import {
  access,
  readdir,
  stat,
} from "node:fs/promises";
import path from "node:path";

export type TargetDirectoryState =
  | { kind: "missing" }
  | { kind: "empty" }
  | { kind: "non-empty"; entries: string[] }
  | { kind: "file" };

export type ConfirmFunction = (message: string) => Promise<boolean>;

export class DirectorySafetyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DirectorySafetyError";
  }
}

export async function getTargetDirectoryState(
  targetDir: string,
): Promise<TargetDirectoryState> {
  let targetStat;

  try {
    targetStat = await stat(targetDir);
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return { kind: "missing" };
    }

    throw error;
  }

  if (!targetStat.isDirectory()) {
    return { kind: "file" };
  }

  const entries = (await readdir(targetDir))
    .filter((entry) => entry !== ".DS_Store")
    .sort();

  if (entries.length === 0) {
    return { kind: "empty" };
  }

  return {
    kind: "non-empty",
    entries,
  };
}

export async function findConflictingGeneratedPaths(input: {
  targetDir: string;
  generatedPaths: string[];
}): Promise<string[]> {
  const conflicts: string[] = [];

  for (const generatedPath of input.generatedPaths) {
    const outputPath = path.resolve(input.targetDir, generatedPath);

    try {
      await access(outputPath);
      conflicts.push(generatedPath);
    } catch (error) {
      if (isNodeError(error) && error.code === "ENOENT") {
        continue;
      }

      throw error;
    }
  }

  return conflicts;
}

export async function ensureSafeTargetDirectory(input: {
  targetDir: string;
  generatedPaths: string[];
  yes: boolean;
  confirm?: ConfirmFunction;
}): Promise<TargetDirectoryState> {
  const state = await getTargetDirectoryState(input.targetDir);

  if (state.kind === "file") {
    throw new DirectorySafetyError(
      `Target path exists and is not a directory: ${input.targetDir}`,
    );
  }

  if (state.kind === "non-empty") {
    if (input.yes) {
      throw new DirectorySafetyError(formatNonEmptyDirectoryError());
    }

    if (!input.confirm) {
      throw new DirectorySafetyError(formatNonEmptyDirectoryError());
    }

    const confirmed = await input.confirm(
      "The target directory is not empty. Continue and add BaseForge files?",
    );

    if (!confirmed) {
      throw new DirectorySafetyError("Project creation cancelled.");
    }
  }

  const conflicts = await findConflictingGeneratedPaths({
    targetDir: input.targetDir,
    generatedPaths: input.generatedPaths,
  });

  if (conflicts.length > 0) {
    throw new DirectorySafetyError(formatConflictingPathsError(conflicts));
  }

  return state;
}

export function formatConflictingPathsError(conflictingPaths: string[]): string {
  return [
    "Refusing to overwrite existing files:",
    ...conflictingPaths.map((path) => `- ${path}`),
    "Choose an empty directory or remove the conflicting files.",
  ].join("\n");
}

function formatNonEmptyDirectoryError(): string {
  return [
    "Target directory is not empty.",
    "Choose an empty directory or run without --yes to confirm adding BaseForge files.",
  ].join("\n");
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
