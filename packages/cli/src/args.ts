import { parseArgs } from "node:util";

import {
  authOptions,
  databaseOptions,
  dockerOptions,
  ormOptions,
  packageManagerOptions,
  uiOptions,
  type AuthOption,
  type DatabaseOption,
  type DockerOption,
  type OrmOption,
  type PackageManagerOption,
  type UiOption,
} from "@launchkit/schema";

export type PackageManagerFlag = PackageManagerOption;
export type UiFlag = UiOption;
export type DatabaseFlag = DatabaseOption;
export type OrmFlag = OrmOption;
export type AuthFlag = AuthOption;
export type DockerFlag = DockerOption;

export type CliArgs = {
  targetDir?: string;
  name?: string;
  packageManager?: PackageManagerFlag;
  ui?: UiFlag;
  database?: DatabaseFlag;
  orm?: OrmFlag;
  auth?: AuthFlag;
  docker?: DockerFlag;
  install?: boolean;
  yes: boolean;
  help: boolean;
  version: boolean;
};

export class CliArgumentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CliArgumentError";
  }
}

export const CLI_VERSION = "0.1.0";

export function parseCliArgs(argv: string[] = process.argv.slice(2)): CliArgs {
  let parsed: ReturnType<typeof parseArgs>;

  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        auth: { type: "string" },
        database: { type: "string" },
        docker: { type: "string" },
        help: { type: "boolean", short: "h" },
        install: { type: "boolean" },
        name: { type: "string" },
        "no-install": { type: "boolean" },
        orm: { type: "string" },
        "package-manager": { type: "string" },
        ui: { type: "string" },
        version: { type: "boolean", short: "v" },
        yes: { type: "boolean", short: "y" },
      },
      strict: true,
    });
  } catch (error) {
    throw new CliArgumentError(formatParseError(error));
  }

  if (parsed.positionals.length > 1) {
    throw new CliArgumentError("Expected at most one target directory.");
  }

  if (parsed.values.install === true && parsed.values["no-install"] === true) {
    throw new CliArgumentError("Use either --install or --no-install, not both.");
  }

  return {
    targetDir: parsed.positionals[0],
    name: readStringFlag(parsed.values.name, "name"),
    packageManager: readLiteralFlag(
      parsed.values["package-manager"],
      "package-manager",
      packageManagerOptions,
    ),
    ui: readLiteralFlag(parsed.values.ui, "ui", uiOptions),
    database: readLiteralFlag(parsed.values.database, "database", databaseOptions),
    orm: readLiteralFlag(parsed.values.orm, "orm", ormOptions),
    auth: readLiteralFlag(parsed.values.auth, "auth", authOptions),
    docker: readLiteralFlag(parsed.values.docker, "docker", dockerOptions),
    install: readInstallFlag(parsed.values.install, parsed.values["no-install"]),
    yes: parsed.values.yes === true,
    help: parsed.values.help === true,
    version: parsed.values.version === true,
  };
}

export function getHelpText(): string {
  return `create-baseforge

Usage:
  create-baseforge [project-name] [options]

Options:
  --name <name>                         Set the generated project name.
  --package-manager <${formatAllowedValues(packageManagerOptions)}>          Select the package manager.
  --ui <${formatAllowedValues(uiOptions)}>                    Select UI scaffolding.
  --database <${formatAllowedValues(databaseOptions)}>            Select database scaffolding.
  --orm <${formatAllowedValues(ormOptions)}>                   Select ORM scaffolding.
  --auth <${formatAllowedValues(authOptions)}>      Select auth scaffolding.
  --docker <${formatAllowedValues(dockerOptions)}>              Select Docker Compose scaffolding.
  --install                            Install dependencies after project creation.
  --no-install                         Skip dependency installation.
  -y, --yes                             Accept defaults where possible.
  -h, --help                            Show this help text.
  -v, --version                         Show the CLI version.

Examples:
  create-baseforge my-app
  create-baseforge my-app --database postgres --orm prisma
  create-baseforge --name my-app --package-manager pnpm --ui shadcn`;
}

export function getVersionText(): string {
  return CLI_VERSION;
}

function readInstallFlag(
  installValue: string | boolean | (string | boolean)[] | undefined,
  noInstallValue: string | boolean | (string | boolean)[] | undefined,
): boolean | undefined {
  if (installValue === true) {
    return true;
  }

  if (noInstallValue === true) {
    return false;
  }

  if (installValue !== undefined) {
    throw new CliArgumentError("--install must not receive a value.");
  }

  if (noInstallValue !== undefined) {
    throw new CliArgumentError("--no-install must not receive a value.");
  }

  return undefined;
}

function readStringFlag(
  value: string | boolean | (string | boolean)[] | undefined,
  flagName: string,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  throw new CliArgumentError(`--${flagName} must receive a string value.`);
}

function readLiteralFlag<const T extends readonly string[]>(
  value: string | boolean | (string | boolean)[] | undefined,
  flagName: string,
  allowedValues: T,
): T[number] | undefined {
  const stringValue = readStringFlag(value, flagName);

  if (stringValue === undefined) {
    return undefined;
  }

  if (allowedValues.includes(stringValue)) {
    return stringValue;
  }

  throw new CliArgumentError(
    `Invalid value for --${flagName}: ${stringValue}. Expected one of: ${allowedValues.join(
      ", ",
    )}.`,
  );
}

function formatParseError(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return "Unable to parse command line arguments.";
}

function formatAllowedValues(values: readonly string[]): string {
  return values.join("|");
}
