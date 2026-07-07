import { describe, expect, it } from "vitest";

import {
  InstallDependenciesError,
  formatInstallCommand,
  getInstallCommand,
  installDependencies,
  type CommandRunner,
} from "../install.js";

describe("getInstallCommand", () => {
  it("constructs npm install", () => {
    expect(getInstallCommand("npm")).toEqual({
      command: "npm",
      args: ["install"],
    });
  });

  it("constructs pnpm install", () => {
    expect(getInstallCommand("pnpm")).toEqual({
      command: "pnpm",
      args: ["install"],
    });
  });
});

describe("formatInstallCommand", () => {
  it("formats install commands for output", () => {
    expect(formatInstallCommand("npm")).toBe("npm install");
    expect(formatInstallCommand("pnpm")).toBe("pnpm install");
  });
});

describe("installDependencies", () => {
  it("runs npm install in the generated project directory", async () => {
    const calls: CommandRunnerCall[] = [];

    await installDependencies({
      targetDir: "/tmp/my-app",
      packageManager: "npm",
      commandRunner: createCommandRunner(calls),
    });

    expect(calls).toEqual([
      {
        command: "npm",
        args: ["install"],
        cwd: "/tmp/my-app",
      },
    ]);
  });

  it("runs pnpm install in the generated project directory", async () => {
    const calls: CommandRunnerCall[] = [];

    await installDependencies({
      targetDir: "/tmp/my-app",
      packageManager: "pnpm",
      commandRunner: createCommandRunner(calls),
    });

    expect(calls).toEqual([
      {
        command: "pnpm",
        args: ["install"],
        cwd: "/tmp/my-app",
      },
    ]);
  });

  it("wraps install failures in a CLI-friendly error", async () => {
    await expect(
      installDependencies({
        targetDir: "/tmp/my-app",
        packageManager: "npm",
        commandRunner: async () => {
          throw new Error("npm install failed with exit code 1.");
        },
      }),
    ).rejects.toThrow(InstallDependenciesError);
  });
});

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
