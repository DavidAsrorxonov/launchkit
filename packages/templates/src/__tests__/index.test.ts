import { describe, expect, it } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { baseNextTemplateId, templatesPackageReady } from "../index";

const templatesRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);
const baseNextTemplateRoot = join(templatesRoot, "base", "next");

const requiredBaseNextTemplateFiles = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/globals.css",
  "components/.gitkeep",
  "lib/.gitkeep",
  "package.json",
  "tsconfig.json",
  "next.config.ts",
  "postcss.config.mjs",
  ".gitignore",
  "README.md",
];

describe("@launchkit/templates package foundation", () => {
  it("exports a readiness placeholder", () => {
    expect(templatesPackageReady()).toBe(true);
  });

  it("exports the base Next.js template id", () => {
    expect(baseNextTemplateId).toBe("next");
  });
});

describe("base Next.js template", () => {
  it("includes the required App Router and project files", async () => {
    await expect(
      Promise.all(
        requiredBaseNextTemplateFiles.map(async (filePath) => {
          await readFile(join(baseNextTemplateRoot, filePath));
        }),
      ),
    ).resolves.toHaveLength(requiredBaseNextTemplateFiles.length);
  });

  it("does not include a src directory", async () => {
    const entries = await readdir(baseNextTemplateRoot, { withFileTypes: true });

    expect(entries.some((entry) => entry.isDirectory() && entry.name === "src")).toBe(false);
  });

  it("uses only supported template placeholders", async () => {
    const templateFiles = await listTemplateFiles(baseNextTemplateRoot);
    const unsupportedPlaceholders = new Set<string>();

    for (const filePath of templateFiles) {
      const contents = await readFile(filePath, "utf8");

      for (const placeholder of contents.matchAll(/{{[^}]+}}/g)) {
        if (!["{{projectName}}", "{{packageName}}"].includes(placeholder[0])) {
          unsupportedPlaceholders.add(
            `${relative(baseNextTemplateRoot, filePath)}: ${placeholder[0]}`,
          );
        }
      }
    }

    expect([...unsupportedPlaceholders]).toEqual([]);
  });
});

async function listTemplateFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = join(root, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listTemplateFiles(entryPath)));
    } else {
      files.push(entryPath);
    }
  }

  return files;
}
