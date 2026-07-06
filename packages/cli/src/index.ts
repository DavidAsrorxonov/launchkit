#!/usr/bin/env node

import { pathToFileURL } from "node:url";

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
import { promptForConfig, type PromptFunctions } from "./prompts.js";
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

    const configDraft = await promptForConfig(args, options.promptFunctions);
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
    await (options.projectWriter ?? writeGeneratedProject)({
      project,
      targetDir,
      cwd: options.cwd,
    });

    output.log(`Created ${project.name} in ${formatTargetDirForDisplay(targetDir)}`);
    output.log("");

    for (const line of formatNextSteps({
      targetDir,
      packageManager: project.packageManager,
    })) {
      output.log(line);
    }

    return 0;
  } catch (error) {
    if (error instanceof CliArgumentError) {
      output.error(`Error: ${error.message}`);
      output.error("Run create-launchkit --help for usage.");
      return 1;
    }

    output.error(`Error: ${formatCliErrorMessage(error)}`);
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = await main();
}

function formatCliErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return "Project generation failed.";
}
