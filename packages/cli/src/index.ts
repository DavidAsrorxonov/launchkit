#!/usr/bin/env node

import { pathToFileURL } from "node:url";

import {
  CliArgumentError,
  getHelpText,
  getVersionText,
  parseCliArgs,
} from "./args.js";
import { promptForConfig, type PromptFunctions } from "./prompts.js";
import { validateCliConfigDraft } from "./validate-config.js";

export type CliOutput = {
  log: (message: string) => void;
  error: (message: string) => void;
};

export type CliMainOptions = {
  output?: CliOutput;
  promptFunctions?: PromptFunctions;
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

    output.log("LaunchKit config validated.");
    output.log("Generation will be added in the next step.");
    return 0;
  } catch (error) {
    if (error instanceof CliArgumentError) {
      output.error(`Error: ${error.message}`);
      output.error("Run create-launchkit --help for usage.");
      return 1;
    }

    throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = await main();
}
