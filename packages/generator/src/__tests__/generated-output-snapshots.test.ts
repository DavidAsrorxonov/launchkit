import { describe, expect, it } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  LaunchKitCompatibilityError,
  defaultLaunchKitConfig,
  type LaunchKitConfig,
} from "@baseforge/schema";

import { type GeneratedProject } from "../file-tree";
import { createGenerationPlan, generateProject } from "../generate-project";
import type { GenerationPlan } from "../generation-plan";
import {
  applyTemplatePlaceholders,
  type TemplateContext,
  type TemplateFile,
  type TemplateLoader,
} from "../template-loader";

const templatesRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "templates");

const baseFiles = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/globals.css",
  "package.json",
  "tsconfig.json",
  "next.config.ts",
  "postcss.config.mjs",
  ".gitignore",
  ".env.example",
  "README.md",
] as const;

const optionalFeatureFiles = [
  "components.json",
  "components/ui/button.tsx",
  "lib/utils.ts",
  "prisma/schema.prisma",
  "lib/db.ts",
  "prisma.config.ts",
  "auth.ts",
  "app/api/auth/[...nextauth]/route.ts",
  "docker-compose.yml",
] as const;

const outputCases = [
  {
    name: "default",
    config: defaultLaunchKitConfig,
  },
  {
    name: "shadcn",
    config: {
      ...defaultLaunchKitConfig,
      name: "shadcn-app",
      ui: "shadcn",
    },
  },
  {
    name: "postgres",
    config: {
      ...defaultLaunchKitConfig,
      name: "postgres-app",
      database: "postgres",
    },
  },
  {
    name: "prisma",
    config: {
      ...defaultLaunchKitConfig,
      name: "prisma-app",
      database: "postgres",
      orm: "prisma",
    },
  },
  {
    name: "authjs-credentials",
    config: {
      ...defaultLaunchKitConfig,
      name: "auth-app",
      auth: "authjs-credentials",
    },
  },
  {
    name: "docker-postgres",
    config: {
      ...defaultLaunchKitConfig,
      name: "docker-app",
      database: "postgres",
      docker: "postgres",
    },
  },
  {
    name: "all-compatible",
    config: {
      ...defaultLaunchKitConfig,
      name: "full-app",
      ui: "shadcn",
      database: "postgres",
      orm: "prisma",
      auth: "authjs-credentials",
      docker: "postgres",
    },
  },
] as const satisfies readonly {
  name: string;
  config: LaunchKitConfig;
}[];

describe("generated output snapshots", () => {
  it("locks generated path, package.json, and env output for the MVP matrix", async () => {
    const summaries = await Promise.all(
      outputCases.map(async ({ name, config }) => {
        const project = await generateWithRealTemplates(config);

        return {
          name,
          paths: listPaths(project),
          packageJson: parsePackageJson(project),
          envLines: readTextFile(project, ".env.example").split("\n"),
        };
      }),
    );

    expect(summaries).toMatchInlineSnapshot(`
      [
        {
          "envLines": [
            "",
          ],
          "name": "default",
          "packageJson": {
            "dependencies": {
              "next": "16.2.9",
              "react": "19.2.4",
              "react-dom": "19.2.4",
            },
            "devDependencies": {
              "@tailwindcss/postcss": "^4",
              "@types/node": "^20",
              "@types/react": "^19",
              "@types/react-dom": "^19",
              "tailwindcss": "^4",
              "typescript": "^5",
            },
            "name": "my-app",
            "private": true,
            "scripts": {
              "build": "next build",
              "dev": "next dev",
              "start": "next start",
              "typecheck": "tsc --noEmit",
            },
            "version": "0.1.0",
          },
          "paths": [
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
            ".env.example",
          ],
        },
        {
          "envLines": [
            "",
          ],
          "name": "shadcn",
          "packageJson": {
            "dependencies": {
              "class-variance-authority": "^0.7.1",
              "clsx": "^2.1.1",
              "next": "16.2.9",
              "react": "19.2.4",
              "react-dom": "19.2.4",
              "tailwind-merge": "^3.6.0",
            },
            "devDependencies": {
              "@tailwindcss/postcss": "^4",
              "@types/node": "^20",
              "@types/react": "^19",
              "@types/react-dom": "^19",
              "tailwindcss": "^4",
              "typescript": "^5",
            },
            "name": "shadcn-app",
            "private": true,
            "scripts": {
              "build": "next build",
              "dev": "next dev",
              "start": "next start",
              "typecheck": "tsc --noEmit",
            },
            "version": "0.1.0",
          },
          "paths": [
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
            "components.json",
            "lib/utils.ts",
            "components/ui/button.tsx",
            ".env.example",
          ],
        },
        {
          "envLines": [
            "# PostgreSQL connection string.",
            "DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres-app"",
            "",
          ],
          "name": "postgres",
          "packageJson": {
            "dependencies": {
              "next": "16.2.9",
              "react": "19.2.4",
              "react-dom": "19.2.4",
            },
            "devDependencies": {
              "@tailwindcss/postcss": "^4",
              "@types/node": "^20",
              "@types/react": "^19",
              "@types/react-dom": "^19",
              "tailwindcss": "^4",
              "typescript": "^5",
            },
            "name": "postgres-app",
            "private": true,
            "scripts": {
              "build": "next build",
              "dev": "next dev",
              "start": "next start",
              "typecheck": "tsc --noEmit",
            },
            "version": "0.1.0",
          },
          "paths": [
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
            ".env.example",
          ],
        },
        {
          "envLines": [
            "# PostgreSQL connection string.",
            "DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prisma-app"",
            "",
          ],
          "name": "prisma",
          "packageJson": {
            "dependencies": {
              "@prisma/adapter-pg": "latest",
              "@prisma/client": "latest",
              "dotenv": "latest",
              "next": "16.2.9",
              "react": "19.2.4",
              "react-dom": "19.2.4",
            },
            "devDependencies": {
              "@tailwindcss/postcss": "^4",
              "@types/node": "^20",
              "@types/react": "^19",
              "@types/react-dom": "^19",
              "prisma": "latest",
              "tailwindcss": "^4",
              "typescript": "^5",
            },
            "name": "prisma-app",
            "private": true,
            "scripts": {
              "build": "next build",
              "db:generate": "prisma generate",
              "db:push": "prisma db push",
              "db:studio": "prisma studio",
              "dev": "next dev",
              "start": "next start",
              "typecheck": "tsc --noEmit",
            },
            "type": "module",
            "version": "0.1.0",
          },
          "paths": [
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
            "prisma/schema.prisma",
            "lib/db.ts",
            "prisma.config.ts",
            ".env.example",
          ],
        },
        {
          "envLines": [
            "# Secret used by Auth.js for session and token signing.",
            "AUTH_SECRET="replace-me"",
            "",
          ],
          "name": "authjs-credentials",
          "packageJson": {
            "dependencies": {
              "next": "16.2.9",
              "next-auth": "latest",
              "react": "19.2.4",
              "react-dom": "19.2.4",
            },
            "devDependencies": {
              "@tailwindcss/postcss": "^4",
              "@types/node": "^20",
              "@types/react": "^19",
              "@types/react-dom": "^19",
              "tailwindcss": "^4",
              "typescript": "^5",
            },
            "name": "auth-app",
            "private": true,
            "scripts": {
              "build": "next build",
              "dev": "next dev",
              "start": "next start",
              "typecheck": "tsc --noEmit",
            },
            "version": "0.1.0",
          },
          "paths": [
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
            "auth.ts",
            "app/api/auth/[...nextauth]/route.ts",
            ".env.example",
          ],
        },
        {
          "envLines": [
            "# PostgreSQL connection string.",
            "DATABASE_URL="postgresql://postgres:postgres@localhost:5432/docker-app"",
            "",
          ],
          "name": "docker-postgres",
          "packageJson": {
            "dependencies": {
              "next": "16.2.9",
              "react": "19.2.4",
              "react-dom": "19.2.4",
            },
            "devDependencies": {
              "@tailwindcss/postcss": "^4",
              "@types/node": "^20",
              "@types/react": "^19",
              "@types/react-dom": "^19",
              "tailwindcss": "^4",
              "typescript": "^5",
            },
            "name": "docker-app",
            "private": true,
            "scripts": {
              "build": "next build",
              "dev": "next dev",
              "start": "next start",
              "typecheck": "tsc --noEmit",
            },
            "version": "0.1.0",
          },
          "paths": [
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
            "docker-compose.yml",
            ".env.example",
          ],
        },
        {
          "envLines": [
            "# PostgreSQL connection string.",
            "DATABASE_URL="postgresql://postgres:postgres@localhost:5432/full-app"",
            "",
            "# Secret used by Auth.js for session and token signing.",
            "AUTH_SECRET="replace-me"",
            "",
          ],
          "name": "all-compatible",
          "packageJson": {
            "dependencies": {
              "@prisma/adapter-pg": "latest",
              "@prisma/client": "latest",
              "class-variance-authority": "^0.7.1",
              "clsx": "^2.1.1",
              "dotenv": "latest",
              "next": "16.2.9",
              "next-auth": "latest",
              "react": "19.2.4",
              "react-dom": "19.2.4",
              "tailwind-merge": "^3.6.0",
            },
            "devDependencies": {
              "@tailwindcss/postcss": "^4",
              "@types/node": "^20",
              "@types/react": "^19",
              "@types/react-dom": "^19",
              "prisma": "latest",
              "tailwindcss": "^4",
              "typescript": "^5",
            },
            "name": "full-app",
            "private": true,
            "scripts": {
              "build": "next build",
              "db:generate": "prisma generate",
              "db:push": "prisma db push",
              "db:studio": "prisma studio",
              "dev": "next dev",
              "start": "next start",
              "typecheck": "tsc --noEmit",
            },
            "type": "module",
            "version": "0.1.0",
          },
          "paths": [
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
            "components.json",
            "lib/utils.ts",
            "components/ui/button.tsx",
            "prisma/schema.prisma",
            "lib/db.ts",
            "prisma.config.ts",
            "auth.ts",
            "app/api/auth/[...nextauth]/route.ts",
            "docker-compose.yml",
            ".env.example",
          ],
        },
      ]
    `);
  });

  it.each(outputCases)("keeps every generated path safe for $name", async ({ config }) => {
    const project = await generateWithRealTemplates(config);

    for (const path of listPaths(project)) {
      const segments = path.split("/");

      expect(path).not.toBe("");
      expect(path.startsWith("/")).toBe(false);
      expect(path.startsWith("src/")).toBe(false);
      expect(segments).not.toContain("");
      expect(segments).not.toContain(".");
      expect(segments).not.toContain("..");
    }
  });

  it("includes only base files for the default config", async () => {
    const project = await generateWithRealTemplates(defaultLaunchKitConfig);
    const paths = listPaths(project);
    const envExample = readTextFile(project, ".env.example");

    expect(paths).toEqual(expect.arrayContaining([...baseFiles]));
    expect(paths).not.toEqual(expect.arrayContaining([...optionalFeatureFiles]));
    expect(envExample).not.toContain("DATABASE_URL");
    expect(envExample).not.toContain("AUTH_SECRET");
  });

  it("adds shadcn/ui files and dependencies without backend files", async () => {
    const project = await generateWithRealTemplates({
      ...defaultLaunchKitConfig,
      ui: "shadcn",
    });
    const paths = listPaths(project);
    const packageJson = parsePackageJson(project);

    expect(paths).toEqual(
      expect.arrayContaining(["components.json", "lib/utils.ts", "components/ui/button.tsx"]),
    );
    expect(paths).not.toEqual(
      expect.arrayContaining([
        "prisma/schema.prisma",
        "lib/db.ts",
        "auth.ts",
        "app/api/auth/[...nextauth]/route.ts",
        "docker-compose.yml",
      ]),
    );
    expect(packageJson.dependencies).toMatchObject({
      "class-variance-authority": "^0.7.1",
      clsx: "^2.1.1",
      "tailwind-merge": "^3.6.0",
    });
  });

  it("adds PostgreSQL env and README guidance without Prisma, Auth.js, or Docker files", async () => {
    const project = await generateWithRealTemplates({
      ...defaultLaunchKitConfig,
      database: "postgres",
    });
    const paths = listPaths(project);
    const readme = readTextFile(project, "README.md");

    expect(readTextFile(project, ".env.example")).toContain("DATABASE_URL=");
    expect(readme).toContain("This project expects a PostgreSQL database.");
    expect(paths).not.toEqual(
      expect.arrayContaining([
        "prisma/schema.prisma",
        "lib/db.ts",
        "auth.ts",
        "app/api/auth/[...nextauth]/route.ts",
        "docker-compose.yml",
      ]),
    );
  });

  it("adds Prisma files, dependencies, and scripts only when Prisma is selected", async () => {
    const postgresProject = await generateWithRealTemplates({
      ...defaultLaunchKitConfig,
      database: "postgres",
    });
    const prismaProject = await generateWithRealTemplates({
      ...defaultLaunchKitConfig,
      database: "postgres",
      orm: "prisma",
    });
    const packageJson = parsePackageJson(prismaProject);

    expect(listPaths(postgresProject)).not.toEqual(
      expect.arrayContaining(["prisma/schema.prisma", "lib/db.ts", "prisma.config.ts"]),
    );
    expect(listPaths(prismaProject)).toEqual(
      expect.arrayContaining(["prisma/schema.prisma", "lib/db.ts", "prisma.config.ts"]),
    );
    expect(packageJson.dependencies).toMatchObject({
      "@prisma/adapter-pg": "latest",
      "@prisma/client": "latest",
      dotenv: "latest",
    });
    expect(packageJson.devDependencies).toMatchObject({
      prisma: "latest",
    });
    expect(packageJson.scripts).toMatchObject({
      "db:generate": "prisma generate",
      "db:push": "prisma db push",
      "db:studio": "prisma studio",
    });
  });

  it("adds Auth.js credentials files, env, dependency, and warning without requiring PostgreSQL", async () => {
    const project = await generateWithRealTemplates({
      ...defaultLaunchKitConfig,
      auth: "authjs-credentials",
      database: "none",
      orm: "none",
    });
    const paths = listPaths(project);
    const packageJson = parsePackageJson(project);
    const readme = readTextFile(project, "README.md");

    expect(paths).toEqual(
      expect.arrayContaining(["auth.ts", "app/api/auth/[...nextauth]/route.ts"]),
    );
    expect(readTextFile(project, ".env.example")).toContain("AUTH_SECRET=");
    expect(packageJson.dependencies).toMatchObject({
      "next-auth": "latest",
    });
    expect(readme).toContain("Credentials auth is intentionally not production-complete.");
  });

  it("adds Docker Compose for PostgreSQL without changing package dependencies", async () => {
    const postgresProject = await generateWithRealTemplates({
      ...defaultLaunchKitConfig,
      database: "postgres",
    });
    const dockerProject = await generateWithRealTemplates({
      ...defaultLaunchKitConfig,
      database: "postgres",
      docker: "postgres",
    });

    expect(listPaths(dockerProject)).toContain("docker-compose.yml");
    expect(readTextFile(dockerProject, "docker-compose.yml")).toContain("image: postgres:16");
    expect(parsePackageJson(dockerProject)).toEqual(parsePackageJson(postgresProject));
  });

  it("includes all compatible MVP feature output together without a src directory", async () => {
    const project = await generateWithRealTemplates({
      ...defaultLaunchKitConfig,
      ui: "shadcn",
      database: "postgres",
      orm: "prisma",
      auth: "authjs-credentials",
      docker: "postgres",
    });

    expect(listPaths(project)).toEqual(
      expect.arrayContaining([
        ...baseFiles,
        "components.json",
        "components/ui/button.tsx",
        "lib/utils.ts",
        "prisma/schema.prisma",
        "lib/db.ts",
        "auth.ts",
        "app/api/auth/[...nextauth]/route.ts",
        "docker-compose.yml",
      ]),
    );
    expect(readTextFile(project, ".env.example")).toContain("DATABASE_URL=");
    expect(readTextFile(project, ".env.example")).toContain("AUTH_SECRET=");
    expect(listPaths(project).some((path) => path.startsWith("src/"))).toBe(false);
  });

  it("rejects incompatible configs at the generator boundary", async () => {
    await expect(
      generateWithRealTemplates({
        ...defaultLaunchKitConfig,
        database: "none",
        orm: "prisma",
      }),
    ).rejects.toThrow(LaunchKitCompatibilityError);
    await expect(
      generateWithRealTemplates({
        ...defaultLaunchKitConfig,
        database: "none",
        docker: "postgres",
      }),
    ).rejects.toThrow(LaunchKitCompatibilityError);
  });
});

async function generateWithRealTemplates(config: LaunchKitConfig): Promise<GeneratedProject> {
  const plan = createGenerationPlan(config);

  return generateProject(config, {
    templateLoader: createRealTemplateLoader(plan),
  });
}

function createRealTemplateLoader(plan: GenerationPlan): TemplateLoader {
  const targetPathBySourcePath = new Map(
    plan.templateFiles.map((file) => [file.sourcePath, file.targetPath]),
  );

  return {
    async loadTemplateFiles(input) {
      if (input.templateId === `base/${plan.baseTemplate}`) {
        return loadTemplateDirectory(input.templateId, input.context);
      }

      const targetPath = targetPathBySourcePath.get(input.templateId);

      if (!targetPath) {
        throw new Error(`Unexpected template ID in output snapshot test: ${input.templateId}`);
      }

      return [
        await loadTemplateFile({
          sourcePath: input.templateId,
          targetPath,
          context: input.context,
        }),
      ];
    },
  };
}

async function loadTemplateDirectory(
  templateId: string,
  context: TemplateContext,
): Promise<TemplateFile[]> {
  const root = join(templatesRoot, templateId);
  const filePaths = await listFiles(root);

  return Promise.all(
    filePaths.map((filePath) => {
      const targetPath = relative(root, filePath).replaceAll("\\", "/");

      return loadTemplateFile({
        sourcePath: `${templateId}/${targetPath}`,
        targetPath,
        context,
      });
    }),
  );
}

async function loadTemplateFile(input: {
  sourcePath: string;
  targetPath: string;
  context: TemplateContext;
}): Promise<TemplateFile> {
  const contents = await readFile(join(templatesRoot, input.sourcePath), "utf8");

  return {
    sourcePath: input.sourcePath,
    targetPath: applyTemplatePlaceholders(input.targetPath, input.context),
    contents: applyTemplatePlaceholders(contents, input.context),
  };
}

async function listFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = join(root, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listFiles(entryPath)));
    } else {
      files.push(entryPath);
    }
  }

  return files;
}

function listPaths(project: GeneratedProject): string[] {
  return project.files.map((file) => file.path);
}

function readTextFile(project: GeneratedProject, path: string): string {
  const file = project.files.find((candidate) => candidate.path === path);

  if (!file || typeof file.contents !== "string") {
    throw new Error(`Missing text file: ${path}`);
  }

  return file.contents;
}

function parsePackageJson(project: GeneratedProject): {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
} & Record<string, unknown> {
  return JSON.parse(readTextFile(project, "package.json")) as {
    name?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
  } & Record<string, unknown>;
}
