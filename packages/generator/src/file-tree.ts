export type GeneratedFile = {
  path: string;
  contents: string | Uint8Array;
};

export type GeneratedProject = {
  name: string;
  files: GeneratedFile[];
  packageManager: "npm" | "pnpm";
};

export class InvalidGeneratedPathError extends Error {
  constructor(public readonly path: string) {
    super(`Invalid generated path: ${path}`);
    this.name = "InvalidGeneratedPathError";
  }
}

export function normalizeGeneratedPath(path: string): string {
  const normalizedPath = path.replaceAll("\\", "/");

  if (
    normalizedPath.length === 0 ||
    normalizedPath.trim().length === 0 ||
    normalizedPath === "." ||
    normalizedPath === ".." ||
    normalizedPath.startsWith("/") ||
    /^[A-Za-z]:($|\/)/.test(normalizedPath)
  ) {
    throw new InvalidGeneratedPathError(path);
  }

  const segments = normalizedPath.split("/");

  if (segments.some((segment) => segment.length === 0 || segment === "." || segment === "..")) {
    throw new InvalidGeneratedPathError(path);
  }

  return normalizedPath;
}

export function createGeneratedFile(path: string, contents: string | Uint8Array): GeneratedFile {
  return {
    path: normalizeGeneratedPath(path),
    contents,
  };
}

export function createGeneratedProject(input: {
  name: string;
  files?: GeneratedFile[];
  packageManager: "npm" | "pnpm";
}): GeneratedProject {
  return {
    name: input.name,
    files: input.files?.map((file) => createGeneratedFile(file.path, file.contents)) ?? [],
    packageManager: input.packageManager,
  };
}
