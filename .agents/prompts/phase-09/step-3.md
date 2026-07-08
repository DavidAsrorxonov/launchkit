# Phase 9 Step 3: Add CLI Argument Parsing

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 9 Step 2 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 9 Step 4.
Do not add interactive prompts yet.
Do not connect to the generator yet.
Do not write generated files to disk yet.
Do not install generated project dependencies.
Do not duplicate schema or generator logic.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Add CLI argument parsing for the future LaunchKit CLI.

This step should parse supported flags and expose a typed parse result that later steps can use for prompts, schema validation, generation, and filesystem writing.

It should not implement interactive prompts or project generation yet.

## Scope

Work inside:

```txt
packages/cli/
```

Recommended files:

```txt
packages/cli/src/index.ts
packages/cli/src/args.ts
packages/cli/src/args.test.ts
packages/cli/package.json, only if adding an argument parsing dependency
```

Follow the strategy confirmed in Phase 9 Step 1.

## Requirements

### 1. Argument Parser Strategy

Use the argument parser selected in Phase 9 Step 1.

Acceptable options:

```txt
commander
meow
node:util parseArgs
```

If no parser was selected, choose the smallest practical option.

Recommended for this MVP:

```txt
node:util parseArgs
```

if it is sufficient, because it avoids an extra dependency.

Using Node standard library argument parsing is allowed.

Do not use Node's built-in test runner.

### 2. Supported Flags

Add parsing for these flags:

```txt
--name <name>
--package-manager <npm|pnpm>
--ui <none|shadcn>
--database <none|postgres>
--orm <none|prisma>
--auth <none|authjs-credentials>
--docker <none|postgres>
--yes
--help
--version
```

Also support common aliases where reasonable:

```txt
-h, --help
-v, --version
-y, --yes
```

Do not add unsupported options for framework, language, router, project structure, or styling unless the existing CLI plan explicitly requires exposing fixed values.

The MVP fixed values remain:

```txt
framework: "next"
language: "typescript"
router: "app"
projectStructure: "no-src"
styling: "tailwind"
```

### 3. Positional Target Directory

Support an optional positional target directory:

```bash
npx create-launchkit@latest my-app
```

Recommended parse result:

```ts
type CliArgs = {
  targetDir?: string;
  name?: string;
  packageManager?: "npm" | "pnpm";
  ui?: "none" | "shadcn";
  database?: "none" | "postgres";
  orm?: "none" | "prisma";
  auth?: "none" | "authjs-credentials";
  docker?: "none" | "postgres";
  yes: boolean;
  help: boolean;
  version: boolean;
};
```

Do not create the directory in this step.

### 4. Unknown Flags

Unknown flags should produce a useful parse error.

Recommended error type:

```ts
export class CliArgumentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CliArgumentError";
  }
}
```

Do not crash with raw parser internals.

### 5. Help Text

Add a help text generator.

Recommended function:

```ts
export function getHelpText(): string;
```

Help should include:

- command name
- usage
- options
- examples

Example:

```txt
Usage:
  create-launchkit [project-name] [options]

Options:
  --name <name>
  --package-manager <npm|pnpm>
  --ui <none|shadcn>
  --database <none|postgres>
  --orm <none|prisma>
  --auth <none|authjs-credentials>
  --docker <none|postgres>
  -y, --yes
  -h, --help
  -v, --version
```

Do not imply unsupported options exist.

### 6. Version Text

Add a way to print CLI version.

Recommended:

- read from package metadata at build time if the repo has a pattern
- or export a constant placeholder from package version

Keep it simple.

Do not introduce complex build-time replacement.

### 7. Entry Point Behavior

Update `packages/cli/src/index.ts` so:

- `--help` prints help text and exits successfully
- `--version` prints version and exits successfully
- parse errors print a concise error and help hint
- normal parsed args currently print a placeholder or return parsed args internally

Do not start prompts.
Do not generate files.

### 8. Schema Boundary

This step may import option types from `@launchkit/schema` if useful.

Do not run full schema validation yet.

Schema validation belongs to Phase 9 Step 5.

However, flag value parsing should reject values outside known literal values.

### 9. Tests

Use Vitest only.

Add tests for:

- empty args parse
- positional target directory parse
- `--name`
- `--package-manager npm`
- `--package-manager pnpm`
- `--ui shadcn`
- `--database postgres`
- `--orm prisma`
- `--auth authjs-credentials`
- `--docker postgres`
- `--yes`
- `--help`
- `--version`
- aliases `-y`, `-h`, `-v`
- unknown flag error
- invalid option value error
- help text includes supported options
- help text does not include unsupported options

Do not add integration tests that run generation.

## Verification

Run the relevant checks available in the repo.

Recommended:

```bash
npm run typecheck -w create-launchkit
npm test -w create-launchkit
npm run build -w create-launchkit
npm run typecheck
npm test
```

Also run if configured:

```bash
npm run lint
npm run build
```

If adding a parser dependency, run:

```bash
npm install
```

Do not use pnpm.

Use the actual package name and workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 9 Step 3 completed: Add CLI argument parsing

Changes made:
- Added CLI argument parser.
- Added supported option flags.
- Added optional positional target directory parsing.
- Added help text.
- Added version handling.
- Added parse error handling.
- Added Vitest coverage for CLI argument parsing.
- Confirmed prompts/generation/filesystem writes are not implemented yet.

Files changed:
- packages/cli/src/index.ts
- packages/cli/src/args.ts
- packages/cli/src/args.test.ts
- packages/cli/package.json, if a dependency was added
- package-lock.json, if dependencies changed
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 9 Step 4: Add interactive prompts
```

## Completion Criteria

This step is complete when:

- CLI parses supported flags.
- CLI parses optional positional target directory.
- CLI handles `--help`.
- CLI handles `--version`.
- CLI handles `--yes`.
- CLI rejects unknown flags.
- CLI rejects invalid option values.
- Help text is accurate.
- Help text does not advertise unsupported options.
- Argument parsing has Vitest coverage.
- No interactive prompts are implemented yet.
- No generator integration is implemented yet.
- No filesystem writes are implemented yet.
- No Node built-in test runner usage is introduced.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
