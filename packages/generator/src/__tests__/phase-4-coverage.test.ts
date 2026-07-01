import { describe, expect, it } from "vitest";

import { defaultLaunchKitConfig, type LaunchKitConfig } from "@launchkit/schema";

import { renderEnvExample } from "../env";
import { featureRegistry } from "../features/registry";
import {
  createGeneratedFile,
  createGeneratedProject,
  normalizeGeneratedPath,
} from "../file-tree";
import { createGenerationPlan, generateProject } from "../generate-project";
import { mergePackageJsonPatches } from "../package-json";
import { createInMemoryTemplateLoader } from "../template-loader";

const fullMvpConfig = {
  ...defaultLaunchKitConfig,
  name: "full-stack-demo",
  ui: "shadcn",
  database: "postgres",
  orm: "prisma",
  auth: "authjs-credentials",
  docker: "postgres",
  packageManager: "pnpm",
} satisfies LaunchKitConfig;

describe("Phase 4 generator coverage", () => {
  it("feature definitions include labels and descriptions for every MVP feature", () => {
    for (const feature of Object.values(featureRegistry)) {
      expect(feature.label.trim()).not.toBe("");
      expect(feature.description.trim()).not.toBe("");
    }
  });

  it("the full MVP config resolves every selected feature in plan order", () => {
    expect(createGenerationPlan(fullMvpConfig).features.map((feature) => feature.id)).toEqual([
      "next",
      "tailwind",
      "shadcn",
      "postgres",
      "prisma",
      "authjs-credentials",
      "docker-postgres",
    ]);
  });

  it("generated files preserve text and binary contents", () => {
    const binaryContents = new Uint8Array([1, 2, 3, 4]);
    const textFile = createGeneratedFile("README.md", "# Demo");
    const binaryFile = createGeneratedFile("public/icon.png", binaryContents);

    expect(textFile.contents).toBe("# Demo");
    expect(binaryFile.contents).toBe(binaryContents);
  });

  it("generated projects store normalized safe paths for text and binary files", () => {
    const binaryContents = new Uint8Array([9, 8, 7]);

    expect(
      createGeneratedProject({
        name: "path-demo",
        packageManager: "npm",
        files: [
          { path: "docs\\README.md", contents: "docs" },
          { path: "public\\icon.png", contents: binaryContents },
        ],
      }).files,
    ).toEqual([
      { path: "docs/README.md", contents: "docs" },
      { path: "public/icon.png", contents: binaryContents },
    ]);
  });

  it("full MVP generated output only contains safe normalized file paths", async () => {
    const project = await generateProject(fullMvpConfig);

    expect(project.files.length).toBeGreaterThan(0);
    expect(project.files.map((file) => file.path)).toEqual(
      project.files.map((file) => normalizeGeneratedPath(file.path)),
    );
  });

  it("full MVP generated output includes merged env and package contributions", async () => {
    const project = await generateProject(fullMvpConfig);
    const packageJson = readJsonFile(project, "package.json");
    const envExample = readTextFile(project, ".env.example");

    expect(packageJson).toMatchObject({
      name: "full-stack-demo",
      dependencies: {
        "@prisma/client": "latest",
        "class-variance-authority": "^0.7.1",
        clsx: "^2.1.1",
        "tailwind-merge": "^3.6.0",
      },
      devDependencies: {
        "@tailwindcss/postcss": "^4",
        prisma: "latest",
        tailwindcss: "^4",
      },
      scripts: {
        "db:generate": "prisma generate",
        "db:push": "prisma db push",
        "db:studio": "prisma studio",
      },
    });
    expect(envExample).toContain("DATABASE_URL=");
    expect(envExample).toContain("AUTH_SECRET=");
  });

  it("template-loaded binary files remain binary in generated projects", async () => {
    const binaryContents = new Uint8Array([5, 6, 7]);
    const loader = createInMemoryTemplateLoader({
      asset: [
        {
          sourcePath: "logo.png",
          targetPath: "public\\{{projectName}}.png",
          contents: binaryContents,
        },
      ],
    });

    const project = await generateProject(defaultLaunchKitConfig, {
      templateLoader: loader,
      templateIds: ["asset"],
    });
    const file = project.files.find((candidate) => candidate.path === "public/my-app.png");

    expect(file?.contents).toEqual(binaryContents);
    expect(file?.contents).not.toBe(binaryContents);
  });

  it("empty env rendering is stable", () => {
    expect(renderEnvExample([])).toBe("");
  });

  it("undefined package metadata does not override defined metadata", () => {
    expect(mergePackageJsonPatches([{ name: "my-app" }, { name: undefined }])).toEqual({
      name: "my-app",
    });
  });
});

function readTextFile(
  project: Awaited<ReturnType<typeof generateProject>>,
  path: string,
): string {
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
