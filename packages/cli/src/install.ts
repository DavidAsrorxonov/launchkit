import { spawn } from "node:child_process";

import type { GeneratedProject } from "@launchkit/generator";

export type InstallPackageManager = GeneratedProject["packageManager"];

export type CommandRunner = (
  command: string,
  args: string[],
  options: { cwd: string },
) => Promise<void>;

export type InstallDependenciesInput = {
  targetDir: string;
  packageManager: InstallPackageManager;
  commandRunner?: CommandRunner;
};

export class InstallDependenciesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InstallDependenciesError";
  }
}

export async function installDependencies(
  input: InstallDependenciesInput,
): Promise<void> {
  const command = getInstallCommand(input.packageManager);
  const runner = input.commandRunner ?? runCommand;

  try {
    await runner(command.command, command.args, { cwd: input.targetDir });
  } catch (error) {
    if (error instanceof Error && error.message.length > 0) {
      throw new InstallDependenciesError(error.message);
    }

    throw new InstallDependenciesError(
      `${formatInstallCommand(input.packageManager)} failed.`,
    );
  }
}

export function getInstallCommand(
  packageManager: InstallPackageManager,
): { command: string; args: string[] } {
  return {
    command: packageManager,
    args: ["install"],
  };
}

export function formatInstallCommand(packageManager: InstallPackageManager): string {
  const command = getInstallCommand(packageManager);
  return [command.command, ...command.args].join(" ");
}

async function runCommand(
  command: string,
  args: string[],
  options: { cwd: string },
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: "inherit",
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(`${[command, ...args].join(" ")} failed with exit code ${code}.`),
      );
    });
  });
}
