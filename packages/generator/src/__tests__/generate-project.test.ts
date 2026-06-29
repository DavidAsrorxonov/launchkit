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
      database: "postgres",
    });

    expect(readTextFile(project, ".env.example")).toContain(
      'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/my_app"',
    );
  });

  it("includes AUTH_SECRET when Auth.js credentials are selected", async () => {
    const project = await generateProject({
      ...defaultLaunchKitConfig,
      auth: "authjs-credentials",
    });

    expect(readTextFile(project, ".env.example")).toContain('AUTH_SECRET="replace-me"');
  });

  it("includes Prisma dependencies and scripts when Prisma is selected", async () => {
    const project = await generateProject({
      ...defaultLaunchKitConfig,
      database: "postgres",
      orm: "prisma",
    });

    expect(readJsonFile(project, "package.json")).toMatchObject({
      dependencies: {
        "@prisma/client": "latest",
      },
      devDependencies: {
        prisma: "latest",
      },
      scripts: {
        "db:generate": "prisma generate",
        "db:migrate": "prisma migrate dev",
      },
    });
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
    expect(plan.packageJson.dependencies).toEqual({ "@prisma/client": "latest" });
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
    ]);
    expect(plan.env.map((envVar) => envVar.name)).toEqual(["DATABASE_URL", "AUTH_SECRET"]);
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
