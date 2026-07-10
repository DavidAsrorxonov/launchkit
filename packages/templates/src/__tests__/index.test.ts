import { describe, expect, it } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  authjsCredentialsTemplateId,
  baseNextTemplateId,
  dockerPostgresTemplateId,
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
const authjsCredentialsTemplateRoot = join(templatesRoot, "features", "authjs-credentials");
const dockerPostgresTemplateRoot = join(templatesRoot, "features", "docker-postgres");
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

const requiredAuthjsCredentialsTemplateFiles = [
  "auth.ts",
  "app/api/auth/[...nextauth]/route.ts",
  "README.md",
];

const requiredDockerPostgresTemplateFiles = [
  "docker-compose.yml",
  "README.md",
];

const requiredPrismaTemplateFiles = [
  "prisma/schema.prisma",
  "lib/db.ts",
  "prisma.config.ts",
  "README.md",
];

const requiredShadcnTemplateFiles = [
  "components.json",
  "components/ui/button.tsx",
  "lib/utils.ts",
  "app/globals.css",
];

describe("@baseforge/templates package foundation", () => {
  it("exports a readiness placeholder", () => {
    expect(templatesPackageReady()).toBe(true);
  });

  it("exports the base Next.js template id", () => {
    expect(baseNextTemplateId).toBe("next");
  });

  it("exports the Auth.js credentials template id", () => {
    expect(authjsCredentialsTemplateId).toBe("authjs-credentials");
  });

  it("exports the Docker PostgreSQL template id", () => {
    expect(dockerPostgresTemplateId).toBe("docker-postgres");
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

describe("template file list snapshots", () => {
  it("locks base and feature template file boundaries", async () => {
    await expect({
      baseNext: await listRelativeTemplateFiles(baseNextTemplateRoot),
      tailwind: await listRelativeTemplateFiles(tailwindTemplateRoot),
      shadcn: await listRelativeTemplateFiles(shadcnTemplateRoot),
      postgres: await listRelativeTemplateFiles(postgresTemplateRoot),
      prisma: await listRelativeTemplateFiles(prismaTemplateRoot),
      authjsCredentials: await listRelativeTemplateFiles(authjsCredentialsTemplateRoot),
      dockerPostgres: await listRelativeTemplateFiles(dockerPostgresTemplateRoot),
    }).toMatchInlineSnapshot(`
      {
        "authjsCredentials": [
          "README.md",
          "app/api/auth/[...nextauth]/route.ts",
          "auth.ts",
        ],
        "baseNext": [
          ".gitignore",
          "README.md",
          "app/globals.css",
          "app/layout.tsx",
          "app/page.tsx",
          "components/.gitkeep",
          "lib/.gitkeep",
          "next.config.ts",
          "package.json",
          "postcss.config.mjs",
          "tsconfig.json",
        ],
        "dockerPostgres": [
          "README.md",
          "docker-compose.yml",
        ],
        "postgres": [
          ".env.example",
          "README.md",
        ],
        "prisma": [
          "README.md",
          "lib/db.ts",
          "prisma.config.ts",
          "prisma/schema.prisma",
        ],
        "shadcn": [
          "app/globals.css",
          "components.json",
          "components/ui/button.tsx",
          "lib/utils.ts",
        ],
        "tailwind": [
          "app/globals.css",
          "postcss.config.mjs",
        ],
      }
    `);
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

describe("Docker PostgreSQL feature template", () => {
  it("includes the required Docker PostgreSQL files", async () => {
    await expect(
      Promise.all(
        requiredDockerPostgresTemplateFiles.map(async (filePath) => {
          await readFile(join(dockerPostgresTemplateRoot, filePath));
        }),
      ),
    ).resolves.toHaveLength(requiredDockerPostgresTemplateFiles.length);
  });

  it("configures a local PostgreSQL Compose service", async () => {
    const compose = await readFile(join(dockerPostgresTemplateRoot, "docker-compose.yml"), "utf8");

    expect(compose).toContain("services:");
    expect(compose).toContain("postgres:");
    expect(compose).toContain("image: postgres:16");
    expect(compose).toContain("restart: unless-stopped");
    expect(compose).toContain('"5432:5432"');
    expect(compose).toContain("POSTGRES_USER: postgres");
    expect(compose).toContain("POSTGRES_PASSWORD: postgres");
    expect(compose).toContain('POSTGRES_DB: "{{packageName}}"');
    expect(compose).toContain("postgres_data:/var/lib/postgresql/data");
  });

  it("includes concise Docker PostgreSQL README guidance", async () => {
    const readme = await readFile(join(dockerPostgresTemplateRoot, "README.md"), "utf8");

    expect(readme).toContain("local development");
    expect(readme).toContain("docker compose up -d");
    expect(readme).toContain("docker compose down");
    expect(readme).toContain("development defaults");
    expect(readme).toContain("DATABASE_URL");
    expect(readme).toContain("postgresql://postgres:postgres@localhost:5432/{{packageName}}");
    expect(readme).toContain("production database hosting");
  });

  it("does not add Prisma, Auth.js, npm, or source-directory files", async () => {
    const templateFiles = (await listTemplateFiles(dockerPostgresTemplateRoot)).map((filePath) =>
      relative(dockerPostgresTemplateRoot, filePath),
    );

    expect([...templateFiles].sort()).toEqual([...requiredDockerPostgresTemplateFiles].sort());
    expect(templateFiles).not.toContain("prisma/schema.prisma");
    expect(templateFiles).not.toContain("lib/db.ts");
    expect(templateFiles).not.toContain("auth.ts");
    expect(templateFiles).not.toContain("app/api/auth/[...nextauth]/route.ts");
    expect(templateFiles).not.toContain("package.json");
  });

  it("does not include a src directory", async () => {
    const entries = await readdir(dockerPostgresTemplateRoot, { withFileTypes: true });

    expect(entries.some((entry) => entry.isDirectory() && entry.name === "src")).toBe(false);
  });

  it("uses only supported template placeholders", async () => {
    const templateFiles = await listTemplateFiles(dockerPostgresTemplateRoot);
    const unsupportedPlaceholders = new Set<string>();

    for (const filePath of templateFiles) {
      const contents = await readFile(filePath, "utf8");

      for (const placeholder of contents.matchAll(/{{[^}]+}}/g)) {
        if (!["{{projectName}}", "{{packageName}}"].includes(placeholder[0])) {
          unsupportedPlaceholders.add(
            `${relative(dockerPostgresTemplateRoot, filePath)}: ${placeholder[0]}`,
          );
        }
      }
    }

    expect([...unsupportedPlaceholders]).toEqual([]);
  });
});

describe("Auth.js credentials feature template", () => {
  it("includes the required Auth.js credentials files", async () => {
    await expect(
      Promise.all(
        requiredAuthjsCredentialsTemplateFiles.map(async (filePath) => {
          await readFile(join(authjsCredentialsTemplateRoot, filePath));
        }),
      ),
    ).resolves.toHaveLength(requiredAuthjsCredentialsTemplateFiles.length);
  });

  it("includes an Auth.js credentials scaffold", async () => {
    const auth = await readFile(join(authjsCredentialsTemplateRoot, "auth.ts"), "utf8");

    expect(auth).toContain('import NextAuth from "next-auth";');
    expect(auth).toContain('import type { NextAuthOptions } from "next-auth";');
    expect(auth).toContain('import CredentialsProvider from "next-auth/providers/credentials";');
    expect(auth).toContain("export const authOptions = {");
    expect(auth).toContain("CredentialsProvider({");
    expect(auth).toContain("} satisfies NextAuthOptions;");
    expect(auth).toContain("export default NextAuth(authOptions);");
    expect(auth).toContain("async authorize(credentials)");
    expect(auth).toContain("replace this with real user lookup and password verification");
    expect(auth).toContain("Never compare plain text passwords");
    expect(auth).toContain("return null;");
    expect(auth).not.toContain("password123");
  });

  it("includes an App Router Auth.js route handler", async () => {
    const route = await readFile(
      join(authjsCredentialsTemplateRoot, "app/api/auth/[...nextauth]/route.ts"),
      "utf8",
    );

    expect(route).toContain('import NextAuth from "next-auth";');
    expect(route).toContain('import { authOptions } from "@/auth";');
    expect(route).toContain("const handler = NextAuth(authOptions);");
    expect(route).toContain("export { handler as GET, handler as POST };");
  });

  it("includes concise Auth.js README guidance", async () => {
    const readme = await readFile(join(authjsCredentialsTemplateRoot, "README.md"), "utf8");

    expect(readme).toContain("Auth.js credentials scaffold");
    expect(readme).toContain("Replace `AUTH_SECRET`");
    expect(readme).toContain("placeholder and always rejects sign-ins");
    expect(readme).toContain("real user lookup");
    expect(readme).toContain("secure password hashing and verification");
    expect(readme).toContain("not production-complete");
    expect(readme).toContain("If Prisma is selected");
  });

  it("does not add Prisma, Docker, sign-in UI, or source-directory files", async () => {
    const templateFiles = (await listTemplateFiles(authjsCredentialsTemplateRoot)).map((filePath) =>
      relative(authjsCredentialsTemplateRoot, filePath),
    );

    expect([...templateFiles].sort()).toEqual([...requiredAuthjsCredentialsTemplateFiles].sort());
    expect(templateFiles).not.toContain("prisma/schema.prisma");
    expect(templateFiles).not.toContain("lib/db.ts");
    expect(templateFiles).not.toContain("docker-compose.yml");
    expect(templateFiles).not.toContain("app/auth/sign-in/page.tsx");
  });

  it("does not include a src directory", async () => {
    const entries = await readdir(authjsCredentialsTemplateRoot, { withFileTypes: true });

    expect(entries.some((entry) => entry.isDirectory() && entry.name === "src")).toBe(false);
  });

  it("uses only supported template placeholders", async () => {
    const templateFiles = await listTemplateFiles(authjsCredentialsTemplateRoot);
    const unsupportedPlaceholders = new Set<string>();

    for (const filePath of templateFiles) {
      const contents = await readFile(filePath, "utf8");

      for (const placeholder of contents.matchAll(/{{[^}]+}}/g)) {
        if (!["{{projectName}}", "{{packageName}}"].includes(placeholder[0])) {
          unsupportedPlaceholders.add(
            `${relative(authjsCredentialsTemplateRoot, filePath)}: ${placeholder[0]}`,
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

  it("configures Prisma schema for Prisma v7 and PostgreSQL", async () => {
    const schema = await readFile(join(prismaTemplateRoot, "prisma/schema.prisma"), "utf8");

    expect(schema).toContain('provider = "postgresql"');
    expect(schema).not.toContain('url      = env("DATABASE_URL")');
    expect(schema).toContain('provider = "prisma-client"');
    expect(schema).toContain('output   = "../lib/generated/prisma"');
    expect(schema).toContain("model User");
    expect(schema).not.toContain("Account");
    expect(schema).not.toContain("Session");
  });

  it("loads DATABASE_URL through Prisma config", async () => {
    const config = await readFile(join(prismaTemplateRoot, "prisma.config.ts"), "utf8");

    expect(config).toContain('import "dotenv/config";');
    expect(config).toContain('import { defineConfig, env } from "prisma/config";');
    expect(config).toContain('schema: "prisma/schema.prisma"');
    expect(config).toContain('url: env("DATABASE_URL")');
  });

  it("includes a development-safe Prisma client helper", async () => {
    const db = await readFile(join(prismaTemplateRoot, "lib/db.ts"), "utf8");

    expect(db).toContain('import { PrismaPg } from "@prisma/adapter-pg";');
    expect(db).toContain('import { PrismaClient } from "./generated/prisma/client";');
    expect(db).toContain("connectionString: process.env.DATABASE_URL");
    expect(db).toContain("const globalForPrisma = globalThis as unknown as");
    expect(db).toContain("export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });");
    expect(db).toContain('process.env.NODE_ENV !== "production"');
    expect(db).toContain("globalForPrisma.prisma = db;");
  });

  it("includes concise Prisma README guidance", async () => {
    const readme = await readFile(join(prismaTemplateRoot, "README.md"), "utf8");

    expect(readme).toContain("uses Prisma v7 with PostgreSQL");
    expect(readme).toContain("prisma.config.ts");
    expect(readme).toContain("@prisma/adapter-pg");
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

async function listRelativeTemplateFiles(root: string): Promise<string[]> {
  return (await listTemplateFiles(root))
    .map((filePath) => relative(root, filePath).replaceAll("\\", "/"))
    .sort();
}
