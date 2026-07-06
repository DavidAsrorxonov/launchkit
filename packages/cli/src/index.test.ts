import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import type { CliProjectGenerator } from "./generate.js";
import type { CommandRunner } from "./install.js";
import { main, type CliOutput } from "./index.js";
import type { PromptFunctions } from "./prompts.js";
import type { CliProjectWriter } from "./write-project.js";

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempRoots.splice(0).map((tempRoot) =>
      rm(tempRoot, { recursive: true, force: true }),
    ),
  );
});

describe("main", () => {
  it("returns zero and prints next steps when project writing succeeds", async () => {
    const output = createOutputCapture();
    const projectGenerator = createProjectGenerator({
      name: "my-app",
      packageManager: "npm",
      files: ["package.json", "README.md"],
    });
    const projectWriter = createProjectWriter();
    const installCalls: CommandRunnerCall[] = [];

    const exitCode = await main(["my-app", "--yes"], {
      output,
      projectGenerator,
      projectWriter,
      installCommandRunner: createCommandRunner(installCalls),
    });

    expect(exitCode).toBe(0);
    expect(output.logs).toEqual([
      "Created my-app in ./my-app",
      "",
      "Next steps:",
      "  cd my-app",
      "  npm install",
      "  npm run dev",
    ]);
    expect(output.errors).toEqual([]);
    expect(projectWriter.calls).toEqual([
      {
        targetDir: "my-app",
        projectName: "my-app",
        cwd: undefined,
        yes: true,
      },
    ]);
    expect(installCalls).toEqual([]);
  });

  it("uses --name as the default target directory", async () => {
    const output = createOutputCapture();
    const projectWriter = createProjectWriter();

    const exitCode = await main(["--name", "named-app", "--yes"], {
      output,
      projectGenerator: createProjectGenerator({
        name: "named-app",
        packageManager: "npm",
        files: ["package.json"],
      }),
      projectWriter,
    });

    expect(exitCode).toBe(0);
    expect(projectWriter.calls[0]).toMatchObject({
      targetDir: "named-app",
      projectName: "named-app",
    });
  });

  it("uses positional target directory before config name", async () => {
    const output = createOutputCapture();
    const projectWriter = createProjectWriter();

    const exitCode = await main(["folder-name", "--name", "package-name", "--yes"], {
      output,
      projectGenerator: createProjectGenerator({
        name: "package-name",
        packageManager: "pnpm",
        files: ["package.json"],
      }),
      projectWriter,
    });

    expect(exitCode).toBe(0);
    expect(output.logs).toContain("Created package-name in ./folder-name");
    expect(output.logs).toContain("  pnpm install");
    expect(output.logs).toContain("  pnpm dev");
    expect(projectWriter.calls[0]).toMatchObject({
      targetDir: "folder-name",
      projectName: "package-name",
    });
  });

  it("returns non-zero when config validation fails", async () => {
    const output = createOutputCapture();

    const exitCode = await main(["--name", "Invalid_Name", "--yes"], {
      output,
    });

    expect(exitCode).toBe(1);
    expect(output.logs).toEqual([]);
    expect(output.errors).toEqual([
      "Error: Use lowercase letters, numbers, and hyphens only.",
    ]);
  });

  it("returns non-zero and prints a CLI-friendly error when generation fails", async () => {
    const output = createOutputCapture();
    const projectGenerator: CliProjectGenerator = async () => {
      throw new Error("Template loader failed.");
    };

    const exitCode = await main(["my-app", "--yes"], {
      output,
      projectGenerator,
      projectWriter: createProjectWriter(),
    });

    expect(exitCode).toBe(1);
    expect(output.logs).toEqual([]);
    expect(output.errors).toEqual(["Error: Template loader failed."]);
  });

  it("returns non-zero when generated output contains an unsafe path", async () => {
    const output = createOutputCapture();
    const projectGenerator = createProjectGenerator({
      name: "my-app",
      packageManager: "npm",
      files: ["src/app/page.tsx"],
    });

    const exitCode = await main(["my-app", "--yes"], {
      output,
      projectGenerator,
      projectWriter: createProjectWriter(),
    });

    expect(exitCode).toBe(1);
    expect(output.logs).toEqual([]);
    expect(output.errors).toEqual([
      "Error: Generated project contains an unsafe file path: src/app/page.tsx",
    ]);
  });

  it("returns non-zero and prints a CLI-friendly error when writing fails", async () => {
    const output = createOutputCapture();
    const projectWriter: CliProjectWriter = async () => {
      throw new Error("Target directory is not empty: /tmp/my-app");
    };

    const exitCode = await main(["my-app", "--yes"], {
      output,
      projectGenerator: createProjectGenerator({
        name: "my-app",
        packageManager: "npm",
        files: ["package.json"],
      }),
      projectWriter,
    });

    expect(exitCode).toBe(1);
    expect(output.logs).toEqual([]);
    expect(output.errors).toEqual(["Error: Target directory is not empty: /tmp/my-app"]);
  });

  it("omits cd from next steps when generating into the current directory", async () => {
    const output = createOutputCapture();
    const cwd = await createTempRoot();

    const exitCode = await main([".", "--name", "current-app", "--yes"], {
      cwd,
      output,
      projectGenerator: createProjectGenerator({
        name: "current-app",
        packageManager: "npm",
        files: ["package.json"],
      }),
    });

    expect(exitCode).toBe(0);
    expect(output.logs).toEqual([
      "Created current-app in .",
      "",
      "Next steps:",
      "  npm install",
      "  npm run dev",
    ]);
    await expect(readFile(path.join(cwd, "package.json"), "utf8")).resolves.toBe("");
  });

  it("rejects an existing non-empty target directory with --yes", async () => {
    const output = createOutputCapture();
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "my-app"));
    await writeFile(path.join(cwd, "my-app", "existing.txt"), "");

    const exitCode = await main(["my-app", "--yes"], {
      cwd,
      output,
      projectGenerator: createProjectGenerator({
        name: "my-app",
        packageManager: "npm",
        files: ["package.json"],
      }),
    });

    expect(exitCode).toBe(1);
    expect(output.logs).toEqual([]);
    expect(output.errors).toEqual([
      [
        "Error: Target directory is not empty.",
        "Choose an empty directory or run without --yes to confirm adding LaunchKit files.",
      ].join("\n"),
    ]);
  });

  it("writes into a non-empty target directory after interactive confirmation", async () => {
    const output = createOutputCapture();
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "my-app"));
    await writeFile(path.join(cwd, "my-app", "existing.txt"), "");
    const prompts = createPromptFunctions({ confirmAnswers: [true] });

    const exitCode = await main(
      [
        "my-app",
        "--name",
        "my-app",
        "--package-manager",
        "npm",
        "--ui",
        "none",
        "--database",
        "none",
        "--auth",
        "none",
      ],
      {
        cwd,
        output,
        promptFunctions: prompts,
        projectGenerator: createProjectGenerator({
          name: "my-app",
          packageManager: "npm",
          files: ["package.json"],
        }),
      },
    );

    expect(exitCode).toBe(0);
    expect(prompts.calls).toEqual([
      {
        kind: "confirm",
        message: "The target directory is not empty. Continue and add LaunchKit files?",
        default: false,
      },
      {
        kind: "confirm",
        message: "Install dependencies now?",
        default: false,
      },
    ]);
    await expect(readFile(path.join(cwd, "my-app", "package.json"), "utf8")).resolves.toBe(
      "",
    );
  });

  it("stops when interactive non-empty target confirmation is declined", async () => {
    const output = createOutputCapture();
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "my-app"));
    await writeFile(path.join(cwd, "my-app", "existing.txt"), "");

    const exitCode = await main(
      [
        "my-app",
        "--name",
        "my-app",
        "--package-manager",
        "npm",
        "--ui",
        "none",
        "--database",
        "none",
        "--auth",
        "none",
      ],
      {
        cwd,
        output,
        promptFunctions: createPromptFunctions({ confirmAnswers: [false] }),
        projectGenerator: createProjectGenerator({
          name: "my-app",
          packageManager: "npm",
          files: ["package.json"],
        }),
      },
    );

    expect(exitCode).toBe(1);
    expect(output.logs).toEqual([]);
    expect(output.errors).toEqual(["Error: Project creation cancelled."]);
  });

  it("asks whether to install dependencies after files are written in interactive mode", async () => {
    const output = createOutputCapture();
    const projectWriter = createProjectWriter();
    const prompts = createPromptFunctions();
    const installCalls: CommandRunnerCall[] = [];

    const exitCode = await main(
      [
        "my-app",
        "--name",
        "my-app",
        "--package-manager",
        "npm",
        "--ui",
        "none",
        "--database",
        "none",
        "--auth",
        "none",
      ],
      {
        output,
        promptFunctions: prompts,
        projectGenerator: createProjectGenerator({
          name: "my-app",
          packageManager: "npm",
          files: ["package.json"],
        }),
        projectWriter,
        installCommandRunner: createCommandRunner(installCalls),
      },
    );

    expect(exitCode).toBe(0);
    expect(projectWriter.calls).toHaveLength(1);
    expect(prompts.calls).toEqual([
      {
        kind: "confirm",
        message: "Install dependencies now?",
        default: false,
      },
    ]);
    expect(installCalls).toEqual([]);
  });

  it("--install runs dependency installation without prompting", async () => {
    const output = createOutputCapture();
    const installCalls: CommandRunnerCall[] = [];

    const exitCode = await main(["my-app", "--yes", "--install"], {
      output,
      projectGenerator: createProjectGenerator({
        name: "my-app",
        packageManager: "npm",
        files: ["package.json"],
      }),
      projectWriter: createProjectWriter({
        resolvedTargetDir: "/tmp/my-app",
      }),
      installCommandRunner: createCommandRunner(installCalls),
    });

    expect(exitCode).toBe(0);
    expect(installCalls).toEqual([
      {
        command: "npm",
        args: ["install"],
        cwd: "/tmp/my-app",
      },
    ]);
    expect(output.logs).toEqual([
      "Created my-app in ./my-app",
      "",
      "Installing dependencies...",
      "",
      "Next steps:",
      "  cd my-app",
      "  npm run dev",
    ]);
  });

  it("--no-install skips dependency installation without prompting", async () => {
    const output = createOutputCapture();
    const prompts = createPromptFunctions();
    const installCalls: CommandRunnerCall[] = [];

    const exitCode = await main(
      [
        "my-app",
        "--name",
        "my-app",
        "--package-manager",
        "npm",
        "--ui",
        "none",
        "--database",
        "none",
        "--auth",
        "none",
        "--no-install",
      ],
      {
        output,
        promptFunctions: prompts,
        projectGenerator: createProjectGenerator({
          name: "my-app",
          packageManager: "npm",
          files: ["package.json"],
        }),
        projectWriter: createProjectWriter(),
        installCommandRunner: createCommandRunner(installCalls),
      },
    );

    expect(exitCode).toBe(0);
    expect(prompts.calls).toEqual([]);
    expect(installCalls).toEqual([]);
    expect(output.logs).toContain("  npm install");
  });

  it("uses the generated project directory as install cwd", async () => {
    const output = createOutputCapture();
    const cwd = await createTempRoot();
    const installCalls: CommandRunnerCall[] = [];

    const exitCode = await main(["my-app", "--yes", "--install"], {
      cwd,
      output,
      projectGenerator: createProjectGenerator({
        name: "my-app",
        packageManager: "pnpm",
        files: ["package.json"],
      }),
      installCommandRunner: createCommandRunner(installCalls),
    });

    expect(exitCode).toBe(0);
    expect(installCalls).toEqual([
      {
        command: "pnpm",
        args: ["install"],
        cwd: path.join(cwd, "my-app"),
      },
    ]);
    expect(output.logs).toContain("  pnpm dev");
    expect(output.logs).not.toContain("  pnpm install");
  });

  it("reports install failure, keeps generated files, and prints manual next steps", async () => {
    const output = createOutputCapture();
    const cwd = await createTempRoot();

    const exitCode = await main(["my-app", "--yes", "--install"], {
      cwd,
      output,
      projectGenerator: createProjectGenerator({
        name: "my-app",
        packageManager: "npm",
        files: ["package.json"],
      }),
      installCommandRunner: async () => {
        throw new Error("npm install failed with exit code 1.");
      },
    });

    expect(exitCode).toBe(1);
    await expect(readFile(path.join(cwd, "my-app", "package.json"), "utf8")).resolves.toBe(
      "",
    );
    expect(output.errors).toEqual([
      "Error: Project files were created, but dependency installation failed.",
      "Error: npm install failed with exit code 1.",
      "Run this manually:",
      "  npm install",
    ]);
    expect(output.logs).toEqual([
      "Created my-app in ./my-app",
      "",
      "Installing dependencies...",
      "",
      "Next steps:",
      "  cd my-app",
      "  npm install",
      "  npm run dev",
    ]);
  });
});

function createOutputCapture(): CliOutput & {
  logs: string[];
  errors: string[];
} {
  const logs: string[] = [];
  const errors: string[] = [];

  return {
    logs,
    errors,
    log(message) {
      logs.push(message);
    },
    error(message) {
      errors.push(message);
    },
  };
}

function createProjectGenerator(input: {
  name: string;
  packageManager: "npm" | "pnpm";
  files: string[];
}): CliProjectGenerator {
  return async () => ({
    name: input.name,
    packageManager: input.packageManager,
    files: input.files.map((path) => ({
      path,
      contents: "",
    })),
  });
}

function createProjectWriter(options?: {
  resolvedTargetDir?: string;
}): CliProjectWriter & {
  calls: Array<{
    targetDir: string;
    projectName: string;
    cwd?: string;
    yes?: boolean;
  }>;
} {
  const calls: Array<{
    targetDir: string;
    projectName: string;
    cwd?: string;
    yes?: boolean;
  }> = [];

  return Object.assign(
    async (input: Parameters<CliProjectWriter>[0]) => {
      calls.push({
        targetDir: input.targetDir,
        projectName: input.project.name,
        cwd: input.cwd,
        yes: input.yes,
      });

      return {
        targetDir: options?.resolvedTargetDir ?? input.targetDir,
        filesWritten: input.project.files.map((file) => file.path),
      };
    },
    { calls },
  );
}

type CommandRunnerCall = {
  command: string;
  args: string[];
  cwd: string;
};

function createCommandRunner(calls: CommandRunnerCall[]): CommandRunner {
  return async (command, args, options) => {
    calls.push({
      command,
      args,
      cwd: options.cwd,
    });
  };
}

type PromptCall = {
  kind: "confirm" | "input" | "select";
  message: string;
  default?: boolean | string;
};

function createPromptFunctions(options?: {
  confirmAnswers?: boolean[];
}): PromptFunctions & { calls: PromptCall[] } {
  const calls: PromptCall[] = [];
  const confirmAnswers = [...(options?.confirmAnswers ?? [])];

  return {
    calls,
    async confirm(config) {
      calls.push({
        kind: "confirm",
        message: config.message,
        default: config.default,
      });

      return confirmAnswers.shift() ?? config.default ?? false;
    },
    async input(config) {
      calls.push({
        kind: "input",
        message: config.message,
        default: config.default,
      });

      return config.default ?? "my-app";
    },
    async select(config) {
      calls.push({
        kind: "select",
        message: config.message,
        default: config.default,
      });

      return (config.default ?? config.choices[0]?.value) as never;
    },
  };
}

async function createTempRoot(): Promise<string> {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "launchkit-cli-"));
  tempRoots.push(tempRoot);

  return tempRoot;
}
