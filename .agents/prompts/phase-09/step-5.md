# Phase 9 Step 5: Connect CLI to Schema Validation

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 9 Step 4 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 9 Step 6.
Do not connect to the generator yet.
Do not write generated files to disk yet.
Do not install generated project dependencies.
Do not duplicate schema or compatibility logic.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Connect the CLI config draft flow to shared schema and compatibility validation.

The CLI should turn parsed arguments and prompt answers into a validated:

```ts
LaunchKitConfig;
```

using:

```txt
@launchkit/schema
```

This step should not generate projects or write files yet.

## Scope

Work inside:

```txt
packages/cli/
```

Recommended files:

```txt
packages/cli/src/validate-config.ts
packages/cli/src/validate-config.test.ts
packages/cli/src/prompts.ts
packages/cli/src/index.ts
```

Adjust paths to match the existing CLI package structure.

## Requirements

### 1. Use Shared Schema

Use these exports from:

```txt
@launchkit/schema
```

where available:

```txt
LaunchKitConfigSchema
defaultLaunchKitConfig
validateCompatibility
assertCompatibleConfig
LaunchKitConfig
```

Do not duplicate:

- option arrays
- project name regex
- compatibility rules
- config defaults

### 2. Validation Function

Create a validation helper.

Recommended:

```ts
import type { LaunchKitConfig } from "@launchkit/schema";

export type CliValidationResult =
  | {
      ok: true;
      config: LaunchKitConfig;
    }
  | {
      ok: false;
      errors: CliValidationError[];
    };

export type CliValidationError = {
  code: string;
  message: string;
  path?: string[];
};

export function validateCliConfigDraft(draft: unknown): CliValidationResult {
  // ...
}
```

Adjust names to match repo style.

### 3. Schema Error Mapping

Map schema validation errors into concise CLI-friendly errors.

Examples:

```txt
Project name is required.
Use lowercase letters, numbers, and hyphens only.
Unsupported package manager.
Unsupported UI option.
```

Do not print raw Zod errors or internal error objects directly to users.

It is okay to include detailed issues in tests/internal results if the CLI output remains readable.

### 4. Compatibility Error Mapping

Use shared compatibility validation.

Required behavior:

```txt
database: "none", orm: "prisma"
  invalid: Prisma requires PostgreSQL.

database: "none", docker: "postgres"
  invalid: PostgreSQL Docker Compose is only available when PostgreSQL is selected.

auth: "authjs-credentials", database: "none", orm: "none"
  valid
```

Do not manually reimplement compatibility logic in the CLI.

### 5. Defaults And Fixed Values

Ensure missing values are filled from:

```txt
defaultLaunchKitConfig
```

Fixed MVP values must remain:

```txt
framework: "next"
language: "typescript"
router: "app"
projectStructure: "no-src"
styling: "tailwind"
```

Do not prompt or validate unsupported alternatives as available.

### 6. Entry Point Behavior

Update CLI entry flow:

1. Parse args.
2. Run prompts or `--yes` draft creation.
3. Validate draft with shared schema.
4. If invalid, print concise errors and exit with non-zero status.
5. If valid, print a short placeholder summary.

Example valid placeholder:

```txt
LaunchKit config validated.
Generation will be added in the next step.
```

Do not call the generator yet.
Do not write files.

### 7. Exit Codes

Use consistent exit behavior:

```txt
0 for help/version/success
1 for argument/config/compatibility errors
```

If the repo has an existing CLI exit-code helper, use it.

### 8. Testability

Keep validation logic pure and easy to test.

Avoid tests that require real terminal input.

Do not require actual process exit in tests; prefer returning exit codes or testing helpers directly.

## Tests

Use Vitest only.

Add tests for:

- valid default draft passes
- valid fully selected MVP draft passes
- invalid project name fails
- unsupported package manager fails
- unsupported UI fails
- unsupported database fails
- Prisma without PostgreSQL fails
- Docker PostgreSQL without PostgreSQL fails
- Auth.js credentials without database passes
- missing optional values are filled from defaults
- fixed MVP values are present
- schema errors are mapped to CLI-friendly messages
- compatibility errors are mapped to CLI-friendly messages

If entry-flow tests exist, add tests for:

- invalid config returns non-zero planned exit code
- valid config reaches placeholder success state

Do not add generator tests here.

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

Also run schema tests if behavior is touched:

```bash
npm test -w @launchkit/schema
```

Also run if configured:

```bash
npm run lint
npm run build
```

Use the actual package name and workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 9 Step 5 completed: Connect CLI to schema validation

Changes made:
- Added CLI config validation helper.
- Connected CLI config draft to @launchkit/schema.
- Added schema error mapping for CLI output.
- Added compatibility validation using shared schema helpers.
- Added validation behavior to CLI entry flow.
- Added tests for valid, invalid, and incompatible CLI configs.
- Confirmed generation and filesystem writes are not implemented yet.

Files changed:
- packages/cli/src/validate-config.ts
- packages/cli/src/validate-config.test.ts
- packages/cli/src/prompts.ts, if changed
- packages/cli/src/index.ts
- relevant test files
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 9 Step 6: Connect CLI to generator
```

## Completion Criteria

This step is complete when:

- CLI config drafts are validated with `@launchkit/schema`.
- CLI uses shared compatibility validation.
- Valid configs produce a typed `LaunchKitConfig`.
- Invalid schema configs produce CLI-friendly errors.
- Incompatible configs produce CLI-friendly errors.
- Auth.js credentials without database is allowed.
- Missing values are filled from defaults.
- Fixed MVP values are preserved.
- CLI entry flow validates before the future generation step.
- Validation behavior has Vitest coverage.
- No generator integration is implemented yet.
- No filesystem writes are implemented yet.
- No dependency installation is implemented yet.
- No Node built-in test runner usage is introduced.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
