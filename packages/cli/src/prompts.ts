import { input, select } from "@inquirer/prompts";
import {
  authMetadata,
  databaseMetadata,
  defaultLaunchKitConfig,
  dockerMetadata,
  ormMetadata,
  packageManagerMetadata,
  uiMetadata,
  type LaunchKitConfig,
  type OptionMetadata,
} from "@launchkit/schema";

import type { CliArgs } from "./args.js";

export type PromptedLaunchKitConfigDraft = Partial<LaunchKitConfig> & {
  name: string;
  framework: "next";
  language: "typescript";
  router: "app";
  projectStructure: "no-src";
  styling: "tailwind";
};

export type PromptAnswers = Partial<
  Pick<
    LaunchKitConfig,
    "name" | "packageManager" | "ui" | "database" | "orm" | "auth" | "docker"
  >
>;

export type SelectChoice<TValue extends string> = {
  value: TValue;
  name: string;
  description?: string;
};

export type PromptFunctions = {
  input: (config: {
    message: string;
    default?: string;
    validate?: (value: string) => true | string;
  }) => Promise<string>;
  select: <TValue extends string>(config: {
    message: string;
    default?: TValue;
    choices: SelectChoice<TValue>[];
  }) => Promise<TValue>;
};

type PromptField =
  | "name"
  | "packageManager"
  | "ui"
  | "database"
  | "orm"
  | "auth"
  | "docker";

const defaultPromptFunctions: PromptFunctions = {
  input,
  select,
};

export async function promptForConfig(
  args: CliArgs,
  promptFunctions: PromptFunctions = defaultPromptFunctions,
): Promise<PromptedLaunchKitConfigDraft> {
  if (args.yes) {
    return createConfigDraftFromAnswers({ args, answers: {} });
  }

  const answers: PromptAnswers = {};
  const nameDefault = getProjectNameDefault(args);

  if (!args.name) {
    answers.name = await promptFunctions.input({
      message: "Project name",
      default: nameDefault,
      validate: (value) => {
        return value.trim().length > 0 ? true : "Project name is required.";
      },
    });
  }

  if (!args.packageManager) {
    answers.packageManager = await promptFunctions.select({
      message: "Package manager",
      default: defaultLaunchKitConfig.packageManager,
      choices: toChoices(packageManagerMetadata),
    });
  }

  if (!args.ui) {
    answers.ui = await promptFunctions.select({
      message: "UI library",
      default: defaultLaunchKitConfig.ui,
      choices: toChoices(uiMetadata),
    });
  }

  if (!args.database) {
    answers.database = await promptFunctions.select({
      message: "Database",
      default: defaultLaunchKitConfig.database,
      choices: toChoices(databaseMetadata),
    });
  }

  const database = args.database ?? answers.database ?? defaultLaunchKitConfig.database;

  if (database === "postgres" && !args.orm) {
    answers.orm = await promptFunctions.select({
      message: "ORM",
      default: defaultLaunchKitConfig.orm,
      choices: toChoices(ormMetadata),
    });
  }

  if (!args.auth) {
    answers.auth = await promptFunctions.select({
      message: "Auth",
      default: defaultLaunchKitConfig.auth,
      choices: toChoices(authMetadata),
    });
  }

  if (database === "postgres" && !args.docker) {
    answers.docker = await promptFunctions.select({
      message: "Docker",
      default: defaultLaunchKitConfig.docker,
      choices: toChoices(dockerMetadata),
    });
  }

  return createConfigDraftFromAnswers({ args, answers });
}

export function createConfigDraftFromAnswers(input: {
  args: CliArgs;
  answers: PromptAnswers;
}): PromptedLaunchKitConfigDraft {
  const { args, answers } = input;
  const database = args.database ?? answers.database ?? defaultLaunchKitConfig.database;

  return {
    ...defaultLaunchKitConfig,
    name: args.name ?? answers.name ?? getProjectNameDefault(args),
    packageManager:
      args.packageManager ?? answers.packageManager ?? defaultLaunchKitConfig.packageManager,
    ui: args.ui ?? answers.ui ?? defaultLaunchKitConfig.ui,
    database,
    orm: args.orm ?? answers.orm ?? defaultLaunchKitConfig.orm,
    auth: args.auth ?? answers.auth ?? defaultLaunchKitConfig.auth,
    docker: args.docker ?? answers.docker ?? defaultLaunchKitConfig.docker,
    framework: "next",
    language: "typescript",
    router: "app",
    projectStructure: "no-src",
    styling: "tailwind",
  };
}

export function getPromptFields(args: CliArgs): PromptField[] {
  if (args.yes) {
    return [];
  }

  const fields: PromptField[] = [];

  if (!args.name) {
    fields.push("name");
  }

  if (!args.packageManager) {
    fields.push("packageManager");
  }

  if (!args.ui) {
    fields.push("ui");
  }

  if (!args.database) {
    fields.push("database");
  }

  if (args.database === "postgres" && !args.orm) {
    fields.push("orm");
  }

  if (!args.auth) {
    fields.push("auth");
  }

  if (args.database === "postgres" && !args.docker) {
    fields.push("docker");
  }

  return fields;
}

function getProjectNameDefault(args: CliArgs): string {
  return args.name ?? args.targetDir ?? defaultLaunchKitConfig.name;
}

function toChoices<TValue extends string>(
  metadata: OptionMetadata<TValue>[],
): SelectChoice<TValue>[] {
  return metadata.map((option) => ({
    value: option.value,
    name: option.label,
    description: option.description,
  }));
}
