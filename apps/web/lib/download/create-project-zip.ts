import JSZip from "jszip";

import type { GenerateProjectResponse } from "@/lib/api/types";

export class UnsafeZipPathError extends Error {
  constructor(path: string) {
    super(`Unsafe zip path: ${path}`);
    this.name = "UnsafeZipPathError";
  }
}

export async function createProjectZip(
  project: GenerateProjectResponse["project"],
): Promise<Blob> {
  const zip = new JSZip();
  const projectFolder = assertSafeProjectFolder(project.name);

  for (const file of project.files) {
    const safePath = assertSafeProjectFilePath(file.path);
    const zipPath = `${projectFolder}/${safePath}`;

    zip.file(
      zipPath,
      file.contents,
      file.encoding === "base64" ? { base64: true } : undefined,
    );
  }

  return zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
  });
}

function assertSafeProjectFolder(name: string): string {
  if (
    name.length === 0 ||
    name.trim().length === 0 ||
    name.includes("/") ||
    name.includes("\\") ||
    name === "." ||
    name === ".."
  ) {
    throw new UnsafeZipPathError(name);
  }

  return name;
}

function assertSafeProjectFilePath(path: string): string {
  const normalizedPath = path.replaceAll("\\", "/");

  if (
    normalizedPath.length === 0 ||
    normalizedPath.trim().length === 0 ||
    normalizedPath === "." ||
    normalizedPath === ".." ||
    normalizedPath.startsWith("/") ||
    /^[A-Za-z]:($|\/)/.test(normalizedPath)
  ) {
    throw new UnsafeZipPathError(path);
  }

  const segments = normalizedPath.split("/");

  if (
    segments.some(
      (segment) => segment.length === 0 || segment === "." || segment === "..",
    ) ||
    segments.includes("src")
  ) {
    throw new UnsafeZipPathError(path);
  }

  return normalizedPath;
}
