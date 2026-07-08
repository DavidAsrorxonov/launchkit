import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

import { afterEach, describe, expect, it } from "vitest";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const cliEntry = path.join(packageRoot, "dist", "index.js");
const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempRoots.splice(0).map((tempRoot) =>
      rm(tempRoot, { recursive: true, force: true }),
    ),
  );
});

describe("built CLI smoke checks", () => {
  it("bundles internal packages and template assets", async () => {
    await expectFile(cliEntry);
    await expectFile(packageRoot, "dist/templates/base/next/app/page.tsx");
    await expectFile(
      packageRoot,
      "dist/templates/features/shadcn/components/ui/button.tsx",
    );

    const entryContents = await readFile(cliEntry, "utf8");

    expect(entryContents.startsWith("#!/usr/bin/env node")).toBe(true);
    expect(entryContents).not.toContain('from "@launchkit/generator"');
    expect(entryContents).not.toContain('from "@launchkit/schema"');
  });

  it("generates the default --yes project without installing dependencies", async () => {
    const cwd = await createTempRoot();
    const result = await runBuiltCli(["my-app", "--yes"], cwd);

    assertExitCode(result, 0);
    expect(result.stdout).toContain("Created my-app in ./my-app");
    expect(result.stdout).toContain("Next steps:");
    expect(result.stdout).toContain("npm install");
    expect(result.stdout).toContain("npm run dev");
    await expectFiles(cwd, "my-app", [
      "package.json",
      ".env.example",
      "README.md",
    ]);
    await expectNoSrcDirectory(cwd, "my-app");
    await expectNoDependencyInstallArtifacts(cwd, "my-app");
  });

  it("generates the all-compatible MVP config with expected files", async () => {
    const cwd = await createTempRoot();
    const result = await runBuiltCli(
      [
        "full-app",
        "--yes",
        "--ui",
        "shadcn",
        "--database",
        "postgres",
        "--orm",
        "prisma",
        "--auth",
        "authjs-credentials",
        "--docker",
        "postgres",
      ],
      cwd,
    );

    assertExitCode(result, 0);
    await expectFiles(cwd, "full-app", [
      "components.json",
      "components/ui/button.tsx",
      "lib/utils.ts",
      "prisma/schema.prisma",
      "lib/db.ts",
      "auth.ts",
      "app/api/auth/[...nextauth]/route.ts",
      "docker-compose.yml",
      ".env.example",
      "package.json",
      "README.md",
    ]);
    await expectNoSrcDirectory(cwd, "full-app");
    await expectNoDependencyInstallArtifacts(cwd, "full-app");
  });

  it("rejects an existing non-empty directory with --yes", async () => {
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "blocked-app"));
    await writeFile(path.join(cwd, "blocked-app", "notes.txt"), "");

    const result = await runBuiltCli(["blocked-app", "--yes"], cwd);

    assertExitCode(result, 1);
    expect(result.stderr).toContain("Target directory is not empty.");
    await expect(readdir(path.join(cwd, "blocked-app"))).resolves.toEqual([
      "notes.txt",
    ]);
  });
});

type CliRunResult = {
  commandLine: string;
  cwd: string;
  exitCode: number | null;
  stdout: string;
  stderr: string;
};

async function createTempRoot(): Promise<string> {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "launchkit-cli-smoke-"));
  tempRoots.push(tempRoot);

  return tempRoot;
}

async function runBuiltCli(args: string[], cwd: string): Promise<CliRunResult> {
  const command = process.execPath;
  const commandArgs = [cliEntry, ...args];

  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, { cwd });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(
        new Error(
          formatSmokeFailure({
            commandLine: [command, ...commandArgs].join(" "),
            cwd,
            exitCode: null,
            stdout: Buffer.concat(stdout).toString("utf8"),
            stderr: Buffer.concat(stderr).toString("utf8"),
          }),
        ),
      );
    }, 10_000);

    child.stdout.on("data", (chunk: Buffer) => {
      stdout.push(chunk);
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr.push(chunk);
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (exitCode) => {
      clearTimeout(timer);
      resolve({
        commandLine: [command, ...commandArgs].join(" "),
        cwd,
        exitCode,
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: Buffer.concat(stderr).toString("utf8"),
      });
    });
  });
}

function assertExitCode(result: CliRunResult, expectedExitCode: number): void {
  if (result.exitCode !== expectedExitCode) {
    throw new Error(formatSmokeFailure(result));
  }
}

function formatSmokeFailure(result: CliRunResult): string {
  return [
    "CLI smoke check failed.",
    `Command: ${result.commandLine}`,
    `Exit code: ${result.exitCode ?? "none"}`,
    `Temp directory: ${result.cwd}`,
    "stdout:",
    result.stdout.length > 0 ? result.stdout : "(empty)",
    "stderr:",
    result.stderr.length > 0 ? result.stderr : "(empty)",
  ].join("\n");
}

async function expectFiles(
  cwd: string,
  projectDir: string,
  expectedPaths: string[],
): Promise<void> {
  for (const expectedPath of expectedPaths) {
    await expectFile(cwd, projectDir, expectedPath);
  }
}

async function expectFile(...pathParts: string[]): Promise<void> {
  const expectedPath = path.join(...pathParts);
  const fileStat = await stat(expectedPath);

  expect(fileStat.isFile(), expectedPath).toBe(true);
}

async function expectNoSrcDirectory(
  cwd: string,
  projectDir: string,
): Promise<void> {
  await expect(stat(path.join(cwd, projectDir, "src"))).rejects.toMatchObject({
    code: "ENOENT",
  });
}

async function expectNoDependencyInstallArtifacts(
  cwd: string,
  projectDir: string,
): Promise<void> {
  const entries = await readdir(path.join(cwd, projectDir));

  expect(entries).not.toContain("node_modules");
  expect(entries).not.toContain("package-lock.json");
  expect(entries).not.toContain("pnpm-lock.yaml");
}
