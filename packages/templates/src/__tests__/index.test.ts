import { describe, expect, it } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { baseNextTemplateId, tailwindTemplateId, templatesPackageReady } from "../index";

const templatesRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);
const baseNextTemplateRoot = join(templatesRoot, "base", "next");
const tailwindTemplateRoot = join(templatesRoot, "features", "tailwind");

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

const requiredTailwindTemplateFiles = [
  "app/globals.css",
  "postcss.config.mjs",
];

describe("@launchkit/templates package foundation", () => {
  it("exports a readiness placeholder", () => {
    expect(templatesPackageReady()).toBe(true);
  });

  it("exports the base Next.js template id", () => {
    expect(baseNextTemplateId).toBe("next");
  });

  it("exports the Tailwind template id", () => {
    expect(tailwindTemplateId).toBe("tailwind");
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

describe("Tailwind feature template", () => {
  it("includes the required Tailwind files", async () => {
    await expect(
      Promise.all(
        requiredTailwindTemplateFiles.map(async (filePath) => {
          await readFile(join(tailwindTemplateRoot, filePath));
        }),
      ),
    ).resolves.toHaveLength(requiredTailwindTemplateFiles.length);
  });

  it("uses the Tailwind v4 stylesheet import", async () => {
    await expect(readFile(join(tailwindTemplateRoot, "app/globals.css"), "utf8")).resolves.toContain(
      '@import "tailwindcss";',
    );
  });

  it("uses the Tailwind v4 PostCSS plugin", async () => {
    await expect(
      readFile(join(tailwindTemplateRoot, "postcss.config.mjs"), "utf8"),
    ).resolves.toContain('"@tailwindcss/postcss": {}');
  });

  it("does not add shadcn/ui or backend feature files", async () => {
    const templateFiles = (await listTemplateFiles(tailwindTemplateRoot)).map((filePath) =>
      relative(tailwindTemplateRoot, filePath),
    );

    expect(templateFiles).toEqual(requiredTailwindTemplateFiles);
    expect(templateFiles).not.toContain("components.json");
    expect(templateFiles).not.toContain("components/ui/button.tsx");
    expect(templateFiles).not.toContain("lib/utils.ts");
    expect(templateFiles).not.toContain("prisma/schema.prisma");
    expect(templateFiles).not.toContain("docker-compose.yml");
  });

  it("does not include a src directory", async () => {
    const entries = await readdir(tailwindTemplateRoot, { withFileTypes: true });

    expect(entries.some((entry) => entry.isDirectory() && entry.name === "src")).toBe(false);
  });

  it("uses only supported template placeholders", async () => {
    const templateFiles = await listTemplateFiles(tailwindTemplateRoot);
    const unsupportedPlaceholders = new Set<string>();

    for (const filePath of templateFiles) {
      const contents = await readFile(filePath, "utf8");

      for (const placeholder of contents.matchAll(/{{[^}]+}}/g)) {
        if (!["{{projectName}}", "{{packageName}}"].includes(placeholder[0])) {
          unsupportedPlaceholders.add(
            `${relative(tailwindTemplateRoot, filePath)}: ${placeholder[0]}`,
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
