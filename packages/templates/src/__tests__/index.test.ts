import { describe, expect, it } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  baseNextTemplateId,
  postgresTemplateId,
  prismaTemplateId,
  shadcnTemplateId,
  tailwindTemplateId,
  templatesPackageReady,
} from "../index";

const templatesRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);
const baseNextTemplateRoot = join(templatesRoot, "base", "next");
const postgresTemplateRoot = join(templatesRoot, "features", "postgres");
const prismaTemplateRoot = join(templatesRoot, "features", "prisma");
const shadcnTemplateRoot = join(templatesRoot, "features", "shadcn");
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

const requiredPostgresTemplateFiles = [
  ".env.example",
  "README.md",
];

const requiredPrismaTemplateFiles = [
  "prisma/schema.prisma",
  "lib/db.ts",
  "README.md",
];

const requiredShadcnTemplateFiles = [
  "components.json",
  "components/ui/button.tsx",
  "lib/utils.ts",
  "app/globals.css",
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

  it("exports the PostgreSQL template id", () => {
    expect(postgresTemplateId).toBe("postgres");
  });

  it("exports the Prisma template id", () => {
    expect(prismaTemplateId).toBe("prisma");
  });

  it("exports the shadcn/ui template id", () => {
    expect(shadcnTemplateId).toBe("shadcn");
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

describe("shadcn/ui feature template", () => {
  it("includes the required shadcn/ui files", async () => {
    await expect(
      Promise.all(
        requiredShadcnTemplateFiles.map(async (filePath) => {
          await readFile(join(shadcnTemplateRoot, filePath));
        }),
      ),
    ).resolves.toHaveLength(requiredShadcnTemplateFiles.length);
  });

  it("configures shadcn/ui for a no-src App Router project", async () => {
    const componentsJson = JSON.parse(
      await readFile(join(shadcnTemplateRoot, "components.json"), "utf8"),
    ) as {
      aliases: Record<string, string>;
      tailwind: { css: string; config: string; cssVariables: boolean };
    };

    expect(componentsJson.tailwind).toMatchObject({
      css: "app/globals.css",
      config: "",
      cssVariables: true,
    });
    expect(componentsJson.aliases).toMatchObject({
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    });
  });

  it("includes the cn helper and button exports", async () => {
    await expect(readFile(join(shadcnTemplateRoot, "lib/utils.ts"), "utf8")).resolves.toContain(
      "export function cn(",
    );

    const button = await readFile(
      join(shadcnTemplateRoot, "components/ui/button.tsx"),
      "utf8",
    );

    expect(button).toContain('from "class-variance-authority"');
    expect(button).toContain('from "@/lib/utils"');
    expect(button).toContain("export { Button, buttonVariants }");
  });

  it("includes Tailwind v4 shadcn token CSS", async () => {
    const css = await readFile(join(shadcnTemplateRoot, "app/globals.css"), "utf8");

    expect(css).toContain('@import "tailwindcss";');
    expect(css).toContain("@custom-variant dark");
    expect(css).toContain("@theme inline");
    expect(css).toContain("--color-primary: var(--primary);");
    expect(css).toContain("--radius-lg: var(--radius);");
  });

  it("does not add backend feature files", async () => {
    const templateFiles = (await listTemplateFiles(shadcnTemplateRoot)).map((filePath) =>
      relative(shadcnTemplateRoot, filePath),
    );

    expect([...templateFiles].sort()).toEqual([...requiredShadcnTemplateFiles].sort());
    expect(templateFiles).not.toContain("prisma/schema.prisma");
    expect(templateFiles).not.toContain("lib/db.ts");
    expect(templateFiles).not.toContain("docker-compose.yml");
  });

  it("does not include a src directory", async () => {
    const entries = await readdir(shadcnTemplateRoot, { withFileTypes: true });

    expect(entries.some((entry) => entry.isDirectory() && entry.name === "src")).toBe(false);
  });

  it("uses only supported template placeholders", async () => {
    const templateFiles = await listTemplateFiles(shadcnTemplateRoot);
    const unsupportedPlaceholders = new Set<string>();

    for (const filePath of templateFiles) {
      const contents = await readFile(filePath, "utf8");

      for (const placeholder of contents.matchAll(/{{[^}]+}}/g)) {
        if (!["{{projectName}}", "{{packageName}}"].includes(placeholder[0])) {
          unsupportedPlaceholders.add(
            `${relative(shadcnTemplateRoot, filePath)}: ${placeholder[0]}`,
          );
        }
      }
    }

    expect([...unsupportedPlaceholders]).toEqual([]);
  });
});

describe("PostgreSQL feature template", () => {
  it("includes the required PostgreSQL files", async () => {
    await expect(
      Promise.all(
        requiredPostgresTemplateFiles.map(async (filePath) => {
          await readFile(join(postgresTemplateRoot, filePath));
        }),
      ),
    ).resolves.toHaveLength(requiredPostgresTemplateFiles.length);
  });

  it("includes the DATABASE_URL example with the package name placeholder", async () => {
    await expect(
      readFile(join(postgresTemplateRoot, ".env.example"), "utf8"),
    ).resolves.toContain(
      'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/{{packageName}}"',
    );
  });

  it("includes concise PostgreSQL README guidance", async () => {
    const readme = await readFile(join(postgresTemplateRoot, "README.md"), "utf8");

    expect(readme).toContain("expects a PostgreSQL database");
    expect(readme).toContain("Configure `DATABASE_URL`");
    expect(readme).toContain("development default only");
    expect(readme).toContain("Docker Compose support is optional");
    expect(readme).toContain("Prisma setup is optional");
  });

  it("does not add Prisma, Auth.js, Docker, or source-directory files", async () => {
    const templateFiles = (await listTemplateFiles(postgresTemplateRoot)).map((filePath) =>
      relative(postgresTemplateRoot, filePath),
    );

    expect([...templateFiles].sort()).toEqual([...requiredPostgresTemplateFiles].sort());
    expect(templateFiles).not.toContain("prisma/schema.prisma");
    expect(templateFiles).not.toContain("lib/db.ts");
    expect(templateFiles).not.toContain("app/api/auth/[...nextauth]/route.ts");
    expect(templateFiles).not.toContain("docker-compose.yml");
  });

  it("does not include a src directory", async () => {
    const entries = await readdir(postgresTemplateRoot, { withFileTypes: true });

    expect(entries.some((entry) => entry.isDirectory() && entry.name === "src")).toBe(false);
  });

  it("uses only supported template placeholders", async () => {
    const templateFiles = await listTemplateFiles(postgresTemplateRoot);
    const unsupportedPlaceholders = new Set<string>();

    for (const filePath of templateFiles) {
      const contents = await readFile(filePath, "utf8");

      for (const placeholder of contents.matchAll(/{{[^}]+}}/g)) {
        if (!["{{projectName}}", "{{packageName}}"].includes(placeholder[0])) {
          unsupportedPlaceholders.add(
            `${relative(postgresTemplateRoot, filePath)}: ${placeholder[0]}`,
          );
        }
      }
    }

    expect([...unsupportedPlaceholders]).toEqual([]);
  });
});

describe("Prisma feature template", () => {
  it("includes the required Prisma files", async () => {
    await expect(
      Promise.all(
        requiredPrismaTemplateFiles.map(async (filePath) => {
          await readFile(join(prismaTemplateRoot, filePath));
        }),
      ),
    ).resolves.toHaveLength(requiredPrismaTemplateFiles.length);
  });

  it("configures Prisma for PostgreSQL through DATABASE_URL", async () => {
    const schema = await readFile(join(prismaTemplateRoot, "prisma/schema.prisma"), "utf8");

    expect(schema).toContain('provider = "postgresql"');
    expect(schema).toContain('url      = env("DATABASE_URL")');
    expect(schema).toContain('provider = "prisma-client-js"');
    expect(schema).toContain("model User");
    expect(schema).not.toContain("Account");
    expect(schema).not.toContain("Session");
  });

  it("includes a development-safe Prisma client helper", async () => {
    const db = await readFile(join(prismaTemplateRoot, "lib/db.ts"), "utf8");

    expect(db).toContain('import { PrismaClient } from "@prisma/client";');
    expect(db).toContain("const globalForPrisma = globalThis as unknown as");
    expect(db).toContain("export const db = globalForPrisma.prisma ?? new PrismaClient();");
    expect(db).toContain('process.env.NODE_ENV !== "production"');
    expect(db).toContain("globalForPrisma.prisma = db;");
  });

  it("includes concise Prisma README guidance", async () => {
    const readme = await readFile(join(prismaTemplateRoot, "README.md"), "utf8");

    expect(readme).toContain("uses Prisma with PostgreSQL");
    expect(readme).toContain("npm run db:generate");
    expect(readme).toContain("npm run db:push");
    expect(readme).toContain("npm run db:studio");
    expect(readme).toContain("Docker Compose and Auth.js setup are optional separate features.");
  });

  it("does not add Auth.js, Docker, or source-directory files", async () => {
    const templateFiles = (await listTemplateFiles(prismaTemplateRoot)).map((filePath) =>
      relative(prismaTemplateRoot, filePath),
    );

    expect([...templateFiles].sort()).toEqual([...requiredPrismaTemplateFiles].sort());
    expect(templateFiles).not.toContain("app/api/auth/[...nextauth]/route.ts");
    expect(templateFiles).not.toContain("auth.ts");
    expect(templateFiles).not.toContain("docker-compose.yml");
  });

  it("does not include a src directory", async () => {
    const entries = await readdir(prismaTemplateRoot, { withFileTypes: true });

    expect(entries.some((entry) => entry.isDirectory() && entry.name === "src")).toBe(false);
  });

  it("uses only supported template placeholders", async () => {
    const templateFiles = await listTemplateFiles(prismaTemplateRoot);
    const unsupportedPlaceholders = new Set<string>();

    for (const filePath of templateFiles) {
      const contents = await readFile(filePath, "utf8");

      for (const placeholder of contents.matchAll(/{{[^}]+}}/g)) {
        if (!["{{projectName}}", "{{packageName}}"].includes(placeholder[0])) {
          unsupportedPlaceholders.add(
            `${relative(prismaTemplateRoot, filePath)}: ${placeholder[0]}`,
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
