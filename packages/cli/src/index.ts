#!/usr/bin/env node

import { realpath } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import {
  CliArgumentError,
  getHelpText,
  getVersionText,
  parseCliArgs,
} from "./args.js";
import {
  generateProjectForCli,
  type CliProjectGenerator,
} from "./generate.js";
import {
  formatInstallCommand,
  installDependencies,
  type CommandRunner,
} from "./install.js";
import {
  defaultPromptFunctions,
  promptForConfig,
  type PromptFunctions,
} from "./prompts.js";
import { validateCliConfigDraft } from "./validate-config.js";
import {
  formatNextSteps,
  formatTargetDirForDisplay,
  resolveTargetDir,
  writeGeneratedProject,
  type CliProjectWriter,
} from "./write-project.js";

export type CliOutput = {
  log: (message: string) => void;
  error: (message: string) => void;
};

export type CliMainOptions = {
  output?: CliOutput;
  promptFunctions?: PromptFunctions;
  projectGenerator?: CliProjectGenerator;
  projectWriter?: CliProjectWriter;
  installCommandRunner?: CommandRunner;
  cwd?: string;
};

export function cliPackageReady() {
  return true;
}

export async function main(
  argv: string[] = process.argv.slice(2),
  options: CliMainOptions = {},
): Promise<number> {
  const output = options.output ?? console;
  const promptFunctions = options.promptFunctions ?? defaultPromptFunctions;

  try {
    const args = parseCliArgs(argv);

    if (args.help) {
      output.log(getHelpText());
      return 0;
    }

    if (args.version) {
      output.log(getVersionText());
      return 0;
    }

    const configDraft = await promptForConfig(args, promptFunctions);
    const validation = validateCliConfigDraft(configDraft);

    if (!validation.ok) {
      for (const error of validation.errors) {
        output.error(`Error: ${error.message}`);
      }

      return 1;
    }

    const project = await generateProjectForCli(
      validation.config,
      options.projectGenerator,
    );
    const targetDir = resolveTargetDir({
      targetDir: args.targetDir,
      projectName: validation.config.name,
    });
    const writeResult = await (options.projectWriter ?? writeGeneratedProject)({
      project,
      targetDir,
      cwd: options.cwd,
      yes: args.yes,
      confirm: (message) =>
        promptFunctions.confirm({
          message,
          default: false,
        }),
    });

    output.log(`Created ${project.name} in ${formatTargetDirForDisplay(targetDir)}`);
    output.log("");

    const shouldInstall = await shouldInstallDependencies({
      installFlag: args.install,
      yes: args.yes,
      promptFunctions,
    });

    if (shouldInstall) {
      try {
        output.log("Installing dependencies...");
        await installDependencies({
          targetDir: writeResult.targetDir,
          packageManager: project.packageManager,
          commandRunner: options.installCommandRunner,
        });
        output.log("");
      } catch (error) {
        output.error(
          "Error: Project files were created, but dependency installation failed.",
        );
        output.error(`Error: ${formatCliErrorMessage(error)}`);
        output.error("Run this manually:");
        output.error(`  ${formatInstallCommand(project.packageManager)}`);
        output.log("");

        for (const line of formatNextSteps({
          targetDir,
          packageManager: project.packageManager,
        })) {
          output.log(line);
        }

        return 1;
      }
    }

    for (const line of formatNextSteps({
      targetDir,
      packageManager: project.packageManager,
      dependenciesInstalled: shouldInstall,
    })) {
      output.log(line);
    }

    return 0;
  } catch (error) {
    if (error instanceof CliArgumentError) {
      output.error(`Error: ${error.message}`);
      output.error("Run create-baseforge --help for usage.");
      return 1;
    }

    output.error(`Error: ${formatCliErrorMessage(error)}`);
    return 1;
  }
}

if (await isCliEntrypoint(process.argv[1], import.meta.url)) {
  process.exitCode = await main();
}

function formatCliErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return "Project generation failed.";
}

async function shouldInstallDependencies(input: {
  installFlag?: boolean;
  yes: boolean;
  promptFunctions: PromptFunctions;
}): Promise<boolean> {
  if (input.installFlag !== undefined) {
    return input.installFlag;
  }

  if (input.yes) {
    return false;
  }

  return input.promptFunctions.confirm({
    message: "Install dependencies now?",
    default: false,
  });
}

async function isCliEntrypoint(
  argvPath: string | undefined,
  moduleUrl: string,
): Promise<boolean> {
  if (!argvPath) {
    return false;
  }

  const modulePath = fileURLToPath(moduleUrl);
  const [argvRealPath, moduleRealPath] = await Promise.all([
    resolveRealPath(argvPath),
    resolveRealPath(modulePath),
  ]);

  return argvRealPath === moduleRealPath;
}

async function resolveRealPath(filePath: string): Promise<string> {
  try {
    return await realpath(filePath);
  } catch {
    return filePath;
  }
}
