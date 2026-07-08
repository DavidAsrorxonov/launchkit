# Phase 9 Step 6: Connect CLI to Generator

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 9 Step 5 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 9 Step 7.
Do not write generated files to disk yet.
Do not implement existing-directory safety yet.
Do not install generated project dependencies.
Do not duplicate generator logic.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Connect the CLI to the shared LaunchKit generator.

After argument parsing, prompting, and schema validation, the CLI should call:

```txt
@launchkit/generator
```

to produce an in-memory generated project.

This step should not write files to disk yet. Filesystem writing belongs to Phase 9 Step 7.

## Scope

Work inside:

```txt
packages/cli/
```

Recommended files:

```txt
packages/cli/src/generate.ts
packages/cli/src/generate.test.ts
packages/cli/src/index.ts
packages/cli/src/validate-config.ts
```

Adjust paths to match the existing CLI package structure.

## Requirements

### 1. Use Shared Generator

Import the generator from:

```txt
@launchkit/generator
```

Expected function:

```ts
generateProject(config);
```

or the equivalent exported API.

Do not duplicate:

- template logic
- feature registry logic
- package.json merge logic
- env var merge logic
- generated path normalization logic

### 2. Generation Helper

Create a CLI generation helper.

Recommended:

```ts
import type { LaunchKitConfig } from "@launchkit/schema";
import type { GeneratedProject } from "@launchkit/generator";

export async function generateProjectForCli(
  config: LaunchKitConfig,
): Promise<GeneratedProject> {
  return generateProject(config);
}
```

Add error handling only where useful for CLI-facing messages.

Do not swallow generator errors silently.

### 3. Output Summary

After generation, the CLI should print a concise summary.

Recommended summary:

```txt
Generated project preview:
- name: my-app
- package manager: npm
- files: 12
```

Optionally list generated file paths:

```txt
Files:
- package.json
- app/page.tsx
- ...
```

Keep the list readable. If many files are generated, cap or format it cleanly.

Do not write files in this step.

### 4. Path Safety Check

Before printing generated file paths, verify they are safe.

Use existing generator helpers if available.

Reject or report a generation failure if any file path:

```txt
starts with /
contains ..
contains empty path segments
is "."
is ".."
contains src/ as a path segment
```

This is a defense-in-depth check before filesystem writing is added in the next step.

### 5. Entry Flow

Update CLI entry flow:

1. Parse args.
2. Run prompts or `--yes` draft creation.
3. Validate config with shared schema.
4. Generate project in memory with `@launchkit/generator`.
5. Print preview summary.
6. Stop.

Do not write files.
Do not install dependencies.

### 6. Error Handling

If generation fails:

- print a concise error
- return non-zero exit code
- do not print stack traces by default

Keep internal error details available in tests if needed, but do not expose noisy internals in normal CLI output.

### 7. No Filesystem Writes Yet

This step must not create:

```txt
target project directory
generated files on disk
package-lock files for generated projects
```

Filesystem writing belongs to Phase 9 Step 7.

### 8. Tests

Use Vitest only.

Add tests for:

- valid config calls generator helper
- generated project is returned
- generated summary includes project name
- generated summary includes package manager
- generated summary includes file count
- generated file paths are checked before output
- unsafe generated path is rejected/reported
- generator errors become CLI-friendly failures
- no filesystem writes happen during generation preview

Mock `@launchkit/generator` if useful for CLI flow tests.

Also include at least one integration-style test with the real generator if the package setup makes it straightforward and fast.

Do not add smoke tests here.

## Verification

Run the relevant checks available in the repo.

Recommended:

```bash
npm run typecheck -w create-launchkit
npm test -w create-launchkit
npm run build -w create-launchkit
npm test -w @launchkit/generator
npm run typecheck
npm test
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
Phase 9 Step 6 completed: Connect CLI to generator

Changes made:
- Added CLI generation helper.
- Connected validated CLI config to @launchkit/generator.
- Added generated project preview summary.
- Added defense-in-depth generated path safety checks.
- Added generator error handling for CLI output.
- Added tests for CLI generator integration.
- Confirmed generated files are not written to disk yet.

Files changed:
- packages/cli/src/generate.ts
- packages/cli/src/generate.test.ts
- packages/cli/src/index.ts
- packages/cli/src/validate-config.ts, if changed
- relevant test files
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 9 Step 7: Add filesystem write behavior
```

## Completion Criteria

This step is complete when:

- CLI calls `@launchkit/generator` after validation.
- CLI receives an in-memory generated project.
- CLI prints a concise generation preview summary.
- Generated file paths are checked before output.
- Generator failures produce CLI-friendly errors.
- Tests cover generator connection behavior.
- No generated files are written to disk yet.
- No dependency installation is implemented yet.
- No generator logic is duplicated.
- No Node built-in test runner usage is introduced.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
