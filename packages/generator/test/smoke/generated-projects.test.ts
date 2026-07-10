import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import {
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { defaultLaunchKitConfig, type LaunchKitConfig } from "@baseforge/schema";

import type { GeneratedProject } from "../../src/file-tree";
import { createGenerationPlan, generateProject } from "../../src/generate-project";
import type { GenerationPlan } from "../../src/generation-plan";
import {
  applyTemplatePlaceholders,
  type TemplateContext,
  type TemplateFile,
  type TemplateLoader,
} from "../../src/template-loader";

const execFileAsync = promisify(execFile);
const testRoot = dirname(fileURLToPath(import.meta.url));
const templatesRoot = join(testRoot, "..", "..", "..", "templates");

const smokeCases = [
  {
    name: "default",
    config: defaultLaunchKitConfig,
    commands: [
      ["npm", ["install"]],
      ["npm", ["run", "typecheck"]],
      ["npm", ["run", "build"]],
    ],
  },
  {
    name: "all-compatible",
    config: {
      ...defaultLaunchKitConfig,
      name: "full-smoke-app",
      ui: "shadcn",
      database: "postgres",
      orm: "prisma",
      auth: "authjs-credentials",
      docker: "postgres",
    },
    commands: [
      ["npm", ["install"]],
      ["npm", ["run", "db:generate"]],
      ["npm", ["run", "typecheck"]],
      ["npm", ["run", "build"]],
    ],
  },
] as const satisfies readonly {
  name: string;
  config: LaunchKitConfig;
  commands: readonly [command: string, args: readonly string[]][];
}[];

describe("generated project smoke tests", () => {
  it.each(smokeCases)(
    "installs, typechecks, and builds the $name generated project",
    async ({ name, config, commands }) => {
      const projectDir = await writeGeneratedProjectToTempDir(config);

      for (const [command, args] of commands) {
        await runProjectCommand({
          caseName: name,
          command,
          args,
          cwd: projectDir,
        });
      }

      expect(projectDir).toContain(`${sep}launchkit-smoke-`);
    },
  );
});

async function writeGeneratedProjectToTempDir(config: LaunchKitConfig): Promise<string> {
  const project = await generateWithRealTemplates(config);
  const tempRoot = await mkdtemp(join(tmpdir(), "launchkit-smoke-"));
  const projectDir = join(tempRoot, project.name);

  await mkdir(projectDir, { recursive: true });

  for (const file of project.files) {
    const targetPath = resolveSafeGeneratedPath(projectDir, file.path);

    await mkdir(dirname(targetPath), { recursive: true });
    await writeFile(targetPath, file.contents);
  }

  return projectDir;
}

function resolveSafeGeneratedPath(projectDir: string, generatedPath: string): string {
  const segments = generatedPath.split("/");

  if (
    generatedPath.length === 0 ||
    generatedPath.startsWith("/") ||
    isAbsolute(generatedPath) ||
    segments.some((segment) => segment.length === 0 || segment === "." || segment === "..") ||
    segments.includes("src")
  ) {
    throw new Error(`Unsafe generated smoke-test path: ${generatedPath}`);
  }

  const targetPath = resolve(projectDir, ...segments);
  const relativeTarget = relative(projectDir, targetPath);

  if (
    relativeTarget.length === 0 ||
    relativeTarget.startsWith("..") ||
    isAbsolute(relativeTarget)
  ) {
    throw new Error(`Generated smoke-test path escapes project root: ${generatedPath}`);
  }

  return targetPath;
}

async function runProjectCommand(input: {
  caseName: string;
  command: string;
  args: readonly string[];
  cwd: string;
}): Promise<void> {
  try {
    await execFileAsync(input.command, [...input.args], {
      cwd: input.cwd,
      env: {
        ...process.env,
        DATABASE_URL:
          process.env.DATABASE_URL ??
          "postgresql://postgres:postgres@localhost:5432/launchkit_smoke",
        AUTH_SECRET: process.env.AUTH_SECRET ?? "launchkit-smoke-secret",
      },
      maxBuffer: 20 * 1024 * 1024,
      timeout: 300_000,
    });
  } catch (error) {
    throw new Error(formatCommandFailure(input, error));
  }
}

function formatCommandFailure(
  input: {
    caseName: string;
    command: string;
    args: readonly string[];
    cwd: string;
  },
  error: unknown,
): string {
  const commandLine = [input.command, ...input.args].join(" ");
  const commandError = error as {
    code?: number | string;
    signal?: string;
    stdout?: string | Buffer;
    stderr?: string | Buffer;
    message?: string;
  };

  return [
    `Generated project smoke command failed.`,
    `Config: ${input.caseName}`,
    `Command: ${commandLine}`,
    `Exit code: ${commandError.code ?? "unknown"}`,
    commandError.signal ? `Signal: ${commandError.signal}` : undefined,
    `Project directory: ${input.cwd}`,
    `stdout:\n${formatOutput(commandError.stdout)}`,
    `stderr:\n${formatOutput(commandError.stderr)}`,
    commandError.message ? `message:\n${commandError.message}` : undefined,
  ]
    .filter((line): line is string => line !== undefined)
    .join("\n\n");
}

function formatOutput(output: string | Buffer | undefined): string {
  if (!output) {
    return "<empty>";
  }

  return output.toString();
}

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
        throw new Error(`Unexpected template ID in smoke test: ${input.templateId}`);
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
