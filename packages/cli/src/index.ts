#!/usr/bin/env node

import { pathToFileURL } from "node:url";

import {
  CliArgumentError,
  getHelpText,
  getVersionText,
  parseCliArgs,
} from "./args.js";
import { promptForConfig } from "./prompts.js";

export function cliPackageReady() {
  return true;
}

export async function main(argv: string[] = process.argv.slice(2)) {
  try {
    const args = parseCliArgs(argv);

    if (args.help) {
      console.log(getHelpText());
      return args;
    }

    if (args.version) {
      console.log(getVersionText());
      return args;
    }

    const configDraft = await promptForConfig(args);

    console.log("LaunchKit CLI config collected.");
    console.log("Generation will be added in a later step.");
    return configDraft;
  } catch (error) {
    if (error instanceof CliArgumentError) {
      console.error(`Error: ${error.message}`);
      console.error("Run create-launchkit --help for usage.");
      process.exitCode = 1;
      return undefined;
    }

    throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
