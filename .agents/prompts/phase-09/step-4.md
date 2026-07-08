# Phase 9 Step 4: Add Interactive Prompts

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 9 Step 3 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 9 Step 5.
Do not connect to the generator yet.
Do not write generated files to disk yet.
Do not install generated project dependencies.
Do not duplicate schema or generator logic.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Add interactive prompts for the LaunchKit CLI.

The prompts should collect missing project options and combine them with parsed CLI arguments to produce a config draft for later schema validation.

This step should not run final schema validation, generate files, or write to disk yet.

## Scope

Work inside:

```txt
packages/cli/
```

Recommended files:

```txt
packages/cli/src/prompts.ts
packages/cli/src/prompts.test.ts
packages/cli/src/index.ts
packages/cli/src/args.ts, if needed
packages/cli/package.json, if adding a prompt dependency
```

Follow the prompt library decision from Phase 9 Step 1.

## Requirements

### 1. Prompt Library

Use the interactive prompt library confirmed in Phase 9 Step 1.

Recommended:

```txt
@inquirer/prompts
```

or the selected alternative.

If no prompt library was selected, choose a small maintained option and document the decision in `progress-tracker.md`.

Do not use custom raw `readline` prompting unless the project explicitly chose that approach.

### 2. Prompt Inputs

Create a function that accepts parsed CLI args and returns a draft config.

Recommended:

```ts
import type { CliArgs } from "./args";
import type { LaunchKitConfig } from "@launchkit/schema";

export type PromptedLaunchKitConfigDraft = Partial<LaunchKitConfig> & {
  name: string;
};

export async function promptForConfig(
  args: CliArgs,
): Promise<PromptedLaunchKitConfigDraft> {
  // ...
}
```

Exact types may vary based on current CLI code.

### 3. Use CLI Args As Defaults

If a value was provided by CLI args, use it as the default or skip the prompt for that value.

Examples:

```bash
create-launchkit my-app --ui shadcn --database postgres
```

should not force the user to re-answer project name, UI, or database unless confirmation is needed.

### 4. `--yes` Behavior

If `--yes` is provided:

- do not run interactive prompts
- use CLI args where provided
- fill missing values from `defaultLaunchKitConfig`

Do not silently choose incompatible values.

Final schema and compatibility validation belongs to Phase 9 Step 5.

### 5. Project Name Prompt

Prompt for project name when missing.

Default:

```txt
my-app
```

If positional target directory is provided, use it as the default project name unless `--name` is provided.

Do not implement final project name validation in this step beyond lightweight prompt-level guidance.

Final validation belongs to Phase 9 Step 5.

### 6. Package Manager Prompt

Prompt for:

```txt
packageManager: "npm" | "pnpm"
```

Use metadata from:

```txt
@launchkit/schema
```

if available.

Default:

```txt
npm
```

### 7. UI Prompt

Prompt for:

```txt
ui: "none" | "shadcn"
```

Use metadata from:

```txt
@launchkit/schema
```

if available.

### 8. Database Prompt

Prompt for:

```txt
database: "none" | "postgres"
```

Use metadata from:

```txt
@launchkit/schema
```

if available.

### 9. ORM Prompt

Prompt for:

```txt
orm: "none" | "prisma"
```

Prisma requires PostgreSQL.

If database is not PostgreSQL:

- default ORM to `none`
- skip Prisma prompt or show Prisma as unavailable if the prompt library supports disabled choices

Do not silently enable PostgreSQL when Prisma is selected.

### 10. Auth Prompt

Prompt for:

```txt
auth: "none" | "authjs-credentials"
```

Auth.js credentials may work without a database.

Do not force PostgreSQL when Auth.js credentials is selected.

Make label clear that it is a scaffold.

### 11. Docker Prompt

Prompt for:

```txt
docker: "none" | "postgres"
```

Docker PostgreSQL requires PostgreSQL.

If database is not PostgreSQL:

- default Docker to `none`
- skip Docker PostgreSQL prompt or show it as unavailable

Do not silently enable PostgreSQL when Docker PostgreSQL is selected.

### 12. Fixed MVP Values

Always include fixed MVP values in the draft:

```ts
framework: "next";
language: "typescript";
router: "app";
projectStructure: "no-src";
styling: "tailwind";
```

Do not prompt for unsupported frameworks, languages, routers, project structures, or styling systems.

### 13. Prompt Testability

Structure prompt code so it can be tested without running real terminal prompts.

Recommended:

- separate prompt orchestration from config assembly
- inject prompt functions for tests
- create pure helper that merges `CliArgs` + prompt answers + defaults

Example:

```ts
export function createConfigDraftFromAnswers(input: {
  args: CliArgs;
  answers: Partial<LaunchKitConfig>;
}): PromptedLaunchKitConfigDraft;
```

Do not make tests depend on real interactive terminal input.

### 14. Entry Point Behavior

Update `index.ts` so normal CLI execution can call the prompt flow after parsing args.

For now, after prompting, print a placeholder summary such as:

```txt
LaunchKit CLI config collected.
Generation will be added in a later step.
```

Do not generate files.
Do not write directories.

## Tests

Use Vitest only.

Add tests for:

- `--yes` skips prompts and uses defaults
- positional target directory becomes default project name
- `--name` overrides positional target directory for config name
- provided args are preserved
- missing values are filled from defaults or prompt answers
- fixed MVP values are included
- Prisma prompt/value is skipped or forced to none without PostgreSQL
- Docker PostgreSQL prompt/value is skipped or forced to none without PostgreSQL
- Auth.js credentials does not force PostgreSQL
- unsupported framework/language/router/styling prompts are not present

Do not use real terminal prompts in tests.

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

If adding a prompt dependency, run:

```bash
npm install
```

Do not use pnpm.

Use the actual package name and workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 9 Step 4 completed: Add interactive prompts

Changes made:
- Added CLI interactive prompt flow.
- Added config draft assembly from args, defaults, and prompt answers.
- Added --yes behavior for non-interactive defaults.
- Added prompts for package manager, UI, database, ORM, auth, and Docker.
- Preserved fixed MVP values without prompting for unsupported options.
- Added tests for prompt/config draft behavior.
- Confirmed generation and filesystem writes are not implemented yet.

Files changed:
- packages/cli/src/prompts.ts
- packages/cli/src/prompts.test.ts
- packages/cli/src/index.ts
- packages/cli/src/args.ts, if changed
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
- Phase 9 Step 5: Connect CLI to schema validation
```

## Completion Criteria

This step is complete when:

- CLI can collect a config draft interactively.
- `--yes` produces a config draft without prompts.
- Parsed args are used as defaults or prompt skips.
- Fixed MVP values are included.
- Unsupported option prompts are not added.
- Prisma is unavailable or reset without PostgreSQL.
- Docker PostgreSQL is unavailable or reset without PostgreSQL.
- Auth.js credentials does not force PostgreSQL.
- Prompt code is testable without real terminal input.
- Prompt behavior has Vitest coverage.
- No generator integration is implemented yet.
- No filesystem writes are implemented yet.
- No dependency installation is implemented yet.
- No Node built-in test runner usage is introduced.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
