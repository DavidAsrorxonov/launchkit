import { parseArgs } from "node:util";

export type PackageManagerFlag = "npm" | "pnpm";
export type UiFlag = "none" | "shadcn";
export type DatabaseFlag = "none" | "postgres";
export type OrmFlag = "none" | "prisma";
export type AuthFlag = "none" | "authjs-credentials";
export type DockerFlag = "none" | "postgres";

export type CliArgs = {
  targetDir?: string;
  name?: string;
  packageManager?: PackageManagerFlag;
  ui?: UiFlag;
  database?: DatabaseFlag;
  orm?: OrmFlag;
  auth?: AuthFlag;
  docker?: DockerFlag;
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

export const CLI_VERSION = "0.0.0";

const packageManagers = ["npm", "pnpm"] as const;
const uiOptions = ["none", "shadcn"] as const;
const databaseOptions = ["none", "postgres"] as const;
const ormOptions = ["none", "prisma"] as const;
const authOptions = ["none", "authjs-credentials"] as const;
const dockerOptions = ["none", "postgres"] as const;

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
        name: { type: "string" },
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

  return {
    targetDir: parsed.positionals[0],
    name: readStringFlag(parsed.values.name, "name"),
    packageManager: readLiteralFlag(
      parsed.values["package-manager"],
      "package-manager",
      packageManagers,
    ),
    ui: readLiteralFlag(parsed.values.ui, "ui", uiOptions),
    database: readLiteralFlag(parsed.values.database, "database", databaseOptions),
    orm: readLiteralFlag(parsed.values.orm, "orm", ormOptions),
    auth: readLiteralFlag(parsed.values.auth, "auth", authOptions),
    docker: readLiteralFlag(parsed.values.docker, "docker", dockerOptions),
    yes: parsed.values.yes === true,
    help: parsed.values.help === true,
    version: parsed.values.version === true,
  };
}

export function getHelpText(): string {
  return `create-launchkit

Usage:
  create-launchkit [project-name] [options]

Options:
  --name <name>                         Set the generated project name.
  --package-manager <npm|pnpm>          Select the package manager.
  --ui <none|shadcn>                    Select UI scaffolding.
  --database <none|postgres>            Select database scaffolding.
  --orm <none|prisma>                   Select ORM scaffolding.
  --auth <none|authjs-credentials>      Select auth scaffolding.
  --docker <none|postgres>              Select Docker Compose scaffolding.
  -y, --yes                             Accept defaults where possible.
  -h, --help                            Show this help text.
  -v, --version                         Show the CLI version.

Examples:
  create-launchkit my-app
  create-launchkit my-app --database postgres --orm prisma
  create-launchkit --name my-app --package-manager pnpm --ui shadcn`;
}

export function getVersionText(): string {
  return CLI_VERSION;
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
