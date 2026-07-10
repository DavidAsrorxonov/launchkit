import { describe, expect, it } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { defaultLaunchKitConfig, type LaunchKitConfig } from "@baseforge/schema";

import type { GenerationPlan } from "../generation-plan";
import { type GeneratedProject } from "../file-tree";
import { createGenerationPlan, generateProject } from "../generate-project";
import {
  applyTemplatePlaceholders,
  type TemplateContext,
  type TemplateFile,
  type TemplateLoader,
} from "../template-loader";

const templatesRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "templates");

describe("Phase 5 completion", () => {
  it("generates expected files for the MVP template combinations using real templates", async () => {
    const defaultProject = await generateWithRealTemplates(defaultLaunchKitConfig);
    const shadcnProject = await generateWithRealTemplates({
      ...defaultLaunchKitConfig,
      ui: "shadcn",
    });
    const postgresProject = await generateWithRealTemplates({
      ...defaultLaunchKitConfig,
      database: "postgres",
    });
    const prismaProject = await generateWithRealTemplates({
      ...defaultLaunchKitConfig,
      database: "postgres",
      orm: "prisma",
    });
    const authProject = await generateWithRealTemplates({
      ...defaultLaunchKitConfig,
      auth: "authjs-credentials",
    });
    const dockerProject = await generateWithRealTemplates({
      ...defaultLaunchKitConfig,
      database: "postgres",
      docker: "postgres",
    });
    const fullProject = await generateWithRealTemplates({
      ...defaultLaunchKitConfig,
      ui: "shadcn",
      database: "postgres",
      orm: "prisma",
      auth: "authjs-credentials",
      docker: "postgres",
    });

    for (const project of [
      defaultProject,
      shadcnProject,
      postgresProject,
      prismaProject,
      authProject,
      dockerProject,
      fullProject,
    ]) {
      expectSafeProjectPaths(project);
      expect(project.files.map((file) => file.path)).toEqual(
        expect.arrayContaining([
          "app/layout.tsx",
          "app/page.tsx",
          "app/globals.css",
          "package.json",
          "tsconfig.json",
          "next.config.ts",
          "postcss.config.mjs",
          ".gitignore",
          "README.md",
          ".env.example",
        ]),
      );
      expect(readJsonFile(project, "package.json")).toMatchObject({
        dependencies: {
          next: "16.2.9",
          react: "19.2.4",
          "react-dom": "19.2.4",
        },
        devDependencies: {
          "@tailwindcss/postcss": "^4",
          tailwindcss: "^4",
          typescript: "^5",
        },
      });
    }

    expect(defaultProject.files.map((file) => file.path)).not.toEqual(
      expect.arrayContaining([
        "components.json",
        "lib/utils.ts",
        "components/ui/button.tsx",
        "prisma/schema.prisma",
        "lib/db.ts",
        "auth.ts",
        "app/api/auth/[...nextauth]/route.ts",
        "docker-compose.yml",
      ]),
    );
    expect(shadcnProject.files.map((file) => file.path)).toEqual(
      expect.arrayContaining(["components.json", "lib/utils.ts", "components/ui/button.tsx"]),
    );
    expect(readTextFile(postgresProject, ".env.example")).toContain("DATABASE_URL=");
    expect(readTextFile(defaultProject, ".env.example")).not.toContain("DATABASE_URL=");
    expect(prismaProject.files.map((file) => file.path)).toEqual(
      expect.arrayContaining(["prisma/schema.prisma", "lib/db.ts", "prisma.config.ts"]),
    );
    expect(authProject.files.map((file) => file.path)).toEqual(
      expect.arrayContaining(["auth.ts", "app/api/auth/[...nextauth]/route.ts"]),
    );
    expect(readTextFile(authProject, ".env.example")).toContain("AUTH_SECRET=");
    expect(dockerProject.files.map((file) => file.path)).toContain("docker-compose.yml");
    expect(readTextFile(dockerProject, "docker-compose.yml")).toContain("POSTGRES_DB: \"my-app\"");
    expect(fullProject.files.map((file) => file.path)).toEqual(
      expect.arrayContaining([
        "components.json",
        "lib/utils.ts",
        "components/ui/button.tsx",
        "prisma/schema.prisma",
        "lib/db.ts",
        "prisma.config.ts",
        "auth.ts",
        "app/api/auth/[...nextauth]/route.ts",
        "docker-compose.yml",
      ]),
    );
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
        throw new Error(`Unexpected template ID in Phase 5 verification: ${input.templateId}`);
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

function expectSafeProjectPaths(project: GeneratedProject): void {
  for (const file of project.files) {
    expect(file.path.startsWith("/")).toBe(false);
    expect(file.path.startsWith("src/")).toBe(false);
    expect(file.path.split("/")).not.toContain("");
    expect(file.path.split("/")).not.toContain("..");
  }
}

function readTextFile(project: GeneratedProject, path: string): string {
  const file = project.files.find((candidate) => candidate.path === path);

  if (!file || typeof file.contents !== "string") {
    throw new Error(`Missing text file: ${path}`);
  }

  return file.contents;
}

function readJsonFile(project: GeneratedProject, path: string): Record<string, unknown> {
  return JSON.parse(readTextFile(project, path)) as Record<string, unknown>;
}
