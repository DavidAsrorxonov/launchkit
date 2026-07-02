import { describe, expect, it } from "vitest";

import {
  LaunchKitCompatibilityError,
  defaultLaunchKitConfig,
  type LaunchKitConfig,
} from "@launchkit/schema";

import { createInMemoryTemplateLoader } from "../template-loader";
import { createGenerationPlan, generateProject } from "../generate-project";

describe("generation pipeline", () => {
  it("generates a project for the default config", async () => {
    const project = await generateProject(defaultLaunchKitConfig);

    expect(project.name).toBe(defaultLaunchKitConfig.name);
    expect(project.packageManager).toBe(defaultLaunchKitConfig.packageManager);
    expect(project.files.map((file) => file.path)).toEqual([
      "package.json",
      ".env.example",
      "README.md",
    ]);
  });

  it("generates package.json with the configured project name", async () => {
    const project = await generateProject({
      ...defaultLaunchKitConfig,
      name: "launchkit-demo",
    });

    expect(readJsonFile(project, "package.json")).toMatchObject({
      name: "launchkit-demo",
      private: true,
      scripts: {},
      dependencies: {},
      devDependencies: {
        "@tailwindcss/postcss": "^4",
        tailwindcss: "^4",
      },
    });
  });

  it("includes Tailwind dependencies for the default MVP config", async () => {
    const project = await generateProject(defaultLaunchKitConfig);

    expect(readJsonFile(project, "package.json")).toMatchObject({
      devDependencies: {
        "@tailwindcss/postcss": "^4",
        tailwindcss: "^4",
      },
    });
  });

  it("generates a README with npm commands for npm configs", async () => {
    const project = await generateProject({
      ...defaultLaunchKitConfig,
      packageManager: "npm",
    });

    expect(readTextFile(project, "README.md")).toContain("npm install\nnpm run dev");
  });

  it("generates a README with pnpm commands for pnpm configs", async () => {
    const project = await generateProject({
      ...defaultLaunchKitConfig,
      packageManager: "pnpm",
    });

    expect(readTextFile(project, "README.md")).toContain("pnpm install\npnpm dev");
  });

  it("includes DATABASE_URL when PostgreSQL is selected", async () => {
    const project = await generateProject({
      ...defaultLaunchKitConfig,
      name: "database-demo",
      database: "postgres",
    });

    expect(readTextFile(project, ".env.example")).toContain(
      'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/database-demo"',
    );
  });

  it("does not include DATABASE_URL when PostgreSQL is not selected", async () => {
    const project = await generateProject({
      ...defaultLaunchKitConfig,
      database: "none",
    });

    expect(readTextFile(project, ".env.example")).not.toContain("DATABASE_URL=");
  });

  it("includes PostgreSQL README guidance only when PostgreSQL is selected", async () => {
    const defaultProject = await generateProject(defaultLaunchKitConfig);
    const postgresProject = await generateProject({
      ...defaultLaunchKitConfig,
      database: "postgres",
    });
    const defaultReadme = readTextFile(defaultProject, "README.md");
    const postgresReadme = readTextFile(postgresProject, "README.md");

    expect(defaultReadme).not.toContain("This project expects a PostgreSQL database.");
    expect(postgresReadme).toContain("This project expects a PostgreSQL database.");
    expect(postgresReadme).toContain("`DATABASE_URL` must be configured");
    expect(postgresReadme).toContain("development default only");
    expect(postgresReadme).toContain("Docker Compose support is optional");
    expect(postgresReadme).toContain("Prisma setup is optional");
  });

  it("does not add Prisma, Auth.js, or Docker files for PostgreSQL alone", async () => {
    const project = await generateProject({
      ...defaultLaunchKitConfig,
      database: "postgres",
    });
    const paths = project.files.map((file) => file.path);

    expect(paths).not.toContain("prisma/schema.prisma");
    expect(paths).not.toContain("lib/db.ts");
    expect(paths).not.toContain("app/api/auth/[...nextauth]/route.ts");
    expect(paths).not.toContain("docker-compose.yml");
    expect(paths.some((path) => path.startsWith("src/"))).toBe(false);
  });

  it("includes AUTH_SECRET when Auth.js credentials are selected", async () => {
    const project = await generateProject({
      ...defaultLaunchKitConfig,
      auth: "authjs-credentials",
    });

    expect(readTextFile(project, ".env.example")).toContain('AUTH_SECRET="replace-me"');
  });

  it("includes Auth.js dependency and README guidance when credentials auth is selected", async () => {
    const project = await generateProject({
      ...defaultLaunchKitConfig,
      auth: "authjs-credentials",
    });
    const packageJson = readJsonFile(project, "package.json");
    const readme = readTextFile(project, "README.md");

    expect(packageJson).toMatchObject({
      dependencies: {
        "next-auth": "latest",
      },
    });
    expect(readme).toContain("Auth.js credentials scaffold was generated.");
    expect(readme).toContain("`AUTH_SECRET` must be replaced");
    expect(readme).toContain("placeholder and always rejects sign-ins");
    expect(readme).toContain("Real user lookup must be implemented");
    expect(readme).toContain("Secure password hashing and verification");
    expect(readme).toContain("intentionally not production-complete");
  });

  it("does not include Auth.js dependency or README guidance when auth is none", async () => {
    const project = await generateProject({
      ...defaultLaunchKitConfig,
      auth: "none",
    });
    const packageJson = readJsonFile(project, "package.json");
    const readme = readTextFile(project, "README.md");

    expect(packageJson).not.toHaveProperty(["dependencies", "next-auth"]);
    expect(readme).not.toContain("Auth.js credentials scaffold was generated.");
  });

  it("includes Prisma dependencies and scripts when Prisma is selected", async () => {
    const project = await generateProject({
      ...defaultLaunchKitConfig,
      database: "postgres",
      orm: "prisma",
    });

    expect(readJsonFile(project, "package.json")).toMatchObject({
      type: "module",
      dependencies: {
        "@prisma/adapter-pg": "latest",
        "@prisma/client": "latest",
        dotenv: "latest",
      },
      devDependencies: {
        prisma: "latest",
      },
      scripts: {
        "db:generate": "prisma generate",
        "db:push": "prisma db push",
        "db:studio": "prisma studio",
      },
    });
    expect(readJsonFile(project, "package.json")).not.toHaveProperty(["scripts", "db:migrate"]);
  });

  it("includes Prisma README guidance only when Prisma is selected", async () => {
    const postgresProject = await generateProject({
      ...defaultLaunchKitConfig,
      database: "postgres",
      orm: "none",
    });
    const prismaProject = await generateProject({
      ...defaultLaunchKitConfig,
      database: "postgres",
      orm: "prisma",
    });
    const postgresReadme = readTextFile(postgresProject, "README.md");
    const prismaReadme = readTextFile(prismaProject, "README.md");

    expect(postgresReadme).not.toContain("Prisma v7 uses `prisma.config.ts`");
    expect(prismaReadme).toContain("Prisma v7 uses `prisma.config.ts`");
    expect(prismaReadme).toContain("@prisma/adapter-pg");
    expect(prismaReadme).toContain("npm run db:generate");
    expect(prismaReadme).toContain("npm run db:push");
    expect(prismaReadme).toContain("npm run db:studio");
  });

  it("creates a generation plan with resolved features and merged contributions", () => {
    const plan = createGenerationPlan({
      ...defaultLaunchKitConfig,
      database: "postgres",
      orm: "prisma",
      auth: "authjs-credentials",
    });

    expect(plan.features.map((feature) => feature.id)).toEqual([
      "next",
      "tailwind",
      "postgres",
      "prisma",
      "authjs-credentials",
    ]);
    expect(plan.packageJson.type).toBe("module");
    expect(plan.packageJson.dependencies).toEqual({
      "@prisma/adapter-pg": "latest",
      "@prisma/client": "latest",
      dotenv: "latest",
      "next-auth": "latest",
    });
    expect(plan.packageJson.devDependencies).toMatchObject({
      "@tailwindcss/postcss": "^4",
      tailwindcss: "^4",
      prisma: "latest",
    });
    expect(plan.templateFiles).toEqual([
      {
        sourcePath: "features/tailwind/app/globals.css",
        targetPath: "app/globals.css",
      },
      {
        sourcePath: "features/tailwind/postcss.config.mjs",
        targetPath: "postcss.config.mjs",
      },
      {
        sourcePath: "features/prisma/prisma/schema.prisma",
        targetPath: "prisma/schema.prisma",
      },
      {
        sourcePath: "features/prisma/lib/db.ts",
        targetPath: "lib/db.ts",
      },
      {
        sourcePath: "features/prisma/prisma.config.ts",
        targetPath: "prisma.config.ts",
      },
      {
        sourcePath: "features/authjs-credentials/auth.ts",
        targetPath: "auth.ts",
      },
      {
        sourcePath: "features/authjs-credentials/app/api/auth/[...nextauth]/route.ts",
        targetPath: "app/api/auth/[...nextauth]/route.ts",
      },
    ]);
    expect(plan.env.map((envVar) => envVar.name)).toEqual(["DATABASE_URL", "AUTH_SECRET"]);
    expect(plan.env.find((envVar) => envVar.name === "DATABASE_URL")?.value).toBe(
      "postgresql://postgres:postgres@localhost:5432/my-app",
    );
  });

  it("adds shadcn/ui dependencies and template files only when selected", () => {
    const defaultPlan = createGenerationPlan(defaultLaunchKitConfig);
    const shadcnPlan = createGenerationPlan({
      ...defaultLaunchKitConfig,
      ui: "shadcn",
    });

    expect(defaultPlan.packageJson.dependencies).toEqual({});
    expect(defaultPlan.templateFiles.map((file) => file.sourcePath)).not.toContain(
      "features/shadcn/components.json",
    );
    expect(shadcnPlan.packageJson.dependencies).toMatchObject({
      "class-variance-authority": "^0.7.1",
      clsx: "^2.1.1",
      "tailwind-merge": "^3.6.0",
    });
    expect(shadcnPlan.templateFiles.map((file) => file.targetPath)).toEqual([
      "app/globals.css",
      "postcss.config.mjs",
      "components.json",
      "lib/utils.ts",
      "components/ui/button.tsx",
      "app/globals.css",
    ]);
  });

  it("loads selected feature template files by default when a template loader is provided", async () => {
    const loader = createInMemoryTemplateLoader({
      "features/tailwind/app/globals.css": [
        {
          sourcePath: "features/tailwind/app/globals.css",
          targetPath: "app/globals.css",
          contents: "tailwind",
        },
      ],
      "features/tailwind/postcss.config.mjs": [
        {
          sourcePath: "features/tailwind/postcss.config.mjs",
          targetPath: "postcss.config.mjs",
          contents: "postcss",
        },
      ],
      "features/shadcn/components.json": [
        {
          sourcePath: "features/shadcn/components.json",
          targetPath: "components.json",
          contents: "{}",
        },
      ],
      "features/shadcn/lib/utils.ts": [
        {
          sourcePath: "features/shadcn/lib/utils.ts",
          targetPath: "lib/utils.ts",
          contents: "utils",
        },
      ],
      "features/shadcn/components/ui/button.tsx": [
        {
          sourcePath: "features/shadcn/components/ui/button.tsx",
          targetPath: "components/ui/button.tsx",
          contents: "button",
        },
      ],
      "features/shadcn/app/globals.css": [
        {
          sourcePath: "features/shadcn/app/globals.css",
          targetPath: "app/globals.css",
          contents: "shadcn",
        },
      ],
      "features/prisma/prisma/schema.prisma": [
        {
          sourcePath: "features/prisma/prisma/schema.prisma",
          targetPath: "prisma/schema.prisma",
          contents: 'datasource db { provider = "postgresql" }',
        },
      ],
      "features/prisma/lib/db.ts": [
        {
          sourcePath: "features/prisma/lib/db.ts",
          targetPath: "lib/db.ts",
          contents: 'import { PrismaPg } from "@prisma/adapter-pg";',
        },
      ],
      "features/prisma/prisma.config.ts": [
        {
          sourcePath: "features/prisma/prisma.config.ts",
          targetPath: "prisma.config.ts",
          contents: 'datasource: { url: env("DATABASE_URL") }',
        },
      ],
      "features/authjs-credentials/auth.ts": [
        {
          sourcePath: "features/authjs-credentials/auth.ts",
          targetPath: "auth.ts",
          contents: 'export const { handlers, signIn, signOut, auth } = NextAuth({});',
        },
      ],
      "features/authjs-credentials/app/api/auth/[...nextauth]/route.ts": [
        {
          sourcePath: "features/authjs-credentials/app/api/auth/[...nextauth]/route.ts",
          targetPath: "app/api/auth/[...nextauth]/route.ts",
          contents: 'import { handlers } from "@/auth";',
        },
      ],
    });

    const defaultProject = await generateProject(defaultLaunchKitConfig, {
      templateLoader: loader,
    });
    const shadcnProject = await generateProject(
      {
        ...defaultLaunchKitConfig,
        ui: "shadcn",
      },
      {
        templateLoader: loader,
      },
    );
    const prismaProject = await generateProject(
      {
        ...defaultLaunchKitConfig,
        database: "postgres",
        orm: "prisma",
      },
      {
        templateLoader: loader,
      },
    );
    const authProject = await generateProject(
      {
        ...defaultLaunchKitConfig,
        auth: "authjs-credentials",
      },
      {
        templateLoader: loader,
      },
    );

    expect(defaultProject.files.map((file) => file.path)).not.toContain("components.json");
    expect(defaultProject.files.map((file) => file.path)).not.toContain("lib/utils.ts");
    expect(defaultProject.files.map((file) => file.path)).not.toContain(
      "components/ui/button.tsx",
    );
    expect(defaultProject.files.map((file) => file.path)).not.toContain("prisma/schema.prisma");
    expect(defaultProject.files.map((file) => file.path)).not.toContain("lib/db.ts");
    expect(defaultProject.files.map((file) => file.path)).not.toContain("prisma.config.ts");
    expect(defaultProject.files.map((file) => file.path)).not.toContain("auth.ts");
    expect(defaultProject.files.map((file) => file.path)).not.toContain(
      "app/api/auth/[...nextauth]/route.ts",
    );
    expect(shadcnProject.files.map((file) => file.path)).toEqual(
      expect.arrayContaining(["components.json", "lib/utils.ts", "components/ui/button.tsx"]),
    );
    expect(prismaProject.files.map((file) => file.path)).toEqual(
      expect.arrayContaining(["prisma/schema.prisma", "lib/db.ts", "prisma.config.ts"]),
    );
    expect(readTextFile(prismaProject, "prisma/schema.prisma")).toContain("postgresql");
    expect(readTextFile(prismaProject, "lib/db.ts")).toContain("@prisma/adapter-pg");
    expect(readTextFile(prismaProject, "prisma.config.ts")).toContain("DATABASE_URL");
    expect(authProject.files.map((file) => file.path)).toEqual(
      expect.arrayContaining(["auth.ts", "app/api/auth/[...nextauth]/route.ts"]),
    );
    expect(readTextFile(authProject, "auth.ts")).toContain("handlers");
    expect(readTextFile(authProject, "app/api/auth/[...nextauth]/route.ts")).toContain(
      'from "@/auth"',
    );
  });

  it("does not add Auth.js, Docker, or source-directory files for Prisma", async () => {
    const loader = createInMemoryTemplateLoader({
      "features/tailwind/app/globals.css": [
        {
          sourcePath: "features/tailwind/app/globals.css",
          targetPath: "app/globals.css",
          contents: "tailwind",
        },
      ],
      "features/tailwind/postcss.config.mjs": [
        {
          sourcePath: "features/tailwind/postcss.config.mjs",
          targetPath: "postcss.config.mjs",
          contents: "postcss",
        },
      ],
      "features/prisma/prisma/schema.prisma": [
        {
          sourcePath: "features/prisma/prisma/schema.prisma",
          targetPath: "prisma/schema.prisma",
          contents: "schema",
        },
      ],
      "features/prisma/lib/db.ts": [
        {
          sourcePath: "features/prisma/lib/db.ts",
          targetPath: "lib/db.ts",
          contents: "db",
        },
      ],
      "features/prisma/prisma.config.ts": [
        {
          sourcePath: "features/prisma/prisma.config.ts",
          targetPath: "prisma.config.ts",
          contents: "config",
        },
      ],
    });
    const project = await generateProject(
      {
        ...defaultLaunchKitConfig,
        database: "postgres",
        orm: "prisma",
      },
      { templateLoader: loader },
    );
    const paths = project.files.map((file) => file.path);

    expect(paths).toEqual(
      expect.arrayContaining(["prisma/schema.prisma", "lib/db.ts", "prisma.config.ts"]),
    );
    expect(paths).not.toContain("app/api/auth/[...nextauth]/route.ts");
    expect(paths).not.toContain("auth.ts");
    expect(paths).not.toContain("docker-compose.yml");
    expect(paths.some((path) => path.startsWith("src/"))).toBe(false);
  });

  it("can include files loaded through the template loader interface", async () => {
    const loader = createInMemoryTemplateLoader({
      "base/skeleton": [
        {
          sourcePath: "README.template.md",
          targetPath: "docs/{{projectName}}.md",
          contents: "Package {{packageName}}",
        },
      ],
    });

    const project = await generateProject(defaultLaunchKitConfig, {
      templateLoader: loader,
      templateIds: ["base/skeleton"],
    });

    expect(readTextFile(project, "docs/my-app.md")).toBe("Package my-app");
  });

  it("rejects invalid schema configs", async () => {
    await expect(
      generateProject({
        ...defaultLaunchKitConfig,
        name: "Invalid Name",
      } as LaunchKitConfig),
    ).rejects.toThrow();
  });

  it("rejects incompatible configs", async () => {
    await expect(
      generateProject({
        ...defaultLaunchKitConfig,
        database: "none",
        orm: "prisma",
      }),
    ).rejects.toThrow(LaunchKitCompatibilityError);
  });
});

function readTextFile(project: Awaited<ReturnType<typeof generateProject>>, path: string): string {
  const file = project.files.find((candidate) => candidate.path === path);

  if (!file || typeof file.contents !== "string") {
    throw new Error(`Missing text file: ${path}`);
  }

  return file.contents;
}

function readJsonFile(
  project: Awaited<ReturnType<typeof generateProject>>,
  path: string,
): Record<string, unknown> {
  return JSON.parse(readTextFile(project, path)) as Record<string, unknown>;
}
